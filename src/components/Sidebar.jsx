import { NavLink, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiActivity,
  FiLogOut,
  FiBarChart2,
  FiTruck,
} from "react-icons/fi";
import { getRole, logout as doLogout } from "../utils/auth";

/**
 * Sidebar
 * @param {String} role - nurse | manager | delivery
 * @param {Boolean} mobile
 * @param {Function} onItemClick
 */
export default function Sidebar({ role, mobile = false, onItemClick }) {
  const navigate = useNavigate();

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition";

  const active = "bg-brand-violet/10 text-brand-violet";
  const inactive = "text-gray-600 hover:bg-slate-100";

  const handleLogout = () => {
    if (onItemClick) onItemClick();
    doLogout(); // utils/auth.js
  };

  const r = role || getRole(); // fallback

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
        {/* ===================== */}
        {/* 👩‍⚕️ NURSE */}
        {/* ===================== */}
        {r === "nurse" && (
          <>
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
          </>
        )}

        {/* ===================== */}
        {/* 👨‍💼 MANAGER */}
        {/* ===================== */}
        {r === "manager" && (
          <>
            <NavLink
              to="/manager"
              end
              onClick={onItemClick}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              <FiBarChart2 className="text-lg" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/manager/warehouse"
              onClick={onItemClick}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              <FiPackage className="text-lg" />
              <span>Ombor</span>
            </NavLink>

            <NavLink
              to="/manager/reports"
              onClick={onItemClick}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              <FiActivity className="text-lg" />
              <span>Hisobotlar</span>
            </NavLink>
          </>
        )}

        {/* ===================== */}
        {/* 🚚 DELIVERY */}
        {/* ===================== */}
        {r === "delivery" && (
          <>
            <NavLink
              to="/delivery"
              end
              onClick={onItemClick}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              <FiTruck className="text-lg" />
              <span>Dori qo‘shish</span>
            </NavLink>

            <NavLink
              to="/delivery"
              onClick={onItemClick}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              <FiPackage className="text-lg" />
              <span>Delivery tarixi</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* ===================== */}
      {/* LOGOUT */}
      {/* ===================== */}
      <button
        onClick={handleLogout}
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
