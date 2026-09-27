# FundooNotes Frontend

## 📌 Project Overview

FundooNotes Frontend is an **Angular-based web application** developed as the user interface for the FundooNotes Notes Management System.

The application provides a clean and responsive interface through which users can register, log in, create and manage notes, organize notes using labels, set reminders, view archived notes, and manage deleted notes.

The frontend communicates with the **FundooNotes Spring Boot REST API backend** using HTTP requests.

---

## 🚀 Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Authentication interceptor
- Secure communication with protected backend APIs
- Logout functionality

### 📝 Notes Management

Users can:

- Create notes
- View notes
- Edit notes
- Delete notes
- Pin notes
- Unpin notes
- Archive notes
- Unarchive notes
- Add labels to notes
- Set reminders
- Add images and other note content

### 🏷️ Label Management

- Create labels
- View labels
- Edit labels
- Delete labels
- Organize notes using labels

### 📌 Archive

Users can:

- View archived notes
- Archive notes
- Restore notes from archive

### 🗑️ Trash

Users can:

- Move notes to trash
- View deleted notes
- Restore notes
- Permanently delete notes

### ⏰ Reminders

Users can:

- Add reminders to notes
- View reminder notes
- Manage reminder information

### 🔍 Search

The application provides note search functionality to help users quickly find their notes.

### 🎨 User Interface

The application includes:

- Navigation bar
- Sidebar navigation
- Note cards
- Note creation form
- Label management
- Archive page
- Trash page
- Reminder page
- Search functionality
- View toggle functionality
- Responsive layouts

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| Angular | Frontend framework |
| TypeScript | Application programming language |
| HTML | UI structure |
| CSS | Styling and responsive design |
| RxJS | Reactive programming |
| Angular Router | Application navigation |
| HttpClient | Backend API communication |
| JWT | Authentication |
| Node.js | JavaScript runtime |
| npm | Package management |

---

## 🏗️ Application Architecture

The frontend follows a feature-based Angular architecture.

```text
                    FundooNotes UI
                         |
                         v
                  Angular Application
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
   Authentication      Notes          Shared/Core
        |                |
        |                +---- Labels
        |                +---- Archive
        |                +---- Trash
        |                +---- Reminders
        |                +---- Note Cards
        |                +---- Note Forms
        |
        v
   Authentication
      Service
        |
        v
   HTTP Interceptor
        |
        v
   FundooNotes REST API
        |
        v
   Spring Boot Backend
````

---

## 📂 Project Structure

```text
fundoo-app
│
├── public
│   └── Application images and static assets
│
├── src
│   │
│   ├── app
│   │   │
│   │   ├── core
│   │   │   └── Core application functionality
│   │   │
│   │   ├── features
│   │   │   │
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   └── signup
│   │   │   │
│   │   │   └── notes
│   │   │       ├── models
│   │   │       ├── pages
│   │   │       │   ├── archive
│   │   │       │   ├── label-notes
│   │   │       │   ├── labels
│   │   │       │   ├── notes
│   │   │       │   ├── reminders
│   │   │       │   └── trash
│   │   │       │
│   │   │       ├── services
│   │   │       └── components
│   │   │
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   ├── app.html
│   │   ├── app.css
│   │   └── app.ts
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentication Flow

The frontend uses JWT-based authentication provided by the FundooNotes backend.

```text
User
 |
 | Login / Register
 v
Angular Authentication Page
 |
 v
Auth Service
 |
 v
Spring Boot REST API
 |
 v
JWT Token
 |
 v
Browser
 |
 v
HTTP Interceptor
 |
 | Adds JWT token to requests
 v
Protected Backend APIs
```

The HTTP interceptor automatically attaches the authentication token to protected API requests.

---

## 🔗 Backend Integration

This frontend is designed to work with the **FundooNotes Spring Boot backend**.

Backend repository:

```text
https://github.com/CHANDANAcs02/FundooNotes
```

The Angular application communicates with the backend through REST APIs for:

* Authentication
* Notes
* Labels
* Reminders
* Archive
* Trash
* Attachments

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/CHANDANAcs02/FundooNotesFrontend.git
```

### 2. Navigate to the Project

```bash
cd FundooNotesFrontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Angular Development Server

```bash
ng serve
```

The application will be available at:

```text
http://localhost:4200
```

---

## ⚙️ Backend Configuration

Before using the application, make sure the FundooNotes Spring Boot backend is running.

The frontend API configuration should point to the backend server.

Example:

```text
http://localhost:8080
```

Update the API URL according to your backend configuration.

---

## 🧪 Testing

The project contains Angular unit test files.

Run the tests using:

```bash
ng test
```

---

## 🏗️ Build

To create a production build:

```bash
ng build
```

The generated production files will be available in the Angular build output directory.

---

## 📱 Main Application Pages

### Authentication

```text
Login
Signup
```

### Notes

```text
Notes
Note Form
Note Card
```

### Organization

```text
Labels
Label Notes
Archive
Reminders
Trash
```

### Navigation

```text
Navbar
Sidebar
Search
View Toggle
```

---

## 🎯 Project Objective

The main objective of the FundooNotes Frontend is to provide a user-friendly Angular interface for the FundooNotes backend application.

The project demonstrates:

* Angular application development
* Component-based architecture
* Feature-based project organization
* REST API integration
* JWT authentication
* HTTP interceptors
* Angular routing
* TypeScript
* Reactive programming
* CRUD operations
* Notes organization
* Responsive UI development

---

## 🔄 Frontend and Backend

```text
+---------------------------+
|    FundooNotes Frontend   |
|         Angular           |
+-------------+-------------+
              |
              | HTTP / REST API
              v
+---------------------------+
|    FundooNotes Backend    |
|       Spring Boot         |
+-------------+-------------+
              |
              v
+---------------------------+
|          PostgreSQL            |
|     Redis / Messaging     |
+---------------------------+
```

---

## 👩‍💻 Author

**Chandana**

GitHub:

[https://github.com/CHANDANAcs02](https://github.com/CHANDANAcs02)

```
```
