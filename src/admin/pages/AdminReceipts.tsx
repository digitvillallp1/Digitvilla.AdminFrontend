import { useEffect, useState } from "react";
import {
  Eye,
  Download,
  Receipt as ReceiptIcon,
  FileText,
  Filter,
  Search,
  Mail,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import api from "../../services/api";

interface BackendReceipt {
  id: string;
  transactionId: string;
  amount: number;
  paidDate: string;
  paymentMethod: string;
}

interface Receipt {
  id: string;
  receiptNumber: string;
  userName: string;
  amount: number;
  date: string;
  issuedDate: string;
  paymentMethod: string;
  status: "Issued" | "Sent" | "Viewed" | "Pending";
  userEmail: string;
}

export default function AdminReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Issued" | "Sent" | "Viewed" | "Pending"
  >("All");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  async function fetchReceipts() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<BackendReceipt[]>("/receipts");

      const mappedReceipts: Receipt[] = response.data.map((r, index) => ({
        id: r.id,
        receiptNumber:
          r.transactionId && r.transactionId.trim() !== ""
            ? r.transactionId
            : `RCP-2026-${(index + 1).toString().padStart(5, "0")}`,
        userName: "User",
        amount: Number(r.amount || 0),
        date: r.paidDate,
        issuedDate: r.paidDate,
        paymentMethod: r.paymentMethod || "Razorpay",
        status: "Issued",
        userEmail: "N/A",
      }));

      setReceipts(mappedReceipts);
    } catch (err) {
      console.error("Receipts fetch error:", err);
      setError("Receipts load nahi ho pa rahe. Token ya backend check karo.");
    } finally {
      setLoading(false);
    }
  }

  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || receipt.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalReceipts: receipts.length,
    issuedCount: receipts.filter((r) => r.status === "Issued").length,
    sentCount: receipts.filter((r) => r.status === "Sent").length,
    viewedCount: receipts.filter((r) => r.status === "Viewed").length,
    totalAmount: receipts.reduce((sum, r) => sum + r.amount, 0),
  };

  const handleDownloadReceipt = (id: string) => {
    alert(`Downloading receipt ${id}...`);
  };

  const handleSendReceipt = (id: string) => {
    setReceipts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Sent" } : r))
    );
    alert("Receipt sent status updated.");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07185f]">Receipts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate and manage payment receipts
            </p>
          </div>

          <button
            onClick={fetchReceipts}
            className="rounded-xl bg-[#4338ca] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
          >
            Refresh Receipts
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-indigo-50 to-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Receipts
                </p>
                <h3 className="mt-3 text-2xl font-bold text-[#07185f]">
                  {stats.totalReceipts}
                </h3>
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
                <h3 className="mt-3 text-2xl font-bold text-green-600">
                  {stats.issuedCount}
                </h3>
                <p className="mt-2 text-xs font-medium text-green-600">
                  Generated
                </p>
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
                <h3 className="mt-3 text-2xl font-bold text-blue-600">
                  {stats.sentCount}
                </h3>
                <p className="mt-2 text-xs font-medium text-blue-600">
                  To users
                </p>
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
                <h3 className="mt-3 text-2xl font-bold text-purple-600">
                  {stats.viewedCount}
                </h3>
                <p className="mt-2 text-xs font-medium text-purple-600">
                  By users
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                <Eye className="h-6 w-6" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-2xl border border-[#dfe4f0] bg-white">
            <div className="flex flex-col gap-4 border-b border-[#dfe4f0] p-6 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xl md:flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by user name or receipt number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-[#dfe4f0] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#dfe4f0] px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as
                        | "All"
                        | "Issued"
                        | "Sent"
                        | "Viewed"
                        | "Pending"
                    )
                  }
                  className="w-full rounded-lg border border-[#dfe4f0] px-3 py-2.5 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="All">All Status</option>
                  <option value="Issued">Issued</option>
                  <option value="Sent">Sent</option>
                  <option value="Viewed">Viewed</option>
                  <option value="Pending">Pending</option>
                </select>

                <button
                  onClick={() => setFilterStatus("All")}
                  className="mt-4 text-sm font-medium text-[#4338ca] hover:text-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            <div className="border-b border-[#dfe4f0] px-8 py-5">
              <h2 className="text-lg font-bold text-[#07185f]">
                Receipt History
              </h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-8 py-12 text-center">
                  <p className="text-gray-500">Loading receipts...</p>
                </div>
              ) : filteredReceipts.length === 0 ? (
                <div className="px-8 py-12 text-center">
                  <p className="text-gray-500">No receipts found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-[#dfe4f0] bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Receipt #
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        User Name
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Method
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReceipts.map((receipt) => (
                      <tr
                        key={receipt.id}
                        className="border-b border-[#dfe4f0] transition hover:bg-gray-50"
                      >
                        <td className="px-8 py-4 font-mono text-sm font-medium text-[#07185f]">
                          {receipt.receiptNumber}
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-[#07185f]">
                          {receipt.userName}
                        </td>
                        <td className="px-8 py-4 text-sm font-semibold text-[#07185f]">
                          ₹{receipt.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-600">
                          {new Date(receipt.date).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-8 py-4">
                          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                            {receipt.paymentMethod}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {receipt.status}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedReceipt(receipt)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => handleDownloadReceipt(receipt.id)}
                              className="rounded-lg bg-green-50 p-2 text-green-600 transition hover:bg-green-100"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>

                            <button
                              onClick={() => handleSendReceipt(receipt.id)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                              title="Send Email"
                            >
                              <Mail size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6 text-sm text-gray-500">
          Showing {filteredReceipts.length} of {receipts.length} receipts
        </div>
      </main>

      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-96 w-96 overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#07185f]">
                Receipt Details
              </h2>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-600">Receipt Number</p>
                <p className="font-mono font-bold text-[#07185f]">
                  {selectedReceipt.receiptNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">User Name</p>
                <p className="font-medium text-[#07185f]">
                  {selectedReceipt.userName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-lg font-bold text-[#4338ca]">
                  ₹{selectedReceipt.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Payment Date</p>
                <p className="font-medium text-[#07185f]">
                  {new Date(selectedReceipt.date).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-[#07185f]">
                  {selectedReceipt.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {selectedReceipt.status}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="w-full rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}