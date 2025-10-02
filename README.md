# Shoe Web App 👟

A full-stack web application for managing shoes, built with **.NET Core (Web API)** on the backend and a frontend (React/Angular/etc. depending on your setup).  
The project supports user authentication with roles, CRUD operations, and is fully containerized with **Docker**.

---

## 🚀 Features

- User authentication (JWT-based login & registration).
- Role-based access (e.g., Admin, User).
- CRUD operations for managing shoes, orders, and order items.
- Integrated with SQL Server database.
- API testing via Swagger UI.
- Dockerized setup for easy deployment.

---

## 📂 Project Structure

│── ShoeAppAPI/ # Backend (ASP.NET Core Web API)
│── ShoeAppFrontend/ # Frontend (React/Angular/etc.)
│── docker-compose.yml
│── README.md

---

## 🛠️ Prerequisites

Make sure you have the following installed:

- [.NET SDK](https://dotnet.microsoft.com/download) (>= 9.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup) (optional for DB management)
- Node.js (if you’re running the frontend locally)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ShoeApp.git
cd ShoeApp
2. Run with Docker
Build and start containers (API + SQL + Frontend if included):

bash
Copy code
docker compose up --build
3. Backend API (ShoeAppAPI)
The API runs inside Docker on port 5146 by default.

Swagger UI:

bash
Copy code
http://localhost:5146/swagger/index.html
4. Database (SQL Server)
SQL Server runs in a container (check docker-compose.yml for details).

You can connect with SSMS using:

Server: localhost,1433

User: sa

Password: (your password from docker-compose.yml)

5. Running Frontend
Navigate to your frontend folder and run:

bash
Copy code
npm install
npm start
```
