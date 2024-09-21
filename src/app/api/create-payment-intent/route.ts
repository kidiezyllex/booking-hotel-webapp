import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { booking, payment_intent_id } = await req.json();

  const bookingData = {
    ...booking,
    userName: user.firstName,
    userEmail: user.emailAddresses,
    userId: user.id,
    currency: "usd",
    paymentIntentId: payment_intent_id,
  };

  // Continue with the rest of your logic...
}
