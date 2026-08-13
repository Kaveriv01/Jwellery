const Stripe = require('stripe');

/**
 * Stripe instance initialized with secret key from environment.
 * Used for creating payment intents and handling webhooks.
 */
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
