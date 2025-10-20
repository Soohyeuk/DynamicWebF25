export default function Button({ children, onClick, type = "button", variant = "primary", fullWidth = false }) {
  const base = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 transition-colors";
  const width = fullWidth ? "w-full" : "";
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
      : "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400";
  return (
    <button type={type} onClick={onClick} className={`${base} ${width} ${styles}`}>
      {children}
    </button>
  );
}


