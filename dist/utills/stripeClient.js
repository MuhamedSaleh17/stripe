"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// utils/stripeClient.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
exports.default = stripe;
