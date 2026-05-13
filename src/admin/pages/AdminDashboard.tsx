import { useEffect, useState } from "react";
import { Users, Clock, CreditCard, Receipt } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminSummaryCard from "../components/AdminSummaryCard";
import CollectionsOverview from "../components/CollectionsOverview";
import RecentPayments from "../components/RecentPayments";
import AdminBottomCard from "../components/AdminBottomCard";
import adminApi from "../../services/api";

// ✅ Types define kiye - no more 'any' errors
type Payment = {
  id: string;
  status: string;
  totalAmount?: number;
  amount?: number;
};

type MonthlyPayment = {
  id: string;
  status?: string;
  isPaid?: boolean;
  amount?: number;
};

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [usersRes, paymentsRes, monthlyRes] = await Promise.allSettled([
          adminApi.get("/users"),
          adminApi.get("/payments"),
          adminApi.get("/monthly-payments"),
        ]);

        // Users count
        if (usersRes.status === "fulfilled") {
          setTotalUsers((usersRes.value.data as unknown[]).length);
        }

        // Payments stats
        if (paymentsRes.status === "fulfilled") {
          const payments = paymentsRes.value.data as Payment[];
          const paid = payments.filter(
  (p) => String(p.status ?? "").toLowerCase() === "paid"
          );
          const paidSum = paid.reduce(
            (sum, p) => sum + (p.totalAmount ?? p.amount ?? 0),
            0
          );
          setPaidCount(paid.length);
          setTotalPaid(paidSum);
        }

        // Monthly pending count
        if (monthlyRes.status === "fulfilled") {
          const monthly = monthlyRes.value.data as MonthlyPayment[];
          const pending = monthly.filter(
(m) => String(m.status ?? "").toLowerCase() === "pending" || m.isPaid === false
          );
          setPendingCount(pending.length);
          const pendingSum = pending.reduce(
            (sum, m) => sum + (m.amount ?? 0),
            0
          );
          setTotalPending(pendingSum);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  const totalCollections = totalPaid + totalPending;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <p className="text-blue-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />
      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        {/* Top Summary Cards */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AdminSummaryCard
            title="Total Users"
            value={totalUsers.toString()}
            percentage="+12%"
          />
          <AdminSummaryCard
            title="Total Collections"
            value={`₹ ${totalCollections.toLocaleString("en-IN")}`}
            percentage="+18%"
          />
          <AdminSummaryCard
            title="Paid Amount"
            value={`₹ ${totalPaid.toLocaleString("en-IN")}`}
            percentage="+15%"
          />
          <AdminSummaryCard
            title="Pending Amount"
            value={`₹ ${totalPending.toLocaleString("en-IN")}`}
            percentage={pendingCount > 0 ? "-5%" : "0%"}
            isPositive={pendingCount === 0}
          />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CollectionsOverview />
          </div>
          <RecentPayments />
        </section>

        {/* Bottom Cards */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AdminBottomCard
            title="Users"
            value={totalUsers.toString()}
            linkText="View all users"
            icon={Users}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <AdminBottomCard
            title="Pending Payments"
            value={pendingCount.toString()}
            linkText="View pending"
            icon={Clock}
            iconBg="bg-orange-100"
            iconColor="text-orange-500"
          />
          <AdminBottomCard
            title="Payments"
            value={paidCount.toString()}
            linkText="View payments"
            icon={CreditCard}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <AdminBottomCard
            title="Paid Amount"
            value={`₹${totalPaid.toLocaleString("en-IN")}`}
            linkText="View details"
            icon={Receipt}
            iconBg="bg-red-100"
            iconColor="text-red-500"
          />
        </section>
      </main>
    </div>
  );
}