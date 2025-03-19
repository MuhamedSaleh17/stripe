// services/payment.service.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string
    // , {
//   apiVersion: '2025-02-24.acacia', // Adjust to your Stripe API version
// }
);

export class PaymentService {
  async createCheckoutSession(items: { id: number; quantity: number; name: string; price: number }[]) {
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
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}