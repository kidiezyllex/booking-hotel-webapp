import { NextResponse } from "next/server";
import Stripe from "stripe";
import prismadb from "../../../../lib/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { booking, payment_intent_id } = await req.json();

    if (!booking || typeof booking.totalPrice !== "number") {
      return new NextResponse("Invalid booking data", { status: 400 });
    }

    const bookingData = {
      ...booking,
      currency: "usd",
      paymentIntentId: payment_intent_id,
    };

    if (payment_intent_id) {
      const existingIntent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );
      if (existingIntent) {
        return NextResponse.json({ paymentIntent: existingIntent });
      }
    }

    // Create new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100),
      currency: bookingData.currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create new booking
    await prismadb.booking.create({
      data: {
        ...bookingData,
        paymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({ paymentIntent });
  } catch (error) {
    console.error("Error in create-payment-intent:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
