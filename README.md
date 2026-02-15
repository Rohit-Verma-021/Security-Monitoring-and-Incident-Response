# Security Monitoring & Incident Response System

(Project 3)

---

## Project Overview

This project focuses on building a **basic Security Monitoring and Incident Response system** for a web application. The objective is to simulate how a Security Operations Center (SOC) monitors activity, detects suspicious behavior, classifies incidents, and responds to potential security threats.

The system extends the secure web application developed in earlier projects and introduces **security logging, threat detection, alerting, and incident response workflows**.

This project represents the **Blue Team perspective**, where the focus shifts from building and testing security to **monitoring and responding to attacks**.

---

## Objectives

The primary goals of this project are:

* Monitor user activity through security logging
* Detect suspicious behavior automatically
* Classify incidents based on severity
* Implement an alert and response workflow
* Document detection logic and incident response procedures

---

## Activity & Log Analysis

Security monitoring begins with **visibility**. The application was enhanced to log critical security-related events in a dedicated security log database.

### Logged Security Events

The application records the following activities:

* Successful login attempts
* Failed login attempts
* Admin panel access
* Logout events
* Detected brute-force login attempts

Each log entry stores:

* Username involved in the activity
* Type of action performed
* IP address of the user
* Severity level of the event
* Timestamp of the event

This logging provides a **historical activity trail**, which is essential for detecting suspicious patterns and performing incident investigations.

---

### Screenshot: Security Logs Dashboard

**How to capture this screenshot**

1. Log in as an administrator.
<img width="1366" height="674" alt="image" src="https://github.com/user-attachments/assets/66cc24a6-ed8b-41ab-a00f-ca49ed15572f" />

2. Open the Security Logs page from the dashboard.
3. Ensure the table showing logged activities is visible.
<img width="1363" height="671" alt="image" src="https://github.com/user-attachments/assets/617353a5-cc8c-4c81-afd6-044ab1a33bc4" />

**What must be visible**

* A table containing multiple log entries
* Columns showing user, action, IP address, severity, and timestamp
* Evidence of both successful and failed login events

This screenshot demonstrates that **security logging and activity monitoring are operational**.

---

## Suspicious Behavior Detection Logic

Monitoring alone is not enough. The system must detect patterns that indicate possible attacks.

### Brute Force Detection Logic

The application implements detection for **brute-force login attacks**.

A brute-force attack is suspected when:

* Multiple login failures occur for the same username
* These failures occur within a short time window

### Detection Rule Implemented

An incident is triggered when:

* Three or more failed login attempts occur
* Within one minute
* For the same username

When this condition is met:

* A high-severity security event is created
* An alert message is shown to the user
* The event is recorded in the security log database

This simulates real-world intrusion detection logic used in SOC environments.

---

### Screenshot: Brute Force Detection Alert

**How to capture this screenshot**

1. Go to the login page.
2. Enter a valid username but the wrong password.
<img width="1366" height="251" alt="image" src="https://github.com/user-attachments/assets/4daa8745-5ce3-40d6-9e87-65193d57d1a4" />

3. Repeat the wrong password attempt at least three times quickly.
4. On the next attempt, the alert message should appear.
<img width="1360" height="564" alt="image" src="https://github.com/user-attachments/assets/c8755b16-9134-43b5-bcac-599228855dc1" />

**What must be visible**

* The login page showing the alert message about suspicious activity
* The alert clearly visible on the screen

This screenshot demonstrates **automatic detection of suspicious behavior**.

---

## Incident Classification & Response

Once suspicious behavior is detected, it must be **classified and handled appropriately**.

### Incident Severity Levels

The system classifies incidents into three levels:

**Low Severity**

* Successful login
* Logout
* Admin access

These represent normal user behavior.

**Medium Severity**

* Failed login attempts

These may indicate incorrect credentials or early attack attempts.

**High Severity**

* Brute force attack detection

This represents a confirmed suspicious pattern requiring attention.

Severity classification helps prioritize response efforts.

---

### Screenshot: High Severity Incident in Logs

**How to capture this screenshot**

1. Trigger the brute-force detection alert.
2. Open the security logs as an administrator.

**What must be visible**

* A log entry showing brute force detection
* Severity marked as HIGH
<img width="1366" height="690" alt="image" src="https://github.com/user-attachments/assets/a7f561e6-ccf9-4887-9a28-aaebfe3981d7" />

This screenshot proves **incident classification is working**.

---

## Alert & Response Workflow

When a security incident is detected, the system follows a basic response workflow.

### Detection → Alert → Logging → Review

1. Suspicious activity is detected automatically.
2. The system generates an alert.
3. The incident is recorded in the security logs.
4. An administrator can review the logs and investigate.

This workflow simulates how SOC teams respond to real incidents.

---

### Screenshot: Incident Response Workflow Evidence

**How to capture this screenshot**

1. Trigger a brute-force alert.
2. Log in as admin.
3. Open the security logs page.

**What must be visible**

* Evidence of failed logins
* Evidence of brute-force detection
* Multiple log entries showing the attack sequence
<img width="1366" height="688" alt="image" src="https://github.com/user-attachments/assets/cec3ec8f-00f3-433a-a366-6e38511dcb01" />

This screenshot demonstrates the **complete detection and response workflow**.

---

## Detection Logic Explanation (Deliverable)

The detection logic implemented in this project focuses on identifying brute-force login attempts.

The logic works by analyzing recent login failure logs and counting how many failures occur within a defined time window. If the threshold is exceeded, the system flags the behavior as suspicious and records a high-severity incident.

This approach demonstrates how simple detection rules can be used to identify attack patterns in real-world environments.

---

## Incident Scenarios & Response Steps (Deliverable)

### Scenario 1: Multiple Failed Login Attempts

**Detection**

* Several failed login attempts detected within one minute.

**Response**

* Alert displayed to the user.
* Event logged with medium severity.

---

### Scenario 2: Brute Force Attack Detected

**Detection**

* Three or more failed login attempts in one minute.

**Response**

* High-severity incident created.
* Alert shown immediately.
* Logs available for admin review.

---

### Scenario 3: Unauthorized Admin Access Attempt

**Detection**

* Non-admin user attempts to access admin panel.

**Response**

* Access denied.
* Attempt recorded in logs.

---

## Future Improvement Scope (Deliverable)

This project demonstrates a foundational monitoring system. Future improvements could include:

* Account lockout after repeated failed logins
* Email or SMS alerts for high-severity incidents
* IP blocking for suspicious activity
* Integration with SIEM tools
* Real-time monitoring dashboards
* Advanced anomaly detection using machine learning

These enhancements would bring the system closer to enterprise-level security monitoring.

---

## Learning Outcomes

Through this project, the following skills were developed:

* Understanding SOC monitoring workflows
* Implementing security logging and detection logic
* Classifying incidents based on severity
* Designing incident response procedures
* Building a basic intrusion detection workflow

---

## Conclusion

This project demonstrates a complete **Security Monitoring and Incident Response workflow**, from activity logging to threat detection and incident handling. It provides practical exposure to Blue Team concepts and highlights the importance of monitoring and response in modern cybersecurity environments.

