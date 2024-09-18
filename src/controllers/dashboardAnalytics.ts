import { Request, Response } from 'express';
import { Pool } from 'pg'; // PostgreSQL client
import { pool } from "../utils/dbconnect";  // PostgreSQL connection


export const getTicketAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, status, priority, type, venue } = req.query;

    // Base query for total and status counts
    let baseQuery = `
      SELECT
        COUNT(*) AS totalTickets,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closedTickets,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS openTickets,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) AS inProgressTickets,
        AVG(price) AS averageCustomerSpending
      FROM tickets
    `;

    // Base query for priority distribution
    let priorityQuery = `
      SELECT
        priority,
        COUNT(*) AS count
      FROM tickets
      GROUP BY priority
    `;

    // Base query for type distribution
    let typeQuery = `
      SELECT
        type,
        COUNT(*) AS count
      FROM tickets
      GROUP BY type
    `;

    const params: any[] = [];
    let whereClauses: string[] = [];

    // Add WHERE clauses
    if (startDate) {
      whereClauses.push('created_at >= $1');
      params.push(startDate);
    }
    if (endDate) {
      whereClauses.push('created_at <= $2');
      params.push(endDate);
    }
    if (status) {
      whereClauses.push('status = $3');
      params.push(status);
    }
    if (priority) {
      whereClauses.push('priority = $4');
      params.push(priority);
    }
    if (type) {
      whereClauses.push('type = $5');
      params.push(type);
    }
    if (venue) {
      whereClauses.push('venue = $6');
      params.push(venue);
    }

    // Apply WHERE clauses to the queries
    if (whereClauses.length > 0) {
      baseQuery += ' WHERE ' + whereClauses.join(' AND ');
      priorityQuery += ' WHERE ' + whereClauses.join(' AND ');
      typeQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Execute queries
    const [baseResult, priorityResult, typeResult] = await Promise.all([
      pool.query(baseQuery, params),
      pool.query(priorityQuery, params),
      pool.query(typeQuery, params),
    ]);

    // Calculate additional metrics
    const totalTickets = parseInt(baseResult.rows[0].totalTickets || '0');
    const closedTickets = parseInt(baseResult.rows[0].closedTickets || '0');
    const openTickets = parseInt(baseResult.rows[0].openTickets || '0');
    const inProgressTickets = parseInt(baseResult.rows[0].inProgressTickets || '0');
    const averageCustomerSpending = parseFloat(baseResult.rows[0].averageCustomerSpending || '0');
    
    const priorityDistribution = priorityResult.rows.reduce((acc: any, row: any) => {
      acc[row.priority] = parseInt(row.count);
      return acc;
    }, {});

    const typeDistribution = typeResult.rows.reduce((acc: any, row: any) => {
      acc[row.type] = parseInt(row.count);
      return acc;
    }, {});

    const daysRange = (new Date(endDate as string).getTime() - new Date(startDate as string).getTime()) / (1000 * 3600 * 24);
    const averageTicketsBookedPerDay = daysRange ? totalTickets / daysRange : 0;

    // Send response
    res.json({
      totalTickets,
      closedTickets,
      openTickets,
      averageCustomerSpending,
      averageTicketsBookedPerDay,
      inProgressTickets,
      priorityDistribution,
      typeDistribution
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
