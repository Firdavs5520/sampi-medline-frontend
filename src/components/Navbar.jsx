import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-xl text-center font-medium transition
     ${
       isActive
         ? "bg-teal-100 text-teal-700"
         : "bg-slate-100 hover:bg-slate-200"
     }`;

  return (
    <>
      {/* ===== TOP NAVBAR ===== */}
      <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* ☰ BURGER — faqat mobile */}
          <button onClick={() => setOpen(true)} className="lg:hidden text-2xl">
            ☰
          </button>

          <h1 className="text-lg font-semibold text-teal-700">Sampi Medline</h1>
        </div>

        {/* RIGHT — logout faqat desktop */}
        <button
          onClick={logout}
          className="hidden lg:block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Chiqish
        </button>
      </header>

      {/* ===== MOBILE BURGER MENU ===== */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* menu box */}
          <div className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl p-4 space-y-3 shadow-lg">
            <h2 className="text-center font-bold text-teal-700 mb-2">Menyu</h2>

            <NavLink
              to="/nurse"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              🧑‍⚕️ Bemorlar
            </NavLink>

            <NavLink
              to="/nurse/medicines"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              💊 Dorilar
            </NavLink>

            <button
              onClick={logout}
              className="w-full bg-red-500 text-white py-3 rounded-xl mt-2 hover:bg-red-600"
            >
              🚪 Chiqish
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full py-2 text-gray-500"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </>
  );
}
