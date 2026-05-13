import { useEffect, useState } from "react";
import {
  
  Eye,
  Download,
  Trash2,
  BarChart3,
  FileText,
  Filter,
  Search,
} from "lucide-react";
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

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | ReportType>("All");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [newReportData, setNewReportData] = useState({
    title: "",
    type: "Payment" as ReportType,
    period: "",
  });

  useEffect(() => {
    let active = true;

    api
      .get<Report[]>("/reports")
      .then((response) => {
        if (!active) return;
        setReports(response.data);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        console.error("Reports fetch error:", err);
        setError("Reports load nahi ho pa rahe. Token ya backend check karo.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function refreshReports() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Report[]>("/reports");
      setReports(response.data);
    } catch (err) {
      console.error("Reports refresh error:", err);
      setError("Reports refresh nahi ho pa rahe.");
    } finally {
      setLoading(false);
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType = filterType === "All" || report.type === filterType;

    return matchesSearch && matchesType;
  });

  const stats = {
    totalReports: reports.length,
    generatedCount: reports.filter((r) => r.status === "Generated").length,
    pendingCount: reports.filter((r) => r.status === "Pending").length,
    totalRecords: reports.reduce((sum, r) => sum + r.recordCount, 0),
  };

  const handleGenerateReport = () => {
    if (!newReportData.title || !newReportData.period) return;

    const newReport: Report = {
      id: `RPT${(reports.length + 1).toString().padStart(3, "0")}`,
      title: newReportData.title,
      type: newReportData.type,
      generatedDate: new Date().toISOString(),
      generatedBy: "Admin",
      period: newReportData.period,
      status: "Generated",
      recordCount: 0,
      fileSize: "0 MB",
    };

    setReports((prev) => [newReport, ...prev]);
    setNewReportData({ title: "", type: "Payment", period: "" });
    setIsModalOpen(false);
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDownloadReport = (id: string) => {
    alert(`Downloading report ${id}...`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07185f]">Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generate and manage all system reports
            </p>
          </div>

          <button
            onClick={refreshReports}
            className="flex items-center gap-2 rounded-xl bg-[#4338ca] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700"
          >
            Refresh Reports
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-indigo-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Total Reports</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#07185f]">
                {stats.totalReports}
              </h3>
              <BarChart3 className="h-6 w-6 text-[#4338ca]" />
            </div>
            <p className="mt-2 text-xs font-medium text-[#4338ca]">All time</p>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-green-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Generated</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-green-600">
                {stats.generatedCount}
              </h3>
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <p className="mt-2 text-xs font-medium text-green-600">
              Ready to download
            </p>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-yellow-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-yellow-600">
                {stats.pendingCount}
              </h3>
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="mt-2 text-xs font-medium text-yellow-600">
              In processing
            </p>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-gradient-to-br from-purple-50 to-white p-6">
            <p className="text-sm font-medium text-gray-600">Total Records</p>
            <div className="mt-3 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-purple-600">
                {stats.totalRecords}
              </h3>
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <p className="mt-2 text-xs font-medium text-purple-600">
              Across all reports
            </p>
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
                  placeholder="Search by report title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-[#dfe4f0] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                onClick={() => setShowFilterPanel((prev) => !prev)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#dfe4f0] px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Filter size={17} />
                Filters
              </button>
            </div>

            {showFilterPanel && (
              <div className="border-b border-[#dfe4f0] bg-gray-50 p-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Report Type
                </label>

                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as "All" | ReportType)
                  }
                  className="w-full rounded-lg border border-[#dfe4f0] px-3 py-2.5 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="All">All Types</option>
                  <option value="Payment">Payment Reports</option>
                  <option value="Collection">Collection Reports</option>
                  <option value="user">User Reports</option>
                  <option value="Financial">Financial Reports</option>
                </select>
              </div>
            )}

            <div className="border-b border-[#dfe4f0] px-8 py-5">
              <h2 className="text-lg font-bold text-[#07185f]">
                Report History
              </h2>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-8 py-12 text-center text-gray-500">
                  Loading reports...
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="px-8 py-12 text-center text-gray-500">
                  No reports found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="border-b border-[#dfe4f0] bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Report Title
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Type
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Period
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">
                        Generated
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
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b border-[#dfe4f0] transition hover:bg-gray-50"
                      >
                        <td className="px-8 py-4 text-sm font-medium text-[#07185f]">
                          {report.title}
                        </td>

                        <td className="px-8 py-4 text-sm">{report.type}</td>

                        <td className="px-8 py-4 text-sm text-gray-600">
                          {report.period}
                        </td>

                        <td className="px-8 py-4 text-sm text-gray-600">
                          {new Date(report.generatedDate).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-8 py-4 text-sm">{report.status}</td>

                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedReport(report)}
                              className="rounded-lg bg-blue-50 p-2 text-blue-600"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => handleDownloadReport(report.id)}
                              className="rounded-lg bg-green-50 p-2 text-green-600"
                            >
                              <Download size={16} />
                            </button>

                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="rounded-lg bg-red-50 p-2 text-red-600"
                            >
                              <Trash2 size={16} />
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
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-2xl bg-white p-8">
            <h2 className="text-xl font-bold text-[#07185f]">
              Generate New Report
            </h2>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                value={newReportData.title}
                onChange={(e) =>
                  setNewReportData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Report title"
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
              />

              <select
                value={newReportData.type}
                onChange={(e) =>
                  setNewReportData((prev) => ({
                    ...prev,
                    type: e.target.value as ReportType,
                  }))
                }
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
              >
                <option value="Payment">Payment Report</option>
                <option value="Collection">Collection Report</option>
                <option value="user">User Report</option>
                <option value="Financial">Financial Report</option>
              </select>

              <input
                type="text"
                value={newReportData.period}
                onChange={(e) =>
                  setNewReportData((prev) => ({
                    ...prev,
                    period: e.target.value,
                  }))
                }
                placeholder="May 2026"
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleGenerateReport}
                className="flex-1 rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm text-white"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold text-[#07185f]">
              Report Details
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                <b>Title:</b> {selectedReport.title}
              </p>
              <p>
                <b>Type:</b> {selectedReport.type}
              </p>
              <p>
                <b>Period:</b> {selectedReport.period}
              </p>
              <p>
                <b>Status:</b> {selectedReport.status}
              </p>
              <p>
                <b>Records:</b> {selectedReport.recordCount}
              </p>
            </div>

            <button
              onClick={() => setSelectedReport(null)}
              className="mt-6 w-full rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}