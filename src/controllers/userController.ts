import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/errorHandler';

type ControllerResponse = Promise<Response | void>;

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): ControllerResponse => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError(400, 'Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): ControllerResponse => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError(401, 'Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1d',
        });

        return res.json({
            status: 'success',
            data: { token },
        });
    } catch (error) {
        next(error);
    }
};
