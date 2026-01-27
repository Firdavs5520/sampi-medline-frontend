import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sm:flex hidden">
      <aside className="w-64 bg-white border-r p-4 ">
        <h2 className="text-xl font-bold text-teal-600 mb-6">Sampi Medline</h2>

        <nav className="space-y-2">
          <NavLink
            to="/nurse"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-teal-100 text-teal-700" : "hover:bg-slate-100"
              }`
            }
          >
            🧑‍⚕️ Bemorlar
          </NavLink>

          <NavLink
            to="/nurse/medicines"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${
                isActive ? "bg-teal-100 text-teal-700" : "hover:bg-slate-100"
              }`
            }
          >
            💊 Dorilar
          </NavLink>
        </nav>
      </aside>
    </div>
  );
}
