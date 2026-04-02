"use client";

import { useCart } from "@/contexts/CartContext";
import { useReservation } from "@/contexts/ReservationContext";
import { Product } from "@/types/product";
import { CartItem } from "@/components/CartItem";
import { useState } from "react";

interface CartSidebarProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ products, isOpen, onClose }: CartSidebarProps) {
  const { items, clearCart } = useCart();
  const { reservationCode, guestName } = useReservation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const cartProducts = items
    .map((item) => ({
      product: products.find((p) => p.id === item.productId),
      quantity: item.quantity,
    }))
    .filter((item) => item.product !== undefined);

  const total = cartProducts.reduce(
    (sum, item) => sum + (item.product!.price_cents * item.quantity) / 100,
    0
  );

  const handleCheckout = async () => {
    if (!reservationCode || !guestName) {
      alert("Reservation information not found. Please reload the page.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          reservationCode,
          guestName,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        alert(`Checkout failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to proceed to checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex justify-between items-center border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          {cartProducts.length === 0 ? (
            <p className="text-center text-slate-600">Your cart is empty</p>
          ) : (
            <div className="space-y-1">
              {cartProducts.map(({ product, quantity }) => (
                <CartItem key={product!.id} product={product!} quantity={quantity} />
              ))}
            </div>
          )}
        </div>

        {cartProducts.length > 0 && (
          <div className="border-t border-slate-200 p-4 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold text-slate-900">
              <span>Total:</span>
              <span>€{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
            <button
              onClick={clearCart}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium py-2 px-4 rounded transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
