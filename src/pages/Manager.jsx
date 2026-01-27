import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Manager() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  // KPI
  const [totalQty, setTotalQty] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [topMedicine, setTopMedicine] = useState("-");
  const [medicineTypes, setMedicineTypes] = useState(0);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);

      // ✅ SUMMARY ROUTE
      const res = await api.get("/reports/summary");

      const { cards, table } = res.data;

      // KPI
      setTotalQty(cards.totalQty);
      setTotalSum(cards.totalSum);
      setTopMedicine(cards.mostUsed);
      setMedicineTypes(cards.types);

      // TABLE
      setRows(table);
    } catch (err) {
      console.error("SUMMARY ERROR:", err);
      alert("Hisobotni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Klinikani boshqarish tizimi">
      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-gray-500 animate-pulse">
          Hisobot yuklanmoqda...
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard title="Jami dori" value={totalQty} />
            <KpiCard
              title="Jami summa"
              value={`${totalSum.toLocaleString()} so‘m`}
            />
            <KpiCard title="Eng ko‘p ishlatilgan" value={topMedicine} />
            <KpiCard title="Dori turlari" value={medicineTypes} />
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <h2 className="font-bold text-lg mb-4">
              📊 Dorilar bo‘yicha umumiy hisobot
            </h2>

            {rows.length === 0 ? (
              <div className="text-gray-500 text-center py-6">
                Hisobotlar mavjud emas
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left text-gray-600">
                    <th className="py-2">Dori nomi</th>
                    <th className="py-2">Miqdor</th>
                    <th className="py-2">Jami summa</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r._id} className="border-b last:border-none">
                      <td className="py-2 font-medium">{r._id}</td>
                      <td className="py-2">{r.qty}</td>
                      <td className="py-2">{r.sum.toLocaleString()} so‘m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/* ===================== */
/* KPI CARD */
/* ===================== */

function KpiCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 transition hover:shadow-lg">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold text-teal-700 mt-1">{value}</div>
    </div>
  );
}
