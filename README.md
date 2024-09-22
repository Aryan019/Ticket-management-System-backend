🎟️ Ticket Management System - Backend
Welcome to the Ticket Management System backend repository! 🎉
Organizing tickets has never been easier (or crazier!). This system helps manage user authentication, ticket creation, assignment, and tracking, all while keeping everything fast and scalable. You’ll feel like a superhero managing tickets 🦸‍♂️!

🛠️ Features
User Authentication: JWT for keeping things secure 🔒.
Ticket Creation and Management: Create, assign, and track status effortlessly.
Role-Based Access Control: Admins, users, and managers have their own superpowers! 👥
💻 Technologies Used
Node.js: The powerhouse of the backend ⚡️.
Express.js: Makes building APIs as fun as it can get 🚀.
PostgreSQL: Reliable database for ticket storage and management 🗄️.
Docker: Ensures everything runs smoothly in a consistent environment 🐳.
PostgreSQL Pool: Connection pooling for scalable DB access 🌐.
JWT (JSON Web Token): For authentication and user management 🔑.
🐳 Setting Up PostgreSQL with Docker
1. Get Docker Running 🐳
Install Docker from here, if you haven’t already.

2. Spin Up PostgreSQL via Docker 🛠️
Run the following command to set up a PostgreSQL instance inside Docker:

docker run --name ticket-db -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=tickets -p 5432:5432 -d postgres
POSTGRES_USER=admin: The default database admin username.
POSTGRES_PASSWORD=password: The database password (change this for production).
POSTGRES_DB=tickets: The database to store ticket information.

3. Connect Node.js to PostgreSQL with Pooling 🧑‍💻
You’ve set up PostgreSQL inside Docker. Now, your Node.js app connects to the DB through pg and pg-pool for efficient database operations. Here’s the code for pooling:

const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'tickets',
  password: 'password',
  port: 5432,
});

module.exports = pool;
Make sure your .env file contains:

DB_USER=admin
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=tickets


4. Migrate the Database 🏗️
If you have any SQL scripts for creating tables or seeding data, you can connect via a client (e.g., pgAdmin or DBeaver) or run SQL scripts manually.

📂 Project Structure
bash
Copy code
├── config/            # Configuration files
├── controllers/       # Business logic controllers
├── db/                # PostgreSQL connection setup
├── middlewares/       # Auth and other middlewares
├── routes/            # API route handlers
├── models/            # DB queries and data handling
└── utils/             # Utility functions
⚙️ How to Run
Clone the repo:
git clone https://github.com/Aryan019/Ticket-management-System-backend.git
cd Ticket-management-System-backend
Install dependencies:
npm install
Start the app:
npm start
Run with Docker (optional): You can use Docker to run the backend entirely inside containers if you prefer containerized environments.

That’s it! 🥳 You’re all set to handle tickets like a pro. Go forth and manage tickets with ease!

Feel free to adjust as necessary! 😎
