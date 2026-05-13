import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, WalletCards, CreditCard,
  Receipt, BarChart3, Bell, Settings, LogOut,
} from "lucide-react";
import { clearAdminAuth } from "../utils/auth";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Monthly Payments", icon: WalletCards, path: "/admin/monthly-payments" },
  { name: "Payments", icon: CreditCard, path: "/admin/payments" },
  { name: "Receipts", icon: Receipt, path: "/admin/receipts" },
  { name: "Reports", icon: BarChart3, path: "/admin/reports" },
  { name: "Notices", icon: Bell, path: "/admin/notices" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAdminAuth();
    void navigate("/admin/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#081c73] text-white">
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold">digitvilla</h1>
        <p className="text-xs text-white/70">
          Digital Future, Infinite Possibilities
        </p>
      </div>

      <nav className="mt-6 flex flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#4338ca] text-white"
                    : "text-white/80 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition mt-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}