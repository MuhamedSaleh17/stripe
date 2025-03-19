"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const client_model_1 = __importDefault(require("../model/client/client.model"));
const packagePrices = {
    "Influencer": 10000,
    "Finance": 15000,
    "Agency": 20000,
    "Corporation": 25000,
    "HoldingsBase": 5000 // $50.00
};
const validPackages = ["Influencer", "Finance", "Agency", "Corporation"];
const stripeClient = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const createCheckoutSession = async (req, res) => {
    try {
        const client = await client_model_1.default.findById(req.body.user.clientId);
        console.log(req.body.subDomain);
        await client_model_1.default.findByIdAndUpdate(req.body.user.clientId, {
            $push: {
                companies: {
                    type: req.body.type,
                    name: req.body.name,
                    quantity: req.body.quantity,
                    address: req.body.address,
                    subDomains: req.body.subDomain,
                    subsidiaries: req.body.subsidiaries
                }
            }
        });
        const { type, package: pkg, subsidiaries } = req.body;
        // Array to hold items for the checkout session
        const items = [];
        if (type === "single") {
            // Handle single package purchase
            if (!pkg || !validPackages.includes(pkg)) {
                throw new Error("Invalid or missing package name");
            }
            items.push({
                name: pkg,
                price: packagePrices[pkg],
                quantity: 1
            });
        }
        else if (type === "holdings") {
            // Handle Holdings purchase
            if (!Array.isArray(subsidiaries) || subsidiaries.length === 0) {
                throw new Error("Subsidiaries must be a non-empty array");
            }
            // Add the Holdings base item
            items.push({
                name: "Holdings Base",
                price: packagePrices["HoldingsBase"],
                quantity: req.body.quantity,
            });
            // Add each subsidiary package
            for (const sub of subsidiaries) {
                if (!sub.package || !validPackages.includes(sub.package) || !sub.quantity || sub.quantity < 1) {
                    throw new Error("Invalid subsidiary package or quantity");
                }
                items.push({
                    name: sub.package,
                    price: packagePrices[sub.package],
                    quantity: sub.quantity
                });
            }
        }
        else {
            throw new Error("Invalid type: must be 'single' or 'holdings'");
        }
        const session = await stripeClient.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: 'https://www.google.com',
            cancel_url: 'https://www.youtube.com',
            // line_items: req.body.items.map((item: { 
            //   id: number; 
            //   quantity: number; 
            //   name: string; 
            //   price: number 
            // }) => ({
            //   price_data: {
            //     currency: 'usd',
            //     product_data: {
            //       name: item.name,
            //     },
            //     unit_amount: item.price,
            //   },
            //   quantity: item.quantity,
            // })),
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
    }
    catch (err) {
        console.error('Error creating checkout session:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
};
exports.createCheckoutSession = createCheckoutSession;
// async (req: Request, res: Response): Promise<void> => 
const handleWebhook = async (req, res) => {
    let event = req.body;
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        const signature = req.headers['stripe-signature'];
        try {
            event = stripeClient.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        }
        catch (err) {
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
exports.handleWebhook = handleWebhook;
