import express from "express";
import { createUser } from "../controllers/user.controller";
import { loginUser } from '../controllers/auth';
import { authMiddleware } from '../utils/authMiddleware';
import { createTicket } from "../controllers/tickets";
import { assignUserToTicket } from "../controllers/ticketAssign";
import { getTicketDetails } from '../controllers/ticketDetails'
import { getTicketAnalytics } from "../controllers/ticketHistory";

const router = express.Router();

router.post("/users", createUser);
router.post("/auth/login",loginUser);
router.post('/createTicket', authMiddleware, createTicket);
router.post('/tickets/:ticketId/assign', authMiddleware, assignUserToTicket);
router.get('/tickets/:ticketId', authMiddleware, getTicketDetails);
router.get('/analytics', authMiddleware, getTicketAnalytics);



export default router;
