import { useState } from "react";
import { Save, Settings2, Mail, Phone, Globe, CreditCard, AlertTriangle, Info } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: "Digitvilla",
    supportEmail: "support@digitvilla.com",
    supportPhone: "+91-9999999999",
    timezone: "IST",
    defaultCurrency: "INR",
    maintenanceMode: false,
    paymentGateway: "Razorpay",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  // NOTE: Backend /api/settings endpoint nahi hai abhi
  // Jab backend ready ho tab: PUT /api/settings call karna hai
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />
      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        <div className="mb-6 mt-6">
          <h1 className="text-2xl font-bold text-[#07185f]">System Settings</h1>
        </div>

        {/* Backend Note */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            Settings abhi <strong>local only</strong> hain — backend mein{" "}
            <code className="rounded bg-blue-100 px-1">GET /api/settings</code> aur{" "}
            <code className="rounded bg-blue-100 px-1">PUT /api/settings</code> endpoints
            banana padega tab real save hoga.
          </p>
        </div>

        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            ✅ Settings saved (local only — backend endpoint pending)
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* General */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2">
                <Settings2 size={18} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">General</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">App Name</label>
                <input
                  type="text"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>IST</option>
                    <option>UTC</option>
                    <option>EST</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    name="defaultCurrency"
                    value={settings.defaultCurrency}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <div className="rounded-lg bg-green-50 p-2">
                <Mail size={18} className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">Contact</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Support Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Support Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    name="supportPhone"
                    value={settings.supportPhone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <div className="rounded-lg bg-purple-50 p-2">
                <CreditCard size={18} className="text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">Payment Gateway</h2>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Gateway</label>
              <select
                name="paymentGateway"
                value={settings.paymentGateway}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
              >
                <option>Razorpay</option>
              </select>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <Globe size={12} /> Backend se manage hota hai — yahan change nahi hoga
              </p>
            </div>
          </div>

          {/* Maintenance */}
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <div className="rounded-lg bg-orange-100 p-2">
                <AlertTriangle size={18} className="text-orange-500" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">Maintenance</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Maintenance Mode</p>
                <p className="mt-0.5 text-xs text-gray-500">Users will see a maintenance page</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-[#07185f] px-8 py-3 font-medium text-white hover:bg-[#0a2272]"
          >
            <Save size={18} />
            Save Settings
          </button>
          <p className="mt-2 text-xs text-gray-400">
            ⚠️ Backend API ready hone ke baad real save hoga
          </p>
        </div>
      </main>
    </div>
  );
}