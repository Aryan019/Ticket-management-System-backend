import express from "express";
import { createUser } from "../controllers/user.controller";
import { loginUser } from '../controllers/auth';
import { authenticateJWT } from '../utils/authMiddleware';
import { createTicket } from "../controllers/tickets";

const router = express.Router();

router.post("/users", createUser);
router.post("/auth/login",loginUser);
router.post('/createTicket', authenticateJWT, createTicket);

export default router;
