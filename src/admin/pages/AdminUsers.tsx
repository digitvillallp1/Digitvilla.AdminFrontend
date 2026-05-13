import { useEffect, useState, useCallback } from "react";
import {
  UserPlus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  ChevronDown,
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import adminApi from "../../services/api";

// ── Types ────────────────────────────────────────────────────────
type User = {
  id: string;
  fullName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
};

type UserFormData = {
  fullName: string;
  email: string;
  password: string;
  roleName: string;
  isActive: boolean;
};

type ModalMode = "add" | "edit" | null;
type ToastType = "success" | "error";
type Toast = { message: string; type: ToastType } | null;

const ROLES = ["Student", "Admin", "User"];

const emptyForm: UserFormData = {
  fullName: "",
  email: "",
  password: "",
  roleName: "Student",
  isActive: true,
};

// ── Main Component ───────────────────────────────────────────────
export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  // ── Toast ────────────────────────────────────────────────────
  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch ────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.get("/users");
      setUsers(res.data as User[]);
    } catch {
      setError("Users load nahi ho pa rahe. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  // ── Filter ───────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roleName.toLowerCase().includes(q);
    const matchRole = filterRole === "All" || u.roleName === filterRole;
    const matchStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" && u.isActive) ||
      (filterStatus === "Inactive" && !u.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  const uniqueRoles = [
    "All",
    ...Array.from(new Set(users.map((u) => u.roleName).filter(Boolean))),
  ];

  // ── Modal helpers ────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);
    setFormError("");
    setSelectedUser(null);
    setModal("add");
  };

  const openEdit = (user: User) => {
    setForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      roleName: user.roleName || "Student",
      isActive: user.isActive,
    });
    setFormError("");
    setSelectedUser(user);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
    setFormError("");
  };

  // ── Validation ───────────────────────────────────────────────
  const validateForm = (): boolean => {
    if (!form.fullName.trim()) {
      setFormError("Full name required hai.");
      return false;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("Valid email required hai.");
      return false;
    }
    if (modal === "add" && !form.password.trim()) {
      setFormError("Password required hai.");
      return false;
    }
    return true;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setFormError("");
    try {
      if (modal === "add") {
        await adminApi.post("/users", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          roleName: form.roleName,
        });
        showToast("User successfully add ho gaya!");
      } else if (modal === "edit" && selectedUser) {
        await adminApi.put(`/users/${selectedUser.id}`, {
          fullName: form.fullName,
          email: form.email,
          roleName: form.roleName,
          isActive: form.isActive,
        });
        showToast("User successfully update ho gaya!");
      }
      closeModal();
      void fetchUsers();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Kuch gadbad ho gayi. Dobara try karo.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (user: User) => {
    try {
      await adminApi.delete(`/users/${user.id}`);
      showToast("User delete ho gaya!");
      void fetchUsers();
    } catch {
      showToast("Delete nahi hua. Dobara try karo.", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ── Toggle Status ────────────────────────────────────────────
  const handleToggleStatus = async (user: User) => {
    try {
      await adminApi.patch(`/users/${user.id}/status`);
      showToast(`User ${user.isActive ? "deactivate" : "activate"} ho gaya!`);
      void fetchUsers();
    } catch {
      showToast("Status update nahi hua.", "error");
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-6 py-8 lg:px-10">
        <AdminHeader />

        {/* Toast */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Page Header */}
        <div className="mt-6 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#07185f]">Students</h1>
            <p className="text-sm text-gray-500">All registered users</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => void fetchUsers()}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-lg bg-[#07185f] px-4 py-2 text-sm font-medium text-white hover:bg-[#0a2272]"
            >
              <UserPlus size={16} />
              Add Student
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#07185f]/30"
            />
          </div>

          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#07185f]/30"
            >
              {uniqueRoles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#07185f]/30"
            >
              {["All", "Active", "Inactive"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#07185f] border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Desktop Table */}
        {!loading && !error && (
          <>
            <div className="hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Email
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Role
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Joined
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {user.fullName}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {user.roleName || "User"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            title="Edit"
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => void handleToggleStatus(user)}
                            title={user.isActive ? "Deactivate" : "Activate"}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                          >
                            {user.isActive ? (
                              <ToggleRight size={16} />
                            ) : (
                              <ToggleLeft size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user)}
                            title="Delete"
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-10 text-center text-gray-400">
                  {search || filterRole !== "All" || filterStatus !== "All"
                    ? "No users match your filters."
                    : "No users found."}
                </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {filtered.length === 0 && (
                <div className="rounded-xl border border-gray-100 p-8 text-center text-gray-400">
                  No users found.
                </div>
              )}
              {filtered.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {user.roleName || "User"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => void handleToggleStatus(user)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        {user.isActive ? (
                          <ToggleRight size={16} />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Add / Edit Modal ──────────────────────────────────── */}
        {modal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#07185f]">
                  {modal === "add" ? "Add New Student" : "Edit Student"}
                </h2>
                <button
                  onClick={closeModal}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#07185f]/30"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Enter email"
                    className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#07185f]/30"
                  />
                </div>

                {/* Password — add only */}
                {modal === "add" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#07185f]/30"
                    />
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      value={form.roleName}
                      onChange={(e) =>
                        setForm({ ...form, roleName: e.target.value })
                      }
                      className="w-full appearance-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#07185f]/30"
                    >
                      {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                {/* Active toggle — edit only */}
                {modal === "edit" && (
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5">
                    <span className="text-sm font-medium text-gray-700">
                      Active Status
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, isActive: !form.isActive })
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        form.isActive ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          form.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Form error */}
                {formError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {formError}
                  </p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleSubmit()}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-[#07185f] py-2.5 text-sm font-medium text-white hover:bg-[#0a2272] disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : modal === "add"
                    ? "Add Student"
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete Confirm Modal ─────────────────────────────── */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-2 text-lg font-bold text-[#07185f]">
                Delete User?
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                <span className="font-medium text-gray-700">
                  {deleteConfirm.fullName}
                </span>{" "}
                ko permanently delete karna chahte ho? Yeh action undo nahi
                hoga.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleDelete(deleteConfirm)}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white hover:bg-red-600"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}