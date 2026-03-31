export interface Order {
  id: string;
  reservation_code: string;
  guest_name: string;
  guest_email: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: "pending" | "paid" | "failed" | "refunded";
  total_cents: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price_cents: number;
  quantity: number;
  subtotal_cents: number;
}
