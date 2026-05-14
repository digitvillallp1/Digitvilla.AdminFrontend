import { useEffect, useState } from "react";
import { Bell, Search, Eye, Trash2, RefreshCw, Plus, X } from "lucide-react";
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

function normalizeNotice(n: any): Notice {
  return {
    id: String(n.id || n.Id || ""),
    title: n.title || n.Title || "",
    message: n.message || n.Message || "",
    type: n.type || n.Type || "General",
    createdAt: n.createdAt || n.CreatedAt || new Date().toISOString(),
    status: n.status || n.Status || "Active",
  };
}

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/notices");
      const raw = Array.isArray(response.data) ? response.data : [];
      setNotices(raw.map(normalizeNotice));
    } catch (err: any) {
      console.error("Notices fetch error:", err);
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("Access denied. Admin token check karo.");
      } else {
        setError("Notices load nahi ho pa rahe. Backend check karo.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ✅ FIXED: Real API delete call
  async function handleDeleteNotice(id: string) {
    if (!window.confirm("Kya aap is notice ko permanently delete karna chahte hain?")) return;
    try {
      await api.delete(`/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      const msg = err?.response?.data?.message || "Notice delete nahi ho pa raya.";
      setError(msg);
    }
  }

  // ✅ NEW: Create notice API call
  async function handleCreateNotice() {
    if (!newTitle.trim() || !newMessage.trim()) {
      setCreateError("Title aur Message dono required hain.");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const response = await api.post("/notices", {
        title: newTitle.trim(),
        message: newMessage.trim(),
      });
      const created = normalizeNotice(response.data);
      setNotices((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setNewTitle("");
      setNewMessage("");
    } catch (err: any) {
      console.error("Create error:", err);
      const msg = err?.response?.data?.message || "Notice create nahi ho pa raya.";
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  }

  // ✅ NEW: Toggle status API call
  async function handleToggleStatus(id: string) {
    try {
      const response = await api.patch(`/notices/${id}/status`);
      const updated = normalizeNotice(response.data);
      setNotices((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (err: any) {
      console.error("Toggle status error:", err);
      setError("Status update nahi ho pa raya.");
    }
  }

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />
      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        {/* Header */}
        <div className="mt-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07185f]">Notices</h1>
            
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowCreateModal(true);
                setCreateError("");
              }}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Plus size={18} />
              New Notice
            </button>
            <button
              onClick={fetchNotices}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#4338ca] px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
            <button onClick={() => setError("")} className="ml-3 underline">Dismiss</button>
          </div>
        )}

        {/* Stats */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#dfe4f0] bg-indigo-50 p-6">
            <p className="text-sm text-gray-600">Total Notices</p>
            <h3 className="mt-3 text-2xl font-bold text-[#07185f]">{notices.length}</h3>
          </div>
          <div className="rounded-2xl border border-[#dfe4f0] bg-green-50 p-6">
            <p className="text-sm text-gray-600">Active</p>
            <h3 className="mt-3 text-2xl font-bold text-green-600">
              {notices.filter((n) => n.status === "Active").length}
            </h3>
          </div>
          <div className="rounded-2xl border border-[#dfe4f0] bg-gray-50 p-6">
            <p className="text-sm text-gray-600">Inactive</p>
            <h3 className="mt-3 text-2xl font-bold text-gray-600">
              {notices.filter((n) => n.status === "Inactive").length}
            </h3>
          </div>
        </section>

        {/* Table */}
        <section className="mt-8 rounded-2xl border border-[#dfe4f0] bg-white">
          <div className="border-b border-[#dfe4f0] p-6">
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-[#dfe4f0] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#4338ca]"
              />
            </div>
          </div>

          <div className="border-b border-[#dfe4f0] px-8 py-5">
            <h2 className="text-lg font-bold text-[#07185f]">Notice History</h2>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#4338ca] border-t-transparent" />
              <p className="ml-3 text-gray-500">Loading notices...</p>
            </div>
          )}

          {!loading && filteredNotices.length === 0 && (
            <div className="px-8 py-16 text-center">
              <Bell size={32} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-500">No notices found</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-3 text-sm font-medium text-[#4338ca] underline"
              >
                Create first notice
              </button>
            </div>
          )}

          {!loading && filteredNotices.length > 0 && (
            <table className="w-full">
              <thead className="border-b border-[#dfe4f0] bg-gray-50">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.map((notice) => (
                  <tr key={notice.id} className="border-b border-[#dfe4f0] hover:bg-gray-50">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-[#4338ca]" />
                        <div>
                          <p className="text-sm font-semibold text-[#07185f]">{notice.title}</p>
                          <p className="max-w-xs truncate text-xs text-gray-500">{notice.message}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm text-gray-600">{notice.type}</td>
                    <td className="px-8 py-4 text-sm text-gray-600">
                      {new Date(notice.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-8 py-4">
                      <button
                        onClick={() => handleToggleStatus(notice.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          notice.status === "Active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {notice.status}
                      </button>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedNotice(notice)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete"
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

      {/* View Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-96 rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#07185f]">Notice Details</h2>
              <button onClick={() => setSelectedNotice(null)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Title</p>
                <p className="font-semibold text-[#07185f]">{selectedNotice.title}</p>
              </div>
              <div><p className="text-xs text-gray-500">Message</p>
                <p className="mt-1 text-gray-700">{selectedNotice.message}</p></div>
              <div><p className="text-xs text-gray-500">Type</p><p>{selectedNotice.type}</p></div>
              <div><p className="text-xs text-gray-500">Status</p>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedNotice.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}>{selectedNotice.status}</span>
              </div>
              <div><p className="text-xs text-gray-500">Date</p>
                <p>{new Date(selectedNotice.createdAt).toLocaleDateString("en-IN")}</p></div>
            </div>
            <button
              onClick={() => setSelectedNotice(null)}
              className="mt-6 w-full rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm text-white hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[480px] rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#07185f]">Create New Notice</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {createError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {createError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Notice ka title likhein..."
                  className="w-full rounded-lg border border-[#dfe4f0] px-3 py-2.5 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Notice ka message likhein..."
                  rows={4}
                  className="w-full rounded-lg border border-[#dfe4f0] px-3 py-2.5 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-lg border border-[#dfe4f0] px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNotice}
                disabled={creating}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Notice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}