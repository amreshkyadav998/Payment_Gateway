/* eslint-disable no-unused-vars */
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import car from '../assets/car.avif'


export default function ProductCard() {
    const [amount, setAmount] = useState(350);
    const [phoneNumber, setPhoneNumber] = useState("");

    // handlePayment Function
    const handlePayment = async () => {
        if (!phoneNumber) {
            toast.error("Please enter your phone number.");
            return;
        }

        try {
            // Create the order on the server
            const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ amount })
            });

            const data = await res.json();
            console.log(data);

            // Open Razorpay payment modal
            if (data && data.data) {
                handlePaymentVerify(data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // handlePaymentVerify Function
    const handlePaymentVerify = (orderData) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use actual env variable
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Payment",
            description: "Test Mode",
            order_id: orderData.id,
            prefill: {
                contact: phoneNumber,
                email: "user@example.com" // Optional: if you have the user's email
            },
            handler: async (response) => {
                console.log("response", response)
                try {
                    // Verify the payment on the server
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })

                    const verifyData = await res.json();

                    if (verifyData.message) {
                        toast.success(verifyData.message);
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };

        // Open Razorpay payment modal
        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    return (
        <Card className="mt-6 w-96 bg-black text-white">
            <CardHeader color="blue-gray" className="relative h-96 bg-[#2C3A47]">
                <img
                    src={car}
                    alt="card-image"
                />
            </CardHeader>

            {/* CardBody */}
            <CardBody>
                <Typography variant="h5" className="mb-2">
                    My First Product
                </Typography>

                <Typography>
                    ₹350 <span className="line-through">₹699</span>
                </Typography>

                {/* Phone Number Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-black mt-4"
                        style={{ '::placeholder': { color: 'black' } }}
                    />

                </div>
            </CardBody>

            <CardFooter className="pt-0">
                <Button className="w-full bg-[#1B9CFC]" onClick={handlePayment}>
                    Buy Now
                </Button>
                <Toaster />
            </CardFooter>
        </Card>
    );
}