import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import {
  FiPackage,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiX,
  FiSave,
} from "react-icons/fi";

/* ===================== */
/* STATUS */
/* ===================== */
function StatusBadge({ status }) {
  if (status === "out") {
    return <div className="text-red-600 text-sm font-semibold">❌ Tugagan</div>;
  }
  if (status === "low") {
    return (
      <div className="text-orange-500 text-sm flex items-center gap-1">
        <FiAlertTriangle /> Kam qoldi
      </div>
    );
  }
  return null;
}

/* ===================== */
/* MODAL — faqat nom + narx */
/* ===================== */
function MedicineModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        price: initial.price,
      });
    }
  }, [initial]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">
              {initial ? "Dorini tahrirlash" : "Yangi dori"}
            </h3>
            <button onClick={onClose}>
              <FiX />
            </button>
          </div>

          <input
            className="border rounded-xl px-3 py-2 w-full"
            placeholder="Dori nomi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            className="border rounded-xl px-3 py-2 w-full"
            placeholder="Narxi"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <button
            onClick={() => onSave(form)}
            className="w-full bg-brand-blue text-white py-2 rounded-xl flex items-center justify-center gap-2"
          >
            <FiSave /> Saqlash
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ===================== */
/* MAIN */
/* ===================== */
export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  /* FETCH */
  const fetchMedicines = async () => {
    const res = await api.get("/medicines");
    setMedicines(res.data);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  /* SAVE (faqat name + price) */
  const saveMedicine = async (data) => {
    if (!data.name || data.price === "") {
      alert("Nom va narxni kiriting");
      return;
    }

    if (editing) {
      await api.put(`/medicines/${editing._id}`, {
        name: data.name,
        price: Number(data.price),
      });
    } else {
      await api.post("/medicines", {
        name: data.name,
        price: Number(data.price),
      });
    }

    setModalOpen(false);
    setEditing(null);
    fetchMedicines();
  };

  /* DELETE */
  const deleteMedicine = async (id) => {
    if (!confirm("Dorini o‘chirasizmi?")) return;
    await api.delete(`/medicines/${id}`);
    fetchMedicines();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FiPackage /> Dorilar (ombor)
        </h2>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-brand-blue text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <FiPlus /> Dori qo‘shish
        </button>
      </div>

      {medicines.map((m) => (
        <motion.div
          key={m._id}
          layout
          className="bg-white rounded-3xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          {/* INFO */}
          <div>
            <div className="text-lg font-semibold">{m.name}</div>
            <div className="text-sm text-gray-500">
              {m.price.toLocaleString()} so‘m · {m.quantity} {m.unit}
            </div>
            <StatusBadge status={m.status} />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditing(m);
                setModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-gray-100"
            >
              <FiEdit2 />
            </button>

            <button
              onClick={() => deleteMedicine(m._id)}
              className="px-3 py-2 rounded-xl bg-gray-100 text-red-600"
            >
              <FiTrash2 />
            </button>
          </div>
        </motion.div>
      ))}

      <MedicineModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={saveMedicine}
        initial={editing}
      />
    </div>
  );
}
