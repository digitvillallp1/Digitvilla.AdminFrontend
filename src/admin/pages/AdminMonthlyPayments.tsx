import { useEffect, useState } from "react";
import { IndianRupee, RefreshCw } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import api from "../../services/api";

type MonthlyPayment = {
  id: string;
  userName: string;
  email: string;
  planName: string;
  amount: number;
  month: string;
  status: string;
  dueDate: string;
  paidDate?: string | null;
};

type Summary = {
  totalRecords: number;
  totalCollected: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
};

function normalizePayment(item: any): MonthlyPayment {
  return {
    id: String(item.id || item.Id || Math.random()),
    userName: item.userName || item.UserName || "—",
    email: item.email || item.Email || "—",
    planName: item.planName || item.PlanName || "N/A",
    amount: Number(item.amount || item.Amount || 0),
    month: item.month || item.Month || "—",
    status: item.status || item.Status || "Pending",
    dueDate: item.dueDate || item.DueDate || "",
    paidDate: item.paidDate || item.PaidDate || null,
  };
}

export default function AdminMonthlyPayments() {
  const [payments, setPayments] = useState<MonthlyPayment[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalRecords: 0,
    totalCollected: 0,
    pendingAmount: 0,
    paidCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMonthlyPayments() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/monthly-payments");
      const res = response.data;

      // Backend returns { totalRecords, totalCollected, pendingAmount, paidCount, pendingCount, data[] }
      if (res && Array.isArray(res.data)) {
        setPayments(res.data.map(normalizePayment));
        setSummary({
          totalRecords: res.totalRecords ?? res.data.length,
          totalCollected: res.totalCollected ?? 0,
          pendingAmount: res.pendingAmount ?? 0,
          paidCount: res.paidCount ?? 0,
          pendingCount: res.pendingCount ?? 0,
        });
      } else if (Array.isArray(res)) {
        // Fallback: flat array
        const normalized = res.map(normalizePayment);
        setPayments(normalized);
        const paid = normalized.filter((m) => m.status?.toLowerCase() === "paid");
        const pending = normalized.filter((m) => m.status?.toLowerCase() === "pending");
        setSummary({
          totalRecords: normalized.length,
          totalCollected: paid.reduce((s, m) => s + m.amount, 0),
          pendingAmount: pending.reduce((s, m) => s + m.amount, 0),
          paidCount: paid.length,
          pendingCount: pending.length,
        });
      }
    } catch (err: any) {
      console.error("Monthly payments fetch error:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("Access denied. Admin token check karo.");
      } else if (status === 404) {
        setError("Endpoint not found: /api/monthly-payments");
      } else {
        setError("Monthly payments load nahi ho pa rahe. Backend check karo.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMonthlyPayments();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />
      <div className="ml-64 flex min-h-screen flex-col">
        <AdminHeader title="Dashboard" />
        <main className="flex-1 p-8">

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#07185f]">Monthly Payments</h1>
              <p className="mt-1 text-sm text-gray-500">
                All users monthly fee status for current month
              </p>
            </div>
            <button
              onClick={fetchMonthlyPayments}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#4338ca] px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Total Records */}
            <div className="rounded-2xl border border-[#dfe4f0] bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Records</p>
              <h2 className="mt-3 text-3xl font-bold text-[#07185f]">
                {loading ? "—" : summary.totalRecords}
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                {summary.paidCount} paid · {summary.pendingCount} pending
              </p>
            </div>

            {/* Total Collected */}
            <div className="rounded-2xl border border-[#dfe4f0] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Collected</p>
                  <h2 className="mt-3 text-3xl font-bold text-green-600">
                    {loading ? "—" : `₹${summary.totalCollected.toLocaleString("en-IN")}`}
                  </h2>
                  <p className="mt-2 text-xs text-green-600">
                    From {summary.paidCount} paid users
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <IndianRupee size={28} />
                </div>
              </div>
            </div>

            {/* Pending Amount */}
            <div className="rounded-2xl border border-[#dfe4f0] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Amount</p>
                  <h2 className="mt-3 text-3xl font-bold text-red-600">
                    {loading ? "—" : `₹${summary.pendingAmount.toLocaleString("en-IN")}`}
                  </h2>
                  <p className="mt-2 text-xs text-red-600">
                    From {summary.pendingCount} pending users
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <IndianRupee size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4338ca] border-t-transparent" />
              <p className="ml-3 text-gray-500">Loading monthly payments...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              <p>{error}</p>
              <button
                onClick={fetchMonthlyPayments}
                className="mt-2 font-medium underline hover:text-red-900"
              >
                Retry karo
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="overflow-hidden rounded-2xl border border-[#dfe4f0] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-[#dfe4f0] bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">User Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">Plan</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">Month</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">Due Date</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">Paid Date</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((item) => (
                      <tr key={item.id} className="border-t border-[#dfe4f0] hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-[#07185f]">
                          {item.userName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.planName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{item.month}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                          ₹{item.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.dueDate
                            ? new Date(item.dueDate).toLocaleDateString("en-IN")
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.paidDate
                            ? new Date(item.paidDate).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.status?.toLowerCase() === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {payments.length === 0 && (
                <div className="p-12 text-center">
                  <p className="font-medium text-gray-500">No monthly payments found</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Koi active user nahi hai ya backend se data nahi aa raha
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}