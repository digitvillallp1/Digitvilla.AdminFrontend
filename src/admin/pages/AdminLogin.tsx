import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Lock, Mail } from "lucide-react";
import adminApi from "../../services/api";
import { setAdminAuth } from "../utils/auth";

type LoginResponse = {
  token: string;
  expiresAt: string;
  user: {
    id: string;
    fullName?: string;
    email: string;
    roleName?: string;
  };
};

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
          title?: string;
        };
      };
    };

    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.title ||
      "Invalid admin email or password"
    );
  }

  return "Invalid admin email or password";
}

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@digitvilla.com");
  const [password, setPassword] = useState("Mayank62010@");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await adminApi.post<LoginResponse>("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const data = response.data;

      if (!data.token) {
        setError("Login failed: token not received from backend");
        return;
      }

      const roleName = data.user?.roleName || "";

      if (roleName.toLowerCase() !== "admin") {
        setError("Access denied. This account is not an admin.");
        return;
      }

      setAdminAuth(data.token, {
        id: data.user.id,
        email: data.user.email,
        role: roleName,
        name: data.user.fullName || data.user.email,
        expiresAt: data.expiresAt,
      });

      navigate("/admin/dashboard");
    } catch (err: unknown) {
      console.error("Admin login error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-2 text-3xl font-bold text-[#07185f]">
          Admin Login
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          Login to admin dashboard
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>

          <div className="flex items-center rounded-xl border border-gray-200 px-3 focus-within:border-[#07185f]">
            <Mail size={18} className="text-gray-400" />

            <input
              className="w-full p-3 outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@digitvilla.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>

          <div className="flex items-center rounded-xl border border-gray-200 px-3 focus-within:border-[#07185f]">
            <Lock size={18} className="text-gray-400" />

            <input
              className="w-full p-3 outline-none"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500 hover:text-[#07185f]"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#07185f] py-3 font-semibold text-white transition hover:bg-[#0a227f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}