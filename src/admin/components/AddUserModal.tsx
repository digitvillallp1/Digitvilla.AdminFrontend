import { useState, type FormEvent } from "react";

type User = {
  name: string;
  course: string;
  phone: string;
  status: "Paid" | "Pending";
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: User) => void;
};

export default function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
}: Props) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"Paid" | "Pending">("Pending");

  if (!isOpen) return null;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    onAddUser({
      name,
      course,
      phone,
      status,
    });

    setName("");
    setCourse("");
    setPhone("");
    setStatus("Pending");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="text-xl font-bold text-[#07185f]">Add user</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            type="text"
            placeholder="user Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-[#dfe4f0] px-4 py-2"
          />

          <input
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
            className="w-full rounded-lg border border-[#dfe4f0] px-4 py-2"
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-lg border border-[#dfe4f0] px-4 py-2"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "Paid" | "Pending")}
            className="w-full rounded-lg border border-[#dfe4f0] px-4 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#dfe4f0] px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#4338ca] px-4 py-2 text-white"
            >
              Save user
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}