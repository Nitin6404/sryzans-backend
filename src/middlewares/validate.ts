import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

type ValidateMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const validate = (validations: ValidationChain[]): ValidateMiddleware => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await Promise.all(validations.map((validation) => validation.run(req)));

            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }

            throw new AppError(400, 'Validation failed');
        } catch (error) {
            next(error);
        }
    };
};
