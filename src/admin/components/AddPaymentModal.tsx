import { useState } from "react";
import { X } from "lucide-react";
import type { Collection } from "../../context/DataContext";
import { useData } from "../../context/useData";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payment: Collection) => void;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPaymentModalProps) {
  const { users } = useData();
  const [formData, setFormData] = useState({
    userName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    status: "Paid",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "user name is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newPayment = {
      userName: formData.userName,
      amount: parseFloat(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod as "Cash" | "Cheque" | "Online",
      status: formData.status as "Paid" | "Pending",
    };

    onSubmit(newPayment);
    setFormData({
      userName: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash",
      status: "Paid",
    });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dfe4f0] p-6">
          <h2 className="text-xl font-bold text-[#07185f]">Add New Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* user Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              user Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="userName"
              placeholder="Enter user name"
              value={formData.userName}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 transition ${
                errors.userName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-[#dfe4f0] focus:border-[#4338ca] focus:ring-indigo-100"
              }`}
              list="user-list"
            />
            <datalist id="user-list">
              {users.map((user) => (
                <option key={user.name} value={user.name} />
              ))}
            </datalist>
            {errors.userName && (
              <p className="mt-1 text-xs text-red-500">{errors.userName}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 transition ${
                errors.amount
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-[#dfe4f0] focus:border-[#4338ca] focus:ring-indigo-100"
              }`}
              step="0.01"
              min="0"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 transition ${
                errors.date
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-[#dfe4f0] focus:border-[#4338ca] focus:ring-indigo-100"
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dfe4f0] px-3 py-2.5 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Online">Online</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#dfe4f0] px-3 py-2.5 text-sm outline-none focus:border-[#4338ca] focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#dfe4f0] px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#4338ca] px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
            >
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
