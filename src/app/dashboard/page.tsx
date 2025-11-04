"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Card, CardContent } from "./Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalOutcome: 0,
    transactions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/razorpay/transactions");
      const json = await res.json();
      if (json.success) setData(json);
    };
    fetchData();
  }, []);

  const chartData = data.transactions.slice(0, 6).map((t, i) => ({
    name: `Tx-${i + 1}`,
    value: parseFloat(t.amount.replace("₹", "")),
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-[#1E1E2F] mb-6">Dashboard</h1>

          {/* Stat Cards */}
          <div className="text-[#1E1E2F] grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Balance" amount={`₹${data.totalBalance}`} icon="💰" />
            <StatCard title="Total Income" amount={`₹${data.totalIncome}`} icon="📈" />
            <StatCard title="Total Outcome" amount={`₹${data.totalOutcome}`} icon="📉" />
            <StatCard title="Transactions" amount={data.transactions.length} icon="🧾" />
          </div>

          {/* Analytics Section */}
          <div className="p-4 bg-white rounded-xl shadow-sm mb-6">
            <h2 className="text-lg text-[#1E1E2F] font-semibold mb-4">
              Analytics
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#2297F2" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions */}
          <div className="p-4 bg-white rounded-xl shadow-sm">
            <h2 className="text-lg text-[#1E1E2F] font-semibold mb-4">Transactions</h2>
            <div className="max-h-64 overflow-y-auto">
              {data.transactions.length > 0 ? (
                data.transactions.map((t) => (
                  <TransactionRow
                    key={t.id}
                    name={t.name}
                    date={t.date}
                    amount={t.amount}
                    status={t.status}
                  />
                ))
              ) : (
                <p className="text-gray-500">No transactions found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* Components */
function StatCard({ title, amount, icon }) {
  return (
    <Card className="p-4 shadow-sm">
      <CardContent>
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold">{amount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ name, date, amount, status }) {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <p className="font-medium text-[#1E1E2F]">{name}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-bold text-[#1E1E2F]">{amount}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            status === "Income"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
