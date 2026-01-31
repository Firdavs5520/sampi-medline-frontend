import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import {
  FiAlertCircle,
  FiTrendingUp,
  FiLayers,
  FiDollarSign,
  FiBox,
} from "react-icons/fi";

export default function Manager() {
  const navigate = useNavigate();

  /* VIEW */
  const [view, setView] = useState("medicines"); // medicines | services

  /* DATA */
  const [allRows, setAllRows] = useState([]); // backend’dan kelgan hamma data
  const [rows, setRows] = useState([]); // view bo‘yicha filtrlangan

  /* KPI */
  const [totalQty, setTotalQty] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [topItem, setTopItem] = useState("-");
  const [typesCount, setTypesCount] = useState(0);

  /* UI */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================== */
  /* ROLE GUARD */
  /* ===================== */
  useEffect(() => {
    if (localStorage.getItem("role") !== "manager") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ===================== */
  /* FETCH SUMMARY */
  /* ===================== */
  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/reports/summary");
      setAllRows(res.data.table || []);
    } catch {
      setError("Hisobotni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== */
  /* FILTER + KPI RECALC */
  /* ===================== */
  useEffect(() => {
    const filtered =
      view === "services"
        ? allRows.filter((r) => r.type === "service")
        : allRows.filter((r) => r.type === "medicine");

    setRows(filtered);

    /* KPI hisoblash */
    const qty = filtered.reduce((s, i) => s + (i.qty || 0), 0);
    const sum = filtered.reduce((s, i) => s + (i.sum || 0), 0);

    const mostUsed =
      filtered.length > 0
        ? filtered.reduce((a, b) => (a.qty > b.qty ? a : b))._id
        : "-";

    setTotalQty(qty);
    setTotalSum(sum);
    setTopItem(mostUsed);
    setTypesCount(filtered.length);
  }, [view, allRows]);

  return (
    <div className="min-h-screen bg-slate-100 pb-[88px]">
      <Navbar />

      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            <FiAlertCircle />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* MENU */}
        <div className="flex gap-3">
          <ToggleButton
            active={view === "medicines"}
            onClick={() => setView("medicines")}
          >
            Dorilar
          </ToggleButton>

          <ToggleButton
            active={view === "services"}
            onClick={() => setView("services")}
          >
            Xizmatlar
          </ToggleButton>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Jami miqdor" value={totalQty} icon={<FiLayers />} />
          <KpiCard
            title="Jami summa"
            value={`${totalSum.toLocaleString()} so‘m`}
            icon={<FiDollarSign />}
          />
          <KpiCard
            title="Eng ko‘p ishlatilgan"
            value={topItem}
            icon={<FiTrendingUp />}
          />
          <KpiCard title="Turlar soni" value={typesCount} icon={<FiBox />} />
        </div>

        {/* LIST */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">
            {view === "medicines"
              ? "Dorilar bo‘yicha hisobot"
              : "Xizmatlar bo‘yicha hisobot"}
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400">
              Yuklanmoqda...
            </div>
          ) : rows.length === 0 ? (
            <p className="text-gray-500">Maʼlumot yo‘q</p>
          ) : (
            <div className="space-y-3">
              {rows.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-xl p-4"
                >
                  <div className="font-semibold text-lg">{r._id}</div>

                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>{r.qty} marta</span>
                    <span className="font-semibold text-brand-violet">
                      {r.sum.toLocaleString()} so‘m
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ===================== */
/* UI HELPERS */
/* ===================== */

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition
        ${
          active
            ? "bg-brand-violet text-white"
            : "bg-white shadow text-gray-600 hover:bg-slate-50"
        }`}
    >
      {children}
    </button>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl shadow p-4 border-l-4 border-brand-violet"
    >
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {icon}
        <span>{title}</span>
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </motion.div>
  );
}
