import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
}

declare module 'express' {
    interface Request {
        user?: JwtPayload;
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;
