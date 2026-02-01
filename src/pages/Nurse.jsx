import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import {
  FiPlus,
  FiMinus,
  FiUser,
  FiPackage,
  FiSave,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiBriefcase,
} from "react-icons/fi";

/* ===================== */
/* MAIN */
/* ===================== */
export default function Nurse() {
  const [patientName, setPatientName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const loadData = async () => {
    const [m, s] = await Promise.all([
      api.get("/medicines"),
      api.get("/services"),
    ]);
    setMedicines(m.data);
    setServices(s.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ===================== */
  /* HELPERS */
  /* ===================== */
  const inCartQty = (id) =>
    cart.find((i) => i.type === "medicine" && i._id === id)?.quantity || 0;

  /* ===================== */
  /* SEARCH */
  /* ===================== */
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [medicines, search]);

  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [services, search]);

  /* ===================== */
  /* ADD MEDICINE */
  /* ===================== */
  const addMedicine = (m) => {
    if (m.quantity <= 0) return;

    const exist = cart.find((i) => i.type === "medicine" && i._id === m._id);

    if (exist) {
      if (exist.quantity >= m.quantity) return;
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
          max: m.quantity,
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
        _id: `${service._id}-${variant.label}`,
        name: `${service.name} (${variant.label})`,
        price: variant.price,
        quantity: 1,
      },
    ]);
  };

  /* ===================== */
  /* CART CONTROLS */
  /* ===================== */
  const inc = (id) =>
    setCart(
      cart.map((i) =>
        i._id === id && (!i.max || i.quantity < i.max)
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    );

  const dec = (id) =>
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );

  const removeItem = (idx) => setCart(cart.filter((_, i) => i !== idx));

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  /* ===================== */
  /* SAVE */
  /* ===================== */
  const save = async () => {
    if (!patientName || cart.length === 0) return;

    for (const i of cart) {
      if (i.type === "medicine") {
        await api.post(`/medicines/use/${i._id}`, {
          quantity: Number(i.quantity),
        });
      }

      await api.post("/administrations", {
        patientName,
        type: i.type,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      });
    }

    await loadData();
    setPatientName("");
    setCart([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24">
      {/* SEARCH */}
      <div className="sticky top-0 bg-slate-100 pt-4 pb-3 z-10">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white"
            placeholder="Dori yoki xizmat qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 mt-4">
        {/* LEFT */}
        <div className="flex-1 space-y-5">
          {/* MEDICINES */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
              <FiPackage /> Dorilar
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredMedicines.map((m) => {
                const isOut = m.quantity === 0;
                const addedQty = inCartQty(m._id);

                return (
                  <button
                    key={m._id}
                    disabled={isOut}
                    onClick={() => addMedicine(m)}
                    className={`relative text-left rounded-xl p-3 border transition
                      ${
                        isOut
                          ? "bg-gray-100 opacity-60 cursor-not-allowed"
                          : addedQty
                            ? "border-green-500 bg-green-50"
                            : "bg-white hover:bg-slate-50"
                      }`}
                  >
                    {/* QOLMADI */}
                    {isOut && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rotate-[-15deg] border-2 border-red-600 text-red-600 px-3 py-1 rounded-lg font-bold bg-white">
                          QOLMADI
                        </div>
                      </div>
                    )}

                    <div className="font-medium text-sm">{m.name}</div>
                    <div className="text-xs text-gray-500">
                      {m.price.toLocaleString()} so‘m
                    </div>

                    {!isOut && (
                      <div className="text-xs text-gray-400 mt-1">
                        Qoldiq: {m.quantity}
                      </div>
                    )}

                    {addedQty > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-green-700">
                        <FiCheck /> Qo‘shildi ({addedQty})
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SERVICES */}
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
              <FiBriefcase /> Xizmatlar
            </h2>

            {filteredServices.map((s) => (
              <div key={s._id} className="border rounded-xl p-3 mb-3">
                <div className="font-medium mb-2">{s.name}</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {s.variants?.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => addService(s, v)}
                      className="flex justify-between items-center border rounded-lg px-3 py-2 hover:bg-slate-50"
                    >
                      <span className="text-sm">{v.label}</span>
                      <span className="font-semibold text-sm">
                        {v.price.toLocaleString()} so‘m
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CART */}
        <div className="w-full lg:w-[340px]">
          <div className="bg-white rounded-2xl shadow p-4 sticky top-[96px]">
            <h3 className="flex items-center gap-2 font-semibold mb-3">
              <FiUser /> Bemor
            </h3>

            <input
              className="border rounded-lg px-3 py-2 mb-3 w-full"
              placeholder="Bemor ismi"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />

            <div className="space-y-2">
              {cart.map((i, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border rounded-lg px-2 py-2"
                >
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-gray-500">
                      {i.price.toLocaleString()} so‘m
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => dec(i._id)}>
                      <FiMinus />
                    </button>
                    <span className="text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => inc(i._id)}>
                      <FiPlus />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-between font-semibold text-sm">
              <span>Jami</span>
              <span>{total.toLocaleString()} so‘m</span>
            </div>

            <button
              onClick={save}
              className="mt-3 w-full bg-brand-red text-white py-2 rounded-lg font-semibold"
            >
              <FiSave className="inline mr-1" />
              Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
