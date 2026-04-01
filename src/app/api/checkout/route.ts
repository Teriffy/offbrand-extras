import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe";
import { env } from "@/lib/env";
import { z } from "zod";

const CheckoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .nonempty(),
  reservationCode: z.string().min(1),
  guestName: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = CheckoutRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { items, reservationCode, guestName } = validation.data;

    // Fetch current product data from database
    const supabase = createServerClient();
    const productIds = items.map((item) => item.productId);

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price_cents, is_available")
      .in("id", productIds);

    if (productsError) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Validate all products exist and are available
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }
      if (!product.is_available) {
        return NextResponse.json(
          { error: `Product ${product.name} is no longer available` },
          { status: 400 }
        );
      }
    }

    // Create Stripe session
    const stripeItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        priceCents: product.price_cents,
        quantity: item.quantity,
      };
    });

    const totalCents = stripeItems.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0
    );

    const session = await createCheckoutSession({
      items: stripeItems,
      reservationCode,
      guestName,
      successUrl: `${env.baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${env.baseUrl}/?res=${reservationCode}&name=${guestName}`,
    });

    // Create order record in database with pending status
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        reservation_code: reservationCode,
        guest_name: guestName,
        stripe_checkout_session_id: session.id,
        status: "pending",
        total_cents: totalCents,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      return {
        order_id: order.id,
        product_id: item.productId,
        product_name: product.name,
        product_price_cents: product.price_cents,
        quantity: item.quantity,
        subtotal_cents: product.price_cents * item.quantity,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
