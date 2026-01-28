import Navbar from "../components/Navbar";
import { FiBarChart2 } from "react-icons/fi";

export default function ManagerLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ===================== */}
      {/* NAVBAR */}
      {/* ===================== */}
      <Navbar />

      {/* ===================== */}
      {/* HEADER */}
      {/* ===================== */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <FiBarChart2 className="text-brand-violet text-xl" />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Manager panel
          </h1>
        </div>
      </header>

      {/* ===================== */}
      {/* CONTENT */}
      {/* ===================== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
