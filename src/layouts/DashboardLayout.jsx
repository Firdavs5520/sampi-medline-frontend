import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FiX } from "react-icons/fi";
import { getRole, isLoggedIn, logout } from "../utils/auth";

/**
 * Universal Dashboard Layout
 * role: "nurse" | "manager" | "delivery"
 */
export default function DashboardLayout({ role }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  /* ===================== */
  /* ROLE GUARD */
  /* ===================== */
  useEffect(() => {
    if (!isLoggedIn()) {
      logout();
      return;
    }

    const currentRole = getRole();
    if (role && currentRole !== role) {
      navigate("/login", { replace: true });
    }
  }, [navigate, role]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ===================== */}
      {/* NAVBAR */}
      {/* ===================== */}
      <Navbar onMenuClick={() => setMobileMenu(true)} />

      {/* ===================== */}
      {/* BODY */}
      {/* ===================== */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block w-64 bg-white border-r">
          <Sidebar role={role} />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* ===================== */}
      {/* MOBILE SIDEBAR */}
      {/* ===================== */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenu(false)}
          />

          {/* SLIDE MENU */}
          <div
            className="
              absolute left-0 top-0 bottom-0 w-72
              bg-white shadow-xl
              animate-slide-in
              flex flex-col
            "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h3 className="font-semibold text-gray-800">Menyu</h3>
              <button
                onClick={() => setMobileMenu(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* MENU ITEMS */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                role={role}
                mobile
                onItemClick={() => setMobileMenu(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
