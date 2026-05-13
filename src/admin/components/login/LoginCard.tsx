import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginCard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("digitvilla_token");

    if (!token) {
      alert("Pehle user dashboard me login karo.");
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <div className="rounded-2xl border border-[#dfe4f0] bg-white p-6 shadow-xl">
      <h2 className="mb-5 text-center text-xl font-bold text-[#07185f]">
        Admin Login
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="h-11 w-full rounded-lg border border-[#dfe4f0] px-4 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="h-11 w-full rounded-lg border border-[#dfe4f0] px-4 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="h-11 w-full rounded-lg bg-[#081c73] font-semibold text-white"
        >
          Enter Admin Panel
        </button>
      </form>
    </div>
  );
}