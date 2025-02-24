import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { registerValidator, loginValidator } from '../validators/userValidators';
import { validate } from '../middlewares/validate';

const router = express.Router();

router.post('/register', validate(registerValidator), registerUser);
router.post('/login', validate(loginValidator), loginUser);

export default router;
