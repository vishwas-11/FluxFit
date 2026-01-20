import { Router } from 'express';
import { register, login, googleAuth } from '../controllers/auth.controller'
import { validate } from '../middlewares/validate.middleware'
import { registerSchema, loginSchema, googleAuthSchema } from '../validators/auth.validator'
const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', validate(googleAuthSchema), googleAuth);

export default router;

