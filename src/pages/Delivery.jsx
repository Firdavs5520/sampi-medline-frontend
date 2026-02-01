import { useEffect, useState } from "react";
import api from "../api/axios";
import { FiCheck, FiX, FiPlus, FiMinus } from "react-icons/fi";

export default function Delivery() {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const loadMedicines = async () => {
    const res = await api.get("/medicines/for-delivery");
    setMedicines(res.data);
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  /* ===================== */
  /* TOGGLE MEDICINE */
  /* ===================== */
  const toggleMedicine = (m) => {
    const exist = cart.find((i) => i._id === m._id);

    if (exist) {
      setCart(cart.filter((i) => i._id !== m._id));
    } else {
      setCart([
        ...cart,
        {
          _id: m._id,
          name: m.name,
          current: m.quantity,
          add: 1,
        },
      ]);
    }
  };

  /* ===================== */
  /* QTY CONTROLS */
  /* ===================== */
  const inc = (id) =>
    setCart(cart.map((i) => (i._id === id ? { ...i, add: i.add + 1 } : i)));

  const dec = (id) =>
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, add: i.add - 1 } : i))
        .filter((i) => i.add > 0),
    );

  /* ===================== */
  /* SAVE */
  /* ===================== */
  const save = async () => {
    if (cart.length === 0) {
      setError("Hech qanday dori tanlanmagan");
      return;
    }

    try {
      setError("");
      setSuccess("");

      for (const i of cart) {
        await api.post("/medicines/delivery", {
          medicineId: i._id,
          quantity: i.add,
        });
      }

      setSuccess("Dorilar omborga muvaffaqiyatli qo‘shildi");
      setCart([]);
      loadMedicines();

      setTimeout(() => setSuccess(""), 2000);
    } catch (e) {
      console.error(e);
      setError("Saqlashda xatolik yuz berdi");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-xl font-semibold">🚚 Delivery</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ===================== */}
        {/* LEFT — MEDICINES */}
        {/* ===================== */}
        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="font-semibold mb-4">Dorilar</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {medicines.map((m) => {
              const selected = cart.find((i) => i._id === m._id);

              return (
                <button
                  key={m._id}
                  onClick={() => toggleMedicine(m)}
                  className={`relative border rounded-2xl p-4 text-left transition
                    ${
                      selected
                        ? "border-brand-violet bg-violet-50"
                        : "hover:bg-slate-50"
                    }`}
                >
                  {selected && (
                    <div className="absolute top-2 right-2 bg-brand-violet text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <FiCheck size={14} />
                    </div>
                  )}

                  <div className="font-medium">{m.name}</div>
                  <div
                    className={`text-sm ${
                      m.quantity <= m.minLevel
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    Omborda: {m.quantity} dona
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================== */}
        {/* RIGHT — CONFIRM */}
        {/* ===================== */}
        <div className="bg-white rounded-3xl shadow p-6 space-y-4">
          <h2 className="font-semibold">Tasdiqlash</h2>

          {cart.length === 0 ? (
            <div className="text-gray-400">Dorilarni tanlang</div>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((i) => (
                  <div
                    key={i._id}
                    className="border rounded-xl px-4 py-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-gray-500">
                        Hozir: {i.current} → Yangi: <b>{i.current + i.add}</b>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => dec(i._id)}>
                        <FiMinus />
                      </button>
                      <span className="font-semibold">{i.add}</span>
                      <button onClick={() => inc(i._id)}>
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
              {success && (
                <div className="text-green-600 text-sm">{success}</div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setCart([])}
                  className="px-4 py-2 rounded-xl border flex items-center gap-2"
                >
                  <FiX /> Bekor qilish
                </button>

                <button
                  onClick={save}
                  className="bg-brand-violet text-white px-5 py-2 rounded-xl flex items-center gap-2"
                >
                  <FiCheck /> Saqlash
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
