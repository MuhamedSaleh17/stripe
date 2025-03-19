"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
// services/payment.service.ts
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY
// , {
//   apiVersion: '2025-02-24.acacia', // Adjust to your Stripe API version
// }
);
class PaymentService {
    async createCheckoutSession(items) {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                success_url: 'https://www.google.com',
                cancel_url: 'https://www.youtube.com',
                line_items: items.map((item) => ({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                        },
                        unit_amount: item.price,
                    },
                    quantity: item.quantity,
                })),
            });
            return session;
        }
        catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;
