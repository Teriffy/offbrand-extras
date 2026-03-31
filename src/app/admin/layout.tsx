import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Prague For You</h1>
        <nav className="space-y-4">
          <Link
            href="/admin/dashboard"
            className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin/orders"
            className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors"
          >
            Orders
          </Link>
          <div className="pt-4 border-t border-slate-700">
            <Link
              href="/"
              className="block px-4 py-2 rounded hover:bg-slate-800 transition-colors text-sm"
            >
              ← Back to Shop
            </Link>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
