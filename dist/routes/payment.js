"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/payment.routes.ts
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controller/paymentController");
const router = express_1.default.Router();
const paymentController = new paymentController_1.PaymentController();
// Endpoint for creating a checkout session (parsed as JSON)
router.post('/create-checkout-session', express_1.default.json(), paymentController.createCheckoutSession.bind(paymentController));
// Endpoint for handling Stripe webhooks (raw body)
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), paymentController.handleWebhook.bind(paymentController));
exports.default = router;
