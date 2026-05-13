import { useState } from "react";


type Collection = {
  userName: string;
  amount: number;
  date: string;
  paymentMethod: "Cash" | "Cheque" | "Online";
  status: "Paid" | "Pending";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddCollection: (collection: Collection) => void;
};

type Errors = {
  userName?: string;
  amount?: string;
  date?: string;
};

export default function AddCollectionModal({
  isOpen,
  onClose,
  onAddCollection,
}: Props) {
  const [userName, setuserName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "Cheque" | "Online"
  >("Cash");
  const [status, setStatus] = useState<"Paid" | "Pending">("Paid");
  const [errors, setErrors] = useState<Errors>({});

  // Validation functions
  const validateuserName = (value: string): string | undefined => {
    if (!value.trim()) return "user name is required";
    if (value.trim().length < 3) return "user name must be at least 3 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "user name can only contain letters and spaces";
    return undefined;
  };

  const validateAmount = (value: string): string | undefined => {
    if (!value) return "Amount is required";
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return "Amount must be a positive number";
    return undefined;
  };

  const validateDate = (value: string): string | undefined => {
    if (!value) return "Date is required";
    const selectedDate = new Date(value);
    const today = new Date();
    if (selectedDate > today) return "Date cannot be in the future";
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    const userError = validateuserName(userName);
    const amountError = validateAmount(amount);
    const dateError = validateDate(date);

    if (userError) newErrors.userName = userError;
    if (amountError) newErrors.amount = amountError;
    if (dateError) newErrors.date = dateError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) return;

    onAddCollection({
      userName: userName.trim(),
      amount: parseFloat(amount),
      date,
      paymentMethod,
      status,
    });

    // Reset form
    setuserName("");
    setAmount("");
    setDate("");
    setPaymentMethod("Cash");
    setStatus("Paid");
    setErrors({});
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-[#07185f]">Add Collection</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* user Name Field */}
          <div>
            <label className="text-sm font-medium text-[#07185f]">
              user Name *
            </label>
            <input
              type="text"
              placeholder="user Name"
              value={userName}
              onChange={(e) => {
                setuserName(e.target.value);
                if (errors.userName)
                  setErrors({ ...errors, userName: undefined });
              }}
              className={`w-full mt-1 rounded-lg border px-4 py-2 outline-none transition ${
                errors.userName
                  ? "border-red-500 bg-red-50 focus:border-red-500"
                  : "border-[#dfe4f0] focus:border-[#4338ca]"
              }`}
            />
            {errors.userName && (
              <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
            )}
          </div>

          {/* Amount Field */}
          <div>
            <label className="text-sm font-medium text-[#07185f]">
              Amount (₹) *
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors({ ...errors, amount: undefined });
              }}
              min="0"
              step="0.01"
              className={`w-full mt-1 rounded-lg border px-4 py-2 outline-none transition ${
                errors.amount
                  ? "border-red-500 bg-red-50 focus:border-red-500"
                  : "border-[#dfe4f0] focus:border-[#4338ca]"
              }`}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Date Field */}
          <div>
            <label className="text-sm font-medium text-[#07185f]">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (errors.date) setErrors({ ...errors, date: undefined });
              }}
              className={`w-full mt-1 rounded-lg border px-4 py-2 outline-none transition ${
                errors.date
                  ? "border-red-500 bg-red-50 focus:border-red-500"
                  : "border-[#dfe4f0] focus:border-[#4338ca]"
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-[#07185f]">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "Cash" | "Cheque" | "Online")
              }
              className="w-full mt-1 rounded-lg border border-[#dfe4f0] px-4 py-2 outline-none transition focus:border-[#4338ca]"
            >
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Online">Online</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-[#07185f]">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Paid" | "Pending")}
              className="w-full mt-1 rounded-lg border border-[#dfe4f0] px-4 py-2 outline-none transition focus:border-[#4338ca]"
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                setuserName("");
                setAmount("");
                setDate("");
                setPaymentMethod("Cash");
                setStatus("Paid");
                setErrors({});
              }}
              className="rounded-lg border border-[#dfe4f0] px-4 py-2 text-[#07185f] hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#4338ca] px-4 py-2 text-white hover:bg-[#3a2fb4] transition"
            >
              Save Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
