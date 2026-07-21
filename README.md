# QPcreator

Automatic Question Paper Generator with a React/Vite frontend and an Express/MongoDB backend.

## Project Structure

- `client-vite/` - React frontend built with Vite
- `server/` - Node.js backend with Express, MongoDB, authentication, and PDF generation

## Key Features

- Role-based dashboard routing for HOD and Teacher users
- User authentication with JWT cookies
- Question management for teachers
- Question paper generation and storage
- PDF generation for question papers
- Admin/HOD user management endpoints

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Toastify
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, nodemailer, @react-pdf/renderer
- Build: Babel for server transpilation

## Prerequisites

- Node.js 18+ / npm
- MongoDB instance or Atlas cluster
- SMTP credentials for email notifications

## Setup

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/` with values similar to:

```env
MONGO_URI=mongodb+srv://username:password@cluster.example.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
SENDER_EMAIL=your-sender@example.com
BREVO_EMAIL=your-brevo-smtp-email
BREVO_SMTP_KEY=your-brevo-smtp-key
NODE_ENV=development
PORT=4000
```

### 2. Frontend

```bash
cd ../client-vite
npm install
```

> The frontend currently expects the backend API to run at `http://localhost:4000`.

## Running Locally

### Backend development

```bash
cd server
npm run dev
```

### Frontend development

```bash
cd client-vite
npm run dev
```

### Production build

- Build frontend:
  ```bash
  cd client-vite
  npm run build
  ```
- Build backend and start:
  ```bash
  cd server
  npm run start
  ```

## Backend API Overview

### Auth

- `POST /api/auth/register` - register new user
- `POST /api/auth/login` - login user
- `POST /api/auth/logout` - logout authenticated user
- `GET /api/auth/isAuthenticated` - verify current session

### User

- `GET /api/user/get-user-data` - authenticated current user info
- `GET /api/user/admin/all` - list all users
- `GET /api/user/admin/:id` - get specific user by ID
- `PUT /api/user/admin/update-role/:id` - change user role
- `DELETE /api/user/admin/delete/:id` - delete user
- `POST /api/user/admin/create` - create user by admin

### Questions

- `POST /api/questions` - add a new question (teacher-authenticated)
- `GET /api/questions` - get questions for teacher
- `DELETE /api/questions/:id` - delete question by ID
- `GET /api/questions/all` - get all questions

### Question Papers

- `POST /api/question-papers/generate-question-paper` - generate a paper from question criteria
- `POST /api/question-papers/create` - manually create question paper
- `GET /api/question-papers/get-all-QuestinPapers` - list all papers
- `GET /api/question-papers/:id` - get question paper by ID
- `GET /api/question-papers/:id/pdf` - download PDF for a paper

## Frontend Routes

The frontend uses protected routes and role-based dashboards, including pages such as:

- `/` - home or dashboard if logged in
- `/login`
- `/email-verify`
- `/reset-pswrd`
- `/hod-dashboard`
- `/teacher-dashboard`
- `/create-question-paper`
- `/add-questions`
- `/teacher-preview`
- `/preview-questions`
- `/manage-users`
- `/view-question-papers`

## Notes

- CORS is configured for `http://localhost:5173`
- The backend uses `cookie-parser` and stores auth tokens in `access_token`
- The server entrypoint is `server/src/server.js`
- MongoDB connection logic lives in `server/src/config/mongodb.js`
- Email transport is configured in `server/src/config/nodemailer.js`

## Helpful commands

From project root:

```bash
cd server && npm run dev
cd client-vite && npm run dev
```

## License

This repository does not currently include a license file.
