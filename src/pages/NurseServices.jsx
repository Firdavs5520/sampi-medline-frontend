import { useEffect, useState } from "react";
import api from "../api/axios";
import { FiPlus, FiTrash2, FiPackage } from "react-icons/fi";

export default function NurseServices() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");

  const [variants, setVariants] = useState([
    { label: "1 marta", count: 1, price: "" },
  ]);

  /* FETCH */
  const fetchServices = async () => {
    const res = await api.get("/services");
    setServices(res.data || []);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  /* VARIANTS */
  const addVariant = () => {
    const next = variants.length + 1;
    setVariants([
      ...variants,
      { label: `${next} marta`, count: next, price: "" },
    ]);
  };

  const updateVariant = (i, value) => {
    setVariants(
      variants.map((v, idx) => (idx === i ? { ...v, price: value } : v)),
    );
  };

  const removeVariant = (i) => {
    if (i === 0) return;
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  /* ADD SERVICE */
  const addService = async () => {
    if (!name || !variants[0].price) {
      alert("Kamida 1 variant narxini kiriting");
      return;
    }

    await api.post("/services", {
      name: name.trim(),
      variants: variants.map((v) => ({
        label: v.label,
        count: v.count,
        price: Number(v.price),
      })),
    });

    setName("");
    setVariants([{ label: "1 marta", count: 1, price: "" }]);
    fetchServices();
  };

  /* DELETE */
  const deleteService = async (id) => {
    if (!confirm("O‘chirmoqchimisiz?")) return;
    await api.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ADD */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <FiPlus /> Yangi xizmat
        </h2>

        <input
          className="border rounded-xl px-4 py-3 w-full mb-4"
          placeholder="Xizmat nomi"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {variants.map((v, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="number"
              className="border rounded-xl px-4 py-3 w-full"
              placeholder={`${v.label} narxi`}
              value={v.price}
              onChange={(e) => updateVariant(i, e.target.value)}
            />

            {i > 0 && (
              <button onClick={() => removeVariant(i)} className="text-red-600">
                <FiTrash2 />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addVariant}
          className="w-full border border-dashed py-3 rounded-xl mb-3"
        >
          ➕ Yana marta qo‘shish
        </button>

        <button
          onClick={addService}
          className="w-full bg-brand-red text-white py-3 rounded-xl font-semibold"
        >
          Saqlash
        </button>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <FiPackage /> Xizmatlar
        </h2>

        {services.map((s) => (
          <div key={s._id} className="border rounded-xl p-4 mb-3">
            <div className="flex justify-between items-center">
              <div className="font-semibold">{s.name}</div>
              <button
                onClick={() => deleteService(s._id)}
                className="text-red-600"
              >
                <FiTrash2 />
              </button>
            </div>

            <div className="text-sm text-gray-600 mt-2 space-y-1">
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
