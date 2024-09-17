import express from "express";
// import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { pool } from "./utils/dbconnect";

// dotenv.config();

const app = express();
app.use(express.json());

// Adding in the connection to the DB 
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Connected to the database');
    // Use the client to query the database here
  }
  done(); // release the client back to the pool
});

app.use("/api", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
