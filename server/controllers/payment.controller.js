import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import stripe from "../services/stripe.service.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;
        if (!amount || !credits) {
            return res.status(400).json({ message: "Invalid plan data" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `InterviewIQ ${planId} Plan`,
                            description: `${credits} AI Interview Credits`,
                        },
                        unit_amount: amount * 100, // in paise
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.CORS_ORIGIN || "http://localhost:5173"}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CORS_ORIGIN || "http://localhost:5173"}/pricing`,
            metadata: {
                userId: req.userId.toString(),
                planId: planId.toString(),
                credits: credits.toString(),
            },
        });

        await Payment.create({
            userId: req.userId,
            planId: planId,
            amount: amount,
            credits: credits,
            stripeSessionId: session.id,
            status: "created",
        });

        return res.json({ url: session.url });

    } catch (error) {
        console.error("Create Checkout Session error:", error);
        return res.status(500).json({ message: "An internal server error occurred while creating Stripe checkout session." });
    }
}


export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    let event;

    try {
        if(!process.env.STRIPE_WEBHOOK_SECRET) {
            console.log("No Stripe Webhook secret provided in .env, skipping signature verification.");
            event = req.body;
        } else {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const payment = await Payment.findOne({ stripeSessionId: session.id });
        if (!payment) {
            console.error("Payment not found for session:", session.id);
            return res.status(404).json({ message: "Payment not found" });
        }

        if (payment.status === "paid") {
            return res.json({ message: "Already processed" });
        }

        payment.status = "paid";
        payment.stripePaymentIntentId = session.payment_intent;
        await payment.save();

        const updatedUser = await User.findByIdAndUpdate(payment.userId, {
            $inc: { credits: payment.credits }
        }, { new: true });

        console.log(`Payment successful. Credits added to user ID: ${payment.userId}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
}