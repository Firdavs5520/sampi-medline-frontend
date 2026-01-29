import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiPackage,
  FiDollarSign,
  FiX,
} from "react-icons/fi";

/* ===================== */
/* INLINE STATUS ICON */
/* ===================== */
function InlineStatus({ status }) {
  if (!status) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="flex justify-center mt-5"
    >
      <div
        className={`
          w-12 h-12 rounded-full shadow-lg
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
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          />
        )}

        {status === "success" && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </motion.svg>
        )}

        {status === "error" && (
          <motion.svg
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </motion.svg>
        )}
      </div>
    </motion.div>
  );
}

/* ===================== */
/* MAIN COMPONENT */
/* ===================== */
export default function Medicines() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const [status, setStatus] = useState(null);

  /* ===================== */
  /* GUARD */
  /* ===================== */
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "nurse") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const fetchMedicines = async () => {
    try {
      const res = await api.get("/medicines");
      setMedicines(res.data);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 1200);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  /* ===================== */
  /* ADD */
  /* ===================== */
  const addMedicine = async () => {
    if (!name || !price) {
      setStatus("error");
      setTimeout(() => setStatus(null), 1200);
      return;
    }

    try {
      setStatus("loading");
      await api.post("/medicines", {
        name: name.trim(),
        price: Number(price),
      });

      setName("");
      setPrice("");
      await fetchMedicines();

      setStatus("success");
      setTimeout(() => setStatus(null), 1200);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 1200);
    }
  };

  /* ===================== */
  /* DELETE */
  /* ===================== */
  const deleteMedicine = async (id) => {
    try {
      setStatus("loading");
      await api.delete(`/medicines/${id}`);

      setMedicines((prev) => prev.filter((m) => m._id !== id));

      setStatus("success");
      setTimeout(() => setStatus(null), 1000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 1200);
    }
  };

  /* ===================== */
  /* EDIT SAVE */
  /* ===================== */
  const saveEdit = async () => {
    if (!editName || !editPrice) {
      setStatus("error");
      setTimeout(() => setStatus(null), 1200);
      return;
    }

    try {
      setStatus("loading");

      await api.put(`/medicines/${editItem._id}`, {
        name: editName,
        price: Number(editPrice),
      });

      setMedicines((prev) =>
        prev.map((m) =>
          m._id === editItem._id
            ? { ...m, name: editName, price: Number(editPrice) }
            : m,
        ),
      );

      setEditItem(null);

      setStatus("success");
      setTimeout(() => setStatus(null), 1200);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 1200);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-32 space-y-8">
      {/* ADD */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <FiPlus /> Yangi dori
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            className="border rounded-xl px-4 py-3"
            placeholder="Dori nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            className="border rounded-xl px-4 py-3"
            placeholder="Narxi"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={addMedicine}
            className="bg-brand-red text-white rounded-xl font-semibold py-3"
          >
            Qo‘shish
          </button>
        </div>

        <AnimatePresence>
          <InlineStatus status={status} />
        </AnimatePresence>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <FiPackage /> Dorilar
        </h2>

        {medicines.map((m) => (
          <motion.div
            key={m._id}
            layout
            className="flex justify-between items-center border rounded-2xl px-4 py-3 mb-2"
          >
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-500">
                {m.price.toLocaleString()} so‘m
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditItem(m);
                  setEditName(m.name);
                  setEditPrice(m.price);
                }}
                className="text-blue-600"
              >
                <FiEdit2 />
              </button>

              <button
                onClick={() => deleteMedicine(m._id)}
                className="text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editItem && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-80"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Tahrirlash</h3>
                <button onClick={() => setEditItem(null)}>
                  <FiX />
                </button>
              </div>

              <input
                className="border rounded-xl px-4 py-2 w-full mb-3"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <input
                type="number"
                className="border rounded-xl px-4 py-2 w-full mb-4"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />

              <button
                onClick={saveEdit}
                className="w-full bg-brand-red text-white py-2 rounded-xl"
              >
                Saqlash
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
