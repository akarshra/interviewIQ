import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
