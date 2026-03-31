import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: "2023-10-16",
});

export interface CreateCheckoutSessionParams {
  items: Array<{
    productId: string;
    productName: string;
    priceCents: number;
    quantity: number;
  }>;
  reservationCode: string;
  guestName: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: params.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.productName,
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      reservation_code: params.reservationCode,
      guest_name: params.guestName,
    },
  });

  return session;
}
