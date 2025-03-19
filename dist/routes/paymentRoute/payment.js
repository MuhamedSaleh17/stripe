"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../../controller/paymentController");
const router = express_1.default.Router();
const authMiddleware_1 = require("../../middleware/authMiddleware");
router.post('/create-checkout-session', authMiddleware_1.authenticateToken, paymentController_1.createCheckoutSession);
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), paymentController_1.handleWebhook);
exports.default = router;
