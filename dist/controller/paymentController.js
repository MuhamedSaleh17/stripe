"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const paymentService_1 = require("../services/paymentService");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
});
class PaymentController {
    async createCheckoutSession(req, res) {
        try {
            const { items } = req.body;
            if (!items || !Array.isArray(items)) {
                res.status(400).json({ error: 'Invalid items' });
                return;
            }
            const session = await PaymentController.paymentService.createCheckoutSession(items);
            res.status(200).json({ sessionId: session.url });
        }
        catch (error) {
            console.error('Error creating checkout session:', error);
            res.status(500).json({ error: error.message });
        }
    }
    async handleWebhook(req, res) {
        let event;
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            res.sendStatus(400);
            return;
        }
        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
                // Add your logic here, e.g., handlePaymentIntentSucceeded(paymentIntent);
                break;
            case 'payment_method.attached':
                const paymentMethod = event.data.object;
                // Add your logic here, e.g., handlePaymentMethodAttached(paymentMethod);
                break;
            default:
                console.log(`Unhandled event type ${event.type}.`);
        }
        // Return a 200 response to acknowledge receipt of the event
        res.send();
    }
}
exports.PaymentController = PaymentController;
PaymentController.paymentService = new paymentService_1.PaymentService();
