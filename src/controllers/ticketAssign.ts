import { Request, Response } from "express";
import jwt from "jsonwebtoken";
// import pool from "../db"; // Assuming you have PostgreSQL pool setup for queries
import { pool } from "../utils/dbconnect";  // PostgreSQL connection

// // Middleware to authenticate and get the user
// const authMiddleware = (req: Request, res: Response, next: Function) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }

//     const token = authHeader.split(" ")[1];
//     try {
//         const decoded = jwt.verify(token, "ThisISAsecret");
//         // req.user = decoded;
//         (req as any).user = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
// };

// POST /tickets/:ticketId/assign - Assign a user to a ticket
const assignUserToTicket = async (req: Request, res: Response) => {
    const { ticketId } = req.params;
    const { userId } = req.body;
    const { id: requestUserId, type: requestUserType } = (req as any).user; // From the JWT

    try {
        // Step 1: Validate if the ticket exists
        const ticketResult = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
        const ticket = ticketResult.rows[0];
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Step 2: Check if the ticket is closed
        if (ticket.status === "closed") {
            return res.status(400).json({ message: "Cannot assign users to a closed ticket" });
        }

        // Step 3: Check if the requesting user is authorized to assign users
        if (ticket.created_by !== requestUserId && requestUserType !== "admin") {
            return res.status(403).json({ message: "Unauthorized to assign users to this ticket" });
        }

        // Step 4: Validate the user being assigned
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.type === "admin") {
            return res.status(400).json({ message: "Cannot assign an admin to a ticket" });
        }

        // Step 5: Check if the user is already assigned to the ticket
        const assignedResult = await pool.query('SELECT * FROM ticket_assignments WHERE ticket_id = $1 AND user_id = $2', [ticketId, userId]);
        if (assignedResult.rows.length > 0) {
            return res.status(400).json({ message: "User already assigned to this ticket" });
        }

        // Step 6: Check the number of assigned users
        const assignedUsersCount = await pool.query('SELECT COUNT(*) FROM ticket_assignments WHERE ticket_id = $1', [ticketId]);
        if (parseInt(assignedUsersCount.rows[0].count) >= 5) {
            return res.status(400).json({ message: "User assignment limit reached" });
        }

        // Step 7: Assign the user to the ticket
        await pool.query('INSERT INTO ticket_assignments (ticket_id, user_id) VALUES ($1, $2)', [ticketId, userId]);

        return res.status(200).json({ message: "User assigned successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export {  assignUserToTicket };
