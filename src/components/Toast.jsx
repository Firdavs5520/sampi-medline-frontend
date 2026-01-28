import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function Toast({ type = "success", message }) {
  const styles =
    type === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : "bg-red-50 border-red-200 text-red-600";

  const Icon = type === "success" ? FiCheckCircle : FiAlertCircle;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-3
        px-4 py-3 rounded-xl border
        shadow-lg animate-toast
        ${styles}
      `}
    >
      <Icon className="text-xl" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
