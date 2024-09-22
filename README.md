# 🎟️ Ticket Management System - Backend

Welcome to the **Ticket Management System** backend repository! 🎉  
Managing tickets has never been this fun… or frustrating 😅. This project helps streamline ticket handling with features like user authentication, ticket creation, status tracking, and more!

## 🛠️ Features
- **User Authentication**: Keep it secure 🔐.
- **Ticket Management**: Create, assign, and track ticket status 📈.
- **Role-Based Access**: Different permissions for different roles 👥.

## 💻 Technologies Used
- **Node.js**: Backend server 🧑‍💻
- **Express.js**: API creation magic 🪄
- **PostgreSQL**: Storing your tickets in an organized manner 📊
- **Docker**: Because "It works on my machine" isn't enough 🐳
- **pg-pool**: For efficient database connection pooling 🌐
- **JWT**: Secure authentication with JSON Web Tokens 🔑

## 🐳 Setting Up PostgreSQL with Docker

### 1. Install Docker
Download and install Docker from [here](https://www.docker.com/).

### 2. Run PostgreSQL in Docker
Run the following command to spin up PostgreSQL:

```bash
docker run --name ticket-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=tickets -p 5432:5432 -d postgres
```

### 3. Configure Connection Pool in Node.js
Here's how your Node.js app connects to PostgreSQL using the `pg-pool`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'tickets',
  password: 'password',
  port: 5432,
});

module.exports = pool;
```

Ensure your `.env` file contains the following:

```bash
DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=tickets
```

## 📂 Project Structure
```bash
├── config/            # Configuration files
├── controllers/       # Business logic controllers
├── db/                # PostgreSQL connection setup
├── middlewares/       # Auth and other middlewares
├── routes/            # API route handlers
├── models/            # DB queries and data handling
└── utils/             # Utility functions
```

## ⚙️ How to Run
Clone the repo:

```bash
git clone https://github.com/Aryan019/Ticket-management-System-backend.git
cd Ticket-management-System-backend
```

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Run with Docker (optional): You can use Docker to run the backend entirely inside containers if you prefer containerized environments.

That’s it! 🥳 You’re all set to handle tickets like a pro. Go forth and manage tickets with ease! 😎
