import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import 'dotenv/config.js';
import Payment from '../models/Payment.js';

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

// ROUTE 1: Create Order API using POST method
router.post('/order', (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: Number(amount * 100), // Amount should be in paisa
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.error("Error creating order:", error);
                return res.status(500).json({ message: "Something went wrong while creating the order." });
            }
            res.status(200).json({ data: order });
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

// ROUTE 2: Verify API using POST method
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        const isAuthentic = expectedSign === razorpay_signature;

        if (isAuthentic) {
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            await payment.save();

            res.json({ message: "Payment Successful" });
        } else {
            res.status(400).json({ message: "Invalid Signature" });
        }
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

export default router;