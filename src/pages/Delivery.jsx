import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import {
  FiPlus,
  FiMinus,
  FiCheck,
  FiX,
  FiPackage,
  FiLoader,
  FiLogOut,
} from "react-icons/fi";

/* ===================== */
/* LOADING */
/* ===================== */
function Loading() {
  return (
    <div className="flex justify-center py-10 text-brand-violet">
      <FiLoader className="animate-spin" size={32} />
    </div>
  );
}

/* ===================== */
/* MAIN */
/* ===================== */
export default function Delivery() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState(null); // loading | success | error
  const [error, setError] = useState("");

  /* ===================== */
  /* FETCH MEDICINES */
  /* ===================== */
  const loadMedicines = async () => {
    try {
      setLoading(true);
      const res = await api.get("/medicines/for-delivery");
      setMedicines(res.data || []);
    } catch {
      setError("Dorilarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  /* ===================== */
  /* CART LOGIC */
  /* ===================== */
  const toggleMedicine = (m) => {
    const exist = cart.find((i) => i._id === m._id);

    if (exist) {
      setCart(cart.filter((i) => i._id !== m._id));
    } else {
      setCart([...cart, { ...m, addQty: 1 }]);
    }
  };

  const setQty = (id, value) => {
    const v = Math.max(1, Number(value) || 1);
    setCart(cart.map((i) => (i._id === id ? { ...i, addQty: v } : i)));
  };

  const inc = (id, step = 1) =>
    setCart(
      cart.map((i) => (i._id === id ? { ...i, addQty: i.addQty + step } : i)),
    );

  const dec = (id) =>
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, addQty: i.addQty - 1 } : i))
        .filter((i) => i.addQty > 0),
    );

  /* ===================== */
  /* SAVE — BULK DELIVERY */
  /* ===================== */
  const save = async () => {
    if (cart.length === 0) {
      setError("Kamida bitta dori tanlang");
      return;
    }

    try {
      setStatus("loading");
      setError("");

      await api.post("/medicines/delivery", {
        items: cart.map((m) => ({
          medicineId: m._id,
          quantity: m.addQty,
        })),
      });

      setStatus("success");
      setCart([]);
      loadMedicines();

      setTimeout(() => setStatus(null), 1500);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setError(e?.response?.data?.message || "Saqlashda xatolik");
      setTimeout(() => setStatus(null), 1500);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ===================== */
  /* UI */
  /* ===================== */
  return (
    <div className="min-h-screen bg-slate-100 pb-[100px]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <FiPackage /> Omborga dori qo‘shish
          </h1>

          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl bg-brand-red text-white flex items-center gap-2"
          >
            <FiLogOut /> Chiqish
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ===================== */}
            {/* LEFT — MEDICINES */}
            {/* ===================== */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
              <h2 className="font-semibold mb-4">Dorilar</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {medicines.map((m) => {
                  const selected = cart.some((i) => i._id === m._id);

                  return (
                    <button
                      key={m._id}
                      onClick={() => toggleMedicine(m)}
                      className={`border rounded-xl p-3 text-left transition
                        ${
                          selected
                            ? "border-brand-violet bg-violet-50"
                            : "hover:bg-slate-50"
                        }`}
                    >
                      <div className="font-medium text-sm">{m.name}</div>
                      <div
                        className={`text-xs ${
                          m.quantity === 0
                            ? "text-gray-400"
                            : m.quantity <= m.minLevel
                              ? "text-red-500"
                              : "text-gray-500"
                        }`}
                      >
                        {m.quantity === 0 ? "Qolmadi" : `Qoldiq: ${m.quantity}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===================== */}
            {/* RIGHT — CONFIRM */}
            {/* ===================== */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-4">
              <h2 className="font-semibold">Tasdiqlash</h2>

              {cart.length === 0 ? (
                <div className="text-gray-400 text-sm">Dorilar tanlanmagan</div>
              ) : (
                <>
                  {cart.map((m) => (
                    <div
                      key={m._id}
                      className="border rounded-xl p-3 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">{m.name}</div>
                        <button
                          onClick={() =>
                            setCart(cart.filter((i) => i._id !== m._id))
                          }
                        >
                          <FiX />
                        </button>
                      </div>

                      {/* QTY CONTROL */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => dec(m._id)}>
                          <FiMinus />
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={m.addQty}
                          onChange={(e) => setQty(m._id, e.target.value)}
                          className="w-20 border rounded-lg text-center py-1"
                        />

                        <button onClick={() => inc(m._id)}>
                          <FiPlus />
                        </button>
                      </div>

                      {/* QUICK ADD */}
                      <div className="flex gap-2 text-xs">
                        {[10, 50, 100].map((n) => (
                          <button
                            key={n}
                            onClick={() => inc(m._id, n)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-brand-violet hover:text-white"
                          >
                            +{n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setCart([]);
                        setError("");
                      }}
                      className="flex-1 border rounded-xl py-2 flex items-center justify-center gap-2"
                    >
                      <FiX /> Bekor
                    </button>

                    <button
                      onClick={save}
                      className="flex-1 bg-brand-violet text-white rounded-xl py-2 flex items-center justify-center gap-2"
                    >
                      <FiCheck /> Tasdiqlash
                    </button>
                  </div>
                </>
              )}

              {/* STATUS */}
              <AnimatePresence>
                {status === "loading" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center text-brand-violet"
                  >
                    <FiLoader className="animate-spin" size={28} />
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center text-green-600 font-medium"
                  >
                    ✅ Saqlandi
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center text-red-600 font-medium"
                  >
                    ❌ Xatolik
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
