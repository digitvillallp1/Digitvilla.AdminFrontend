type AdminHeaderProps = {
  title?: string;
};

export default function AdminHeader({
  title = "Dashboard",
}: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-[#07185f]">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[#07185f] text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </div>
  );
}