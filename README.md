# Team Task Manager

A full-stack Team Task Management Web Application where users can create projects, assign tasks, and track progress with role-based access control.

---

# 🚀 Features

## 🔐 Authentication
- User Signup
- User Login
- Password Encryption using BCrypt
- Role-Based Access (ADMIN / MEMBER)

---

## 📁 Project Management
- Create Projects
- View Projects
- Manage Team Members

---

## ✅ Task Management
- Create Tasks
- Assign Tasks to Users
- Update Task Status
- Set Priority & Due Date

---

## 📊 Dashboard
- Total Tasks
- Completed Tasks
- Pending Tasks
- Overdue Tasks

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM

## Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate

## Database
- MySQL

## Deployment
- Railway
- Vercel

---

# 📂 Project Structure

```bash
team-task-manager/
│
├── backend/
│   ├── controller
│   ├── entity
│   ├── repository
│   ├── service
│   ├── config
│   └── security
│
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

---

# ⚙️ Backend Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/team-task-manager.git
```

---

## 2️⃣ Navigate to Backend

```bash
cd backend
```

---

## 3️⃣ Configure Database

Create MySQL database:

```sql
CREATE DATABASE taskmanager;
```

---

## 4️⃣ Configure application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanager
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

---

## 5️⃣ Run Backend

```bash
./mvnw spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# ⚛️ Frontend Setup

## 1️⃣ Navigate to Frontend

```bash
cd frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Start Frontend

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🔗 API Endpoints

## Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register User |
| POST | /api/auth/login | Login User |

---

## Project APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/projects | Get Projects |
| POST | /api/projects | Create Project |

---

## Task APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get Tasks |
| POST | /api/tasks | Create Task |
| PUT | /api/tasks/{id} | Update Task |

---

# 🔐 Roles

## ADMIN
- Create Projects
- Assign Tasks
- Manage Users
- Update Any Task

## MEMBER
- View Assigned Tasks
- Update Own Task Status

---

# 🌐 Deployment

## Backend Deployment
- Railway

## Frontend Deployment
- Vercel / Railway

---

# 📸 Screenshots

- Login Page
- Dashboard
- Project Page
- Task Management

---

# 👨‍💻 Author

## Simha

GitHub:
https://github.com/yourusername

---

# 📄 License

This project is developed for assignment and learning purposes.
