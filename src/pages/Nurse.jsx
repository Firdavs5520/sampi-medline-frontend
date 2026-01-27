import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Nurse() {
  const [patientName, setPatientName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);

  /* ===================== */
  /* GET MEDICINES */
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
      alert("Dorilarni olishda xato");
    }
  };

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

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    setCart(cart.map((i) => (i._id === id ? { ...i, quantity: qty } : i)));
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  /* ===================== */
  /* SAVE ADMINISTRATION */
  /* ===================== */
  const save = async () => {
    if (!patientName || cart.length === 0) {
      alert("Bemor va dorilarni tanlang");
      return;
    }

    try {
      // ketma-ket saqlash
      for (const i of cart) {
        await api.post("/administrations", {
          patientName,
          medicine: i.name,
          quantity: i.quantity,
          pricePerUnit: i.price,
        });
      }

      alert("✅ Dori saqlandi");
      setPatientName("");
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("❌ Saqlashda xato");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ===================== */}
      {/* MEDICINES */}
      {/* ===================== */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-teal-700 mb-4">💊 Dorilar</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {medicines.map((m) => (
            <button
              key={m._id}
              onClick={() => addMedicine(m)}
              className="border rounded-xl p-4 hover:bg-teal-50 transition"
            >
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-500">
                {m.price.toLocaleString()} so‘m
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===================== */}
      {/* PATIENT + CART */}
      {/* ===================== */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold mb-3">🧑‍⚕️ Bemor</h3>

        <input
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Bemor ismi"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />

        <div className="space-y-3">
          {cart.map((i) => (
            <div key={i._id} className="flex justify-between items-center">
              <span>{i.name}</span>
              <input
                type="number"
                min="1"
                className="w-16 border rounded px-2"
                value={i.quantity}
                onChange={(e) => changeQty(i._id, Number(e.target.value))}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 font-bold text-teal-700">
          Jami: {total.toLocaleString()} so‘m
        </div>

        <button
          onClick={save}
          className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg"
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}
