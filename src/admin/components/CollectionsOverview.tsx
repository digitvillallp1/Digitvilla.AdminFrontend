import { useEffect, useState } from "react";
import adminApi from "../../services/api";

type Payment = {
  totalAmount?: number;
  amount?: number;
  status: string | number;
  paidAt?: string;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function CollectionsOverview() {
  const [paidData, setPaidData] = useState<number[]>(new Array(12).fill(0));
  const [pendingData, setPendingData] = useState<number[]>(new Array(12).fill(0));

  useEffect(() => {
    adminApi.get("/payments")
      .then((res) => {
        const payments = res.data as Payment[];
        const paid = new Array(12).fill(0);
        const pending = new Array(12).fill(0);

        payments.forEach((p) => {
          const monthIndex = p.paidAt
            ? new Date(p.paidAt).getMonth()
            : new Date().getMonth();
          const amt = Number(p.totalAmount ?? p.amount ?? 0);
          const s = String(p.status ?? "");
          const isPaid = s === "1" || s.toLowerCase() === "paid";

          if (isPaid) paid[monthIndex] += amt;
          else pending[monthIndex] += amt;
        });

        setPaidData(paid);
        setPendingData(pending);
      })
      .catch(console.error);
  }, []);

  const maxVal = Math.max(...paidData, ...pendingData, 1);

  // Convert data to SVG points
  function toPoints(data: number[]) {
    return data
      .map((val, i) => {
        const x = 10 + (i / 11) * 630;
        const y = 200 - (val / maxVal) * 180;
        return `${x},${y}`;
      })
      .join(" ");
  }

  return (
    <div className="rounded-xl border border-[#dfe4f0] bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#07185f]">Collections Overview</h3>
        <div className="flex gap-4 text-xs">
          <span className="text-[#4338ca]">● Paid Amount</span>
          <span className="text-red-400">● Pending Amount</span>
        </div>
      </div>

      <div className="relative h-60 w-full">
        <svg
          viewBox="0 0 650 220"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="10"
              y1={20 + i * 45}
              x2="640"
              y2={20 + i * 45}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          ))}

          {/* Paid line */}
          <polyline
            fill="none"
            stroke="#4338ca"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={toPoints(paidData)}
          />

          {/* Pending line */}
          <polyline
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={toPoints(pendingData)}
          />

          {/* Dots on paid line */}
          {paidData.map((val, i) => (
            <circle
              key={i}
              cx={10 + (i / 11) * 630}
              cy={200 - (val / maxVal) * 180}
              r="4"
              fill="#4338ca"
            />
          ))}

          {/* Dots on pending line */}
          {pendingData.map((val, i) => (
            <circle
              key={i}
              cx={10 + (i / 11) * 630}
              cy={200 - (val / maxVal) * 180}
              r="4"
              fill="#ef4444"
            />
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-12 text-center text-xs text-gray-500 mt-2">
        {MONTHS.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}