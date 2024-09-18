import { Request, Response } from 'express';
// import pool from '../db'; // Adjust the path according to your db connection file
import { pool } from "../utils/dbconnect";  // PostgreSQL connection

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
  type: string;
  venue: string;
  created_at: string;
  created_by: string;
}

export const getTicketAnalytics = async (req: Request, res: Response) => {
  const { startDate, endDate, status, priority, type, venue } = req.query;

  try {
    let query = `
      SELECT id, title, status, priority, type, venue, created_at, created_by 
      FROM tickets 
      WHERE 1=1
    `;
    const values: any[] = [];

    if (startDate) {
      query += ` AND created_at >= $${values.length + 1}`;
      values.push(startDate);
    }

    if (endDate) {
      query += ` AND created_at <= $${values.length + 1}`;
      values.push(endDate);
    }

    if (status) {
      query += ` AND status = $${values.length + 1}`;
      values.push(status);
    }

    if (priority) {
      query += ` AND priority = $${values.length + 1}`;
      values.push(priority);
    }

    if (type) {
      query += ` AND type = $${values.length + 1}`;
      values.push(type);
    }

    if (venue) {
      query += ` AND venue = $${values.length + 1}`;
      values.push(venue);
    }

    // Fetch filtered tickets from the database
    const result = await pool.query(query, values);
    const tickets: Ticket[] = result.rows;

    const totalTickets = tickets.length;
    const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
    const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
    const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress').length;

    const priorityDistribution = {
      low: tickets.filter(ticket => ticket.priority === 'low').length,
      medium: tickets.filter(ticket => ticket.priority === 'medium').length,
      high: tickets.filter(ticket => ticket.priority === 'high').length,
    };

    const typeDistribution = {
      concert: tickets.filter(ticket => ticket.type === 'concert').length,
      conference: tickets.filter(ticket => ticket.type === 'conference').length,
      sports: tickets.filter(ticket => ticket.type === 'sports').length,
    };

    const response = {
      totalTickets,
      closedTickets,
      openTickets,
      inProgressTickets,
      priorityDistribution,
      typeDistribution,
      tickets: tickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        type: ticket.type,
        venue: ticket.venue,
        createdDate: ticket.created_at,
        createdBy: ticket.created_by,
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching ticket analytics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// export default getTicketAnalytics;
