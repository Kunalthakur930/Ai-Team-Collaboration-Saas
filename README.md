# FlowSync – Team Collaboration SaaS

FlowSync is a team collaboration platform built with Node.js, Express.js, and MongoDB. The goal of this project is to help teams organize their work, manage tasks, collaborate in shared workspaces, and track progress in real time.

This project was developed to practice backend system design concepts such as authentication, role-based access control, real-time communication, file handling, notifications, and scalable API development.

## Features

### Authentication

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* Forgot Password via Email
* Reset Password Functionality

### Workspace Management

* Create and Manage Workspaces
* Invite Team Members
* Role-Based Access Control (Owner, Admin, Member)
* Member Promotion and Management

### Task Management

* Create, Update, and Delete Tasks
* Assign Tasks to Team Members
* Track Task Status
* Personal Task Dashboard
* Search and Filter Tasks
* Pagination Support

### Collaboration

* Task Comments
* Activity Tracking
* File Attachments
* Real-Time Notifications using Socket.io

### Notifications

* Database-Persisted Notifications
* Mark Notifications as Read
* Unread Notification Count
* Real-Time Task Assignment Alerts

### Analytics

* Workspace Task Analytics
* Task Status Overview

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io
* JWT Authentication
* Nodemailer
* Multer

### Tools

* Postman
* Git & GitHub
* MongoDB Atlas

## Project Structure

backend/
│
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── uploads/
│ └── config/
│
├── package.json
├── .env
└── server.js

## Installation

Clone the repository:

git clone https://github.com/Kunalthakur930/Ai-Team-Collaboration-Saas.git

Install dependencies:

npm install

Run the server:

npm run dev

## Future Improvements

* React Frontend
* Dashboard UI
* Deployment
* AI-Based Productivity Insights
* Team Performance Reports
