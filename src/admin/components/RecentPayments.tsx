import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../services/api";

type Payment = {
  id: string;
  userId: string;
  totalAmount?: number;
  amount?: number;
  status: string | number;
  paidAt?: string;
  paymentMethod?: string;
};

export default function RecentPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.get("/payments")
      .then((res) => {
        const all = res.data as Payment[];
        setPayments(all.slice(0, 5));
      })
      .catch(console.error);
  }, []);

  function getAmount(p: Payment) {
    return Number(p.totalAmount ?? p.amount ?? 0);
  }

  function getStatus(p: Payment) {
    const s = String(p.status ?? "");
    if (s === "1" || s.toLowerCase() === "paid") return "Paid";
    return "Pending";
  }

  return (
    <div className="rounded-xl border border-[#dfe4f0] bg-white p-5">
      <h3 className="mb-5 text-lg font-bold text-[#07185f]">Recent Payments</h3>

      <div className="space-y-4">
        {payments.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">
            No payments found
          </p>
        )}

        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#07185f]">
                {payment.paymentMethod ?? "Razorpay"}
              </p>
              <p className="text-xs text-gray-500">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
            </div>

            <p className="text-sm font-semibold text-[#07185f]">
              ₹{getAmount(payment).toLocaleString("en-IN")}
            </p>

            <span
              className={`rounded-md px-3 py-1 text-xs font-semibold ${
                getStatus(payment) === "Paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {getStatus(payment)}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => void navigate("/admin/payments")}
        className="mt-6 w-full text-sm font-semibold text-[#4338ca] hover:underline"
      >
        View All
      </button>
    </div>
  );
}