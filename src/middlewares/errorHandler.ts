import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // Log error in production using proper logging service
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
};

export default errorHandler;
