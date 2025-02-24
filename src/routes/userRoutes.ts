import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { registerValidator, loginValidator } from '../validators/userValidators';
import { validate } from '../middlewares/validate';

const router = Router();

type AsyncHandler = Parameters<typeof router.post>[1];

router.post('/register', validate(registerValidator), registerUser as AsyncHandler);
router.post('/login', validate(loginValidator), loginUser as AsyncHandler);

export default router;
