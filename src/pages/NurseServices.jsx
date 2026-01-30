import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { FiPlus, FiX, FiActivity, FiCheck, FiUser } from "react-icons/fi";

export default function NurseServices() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState([]);
  const [patientName, setPatientName] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [newService, setNewService] = useState("");

  /* ===================== */
  /* FETCH SERVICES */
  /* ===================== */
  useEffect(() => {
    api.get("/services").then((res) => setServices(res.data));
  }, []);

  /* ===================== */
  /* ADD SERVICE (LOCAL + API) */
  /* ===================== */
  const addService = async () => {
    if (!newService.trim()) return;

    const res = await api.post("/services", { name: newService });
    setServices((p) => [...p, res.data]);
    setNewService("");
    setOpenAdd(false);
  };

  /* ===================== */
  /* TOGGLE SELECT */
  /* ===================== */
  const toggle = (s) => {
    setSelected((prev) =>
      prev.find((i) => i._id === s._id)
        ? prev.filter((i) => i._id !== s._id)
        : [...prev, s],
    );
  };

  /* ===================== */
  /* SAVE */
  /* ===================== */
  const save = async () => {
    if (!patientName || selected.length === 0) return;

    await api.post("/service-logs", {
      patientName,
      services: selected.map((s) => s.name),
    });

    setPatientName("");
    setSelected([]);
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-6">
      {/* ===================== */}
      {/* TITLE */}
      {/* ===================== */}
      <h1 className="text-xl font-semibold text-brand-dark flex items-center gap-2">
        <FiActivity className="text-brand-violet" />
        Xizmatlar
      </h1>

      {/* ===================== */}
      {/* PATIENT */}
      {/* ===================== */}
      <div className="bg-white rounded-3xl shadow p-6">
        <label className="text-sm text-gray-500 flex items-center gap-1 mb-2">
          <FiUser /> Bemor
        </label>
        <input
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          placeholder="Bemor ismi"
          className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-violet outline-none"
        />
      </div>

      {/* ===================== */}
      {/* SERVICES */}
      {/* ===================== */}
      <div className="bg-white rounded-3xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Xizmatlar ro‘yxati</h2>
          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-1 text-sm text-brand-violet"
          >
            <FiPlus /> Qo‘shish
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {services.map((s) => {
            const active = selected.find((i) => i._id === s._id);
            return (
              <motion.button
                key={s._id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggle(s)}
                className={`
                  rounded-2xl px-4 py-3 text-sm font-medium border transition
                  ${
                    active
                      ? "bg-brand-violet text-white border-brand-violet"
                      : "bg-white hover:bg-slate-50"
                  }
                `}
              >
                {s.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ===================== */}
      {/* SAVE */}
      {/* ===================== */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={save}
        className="w-full bg-brand-red text-white py-3 rounded-2xl font-semibold flex justify-center items-center gap-2"
      >
        <FiCheck />
        Saqlash
      </motion.button>

      {/* ===================== */}
      {/* ADD MODAL */}
      {/* ===================== */}
      <AnimatePresence>
        {openAdd && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 w-80"
            >
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Yangi xizmat</h3>
                <button onClick={() => setOpenAdd(false)}>
                  <FiX />
                </button>
              </div>

              <input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Masalan: Ukol qilish"
                className="w-full border rounded-xl px-4 py-2 mb-4"
              />

              <button
                onClick={addService}
                className="w-full bg-brand-violet text-white py-2 rounded-xl"
              >
                Qo‘shish
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
