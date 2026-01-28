import { useNavigate } from "react-router-dom";
import { FiLogOut, FiRefreshCw, FiUser, FiPackage } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const refresh = () => window.location.reload();

  /* ===================== */
  /* MANAGER NAVBAR */
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
  /* NURSE BOTTOM NAV */
  /* ===================== */
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 lg:hidden">
      <button
        onClick={() => navigate("/nurse")}
        className="flex flex-col items-center"
      >
        <FiUser />
        <span className="text-xs block">Bemorlar</span>
      </button>

      <button
        onClick={() => navigate("/nurse/medicines")}
        className="flex flex-col items-center"
      >
        <FiPackage />
        <span className="text-xs block">Dorilar</span>
      </button>

      <button onClick={refresh} className="flex flex-col items-center">
        <FiRefreshCw />
        <span className="text-xs block">Yangilash</span>
      </button>

      <button
        onClick={logout}
        className="text-brand-red flex flex-col items-center"
      >
        <FiLogOut />
        <span className="text-xs block">Chiqish</span>
      </button>
    </nav>
  );
}
