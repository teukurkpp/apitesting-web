# 🚀 API Testing Web - REST API Performance Monitoring System

## 📌 Overview
API Testing Web is a web-based system designed to monitor the performance of REST APIs in real-time. This project was developed to provide a lightweight and accessible monitoring solution for small-to-medium scale developers without requiring complex infrastructure.

The system automatically monitors registered API endpoints and visualizes key performance metrics through an interactive dashboard.

---

## 🎯 Features

### 🔍 API Monitoring
- Automatic monitoring based on configurable intervals
- Supports multiple API endpoints
- Real-time performance tracking

### 📊 Performance Metrics
- **Response Time** (ms)
- **Throughput** (request count)
- **Error Rate** (HTTP status classification)
- **Uptime percentage**

### 📈 Dashboard
- Real-time data visualization
- Response time trend chart
- Status code distribution (pie chart)
- Summary metrics in a single view

### 🕒 Monitoring History
- Stores monitoring logs in database
- Filter by:
  - Status code (success / error)
  - Time range (today, 7 days, 30 days)
- Displays:
  - API name
  - Response time
  - Status code
  - Timestamp

---

## 🏗️ Tech Stack

### Frontend
- Next.js

### Backend
- NestJS

### Database
- PostgreSQL

---

## ⚙️ How It Works

1. User registers an API endpoint
2. System validates the endpoint
3. Monitoring service sends periodic requests
4. System records:
   - Response time
   - Status code
   - Response size
5. Data is stored in PostgreSQL
6. Dashboard displays real-time insights

---

## 🧪 Testing

The system has been tested using **Black Box Testing** with 11 test scenarios.

✅ All features work as expected:
- API validation
- Monitoring process
- Dashboard visualization
- Log filtering

---

## 📂 Project Structure

apitesting-web/
│
├── Backend/ # NestJS API server
├── Frontend/ # Next.js web app
├── .gitignore
└── README.md
