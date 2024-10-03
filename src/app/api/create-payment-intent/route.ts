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

    let foundBooking;
    if (payment_intent_id) {
      foundBooking = await prismadb.booking.findUnique({
        where: {
          paymentIntentId: payment_intent_id,
        },
      });

      if (foundBooking) {
        // Update payment intent
        const current_intent = await stripe.paymentIntents.retrieve(
          payment_intent_id
        );
        if (current_intent) {
          const updated_intent = await stripe.paymentIntents.update(
            payment_intent_id,
            {
              amount: booking.totalPrice * 100,
            }
          );
          const res = await prismadb.booking.update({
            where: { paymentIntentId: payment_intent_id },
            data: bookingData,
          });

          if (!res) {
            return NextResponse.json(
              { error: "Failed to update booking" },
              { status: 500 }
            );
          }

          return NextResponse.json({ paymentIntent: updated_intent });
        }
      }
    }

    // If we reach here, we need to create a new payment intent
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
