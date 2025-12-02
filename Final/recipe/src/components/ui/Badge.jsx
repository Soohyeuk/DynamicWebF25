export default function Badge({ children, color = "indigo" }) {
  const palette = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    gray: "bg-gray-50 text-gray-700 ring-gray-200",
    green: "bg-green-50 text-green-700 ring-green-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
  };
  const cls = palette[color]
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {children}
    </span>
  );
}


