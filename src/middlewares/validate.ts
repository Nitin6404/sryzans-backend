import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

type ValidateMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const validate = (validations: ValidationChain[]): ValidateMiddleware => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
            return;
        }

        const extractedErrors = errors.array().map((err) => err.msg);
        throw new AppError(400, extractedErrors[0]);
    };
};
