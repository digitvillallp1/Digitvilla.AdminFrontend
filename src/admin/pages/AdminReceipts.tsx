import { useEffect, useState } from "react";
import {
  Eye, Download, Receipt as ReceiptIcon,
  FileText, Filter, Search, Mail,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import api from "../../services/api";

interface Receipt {
  id: string;
  receiptNumber: string;
  userName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: "Issued" | "Sent" | "Viewed" | "Pending";
}

// PascalCase + camelCase dono handle
function normalizeReceipt(r: any, index: number): Receipt {
  const tid = r.transactionId || r.TransactionId || "";
  return {
    id: String(r.id || r.Id || index),
    receiptNumber: tid.trim() !== ""
      ? tid
      : `RCP-2026-${(index + 1).toString().padStart(5, "0")}`,
    userName: r.userName || r.UserName || "N/A",
    amount: Number(r.amount || r.Amount || r.paidAmount || r.PaidAmount || 0),
    date: r.paidDate || r.PaidDate || r.issuedAt || r.IssuedAt || "",
    paymentMethod: r.paymentMethod || r.PaymentMethod || "Razorpay",
    status: "Issued",
  };
}

export default function AdminReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | Receipt["status"]>("All");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  async function fetchReceipts() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/receipts");
      const raw = Array.isArray(response.data) ? response.data : [];
      setReceipts(raw.map(normalizeReceipt));
    } catch (err: any) {
      console.error("Receipts fetch error:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("Access denied. Admin token check karo.");
      } else {
        setError("Receipts load nahi ho pa rahe. Backend check karo.");
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredReceipts = receipts.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      r.userName.toLowerCase().includes(q) ||
      r.receiptNumber.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: receipts.length,
    totalAmount: receipts.reduce((s, r) => s + r.amount, 0),
    issued: receipts.filter((r) => r.status === "Issued").length,
    sent: receipts.filter((r) => r.status === "Sent").length,
    viewed: receipts.filter((r) => r.status === "Viewed").length,
  };

  function handleSend(id: string) {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Sent" } : r))
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />
      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        {/* Header */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07185f]">Receipts</h1>
            
          </div>
          <button
            onClick={fetchReceipts}
            disabled={loading}
            className="rounded-xl bg-[#4338ca] px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Receipts"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={fetchReceipts} className="ml-3 font-medium underline">
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-indigo-50 to-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <h3 className="mt-3 text-2xl font-bold text-[#07185f]">{stats.total}</h3>
                <p className="mt-2 text-xs font-medium text-[#4338ca]">
                  ₹{stats.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="rounded-lg bg-[#4338ca]/10 p-3">
                <ReceiptIcon className="h-6 w-6 text-[#4338ca]" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-green-50 to-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issued</p>
                <h3 className="mt-3 text-2xl font-bold text-green-600">{stats.issued}</h3>
                <p className="mt-2 text-xs font-medium text-green-600">Generated</p>
              </div>
              <div className="rounded-lg bg-green-100 p-3 text-green-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <h3 className="mt-3 text-2xl font-bold text-blue-600">{stats.sent}</h3>
                <p className="mt-2 text-xs font-medium text-blue-600">To users</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <Mail className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-purple-50 to-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Viewed</p>
                <h3 className="mt-3 text-2xl font-bold text-purple-600">{stats.viewed}</h3>
                <p className="mt-2 text-xs font-medium text-purple-600">By users</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                <Eye className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="mt-8">
          <div className="rounded-2xl border border-[#dfe4f0] bg-white">
            {/* Search + Filter bar */}
            <div className="flex flex-col gap-4 border-b border-[#dfe4f0] p-6 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xl">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by user name or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-[#dfe4f0] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4338ca]"
                />
              </div>
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex items-center gap-2 rounded-lg border border-[#dfe4f0] px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Filter size={17} />
                Filters
              </button>
            </div>

            {showFilterPanel && (
              <div className="border-b border-[#dfe4f0] bg-gray-50 p-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Receipt Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full rounded-lg border border-[#dfe4f0] px-3 py-2.5 text-sm outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Issued">Issued</option>
                  <option value="Sent">Sent</option>
                  <option value="Viewed">Viewed</option>
                  <option value="Pending">Pending</option>
                </select>
                <button
                  onClick={() => setFilterStatus("All")}
                  className="mt-3 text-sm font-medium text-[#4338ca] hover:text-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="border-b border-[#dfe4f0] px-8 py-5">
              <h2 className="text-lg font-bold text-[#07185f]">Receipt History</h2>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#4338ca] border-t-transparent" />
                <p className="ml-3 text-gray-500">Loading receipts...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filteredReceipts.length === 0 && (
              <div className="px-8 py-16 text-center">
                <p className="font-medium text-gray-500">No receipts found</p>
                <p className="mt-1 text-xs text-gray-400">
                  Database mein abhi koi receipt nahi hai
                </p>
              </div>
            )}

            {/* Table */}
            {!loading && filteredReceipts.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[#dfe4f0] bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Receipt #</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReceipts.map((r) => (
                      <tr key={r.id} className="border-b border-[#dfe4f0] hover:bg-gray-50">
                        <td className="px-8 py-4 font-mono text-sm font-medium text-[#07185f]">
                          {r.receiptNumber}
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-[#07185f]">
                          {r.userName}
                        </td>
                        <td className="px-8 py-4 text-sm font-semibold text-[#07185f]">
                          ₹{r.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-600">
                          {r.date ? new Date(r.date).toLocaleDateString("en-IN") : "N/A"}
                        </td>
                        <td className="px-8 py-4">
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                            {r.paymentMethod}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {r.status}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedReceipt(r)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => alert(`Download: ${r.receiptNumber}`)}
                              className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleSend(r.id)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                              title="Send"
                            >
                              <Mail size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredReceipts.length} of {receipts.length} receipts
        </p>
      </main>

      {/* Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#07185f]">Receipt Details</h2>
              <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Receipt Number</p>
                <p className="font-mono font-bold text-[#07185f]">{selectedReceipt.receiptNumber}</p>
              </div>
              <div><p className="text-xs text-gray-500">User</p><p className="font-medium">{selectedReceipt.userName}</p></div>
              <div><p className="text-xs text-gray-500">Amount</p><p className="text-lg font-bold text-[#4338ca]">₹{selectedReceipt.amount.toLocaleString("en-IN")}</p></div>
              <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{selectedReceipt.date ? new Date(selectedReceipt.date).toLocaleDateString("en-IN") : "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Method</p><p className="font-medium">{selectedReceipt.paymentMethod}</p></div>
              <div><p className="text-xs text-gray-500">Status</p>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{selectedReceipt.status}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="mt-6 w-full rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}