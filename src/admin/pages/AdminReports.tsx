import { useEffect, useState } from "react";
import { Eye, Download, Trash2, BarChart3, FileText, Search } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import api from "../../services/api";

type ReportType = "Payment" | "Collection" | "user" | "Financial";
type ReportStatus = "Generated" | "Pending" | "Failed";

interface Report {
  id: string;
  title: string;
  type: ReportType;
  generatedDate: string;
  generatedBy: string;
  period: string;
  status: ReportStatus;
  recordCount: number;
  fileSize: string;
}

function normalizeReport(r: any): Report {
  return {
    id: String(r.id || r.Id || ""),
    title: r.title || r.Title || "Untitled Report",
    type: r.type || r.Type || "Payment",
    generatedDate: r.generatedDate || r.GeneratedDate || new Date().toISOString(),
    generatedBy: r.generatedBy || r.GeneratedBy || "Admin",
    period: r.period || r.Period || "",
    status: r.status || r.Status || "Generated",
    recordCount: Number(r.recordCount || r.RecordCount || 0),
    fileSize: r.fileSize || r.FileSize || "N/A",
  };
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/reports");
      const raw = Array.isArray(response.data) ? response.data : [];
      setReports(raw.map(normalizeReport));
    } catch (err: any) {
      console.error("Reports fetch error:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("Access denied. Admin token check karo.");
      } else {
        setError("Reports load nahi ho pa rahe. Backend check karo.");
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: reports.length,
    generated: reports.filter((r) => r.status === "Generated").length,
    pending: reports.filter((r) => r.status === "Pending").length,
    totalRecords: reports.reduce((s, r) => s + r.recordCount, 0),
  };

  // NOTE: Delete sirf UI se hata raha hai — backend DELETE endpoint nahi hai
  function handleDeleteReport(id: string) {
    if (!window.confirm("Is report ko UI se hatana chahte ho?")) return;
    setReports((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />
      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07185f]">Reports</h1>
          </div>
          <button
            onClick={fetchReports}
            disabled={loading}
            className="rounded-xl bg-[#4338ca] px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh Reports"}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={fetchReports} className="ml-3 underline">Retry</button>
          </div>
        )}

        {/* Stats */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-indigo-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Total Reports</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#07185f]">{stats.total}</h3>
              <BarChart3 className="h-6 w-6 text-[#4338ca]" />
            </div>
          </div>
          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-green-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Generated</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-green-600">{stats.generated}</h3>
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-yellow-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-yellow-600">{stats.pending}</h3>
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-purple-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Total Records</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-purple-600">{stats.totalRecords}</h3>
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="mt-8">
          <div className="rounded-2xl border border-[#dfe4f0] bg-white">
            <div className="border-b border-[#dfe4f0] p-6">
              <div className="relative max-w-xl">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by report title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-[#dfe4f0] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4338ca]"
                />
              </div>
            </div>

            <div className="border-b border-[#dfe4f0] px-8 py-5">
              <h2 className="text-lg font-bold text-[#07185f]">Report History</h2>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#4338ca] border-t-transparent" />
                <p className="ml-3 text-gray-500">Loading reports...</p>
              </div>
            )}

            {!loading && filteredReports.length === 0 && (
              <div className="px-8 py-16 text-center">
                <p className="font-medium text-gray-500">No reports found</p>
              </div>
            )}

            {!loading && filteredReports.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-[#dfe4f0] bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Period</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Records</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((r) => (
                      <tr key={r.id} className="border-b border-[#dfe4f0] hover:bg-gray-50">
                        <td className="px-8 py-4 text-sm font-medium text-[#07185f]">{r.title}</td>
                        <td className="px-8 py-4 text-sm text-gray-600">{r.type}</td>
                        <td className="px-8 py-4 text-sm text-gray-600">{r.period}</td>
                        <td className="px-8 py-4 text-sm text-gray-600">{r.recordCount}</td>
                        <td className="px-8 py-4">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {r.status}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedReport(r)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => alert(`Download: ${r.title}`)}
                              className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteReport(r.id)}
                              className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                              title="Remove from list"
                            >
                              <Trash2 size={16} />
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
          Showing {filteredReports.length} of {reports.length} reports
        </p>
      </main>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold text-[#07185f]">Report Details</h2>
            <div className="mt-4 space-y-2 text-sm">
              <p><b>Title:</b> {selectedReport.title}</p>
              <p><b>Type:</b> {selectedReport.type}</p>
              <p><b>Period:</b> {selectedReport.period}</p>
              <p><b>Status:</b> {selectedReport.status}</p>
              <p><b>Records:</b> {selectedReport.recordCount}</p>
              <p><b>File Size:</b> {selectedReport.fileSize}</p>
            </div>
            <button
              onClick={() => setSelectedReport(null)}
              className="mt-6 w-full rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}