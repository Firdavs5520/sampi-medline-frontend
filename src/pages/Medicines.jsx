import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
    } catch (err) {
      console.error(err);
      alert("❌ Dorilarni olishda xato");
    }
  };

  /* ===================== */
  /* ADD MEDICINE */
  /* ===================== */
  const addMedicine = async () => {
    if (!name || !price) {
      alert("Dori nomi va narxini kiriting");
      return;
    }

    setLoading(true);
    try {
      await api.post("/medicines", {
        name,
        price: Number(price),
      });

      setName("");
      setPrice("");
      fetchMedicines();
    } catch (err) {
      console.error(err);
      alert("❌ Dori qo‘shishda xato");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== */
  /* DELETE MEDICINE */
  /* ===================== */
  const removeMedicine = async (id) => {
    if (!window.confirm("O‘chirishga ishonchingiz komilmi?")) return;

    try {
      await api.delete(`/medicines/${id}`);
      fetchMedicines();
    } catch (err) {
      console.error(err);
      alert("❌ O‘chirishda xato");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ===================== */}
      {/* ADD MEDICINE */}
      {/* ===================== */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-teal-700 mb-4">
          💊 Yangi dori qo‘shish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Dori nomi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            className="border rounded-lg px-4 py-2"
            placeholder="Narxi (so‘m)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={addMedicine}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Saqlanmoqda..." : "Qo‘shish"}
          </button>
        </div>
      </div>

      {/* ===================== */}
      {/* MEDICINES LIST */}
      {/* ===================== */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-slate-700 mb-4">
          📋 Dorilar ro‘yxati
        </h2>

        {medicines.length === 0 ? (
          <p className="text-gray-500">Hozircha dori yo‘q</p>
        ) : (
          <div className="space-y-3">
            {medicines.map((m) => (
              <div
                key={m._id}
                className="flex justify-between items-center border rounded-lg px-4 py-3 hover:bg-slate-50"
              >
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-500">
                    {m.price.toLocaleString()} so‘m
                  </div>
                </div>

                <button
                  onClick={() => removeMedicine(m._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  O‘chirish
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
