import { useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiRefreshCw, FiUser, FiPackage } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const refresh = () => window.location.reload();

  const isActive = (path) => location.pathname === path;

  /* ===================== */
  /* MANAGER NAVBAR (TOP) */
  /* ===================== */
  if (role === "manager") {
    return (
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-brand-violet">
          Sampi Medline
        </h1>

        <div className="flex gap-2">
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <FiRefreshCw size={20} />
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-lg bg-brand-red text-white"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </header>
    );
  }

  /* ===================== */
  /* NURSE MOBILE BOTTOM NAV */
  /* ===================== */
  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg border flex justify-around py-2 lg:hidden z-50 mb-2">
      {/* BEMORLAR */}
      <button
        onClick={() => navigate("/nurse")}
        className={`flex flex-col items-center text-xs transition
          ${
            isActive("/nurse")
              ? "text-brand-violet font-semibold"
              : "text-gray-500"
          }
        `}
      >
        <FiUser size={20} />
        <span>Bemorlar</span>
        {isActive("/nurse") && (
          <span className="w-4 h-1 bg-brand-violet rounded-full mt-1" />
        )}
      </button>

      {/* DORILAR */}
      <button
        onClick={() => navigate("/nurse/medicines")}
        className={`flex flex-col items-center text-xs transition
          ${
            isActive("/nurse/medicines")
              ? "text-brand-violet font-semibold"
              : "text-gray-500"
          }
        `}
      >
        <FiPackage size={20} />
        <span>Dorilar</span>
        {isActive("/nurse/medicines") && (
          <span className="w-4 h-1 bg-brand-violet rounded-full mt-1" />
        )}
      </button>

      {/* REFRESH */}
      <button
        onClick={refresh}
        className="flex flex-col items-center text-xs text-gray-500"
      >
        <FiRefreshCw size={20} />
        <span>Yangilash</span>
      </button>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="flex flex-col items-center text-xs text-brand-red"
      >
        <FiLogOut size={20} />
        <span>Chiqish</span>
      </button>
    </nav>
  );
}
