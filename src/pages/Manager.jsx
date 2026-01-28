import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import {
  FiBox,
  FiDollarSign,
  FiTrendingUp,
  FiLayers,
  FiAlertCircle,
} from "react-icons/fi";

export default function Manager() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  // KPI
  const [totalQty, setTotalQty] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [topMedicine, setTopMedicine] = useState("-");
  const [medicineTypes, setMedicineTypes] = useState(0);

  /* ===================== */
  /* ROLE GUARD */
  /* ===================== */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "manager") {
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
      const { cards, table } = res.data;

      setTotalQty(cards.totalQty);
      setTotalSum(cards.totalSum);
      setTopMedicine(cards.mostUsed);
      setMedicineTypes(cards.types);
      setRows(table);
    } catch (e) {
      setError("Hisobotni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {/* ===================== */}
        {/* ERROR */}
        {/* ===================== */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            <FiAlertCircle />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* ===================== */}
        {/* KPI CARDS */}
        {/* ===================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Jami dori"
            value={totalQty}
            icon={<FiBox />}
            color="border-brand-blue"
          />

          <KpiCard
            title="Jami summa"
            value={`${totalSum.toLocaleString()} so‘m`}
            icon={<FiDollarSign />}
            color="border-brand-violet"
          />

          <KpiCard
            title="Eng ko‘p ishlatilgan"
            value={topMedicine}
            icon={<FiTrendingUp />}
            color="border-brand-red"
          />

          <KpiCard
            title="Dori turlari"
            value={medicineTypes}
            icon={<FiLayers />}
            color="border-brand-blue"
          />
        </div>

        {/* ===================== */}
        {/* REPORT */}
        {/* ===================== */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Dorilar bo‘yicha umumiy hisobot
          </h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400 animate-pulse">
              Yuklanmoqda...
            </div>
          ) : rows.length === 0 ? (
            <p className="text-gray-500">Maʼlumot mavjud emas</p>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr className="text-left text-gray-500">
                      <th className="py-2">Dori</th>
                      <th>Miqdor</th>
                      <th>Summa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r._id} className="border-b last:border-none">
                        <td className="py-2 font-medium">{r._id}</td>
                        <td>{r.qty}</td>
                        <td className="font-semibold text-brand-violet">
                          {r.sum.toLocaleString()} so‘m
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="sm:hidden space-y-3">
                {rows.map((r) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-xl p-4"
                  >
                    <div className="font-semibold text-brand-dark">{r._id}</div>

                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>Miqdor</span>
                      <span>{r.qty}</span>
                    </div>

                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">Summa</span>
                      <span className="font-semibold text-brand-violet">
                        {r.sum.toLocaleString()} so‘m
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ===================== */
/* KPI CARD COMPONENT */
/* ===================== */

function KpiCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`
        bg-white rounded-2xl shadow p-4
        border-l-4 ${color}
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-brand-dark mt-1">{value}</p>
        </div>

        <div className="text-2xl text-gray-400">{icon}</div>
      </div>
    </motion.div>
  );
}
