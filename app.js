const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
}));

const db = new sqlite3.Database("database.db");

// USERS TABLE
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user'
)`);

// SECURITY LOG TABLE
db.run(`CREATE TABLE IF NOT EXISTS security_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  action TEXT,
  ip TEXT,
  severity TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

function logEvent(username, action, ip, severity) {
  db.run("INSERT INTO security_logs (username,action,ip,severity) VALUES (?,?,?,?)",
    [username, action, ip, severity]);
}

function detectBruteForce(username, ip, cb) {
  db.get(`SELECT COUNT(*) as count FROM security_logs 
          WHERE username=? AND action='LOGIN_FAILED' 
          AND timestamp > datetime('now','-1 minute')`,
    [username], (err, row) => {
      if (row.count >= 3) {
        logEvent(username, "BRUTE_FORCE_DETECTED", ip, "HIGH");
        cb(true);
      } else cb(false);
    });
}

// GLOBAL CSS
const style = `
<style>
body{background:#0f172a;color:#e2e8f0;font-family:Segoe UI;margin:0}
nav{background:#020617;padding:15px}
nav a{color:#38bdf8;margin-right:20px;text-decoration:none;font-weight:bold}
.container{padding:40px}
.card{background:#020617;padding:25px;border-radius:12px;box-shadow:0 0 20px #0ea5e9;margin:20px 0}
input,button{padding:10px;margin:8px;width:250px;border-radius:6px;border:none}
button{background:#38bdf8;color:black;font-weight:bold;cursor:pointer}
button:hover{background:#0ea5e9}
table{width:100%;border-collapse:collapse}
th,td{padding:12px;text-align:center}
th{background:#38bdf8;color:black}
tr:nth-child(even){background:#020617}
.alert{color:#f87171;font-weight:bold;font-size:20px}
</style>
`;

function layout(content){
  return `${style}<nav>
  <a href="/">Home</a>
  <a href="/signup">Signup</a>
  <a href="/login">Login</a>
  </nav>
  <div class="container">${content}</div>`;
}

// HOME
app.get("/", (req,res)=>{
  res.send(layout(`<div class="card">
  <h1>🛡 Security Monitoring Dashboard</h1>
  <p>Monitor activity, detect threats & respond to incidents.</p>
  </div>`));
});

// SIGNUP
app.get("/signup",(req,res)=>{
  res.send(layout(`<div class="card">
  <h2>Create Account</h2>
  <form method="POST">
  <input name="username" placeholder="Username"><br>
  <input name="password" type="password" placeholder="Password"><br>
  <button>Signup</button>
  </form></div>`));
});

app.post("/signup", async(req,res)=>{
  const hash=await bcrypt.hash(req.body.password,10);
  db.run("INSERT INTO users(username,password) VALUES(?,?)",
  [req.body.username,hash],()=>res.redirect("/login"));
});

// LOGIN
app.get("/login",(req,res)=>{
  res.send(layout(`<div class="card">
  <h2>Login</h2>
  <form method="POST">
  <input name="username" placeholder="Username"><br>
  <input name="password" type="password" placeholder="Password"><br>
  <button>Login</button>
  </form></div>`));
});

app.post("/login",(req,res)=>{
  const {username,password}=req.body;
  db.get("SELECT * FROM users WHERE username=?",[username],async(err,user)=>{
    if(!user){
      logEvent(username,"LOGIN_FAILED",req.ip,"MEDIUM");
      return res.send(layout(`<div class="card alert">Invalid Credentials</div>`));
    }

    const match=await bcrypt.compare(password,user.password);
    if(!match){
      logEvent(username,"LOGIN_FAILED",req.ip,"MEDIUM");
      detectBruteForce(username,req.ip,(detected)=>{
        if(detected){
          return res.send(layout(`<div class="card alert">
          ⚠️ ALERT: Brute force attack detected!
          </div>`));
        }
        res.send(layout(`<div class="card alert">Invalid Credentials</div>`));
      });
      return;
    }

    req.session.user=user;
    logEvent(username,"LOGIN_SUCCESS",req.ip,"LOW");
    res.redirect("/dashboard");
  });
});

// DASHBOARD
app.get("/dashboard",(req,res)=>{
  if(!req.session.user) return res.redirect("/login");
  res.send(layout(`<div class="card">
  <h2>Welcome ${req.session.user.username}</h2>
  <p>Role: ${req.session.user.role}</p>
  <a href="/logout"><button>Logout</button></a>
  ${req.session.user.role==="admin"?
    `<a href="/admin"><button>Security Logs</button></a>`:""}
  </div>`));
});

// ADMIN LOG VIEW
app.get("/admin",(req,res)=>{
  if(!req.session.user || req.session.user.role!=="admin")
    return res.send(layout(`<div class="card alert">Access Denied</div>`));

  logEvent(req.session.user.username,"ADMIN_ACCESS",req.ip,"LOW");

  db.all("SELECT * FROM security_logs ORDER BY timestamp DESC",(err,logs)=>{
    let rows=logs.map(l=>`<tr>
      <td>${l.username}</td><td>${l.action}</td>
      <td>${l.ip}</td><td>${l.severity}</td>
      <td>${l.timestamp}</td></tr>`).join("");

    res.send(layout(`<div class="card">
    <h2>Security Event Logs</h2>
    <table>
    <tr><th>User</th><th>Action</th><th>IP</th><th>Severity</th><th>Time</th></tr>
    ${rows}
    </table></div>`));
  });
});

// LOGOUT
app.get("/logout",(req,res)=>{
  if(req.session.user) logEvent(req.session.user.username,"LOGOUT",req.ip,"LOW");
  req.session.destroy(()=>res.redirect("/login"));
});

app.listen(3000,()=>console.log("SOC Dashboard running on port 3000"));
