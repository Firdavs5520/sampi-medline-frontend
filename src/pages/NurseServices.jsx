import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { FiPlus, FiTrash2, FiPackage } from "react-icons/fi";

/* ===================== */
/* STATUS */
/* ===================== */
function Status({ status }) {
  if (!status) return null;

  return (
    <div className="flex justify-center mt-4">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white
          ${
            status === "loading"
              ? "bg-brand-violet"
              : status === "success"
                ? "bg-green-600"
                : "bg-red-500"
          }
        `}
      >
        {status === "loading" && "…"}
        {status === "success" && "✓"}
        {status === "error" && "✕"}
      </div>
    </div>
  );
}

/* ===================== */
/* MAIN */
/* ===================== */
export default function Services() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const [name, setName] = useState("");

  // VARIANTS (1 marta majburiy)
  const [variants, setVariants] = useState([
    { label: "1 marta", count: 1, price: "" },
  ]);

  const [status, setStatus] = useState(null);

  /* ===================== */
  /* GUARD */
  /* ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const fetchServices = async () => {
    const res = await api.get("/services");
    setServices(res.data || []);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* ===================== */
  /* VARIANT CONTROLS */
  /* ===================== */
  const addVariant = () => {
    const next = variants.length + 1;
    setVariants([
      ...variants,
      { label: `${next} marta`, count: next, price: "" },
    ]);
  };

  const updateVariant = (index, value) => {
    setVariants(
      variants.map((v, i) => (i === index ? { ...v, price: value } : v)),
    );
  };

  const removeVariant = (index) => {
    if (index === 0) return; // 1 marta majburiy
    setVariants(variants.filter((_, i) => i !== index));
  };

  /* ===================== */
  /* ADD SERVICE */
  /* ===================== */
  const addService = async () => {
    if (!name || !variants[0].price) {
      setStatus("error");
      setTimeout(() => setStatus(null), 1000);
      return;
    }

    try {
      setStatus("loading");

      const cleanVariants = variants
        .filter((v) => v.price)
        .map((v) => ({
          label: v.label,
          count: v.count,
          price: Number(v.price),
        }));

      await api.post("/services", {
        name: name.trim(),
        variants: cleanVariants,
      });

      setName("");
      setVariants([{ label: "1 marta", count: 1, price: "" }]);

      await fetchServices();

      setStatus("success");
      setTimeout(() => setStatus(null), 1000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus(null), 1000);
    }
  };

  /* ===================== */
  /* DELETE */
  /* ===================== */
  const deleteService = async (id) => {
    if (!confirm("O‘chirmoqchimisiz?")) return;
    await api.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-8">
      {/* ADD */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4 text-lg">
          <FiPlus /> Yangi xizmat qo‘shish
        </h2>

        <div className="space-y-4">
          <input
            className="border rounded-xl px-4 py-3 w-full text-lg"
            placeholder="Xizmat nomi (masalan: Ukol)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="number"
                className="border rounded-xl px-4 py-3 w-full text-lg"
                placeholder={`${v.label} narxi (so‘m)`}
                value={v.price}
                onChange={(e) => updateVariant(i, e.target.value)}
              />

              {i > 0 && (
                <button
                  onClick={() => removeVariant(i)}
                  className="text-red-500"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addVariant}
            className="w-full border border-dashed border-gray-400
              py-3 rounded-xl text-gray-600"
          >
            ➕ Yana marta qo‘shish
          </button>

          <button
            onClick={addService}
            className="w-full bg-brand-red text-white py-4 rounded-2xl text-lg font-semibold"
          >
            Saqlash
          </button>
        </div>

        <AnimatePresence>
          <Status status={status} />
        </AnimatePresence>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4 text-lg">
          <FiPackage /> Xizmatlar ro‘yxati
        </h2>

        {services.map((s) => (
          <div key={s._id} className="border rounded-2xl px-4 py-3 mb-3">
            <div className="flex justify-between items-center">
              <div className="font-medium text-lg">{s.name}</div>
              <button
                onClick={() => deleteService(s._id)}
                className="text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>

            <div className="text-gray-600 text-sm mt-1 space-y-1">
              {(s.variants || []).map((v, i) => (
                <div key={i}>
                  {v.label} — {v.price.toLocaleString()} so‘m
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
