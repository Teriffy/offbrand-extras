"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Order, OrderItem } from "@/types/order";

export default function OrderDetail() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      const data = await response.json();
      setOrder(data.order);
      setItems(data.items);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  const total = (order.total_cents / 100).toFixed(2);

  return (
    <div>
      <Link href="/admin/orders" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Orders
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 mb-8">
        Order {order.reservation_code}
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-slate-900 mb-4">Guest Information</h2>
          <p>
            <span className="text-slate-600">Name:</span> {order.guest_name}
          </p>
          <p>
            <span className="text-slate-600">Email:</span>{" "}
            {order.guest_email || "N/A"}
          </p>
          <p>
            <span className="text-slate-600">Reservation:</span>{" "}
            {order.reservation_code}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-slate-900 mb-4">Order Status</h2>
          <p>
            <span className="text-slate-600">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-sm font-medium ${
                order.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : order.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </p>
          <p>
            <span className="text-slate-600">Date:</span>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="font-bold text-slate-900 mb-4">Order Items</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2">Product</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-200">
                <td className="py-2">{item.product_name}</td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  €{(item.product_price_cents / 100).toFixed(2)}
                </td>
                <td className="text-right py-2">
                  €{(item.subtotal_cents / 100).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="font-bold bg-slate-50">
              <td colSpan={3} className="text-right py-2">
                Total:
              </td>
              <td className="text-right py-2">€{total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {order.stripe_payment_intent_id && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800">
            <strong>Payment Intent:</strong> {order.stripe_payment_intent_id}
          </p>
        </div>
      )}
    </div>
  );
}
