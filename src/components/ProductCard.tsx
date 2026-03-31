"use client";

import { Product } from "@/types/product";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const priceInEur = (product.price_cents / 100).toFixed(2);

  const handleAddToCart = () => {
    addItem(product.id, quantity);
    setQuantity(1);
    // Could add a toast notification here
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 flex flex-col">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      <div className="flex-grow">
        <h3 className="font-semibold text-slate-900 mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-slate-600 mb-3">{product.description}</p>
        )}
      </div>
      <div className="border-t border-slate-200 pt-3 mt-3">
        <p className="text-lg font-bold text-slate-900 mb-3">
          {product.currency === "eur" && "€"}
          {priceInEur}
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 px-2 py-2 border border-slate-300 rounded text-sm"
          />
          <button
            onClick={handleAddToCart}
            className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
