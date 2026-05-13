import { useEffect, useState } from "react";
import { Bell, Search, Eye, Trash2, RefreshCw } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import api from "../../services/api";

interface Notice {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  status: string;
}

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Notice[]>("/notices");
      setNotices(response.data);
    } catch (err) {
      console.error("Notices fetch error:", err);
      setError("Notices load nahi ho pa rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07185f]">Notices</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage system notices and announcements
            </p>
          </div>

          <button
            onClick={fetchNotices}
            className="flex items-center gap-2 rounded-xl bg-[#4338ca] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
          >
            <RefreshCw size={18} />
            Refresh Notices
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#dfe4f0] bg-indigo-50 p-6">
            <p className="text-sm text-gray-600">Total Notices</p>
            <h3 className="mt-3 text-2xl font-bold text-[#07185f]">
              {notices.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-green-50 p-6">
            <p className="text-sm text-gray-600">Active</p>
            <h3 className="mt-3 text-2xl font-bold text-green-600">
              {notices.filter((n) => n.status === "Active").length}
            </h3>
          </div>

          <div className="rounded-2xl border border-[#dfe4f0] bg-purple-50 p-6">
            <p className="text-sm text-gray-600">General</p>
            <h3 className="mt-3 text-2xl font-bold text-purple-600">
              {notices.filter((n) => n.type === "General").length}
            </h3>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#dfe4f0] bg-white">
          <div className="border-b border-[#dfe4f0] p-6">
            <div className="relative max-w-xl">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-[#dfe4f0] py-2.5 pl-10 pr-4 text-sm outline-none"
              />
            </div>
          </div>

          <div className="border-b border-[#dfe4f0] px-8 py-5">
            <h2 className="text-lg font-bold text-[#07185f]">Notice History</h2>
          </div>

          {loading ? (
            <div className="px-8 py-12 text-center text-gray-500">
              Loading notices...
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="px-8 py-12 text-center text-gray-500">
              No notices found
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-[#dfe4f0] bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold">
                    Type
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredNotices.map((notice) => (
                  <tr
                    key={notice.id}
                    className="border-b border-[#dfe4f0] hover:bg-gray-50"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-[#4338ca]" />
                        <div>
                          <p className="text-sm font-semibold text-[#07185f]">
                            {notice.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notice.message}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-4 text-sm">{notice.type}</td>

                    <td className="px-8 py-4 text-sm text-gray-600">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-8 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {notice.status}
                      </span>
                    </td>

                    <td className="px-8 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedNotice(notice)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
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
        </section>
      </main>

      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold text-[#07185f]">
              Notice Details
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                <b>Title:</b> {selectedNotice.title}
              </p>
              <p>
                <b>Message:</b> {selectedNotice.message}
              </p>
              <p>
                <b>Type:</b> {selectedNotice.type}
              </p>
              <p>
                <b>Status:</b> {selectedNotice.status}
              </p>
              <p>
                <b>Date:</b>{" "}
                {new Date(selectedNotice.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            <button
              onClick={() => setSelectedNotice(null)}
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