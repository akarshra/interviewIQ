import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createCheckoutSession, stripeWebhook } from "../controllers/payment.controller.js"

const paymentRouter = express.Router()

paymentRouter.post("/create-checkout-session", isAuth, createCheckoutSession)
paymentRouter.post("/webhook", stripeWebhook)

export default paymentRouter