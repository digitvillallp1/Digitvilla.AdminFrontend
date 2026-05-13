import { useEffect, useState, useCallback } from "react";
import { Eye, X, RefreshCw } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import adminApi from "../../services/api";

type Payment = {
  id: string;
  userId: string;
  totalAmount?: number;
  amount?: number;
  status: string | number;
  paidAt?: string;
  paidDate?: string;
  paymentMethod?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

function getAmount(p: Payment) {
  return Number(p.totalAmount ?? p.amount ?? 0);
}

function getDate(p: Payment) {
  return p.paidAt ?? p.paidDate ?? null;
}

function getStatus(p: Payment) {
  const s = String(p.status ?? "");
  if (s === "1" || s.toLowerCase() === "paid") return "Paid";
  if (s === "0" || s.toLowerCase() === "pending") return "Pending";
  return s || "N/A";
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // ✅ FIXED — useCallback + void fetchPayments() + [fetchPayments] dependency
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminApi.get("/payments");
      setPayments(response.data as Payment[]);
    } catch (err) {
      console.error("Payments fetch error:", err);
      setError("Payments load nahi ho pa rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const totalAmount = payments.reduce((sum, p) => sum + getAmount(p), 0);
  const paidPayments = payments.filter((p) => getStatus(p) === "Paid");
  const pendingPayments = payments.filter((p) => getStatus(p) !== "Paid");

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        {/* Header */}
        <div className="mt-6 mb-6 flex items-center justify-between">
          <button
            onClick={() => void fetchPayments()}
            className="flex items-center gap-2 rounded-lg bg-[#07185f] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a2272]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Records</p>
            <h2 className="text-3xl font-bold text-[#07185f] mt-1">
              {payments.length}
            </h2>
            <p className="text-xs text-gray-400 mt-1">All payment records</p>
          </div>

          <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Collected</p>
            <h2 className="text-3xl font-bold text-green-600 mt-1">
              ₹{totalAmount.toLocaleString("en-IN")}
            </h2>
            <p className="text-xs text-green-500 mt-1">
              From {paidPayments.length} paid records
            </p>
          </div>

          <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Payments</p>
            <h2 className="text-3xl font-bold text-red-500 mt-1">
              {pendingPayments.length}
            </h2>
            <p className="text-xs text-red-400 mt-1">
              From {pendingPayments.length} pending records
            </p>
          </div>
        </section>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#07185f] border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Method
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-semibold text-gray-800">
                      ₹{getAmount(payment).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {getDate(payment)
                        ? new Date(getDate(payment)!).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {payment.paymentMethod ?? "Razorpay"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          getStatus(payment) === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {getStatus(payment)}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {payments.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                No payments found
              </div>
            )}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#07185f]">
                Payment Details
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-semibold">
                  ₹{getAmount(selectedPayment).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Status</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    getStatus(selectedPayment) === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {getStatus(selectedPayment)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Method</span>
                <span>{selectedPayment.paymentMethod ?? "Razorpay"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Date</span>
                <span>
                  {getDate(selectedPayment)
                    ? new Date(getDate(selectedPayment)!).toLocaleString("en-IN")
                    : "N/A"}
                </span>
              </div>
              {selectedPayment.razorpayOrderId && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Order ID</span>
                  <span className="text-xs text-gray-400 max-w-[180px] truncate">
                    {selectedPayment.razorpayOrderId}
                  </span>
                </div>
              )}
              {selectedPayment.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="text-xs text-gray-400 max-w-[180px] truncate">
                    {selectedPayment.razorpayPaymentId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}