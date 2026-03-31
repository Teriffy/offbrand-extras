"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { ReservationBanner } from "@/components/ReservationBanner";
import { CartSidebar } from "@/components/CartSidebar";
import { useCart } from "@/contexts/CartContext";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { items } = useCart();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Prague For You
            </h1>
            <p className="text-sm text-slate-600">Guest Services</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center gap-2"
          >
            <span>🛒</span>
            Cart
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <ReservationBanner />

        <h2 className="text-3xl font-bold text-slate-900 mb-6">
          Available Services
        </h2>

        {loading && (
          <p className="text-center text-slate-600">Loading products...</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading products: {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-slate-600">No products available</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <CartSidebar
        products={products}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </main>
  );
}
