import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// import pool from '../db'; // Your PostgreSQL connection
import { pool } from "../utils/dbconnect";  // PostgreSQL connection

// Create a Ticket endpoint
export const createTicket = async (req: Request, res: Response) => {
  const { title, description, type, venue, status, price, priority, dueDate, createdBy } = req.body;

  // Validate token and extract user ID
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, "ThisISAsecret") as jwt.JwtPayload;

    // Check if the provided user ID matches the ID in the token
    if (createdBy !== decoded.id) {
      return res.status(403).json({ message: 'Invalid user ID' });
    }

    // Validate dueDate
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    
    if (dueDateObj <= now) {
      return res.status(400).json({ message: 'Due date must be a future date' });
    }

    // Check if user exists
    const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [createdBy]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Insert ticket into the database
    const result = await pool.query(
      `INSERT INTO tickets (title, description, type, venue, status, price, priority, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [title, description, type, venue, status, price, priority, dueDate, createdBy]
    );

    const ticket = result.rows[0];
    
    // Return the created ticket details
    return res.status(201).json({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      type: ticket.type,
      venue: ticket.venue,
      status: ticket.status,
      priority: ticket.priority,
      dueDate: ticket.due_date,
      createdBy: ticket.created_by,
      assignedUsers: []
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
