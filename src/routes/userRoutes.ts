import express from "express";
import { createUser } from "../controllers/user.controller";
import { loginUser } from '../controllers/auth';

const router = express.Router();

router.post("/users", createUser);
router.post("/auth/login",loginUser);

export default router;
