"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/orders?limit=1000");
        const data = await response.json();

        const paidOrders = data.data.filter(
          (order: any) => order.status === "paid"
        );
        const totalRevenue = paidOrders.reduce(
          (sum: number, order: any) => sum + order.total_cents,
          0
        );

        setStats({
          totalOrders: data.total,
          paidOrders: paidOrders.length,
          totalRevenue: totalRevenue / 100,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

      {loading && <p>Loading...</p>}

      {!loading && stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-600 text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-600 text-sm">Paid Orders</p>
            <p className="text-3xl font-bold text-green-600">{stats.paidOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-slate-600 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900">
              €{stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <a href="/admin/products" className="text-blue-600 hover:underline">
              Manage Products
            </a>
          </li>
          <li>
            <a href="/admin/orders" className="text-blue-600 hover:underline">
              View Orders
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
