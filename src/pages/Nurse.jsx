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
  FiTrash2,
} from "react-icons/fi";

/* ===================== */
/* STATUS ICON */
/* ===================== */
function InlineStatus({ status }) {
  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      className="flex justify-center mt-5"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center
        ${
          status === "loading"
            ? "bg-brand-violet"
            : status === "success"
              ? "bg-green-500"
              : "bg-red-500"
        }`}
      >
        {status === "loading" && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
          />
        )}

        {status === "success" && (
          <svg
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
          </svg>
        )}

        {status === "error" && (
          <svg
            className="w-7 h-7 text-white"
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
          </svg>
        )}
      </div>
    </motion.div>
  );
}

/* ===================== */
/* MAIN */
/* ===================== */
export default function Nurse() {
  const [patientName, setPatientName] = useState("");

  const [medicines, setMedicines] = useState([]);
  const [services, setServices] = useState([]);

  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState(null);

  /* ===================== */
  /* FETCH */
  /* ===================== */
  useEffect(() => {
    api.get("/medicines").then((res) => setMedicines(res.data));
    api.get("/services").then((res) => setServices(res.data));
  }, []);

  /* ===================== */
  /* ADD MEDICINE */
  /* ===================== */
  const addMedicine = (m) => {
    const exist = cart.find((i) => i.type === "medicine" && i._id === m._id);

    if (exist) {
      setCart(
        cart.map((i) =>
          i._id === m._id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          type: "medicine",
          _id: m._id,
          name: m.name,
          price: m.price,
          quantity: 1,
        },
      ]);
    }
  };

  /* ===================== */
  /* ADD SERVICE */
  /* ===================== */
  const addService = (service, variant) => {
    setCart([
      ...cart,
      {
        type: "service",
        name: `${service.name} (${variant.label})`,
        price: variant.price,
      },
    ]);
  };

  /* ===================== */
  /* CART CONTROLS */
  /* ===================== */
  const inc = (id) =>
    setCart(
      cart.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i)),
    );

  const dec = (id) =>
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );

  const removeItem = (idx) => setCart(cart.filter((_, i) => i !== idx));

  const total = cart.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

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
        if (i.type === "medicine") {
          await api.post("/administrations", {
            patientName,
            type: "medicine",
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          });
        } else {
          await api.post("/administrations", {
            patientName,
            type: "service",
            name: i.name,
            price: i.price,
          });
        }
      }

      setPatientName("");
      setCart([]);
      setStatus("success");
      setTimeout(() => setStatus(null), 1500);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setTimeout(() => setStatus(null), 1500);
    }
  };

  return (
    <div className="pb-[88px] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ===================== */}
      {/* LEFT */}
      {/* ===================== */}
      <div className="lg:col-span-2 space-y-6">
        {/* MEDICINES */}
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="flex items-center gap-2 font-semibold mb-4">
            <FiPackage /> Dorilar
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {medicines.map((m) => (
              <button
                key={m._id}
                onClick={() => addMedicine(m)}
                className="border rounded-2xl p-4 text-left hover:bg-slate-50"
              >
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-gray-500">
                  {m.price.toLocaleString()} so‘m
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES */}
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-4">Xizmatlar</h2>

          {services.map((s) => (
            <div key={s._id} className="border rounded-2xl p-4 mb-3">
              <div className="font-medium mb-2">{s.name}</div>

              <div className="space-y-2">
                {Array.isArray(s.variants) &&
                  s.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => addService(s, v)}
                      className="w-full flex justify-between border rounded-xl px-3 py-2 hover:bg-slate-50"
                    >
                      <span>{v.label}</span>
                      <span className="font-semibold">
                        {v.price.toLocaleString()} so‘m
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== */}
      {/* RIGHT */}
      {/* ===================== */}
      <div className="bg-white rounded-3xl shadow p-6 flex flex-col">
        <h3 className="flex items-center gap-2 font-semibold mb-4">
          <FiUser /> Bemor
        </h3>

        <input
          className="border rounded-xl px-4 py-3 mb-4"
          placeholder="Bemor ismi"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <div className="flex-1 space-y-3">
          {cart.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border rounded-xl px-3 py-2"
            >
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-gray-500">
                  {i.price.toLocaleString()} so‘m
                </div>
              </div>

              {i.type === "medicine" ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => dec(i._id)}>
                    <FiMinus />
                  </button>
                  <span>{i.quantity}</span>
                  <button onClick={() => inc(i._id)}>
                    <FiPlus />
                  </button>
                </div>
              ) : (
                <button onClick={() => removeItem(idx)}>
                  <FiTrash2 className="text-red-500" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between font-semibold">
          <span>Jami</span>
          <span>{total.toLocaleString()} so‘m</span>
        </div>

        <button
          onClick={save}
          className="mt-4 bg-brand-red text-white py-3 rounded-xl font-semibold"
        >
          <FiSave className="inline mr-2" />
          Saqlash
        </button>

        <AnimatePresence>
          <InlineStatus status={status} />
        </AnimatePresence>
      </div>
    </div>
  );
}
