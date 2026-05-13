type AdminSummaryCardProps = {
  title: string;
  value: string;
  percentage: string;
  isPositive?: boolean;
};

export default function AdminSummaryCard({
  title,
  value,
  percentage,
  isPositive = true,
}: AdminSummaryCardProps) {
  return (
    <div className="rounded-xl border border-[#dfe4f0] bg-white p-5">
      <p className="text-sm font-semibold text-[#07185f]">{title}</p>

      <h3 className="mt-4 text-2xl font-bold text-[#07185f]">
        {value}
      </h3>

      <p
        className={`mt-3 text-xs font-medium ${
          isPositive ? "text-green-600" : "text-red-500"
        }`}
      >
        {percentage} from last month
      </p>
    </div>
  );
}