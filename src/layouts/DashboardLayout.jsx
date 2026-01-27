import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  title,
  sidebarItems = [],
  children,
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR */}
      <Navbar
        title={title}
        onMenuClick={sidebarItems.length > 0 ? () => setMobileMenu(true) : null}
      />

      <div className="flex">
        {/* DESKTOP SIDEBAR */}
        {sidebarItems.length > 0 && (
          <div className="hidden lg:block w-64">
            <Sidebar items={sidebarItems} />
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenu(false)}
          />

          {/* menu */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 space-y-2">
            <h3 className="font-semibold mb-2">Menyu</h3>

            {sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setMobileMenu(false);
                  item.onClick();
                }}
                className="w-full text-left px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200"
              >
                {item.icon} {item.label}
              </button>
            ))}

            <button
              onClick={() => setMobileMenu(false)}
              className="w-full mt-2 py-2 text-gray-500"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
