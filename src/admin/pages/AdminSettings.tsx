import { useState } from "react";
import { Save, Settings2, Mail, Phone, Globe, CreditCard, AlertTriangle } from "lucide-react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings({
      ...settings,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen rounded-l-3xl border border-[#dfe4f0] bg-white px-10 py-8">
        <AdminHeader />

        <div className="mt-6 mb-6">
          <h1 className="text-2xl font-bold text-[#07185f]">System Settings</h1>
          <p className="text-sm text-gray-500">Manage your application settings</p>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm flex items-center gap-2">
            ✅ Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* General Settings */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-lg bg-blue-50 p-2">
                <Settings2 size={18} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">General</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={settings.timezone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>IST</option>
                    <option>UTC</option>
                    <option>EST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    name="defaultCurrency"
                    value={settings.defaultCurrency}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-lg bg-green-50 p-2">
                <Mail size={18} className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">Contact</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    name="supportEmail"
                    value={settings.supportEmail}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Phone
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    name="supportPhone"
                    value={settings.supportPhone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-lg bg-purple-50 p-2">
                <CreditCard size={18} className="text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">Payment Gateway</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gateway
              </label>
              <select
                name="paymentGateway"
                value={settings.paymentGateway}
                onChange={handleChange}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
              >
                <option>Razorpay</option>
              </select>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Globe size={12} /> Managed by backend — cannot be changed here
              </p>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="rounded-lg bg-orange-100 p-2">
                <AlertTriangle size={18} className="text-orange-500" />
              </div>
              <h2 className="text-lg font-semibold text-[#07185f]">Maintenance</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Maintenance Mode</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Users will see a maintenance page
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-[#07185f] text-white px-8 py-3 rounded-xl hover:bg-[#0a2272] font-medium"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}