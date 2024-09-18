import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers['authorization'];

//   if (!token) {
//     return res.status(403).json({ message: 'Access denied, no token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token.split(' ')[1],"ThisISAsecret");
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// Middleware to authenticate and get the user
export const authMiddleware = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, "ThisISAsecret");
        // req.user = decoded;
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
