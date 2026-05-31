# Team Task Tracker API

REST API for a team-based task tracker with authentication, role-based access control, Redis caching, and Dockerized setup.

This project was built as an SDE II take-home assignment with focus on clean backend architecture, authorization, caching, and easy local setup.

---

## Features

### Authentication
- JWT-based login
- Access token + refresh token flow
- Secure password hashing using bcrypt
- Protected routes

### Role-Based Access Control (RBAC)
Supported roles:
- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`
- `MEMBER`

Permissions enforced at API level.

Examples:
- Super Admin can manage organization
- Admin can manage projects/tasks
- Member can access assigned resources only

---

### Users
- Create user
- List users
- Role mapping
- Organization-level access

---

### Projects
- Create project
- List projects
- Update project
- Organization scoped

---

### Tasks
- Create task
- Assign task
- Update task
- Track status

Supported statuses:
- `TODO`
- `IN_PROGRESS`
- `IN_REVIEW`
- `BLOCKED`
- `DONE`

Filters supported:
- project
- assigned user
- status
- pagination

---

### Redis Caching
Redis is used to cache frequently accessed APIs.

Examples:
- project listing
- task listing

Cache is invalidated on create/update operations.

---

### MongoDB Indexing
Indexes added for performance.

Examples:
- user email
- task status
- assigned user
- due date
- organization

---

### Dockerized Setup
Includes:
- Node.js app container
- MongoDB container
- Redis container

One command startup.

---

# Tech Stack

Backend:
- Node.js
- Express.js

Database:
- MongoDB

Cache:
- Redis

Authentication:
- JWT
- bcrypt

Containerization:
- Docker
- Docker Compose

---

# Project Structure

```bash
team-task-tracker/
│
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── organizations/
│   │   ├── projects/
│   │   └── tasks/
│   ├── seed/
│   ├── utils/
│   ├── server.js
│   └── app.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

---

# Environment Variables

Create `.env`

Example:

```env
PORT=5000
MONGO_URI=mongodb://mongo:27017/team_task_tracker

JWT_ACCESS_SECRET=replace_with_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

REDIS_CLIENT_HOST=redis://redis:6379
REDIS_CLIENT_PORT=6379
```

---

# Running with Docker

## 1. Clone repository

```bash
git clone https://github.com/frantic32211/team-task-tracker
cd team-task-tracker
```

---

## 2. Create env file

Linux / Mac:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
copy .env.example .env
```

---

## 3. Start containers

```bash
docker-compose up --build
```

---

## 4. API available at

```txt
http://localhost:5000
```

MongoDB:

```txt
localhost:27017
```

Redis:

```txt
localhost:6379
```

---

# Health Check

Verify app:

## Request

```http
GET /
```

## Response

```json
{
  "status": "Team Task Tracker API running"
}
```

---

# Authentication Flow

## Login

### Request

```http
POST /api/auth/login
```

```json
{
  "email": "admin@system.com",
  "password": "admin123"
}
```

### Response

```json
{
  "accessToken": "....",
  "refreshToken": "...."
}
```

---

## Refresh token

### Request

```http
POST /api/auth/refresh
```

```json
{
  "refreshToken": "..."
}
```

---

# Example Test Users

Use these after setup.

## Super Admin

```txt
email: admin@test.com
password: admin123
```

And then create org and users using API.

---

# Core API Endpoints

## Auth

```http
POST /api/auth/login
POST /api/auth/refresh-token
```

---

## Users

```http
GET /api/users/organization/:organizationId
PATCH /api/users/:userId/role
```

---

## Projects

```http
POST /api/projects
GET /api/projects
```

---

## Tasks

```http
POST /api/tasks
GET /api/tasks
PATCH /api/tasks/:id/status
DELETE /api/tasks/:id
```

Example filters:

```http
GET /api/tasks?page=1&limit=10
GET /api/tasks?status=TODO
GET /api/tasks?projectId=...
```

---

# Error Handling

Standard response format:

```json
{
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Project name is required"
}
```

Examples:
- `400`
- `401`
- `403`
- `404`
- `500`

---

# Deliverables

Included in repository:

- Source code
- Dockerfile
- docker-compose.yml
- Redis integration
- MongoDB integration
- RBAC
- JWT auth
- API endpoints
- README
- `.env.example`

---

# Assumptions

- MongoDB and Redis run via Docker
- JWT secrets supplied through `.env`
- Access token required on protected routes
- Organization-based access enforced
- Redis cache invalidates on writes

---

# Submission Notes

To run:

```bash
docker-compose up --build
```

Then test:

```txt
GET /
POST /api/auth/login
POST /api/projects
POST /api/tasks
```

Everything should work from a clean setup.

---