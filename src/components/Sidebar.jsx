import { NavLink, useNavigate } from "react-router-dom";
import { FiUser, FiPackage, FiActivity, FiLogOut } from "react-icons/fi";

export default function Sidebar({ mobile = false, onItemClick }) {
  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition";

  const active = "bg-brand-violet/10 text-brand-violet";
  const inactive = "text-gray-600 hover:bg-slate-100";

  const logout = () => {
    localStorage.clear();
    if (onItemClick) onItemClick();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`
        ${mobile ? "p-4" : "p-6"}
        w-full h-full flex flex-col
      `}
    >
      {/* ===================== */}
      {/* NAV LINKS */}
      {/* ===================== */}
      <nav className="space-y-2 flex-1">
        <NavLink
          to="/nurse"
          end
          onClick={onItemClick}
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiUser className="text-lg" />
          <span>Bemorlar</span>
        </NavLink>

        <NavLink
          to="/nurse/medicines"
          onClick={onItemClick}
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiPackage className="text-lg" />
          <span>Dorilar</span>
        </NavLink>

        {/* 🔹 YANGI: XIZMATLAR */}
        <NavLink
          to="/nurse/services"
          onClick={onItemClick}
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          <FiActivity className="text-lg" />
          <span>Xizmatlar</span>
        </NavLink>
      </nav>

      {/* ===================== */}
      {/* LOGOUT */}
      {/* ===================== */}
      <button
        onClick={logout}
        className="
          mt-6 flex items-center gap-3
          px-4 py-3 rounded-xl
          text-sm font-medium
          text-red-600 hover:text-white
          hover:bg-brand-red
          transition
        "
      >
        <FiLogOut className="text-lg" />
        <span>Chiqish</span>
      </button>
    </aside>
  );
}
