import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../utils/dbconnect";  // PostgreSQL connection
import { validateEmail, validatePassword } from "../utils/passwordUtil";

export const createUser = async (req: Request, res: Response) => {
    const { name, email, type, password } = req.body;

    try {
        // Validate request body
        if (!name || !email || !type || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long, contain at least one special character, and one number."
            });
        }

        // Check user type
        if (type !== "customer" && type !== "admin") {
            return res.status(400).json({ error: "Invalid user type." });
        }

        // Check if email is unique
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (name, email, type, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
            [name, email, type, hashedPassword]
        );

        // Return user details without password
        return res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
