import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { FiPackage, FiMinus, FiAlertTriangle } from "react-icons/fi";

/* ===================== */
/* STATUS BADGE */
/* ===================== */
function StatusBadge({ status }) {
  if (status === "out") {
    return (
      <div className="mt-2 text-red-600 font-extrabold text-lg">
        ❌ DORI TUGAGAN
      </div>
    );
  }

  if (status === "low") {
    return (
      <div className="mt-2 text-orange-500 font-semibold flex items-center gap-2">
        <FiAlertTriangle /> Kam qoldi
      </div>
    );
  }

  return null;
}

/* ===================== */
/* MAIN */
/* ===================== */
export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [usingId, setUsingId] = useState(null);
  const [qty, setQty] = useState(1);

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const fetchMedicines = async () => {
    const res = await api.get("/medicines");
    setMedicines(res.data);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  /* ===================== */
  /* USE MEDICINE */
  /* ===================== */
  const useMedicine = async (id) => {
    if (qty <= 0) return;

    try {
      setUsingId(id);
      await api.post(`/medicines/use/${id}`, {
        quantity: Number(qty),
      });
      await fetchMedicines();
    } catch (err) {
      alert(err?.response?.data?.message || "Dori omborda yetarli emas");
    } finally {
      setUsingId(null);
      setQty(1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <FiPackage /> Dorilar (ombor)
      </h2>

      {medicines.map((m) => (
        <motion.div
          key={m._id}
          layout
          className="
            bg-white rounded-3xl shadow
            p-6 flex flex-col md:flex-row
            md:items-center md:justify-between
            gap-4
          "
        >
          {/* INFO */}
          <div>
            <div className="text-lg font-semibold">{m.name}</div>
            <div className="text-sm text-gray-500">
              {m.price.toLocaleString()} so‘m · {m.quantity} {m.unit}
            </div>

            <StatusBadge status={m.status} />
          </div>

          {/* ACTION */}
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-20 border rounded-xl px-3 py-2"
              disabled={m.status === "out"}
            />

            <button
              onClick={() => useMedicine(m._id)}
              disabled={m.status === "out" || usingId === m._id}
              className={`
                flex items-center gap-2
                px-4 py-2 rounded-xl font-semibold
                ${
                  m.status === "out"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-brand-red text-white hover:bg-red-700"
                }
              `}
            >
              <FiMinus />
              Ishlatish
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
