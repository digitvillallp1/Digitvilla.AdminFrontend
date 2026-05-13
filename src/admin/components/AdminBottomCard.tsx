import type { LucideIcon } from "lucide-react";

type AdminBottomCardProps = {
  title: string;
  value: string;
  linkText: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

export default function AdminBottomCard({
  title,
  value,
  linkText,
  icon: Icon,
  iconBg,
  iconColor,
}: AdminBottomCardProps) {
  return (
    <div className="rounded-xl border border-[#dfe4f0] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-3 ${iconBg}`}>
          <Icon className={iconColor} size={22} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-[#07185f]">{value}</h3>
        </div>
      </div>

      <button className="mt-5 text-sm font-semibold text-[#4338ca]">
        {linkText}
      </button>
    </div>
  );
}