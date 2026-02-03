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
  /* QTY HELPERS */
  /* ===================== */
  const normalizeQty = (value, max = Infinity) => {
    let v = Number(value);
    if (isNaN(v)) v = 1;
    if (v < 1) v = 1;
    if (v > max) v = max;
    return v;
  };

  /* ===================== */
  /* CART LOGIC */
  /* ===================== */
  const toggleMedicine = (m) => {
    if (m.quantity === 0) return;

    const exist = cart.find((i) => i._id === m._id);

    if (exist) {
      setCart(cart.filter((i) => i._id !== m._id));
    } else {
      setCart([...cart, { ...m, addQty: 1 }]);
    }
  };

  const setQty = (id, value) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id ? { ...i, addQty: normalizeQty(value, i.quantity) } : i,
      ),
    );
  };

  const inc = (id, step = 1) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, addQty: normalizeQty(i.addQty + step, i.quantity) }
          : i,
      ),
    );
  };

  const dec = (id) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id
          ? { ...i, addQty: normalizeQty(i.addQty - 1, i.quantity) }
          : i,
      ),
    );
  };

  /* ===================== */
  /* SAVE */
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
            {/* LEFT */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
              <h2 className="font-semibold mb-4">Dorilar</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {medicines.map((m) => {
                  const selected = cart.some((i) => i._id === m._id);

                  return (
                    <button
                      key={m._id}
                      disabled={m.quantity === 0}
                      onClick={() => toggleMedicine(m)}
                      className={`border rounded-xl p-3 text-left transition
                        ${
                          m.quantity === 0
                            ? "opacity-40 cursor-not-allowed"
                            : selected
                              ? "border-brand-violet bg-violet-50"
                              : "hover:bg-slate-50"
                        }`}
                    >
                      <div className="font-medium text-sm">{m.name}</div>
                      <div
                        className={`text-xs ${
                          m.quantity === 0
                            ? "text-gray-400"
                            : m.quantity <= (m.minLevel ?? 0)
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

            {/* RIGHT */}
            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-4">
              <h2 className="font-semibold">Tasdiqlash</h2>

              {cart.length === 0 ? (
                <div className="text-gray-400 text-sm">Dorilar tanlanmagan</div>
              ) : (
                <>
                  {cart.map((m) => (
                    <div
                      key={m._id}
                      className="border rounded-xl p-3 space-y-3"
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

                      {/* QTY */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => dec(m._id)}
                          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                        >
                          <FiMinus />
                        </button>

                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={m.quantity}
                          value={m.addQty}
                          onChange={(e) => setQty(m._id, e.target.value)}
                          onBlur={(e) => setQty(m._id, e.target.value)}
                          className="w-20 border rounded-lg text-center py-1"
                        />

                        <button
                          onClick={() => inc(m._id)}
                          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      {/* QUICK ADD */}
                      <div className="flex gap-2 text-xs">
                        {[10, 50, 100].map((n) => (
                          <button
                            key={n}
                            onClick={() => inc(m._id, n)}
                            className="px-3 py-1 rounded-full bg-slate-100"
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
                      className="flex-1 border rounded-xl py-2"
                    >
                      Bekor
                    </button>

                    <button
                      disabled={status === "loading"}
                      onClick={save}
                      className="flex-1 bg-brand-violet disabled:opacity-50 text-white rounded-xl py-2"
                    >
                      Tasdiqlash
                    </button>
                  </div>
                </>
              )}

              {/* STATUS */}
              <AnimatePresence>
                {status === "loading" && (
                  <motion.div className="flex justify-center text-brand-violet">
                    <FiLoader className="animate-spin" size={28} />
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div className="text-center text-green-600 font-medium">
                    ✅ Saqlandi
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div className="text-center text-red-600 font-medium">
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
