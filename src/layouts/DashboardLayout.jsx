import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FiX } from "react-icons/fi";

export default function DashboardLayout({
  title,
  sidebarItems = [],
  children,
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ===================== */}
      {/* NAVBAR */}
      {/* ===================== */}
      <Navbar
        title={title}
        onMenuClick={
          sidebarItems.length > 0 ? () => setMobileMenu(true) : undefined
        }
      />

      {/* ===================== */}
      {/* BODY */}
      {/* ===================== */}
      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        {sidebarItems.length > 0 && (
          <aside className="hidden lg:block w-64 bg-white border-r">
            <Sidebar items={sidebarItems} />
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>

      {/* ===================== */}
      {/* MOBILE SIDEBAR */}
      {/* ===================== */}
      {mobileMenu && sidebarItems.length > 0 && (
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

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setMobileMenu(false);
                    item.onClick();
                  }}
                  className="
                    w-full flex items-center gap-3
                    px-4 py-3 rounded-xl
                    text-left text-gray-700
                    hover:bg-slate-100 transition
                  "
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
