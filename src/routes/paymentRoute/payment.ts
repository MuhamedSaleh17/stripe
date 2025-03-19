import express from 'express';
import { 
  createCheckoutSession , handleWebhook
} from '../../controller/paymentController';

const router = express.Router();
import { authenticateToken } from '../../middleware/authMiddleware';

router.post('/create-checkout-session',authenticateToken, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;