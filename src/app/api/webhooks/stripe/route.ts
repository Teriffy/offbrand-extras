import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { sendOrderConfirmation } from "@/lib/email";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.stripe.webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Check if order already processed (idempotency)
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, status")
          .eq("stripe_checkout_session_id", session.id)
          .single();

        if (existingOrder && existingOrder.status === "paid") {
          console.log(
            `Order already processed for session ${session.id}, skipping.`
          );
          return NextResponse.json({ received: true });
        }

        // Update order status to paid
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "paid",
            stripe_payment_intent_id: session.payment_intent as string,
            guest_email: session.customer_email,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_checkout_session_id", session.id);

        if (updateError) {
          console.error("Failed to update order status:", updateError);
          throw updateError;
        }

        // Fetch order and items to send confirmation email
        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_checkout_session_id", session.id)
          .single();

        if (order) {
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id);

          if (items) {
            // Send email (fire-and-forget, don't throw if it fails)
            await sendOrderConfirmation({
              order,
              items,
            });
          }
        }

        console.log(`Order ${session.id} marked as paid`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        // Try to find order by payment intent
        if (paymentIntent.metadata?.["stripe_checkout_session_id"]) {
          const { error: updateError } = await supabase
            .from("orders")
            .update({
              status: "failed",
              updated_at: new Date().toISOString(),
            })
            .eq(
              "stripe_checkout_session_id",
              paymentIntent.metadata["stripe_checkout_session_id"]
            );

          if (updateError) {
            console.error("Failed to update order to failed:", updateError);
          }
        }

        console.log(
          `Payment failed for intent ${paymentIntent.id}:`,
          paymentIntent.last_payment_error?.message
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    // Return 200 to acknowledge receipt but log the error
    // This prevents Stripe from retrying forever
    return NextResponse.json(
      { received: true, error: "Webhook processing error" },
      { status: 200 }
    );
  }
}
