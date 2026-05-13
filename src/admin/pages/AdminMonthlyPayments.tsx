import { useEffect, useState } from "react";
import { IndianRupee, RefreshCw } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import api from "../../services/api";

type MonthlyPayment = {
  id: string;
  planName: string;
  amount: number;
  status: string;
  dueDate: string;
  paidDate?: string | null;
};

export default function AdminMonthlyPayments() {
  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchMonthlyPayments() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/monthly-payments");
      console.log("Monthly payments:", response.data);
      setMonthlyPayments(response.data);
    } catch (err) {
      console.error("Monthly payments fetch error:", err);
      setError("Monthly payments load nahi ho pa rahe. Token ya backend check karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchMonthlyPayments();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const paidList = monthlyPayments.filter(
    (m) => m.status?.toLowerCase() === "paid"
  );

  const pendingList = monthlyPayments.filter(
    (m) => m.status?.toLowerCase() === "pending"
  );

  const totalCollected = paidList.reduce(
    (sum, m) => sum + Number(m.amount || 0),
    0
  );

  const totalPending = pendingList.reduce(
    (sum, m) => sum + Number(m.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />

      <div className="ml-64 flex min-h-screen flex-col">
        <AdminHeader title="Monthly Payments" />

        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#07185f]">
                Monthly Payments
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Backend database se monthly paid aur pending records
              </p>
            </div>

            <button
              onClick={fetchMonthlyPayments}
              className="flex items-center gap-2 rounded-xl bg-[#4338ca] px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-[#dfe4f0] bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Records</p>
              <h2 className="mt-3 text-3xl font-bold text-[#07185f]">
                {monthlyPayments.length}
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                Monthly payment statuses
              </p>
            </div>

            <div className="rounded-2xl border border-[#dfe4f0] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Collected</p>
                  <h2 className="mt-3 text-3xl font-bold text-green-600">
                    ₹{totalCollected.toLocaleString("en-IN")}
                  </h2>
                  <p className="mt-2 text-xs text-green-600">
                    From {paidList.length} paid records
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <IndianRupee size={28} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#dfe4f0] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Amount</p>
                  <h2 className="mt-3 text-3xl font-bold text-red-600">
                    ₹{totalPending.toLocaleString("en-IN")}
                  </h2>
                  <p className="mt-2 text-xs text-red-600">
                    From {pendingList.length} pending records
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <IndianRupee size={28} />
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <p className="text-blue-600">Loading monthly payments...</p>
          )}

          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <div className="overflow-hidden rounded-2xl border border-[#dfe4f0] bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="border-b border-[#dfe4f0] bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Plan Name
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Paid Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {monthlyPayments.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#dfe4f0] hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#07185f]">
                        {item.planName || "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        ₹{Number(item.amount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.dueDate
                          ? new Date(item.dueDate).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.paidDate
                          ? new Date(item.paidDate).toLocaleDateString("en-IN")
                          : "Not Paid"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            item.status?.toLowerCase() === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {monthlyPayments.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No monthly payments found
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}