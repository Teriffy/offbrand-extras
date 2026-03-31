"use client";

import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  product: Product;
  quantity: number;
}

export function CartItem({ product, quantity }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const subtotal = (product.price_cents * quantity) / 100;
  const priceInEur = (product.price_cents / 100).toFixed(2);

  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-200 last:border-b-0">
      <div className="flex-grow">
        <p className="font-medium text-slate-900">{product.name}</p>
        <p className="text-sm text-slate-600">
          {product.currency === "eur" && "€"}
          {priceInEur} × {quantity}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-sm"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-sm"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeItem(product.id)}
          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
        >
          ✕
        </button>
      </div>
      <div className="w-20 text-right">
        <p className="font-semibold text-slate-900">
          {product.currency === "eur" && "€"}
          {subtotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
