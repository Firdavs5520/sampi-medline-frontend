import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  FiPlus,
  FiMinus,
  FiUser,
  FiPackage,
  FiDollarSign,
  FiSave,
} from "react-icons/fi";

/* ===================== */
/* INLINE STATUS (LOGIN STYLE) */
/* ===================== */
function InlineStatus({ status }) {
  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex justify-center mt-6"
    >
      <div
        className={`
          w-14 h-14 rounded-full shadow-xl
          flex items-center justify-center
          ${
            status === "loading"
              ? "bg-brand-violet"
              : status === "success"
                ? "bg-green-500"
                : "bg-red-500"
          }
        `}
      >
        {status === "loading" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
          />
        )}

        {status === "success" && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        )}

        {status === "error" && (
          <motion.svg
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </motion.svg>
        )}
      </div>
    </motion.div>
  );
}

/* ===================== */
/* MAIN COMPONENT */
/* ===================== */
export default function Nurse() {
  const [patientName, setPatientName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState(null); // null | loading | success | error

  /* ===================== */
  /* FETCH MEDICINES */
  /* ===================== */
  useEffect(() => {
    api
      .get("/medicines")
      .then((res) => setMedicines(res.data))
      .catch(() => setStatus("error"));
  }, []);

  /* ===================== */
  /* CART LOGIC */
  /* ===================== */
  const addMedicine = (med) => {
    const exists = cart.find((i) => i._id === med._id);

    if (exists) {
      setCart(
        cart.map((i) =>
          i._id === med._id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { ...med, quantity: 1 }]);
    }
  };

  const increaseQty = (id) =>
    setCart(
      cart.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );

  const decreaseQty = (id) =>
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  /* ===================== */
  /* SAVE */
  /* ===================== */
  const save = async () => {
    if (!patientName || cart.length === 0) {
      setStatus("error");
      setTimeout(() => setStatus(null), 1200);
      return;
    }

    try {
      setStatus("loading");

      for (const i of cart) {
        await api.post("/administrations", {
          patientName,
          medicine: i.name,
          quantity: i.quantity,
          pricePerUnit: i.price,
        });
      }

      setPatientName("");
      setCart([]);

      setStatus("success");
      setTimeout(() => setStatus(null), 1500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 1500);
    }
  };

  return (
    <div className="pb-32 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* ===================== */}
        {/* MEDICINES */}
        {/* ===================== */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-dark mb-4">
            <FiPackage className="text-brand-violet" />
            Dorilar
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {medicines.map((m) => (
              <motion.button
                key={m._id}
                whileTap={{ scale: 0.96 }}
                onClick={() => addMedicine(m)}
                className="
                  border rounded-2xl p-4 text-left
                  hover:bg-slate-50 transition
                "
              >
                <div className="font-medium text-gray-800">{m.name}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <FiDollarSign />
                  {m.price.toLocaleString()} so‘m
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ===================== */}
        {/* PATIENT + CART */}
        {/* ===================== */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col">
          <h3 className="flex items-center gap-2 font-semibold text-brand-dark mb-4">
            <FiUser className="text-brand-red" />
            Bemor
          </h3>

          <input
            className="
              w-full border rounded-xl px-4 py-3 mb-4
              focus:ring-2 focus:ring-brand-violet outline-none
            "
            placeholder="Bemor ismi"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          <div className="space-y-3 flex-1">
            {cart.length === 0 && (
              <p className="text-sm text-gray-500">Dorilar tanlanmagan</p>
            )}

            {cart.map((i) => (
              <div
                key={i._id}
                className="flex items-center justify-between border rounded-xl px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium">{i.name}</div>
                  <div className="text-xs text-gray-500">
                    {i.price.toLocaleString()} so‘m
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(i._id)}
                    className="p-1 rounded hover:bg-slate-100"
                  >
                    <FiMinus />
                  </button>

                  <span className="w-6 text-center">{i.quantity}</span>

                  <button
                    onClick={() => increaseQty(i._id)}
                    className="p-1 rounded hover:bg-slate-100"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between font-semibold text-brand-dark">
            <span>Jami</span>
            <span>{total.toLocaleString()} so‘m</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={save}
            disabled={status === "loading"}
            className="
              mt-4 flex items-center justify-center gap-2
              bg-brand-red hover:bg-red-700
              text-white py-3 rounded-xl font-semibold
              transition disabled:opacity-50
            "
          >
            <FiSave />
            Saqlash
          </motion.button>

          {/* LOGIN STYLE STATUS */}
          <AnimatePresence>
            <InlineStatus status={status} />
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
