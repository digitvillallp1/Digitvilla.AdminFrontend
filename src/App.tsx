import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";

import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminMonthlyPayments from "./admin/pages/AdminMonthlyPayments";
import AdminPayments from "./admin/pages/AdminPayments";
import AdminReports from "./admin/pages/AdminReports";
import AdminReceipts from "./admin/pages/AdminReceipts";
import AdminNotices from "./admin/pages/AdminNotices";
import AdminSettings from "./admin/pages/AdminSettings";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/monthly-payments"
            element={
              <AdminProtectedRoute>
                <AdminMonthlyPayments />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/fee-collections"
            element={<Navigate to="/admin/monthly-payments" replace />}
          />

          <Route
            path="/admin/payments"
            element={
              <AdminProtectedRoute>
                <AdminPayments />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/receipts"
            element={
              <AdminProtectedRoute>
                <AdminReceipts />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <AdminProtectedRoute>
                <AdminReports />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/notices"
            element={
              <AdminProtectedRoute>
                <AdminNotices />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute>
                <AdminSettings />
              </AdminProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;