import { Request, Response } from 'express';
// import pool from '../utils/dbconnect'; // Adjust path as necessary
import { pool } from "../utils/dbconnect";  // PostgreSQL connection

export const getTicketDetails = async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const user = (req as any).user as { id: string }; // Type assertion
//   (req as any).user = decoded;
  try {
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get the ticket details
    const ticketResult = await pool.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [ticketId]
    );
    const ticket = ticketResult.rows[0];
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Get the assigned users
    const assignedUsersResult = await pool.query(
      `SELECT users.id AS user_id, users.name, users.email
       FROM ticket_assignments
       JOIN users ON ticket_assignments.user_id = users.id
       WHERE ticket_assignments.ticket_id = $1`,
      [ticketId]
    );
    const assignedUsers = assignedUsersResult.rows;

    // Get the number of assigned users
    const totalAssigned = assignedUsers.length;

    // Prepare response
    const response = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      type: ticket.type,
      venue: ticket.venue,
      status: ticket.status,
      price: ticket.price,
      priority: ticket.priority,
      dueDate: ticket.due_date,
      createdBy: ticket.created_by,
      assignedUsers,
      statistics: {
        totalAssigned,
        status: ticket.status,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getTicketDetails;
