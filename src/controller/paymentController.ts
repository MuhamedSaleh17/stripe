import { Request, Response } from 'express';
import stripe from 'stripe';
import ClientModel from '../model/client/client.model';

const packagePrices = {
  "Influencer": 10000, // $100.00
  "Finance": 15000,    // $150.00
  "Agency": 20000,     // $200.00
  "Corporation": 25000,// $250.00
  "HoldingsBase": 5000 // $50.00
};
const validPackages = ["Influencer", "Finance", "Agency", "Corporation"];
const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {

    const client = await ClientModel.findById(req.body.user.clientId)
     await ClientModel.findByIdAndUpdate(req.body.user.clientId, 
      {
        $set: {
          company: req.body.company, // No array, just an object
          subsidiaries: req.body.subsidiaries,
        },
      },
      { new: true }
    );
    
   
    const { company, subsidiaries = [] } = req.body;

    const items = [];
    
    if (company.type === "single") {
      const pkg = company.package as keyof typeof packagePrices;
      if (!pkg || !validPackages.includes(pkg)) {
        throw new Error("Invalid or missing package name");
      }
      items.push({
        name: pkg,
        price: packagePrices[pkg] * 100, // Convert to cents
        quantity: company.quantity || 1
      });
    } else if (company.type === "holdings") {
      if (!Array.isArray(subsidiaries) || subsidiaries.length === 0) {
        throw new Error("Subsidiaries must be a non-empty array");
      }
      // Add the Holdings base item
      items.push({
        name: "HoldingsBase",
        price: packagePrices["HoldingsBase"] * 100, // Convert to cents
        quantity: 1
      });
      // Add each subsidiary package
      for (const sub of subsidiaries as Array<{ package: keyof typeof packagePrices; quantity: number }>) {
        if (!sub.package || !validPackages.includes(sub.package) || !sub.quantity || sub.quantity < 1) {
          throw new Error("Invalid subsidiary package or quantity");
        }
        items.push({
          name: sub.package,
          price: packagePrices[sub.package] * 100, // Convert to cents
          quantity: sub.quantity
        });
      }
    } else {
      throw new Error("Invalid type: must be 'single' or 'holdings'");
    }
    
    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: 'https://www.google.com',
        cancel_url: 'https://www.youtube.com',
        line_items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name
            },
            unit_amount: item.price
          },
          quantity: item.quantity
        }))
      });
    
      res.json({ sessionId: session.url });
    } catch (err) {
      console.error('Error creating checkout session:', err);
      res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }


    // Array to hold items for the checkout session
    // const items = [];
    // console.log(pkg)
    // if (company.type === "single") {
    //   // Handle single package purchase
    //   // if (!pkg || !validPackages.includes(pkg)) {
    //   //   throw new Error("Invalid or missing package name");
    //   // }
    //   items.push({
    //     name: pkg,
    //     price: packagePrices[pkg],
    //     quantity: 1
    //   });
    // } else if (company.type === "holdings") {
    //   // Handle Holdings purchase
    //   if (!Array.isArray(subsidiaries) || subsidiaries.length === 0) {
    //     throw new Error("Subsidiaries must be a non-empty array");
    //   }
    //   // Add the Holdings base item
    //   items.push({
    //     name: "Holdings Base",
    //     price: packagePrices["HoldingsBase"],
    //     quantity: req.body.quantity,
      
    //   });
    //   // Add each subsidiary package
    //   for (const sub of subsidiaries as { package: keyof typeof packagePrices; quantity: number }[]) {
    //     if (!sub.package || !validPackages.includes(sub.package) || !sub.quantity || sub.quantity < 1) {
    //       throw new Error("Invalid subsidiary package or quantity");
    //     }
    //     items.push({
    //       name: sub.package,
    //       price: packagePrices[sub.package],
    //       quantity: sub.quantity
    //     });
    //   }
    // } else {
    //   throw new Error("Invalid type: must be 'single' or 'holdings'");
    // }



    // const session = await stripeClient.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   mode: 'payment',
    //   success_url: 'https://www.google.com',
    //   cancel_url: 'https://www.youtube.com',
    //   // line_items: req.body.items.map((item: { 
    //   //   id: number; 
    //   //   quantity: number; 
    //   //   name: string; 
    //   //   price: number 
    //   // }) => ({
    //   //   price_data: {
    //   //     currency: 'usd',
    //   //     product_data: {
    //   //       name: item.name,
    //   //     },
    //   //     unit_amount: item.price,
    //   //   },
    //   //   quantity: item.quantity,
    //   // })),
    //   line_items: items.map(item => ({
    //     price_data: {
    //       currency: 'usd',
    //       product_data: {
    //         name: item.name
    //       },
    //       unit_amount: item.price
    //     },
    //     quantity: item.quantity
    //   }))
    // });

    // res.json({ sessionId: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
}
// async (req: Request, res: Response): Promise<void> => 
export const handleWebhook = async (req: Request, res: Response): Promise<any> => {
  let event = req.body;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    const signature = req.headers['stripe-signature'] as string;
    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log('⚠️ Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Add your business logic here
      break;

    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Add your business logic here
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  res.json({ received: true });
};