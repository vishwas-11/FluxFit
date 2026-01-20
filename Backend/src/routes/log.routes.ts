import { Router } from 'express';
import { addLog, getLogs } from '../controllers/log.controller';
import { protect } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validate.middleware';
import { logSchema } from '../validators/log.validator';

const router = Router()

router.post("/", protect, validate(logSchema), addLog )
router.get("/", protect, getLogs )

export default router;