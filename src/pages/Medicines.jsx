import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios";
import { FiPlus, FiTrash2, FiPackage, FiDollarSign } from "react-icons/fi";

export default function Medicines() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ===================== */
  /* ROLE GUARD */
  /* ===================== */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "nurse") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ===================== */
  /* FETCH MEDICINES */
  /* ===================== */
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines");
      setMedicines(res.data);
    } catch {
      toast.error("Dorilarni yuklashda xatolik");
    }
  };

  /* ===================== */
  /* ADD MEDICINE */
  /* ===================== */
  const addMedicine = async () => {
    if (!name || !price) {
      toast.error("Dori nomi va narxini kiriting");
      return;
    }

    try {
      setLoading(true);

      await api.post("/medicines", {
        name,
        price: Number(price),
      });

      setName("");
      setPrice("");
      fetchMedicines();
      toast.success("Dori muvaffaqiyatli qo‘shildi");
    } catch {
      toast.error("Dori qo‘shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== */
  /* DELETE MEDICINE */
  /* ===================== */
  const removeMedicine = async (id) => {
    toast(
      (t) => (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            Dorini o‘chirishni tasdiqlaysizmi?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-sm rounded-lg bg-slate-100"
            >
              Yo‘q
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await api.delete(`/medicines/${id}`);
                  fetchMedicines();
                  toast.success("Dori o‘chirildi");
                } catch {
                  toast.error("O‘chirishda xatolik");
                }
              }}
              className="px-3 py-1 text-sm rounded-lg bg-brand-red text-white"
            >
              Ha
            </button>
          </div>
        </div>
      ),
      { duration: 6000 },
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-28">
      <Toaster position="top-center" />

      {/* ===================== */}
      {/* ADD MEDICINE */}
      {/* ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl shadow-xl p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-dark mb-4">
          <FiPlus className="text-brand-violet" />
          Yangi dori qo‘shish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="
              border rounded-xl px-4 py-3
              focus:ring-2 focus:ring-brand-violet outline-none
            "
            placeholder="Dori nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="relative">
            <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              className="
                border rounded-xl pl-11 pr-4 py-3 w-full
                focus:ring-2 focus:ring-brand-violet outline-none
              "
              placeholder="Narxi (so‘m)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={addMedicine}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              bg-brand-red hover:bg-red-700
              text-white rounded-xl font-semibold
              transition disabled:opacity-50
            "
          >
            <FiPlus />
            {loading ? "Saqlanmoqda..." : "Qo‘shish"}
          </motion.button>
        </div>
      </motion.div>

      {/* ===================== */}
      {/* MEDICINES LIST */}
      {/* ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-xl p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-dark mb-4">
          <FiPackage className="text-brand-blue" />
          Dorilar ro‘yxati
        </h2>

        {medicines.length === 0 ? (
          <p className="text-gray-500 text-sm">Hozircha dori mavjud emas</p>
        ) : (
          <div className="space-y-3">
            {medicines.map((m) => (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="
                  flex items-center justify-between
                  border rounded-2xl px-4 py-3
                  hover:bg-slate-50 transition
                "
              >
                <div>
                  <div className="font-medium text-gray-800">{m.name}</div>
                  <div className="text-sm text-gray-500">
                    {m.price.toLocaleString()} so‘m
                  </div>
                </div>

                <button
                  onClick={() => removeMedicine(m._id)}
                  className="
                    flex items-center gap-1
                    text-red-600 hover:text-red-800
                    transition
                  "
                >
                  <FiTrash2 />
                  <span className="hidden sm:inline">O‘chirish</span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
