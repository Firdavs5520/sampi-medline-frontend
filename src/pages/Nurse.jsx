import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import {
  FiPackage,
  FiBriefcase,
  FiSave,
  FiCheck,
  FiUser,
  FiPlus,
  FiMinus,
  FiTrash2,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Nurse() {
  const [patientName, setPatientName] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [blocking, setBlocking] = useState(false);
  const [search, setSearch] = useState("");

  /* ===================== */
  /* HELPERS */
  /* ===================== */

  const formatName = (v) =>
    v
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const medicineInCart = (id) =>
    cart.find((i) => i.type === "medicine" && i._id === id);

  const serviceInCart = (id) =>
    cart.find((i) => i.type === "service" && i.serviceId === id);

  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart],
  );

  /* ===================== */
  /* FETCH (REFRESH SYNC) */
  /* ===================== */
  useEffect(() => {
    const load = async () => {
      const [m, s] = await Promise.all([
        api.get("/medicines"),
        api.get("/services"),
      ]);

      setMedicines(
        [...m.data].sort((a, b) =>
          a.name.localeCompare(b.name, "uz", { sensitivity: "base" }),
        ),
      );
      setServices(s.data);
    };

    load();
  }, []);

  /* ===================== */
  /* CART SAFETY (DB’da yo‘q dori bo‘lsa) */
  /* ===================== */
  useEffect(() => {
    setCart((c) =>
      c.filter((i) => {
        if (i.type !== "medicine") return true;
        return medicines.some((m) => m._id === i._id);
      }),
    );
  }, [medicines]);

  /* ===================== */
  /* MEDICINES */
  /* ===================== */
  const toggleMedicine = (m) => {
    if (blocking || m.quantity <= 0) return;

    const exist = medicineInCart(m._id);

    if (exist) {
      setCart((c) => c.filter((i) => i._id !== m._id));
    } else {
      setCart((c) => [
        ...c,
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

  const incMedicine = (id) => {
    setCart((c) =>
      c.map((i) =>
        i._id === id && i.quantity < i.max
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    );
  };

  const decMedicine = (id) => {
    setCart((c) =>
      c
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  /* ===================== */
  /* SERVICES */
  /* ===================== */
  const toggleService = (s, v) => {
    if (blocking) return;

    setCart((c) =>
      c.filter((i) => !(i.type === "service" && i.serviceId === s._id)),
    );

    setCart((c) => [
      ...c,
      {
        type: "service",
        serviceId: s._id,
        variant: v.label,
        name: `${s.name} (${v.label})`,
        price: v.price,
        quantity: 1,
      },
    ]);
  };

  /* ===================== */
  /* SAVE */
  /* ===================== */
  const save = async () => {
    if (!patientName || !cart.length || blocking) return;

    setBlocking(true);

    try {
      const res = await api.post("/administrations/bulk", {
        patientName,
        items: cart,
      });

      const orderId = res.data.orderId;
      window.open(`/nurse/check/${orderId}`, "_blank");

      // 🔥 REAL-TIME UI UPDATE
      setMedicines((prev) =>
        prev.map((m) => {
          const used = cart.find(
            (i) => i.type === "medicine" && i._id === m._id,
          );
          if (!used) return m;
          return { ...m, quantity: m.quantity - used.quantity };
        }),
      );

      setCart([]);
      setPatientName("");
    } catch (err) {
      alert(err?.response?.data?.message || "Omborda yetarli emas");
    } finally {
      setBlocking(false);
    }
  };

  /* ===================== */
  /* ⌨️ ENTER (PC) */
  /* ===================== */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      if (blocking) return;

      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (patientName && cart.length) {
        save();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [patientName, cart, blocking]);

  /* ===================== */
  /* UI */
  /* ===================== */
  return (
    <div className="max-w-7xl mx-auto px-3 pb-28">
      <input
        className="w-full px-4 py-3 rounded-xl border mb-3"
        placeholder="Dori yoki xizmat qidirish..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT */}
        <div className="flex-1 space-y-4">
          {/* MEDICINES */}
          <div className="bg-white rounded-2xl p-3 shadow">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
              <FiPackage /> Dorilar
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {medicines
                .filter((m) =>
                  m.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((m) => {
                  const selected = medicineInCart(m._id);
                  const out = m.quantity <= 0;

                  return (
                    <motion.button
                      key={m._id}
                      whileTap={!out ? { scale: 0.97 } : {}}
                      onClick={() => toggleMedicine(m)}
                      disabled={out || blocking}
                      className={`relative border rounded-xl p-3 text-left
                        ${
                          selected
                            ? "bg-green-50 border-green-500"
                            : "hover:bg-slate-50"
                        }
                        ${out ? "opacity-60" : ""}`}
                    >
                      {out && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="border-2 border-red-600 text-red-600 text-xs font-bold px-2 py-1 rounded bg-white">
                            QOLMADI
                          </div>
                        </div>
                      )}

                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-gray-500">
                        {m.price.toLocaleString()} so‘m
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Qoldiq: {m.quantity}
                      </div>

                      {selected && (
                        <FiCheck className="absolute top-2 right-2 text-green-600 text-sm" />
                      )}
                    </motion.button>
                  );
                })}
            </div>
          </div>

          {/* SERVICES */}
          <div className="bg-white rounded-2xl p-3 shadow">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
              <FiBriefcase /> Xizmatlar
            </h2>

            {services.map((s) => {
              const selected = serviceInCart(s._id);

              return (
                <div key={s._id} className="border rounded-xl p-3 mb-3">
                  <div className="font-medium mb-2 text-sm">{s.name}</div>

                  {s.variants.map((v, i) => {
                    const active = selected && selected.variant === v.label;

                    return (
                      <button
                        key={i}
                        onClick={() => toggleService(s, v)}
                        disabled={selected && !active}
                        className={`w-full flex justify-between items-center border rounded-lg px-3 py-2 mb-2 text-sm
                          ${
                            active
                              ? "bg-green-50 border-green-500"
                              : "hover:bg-slate-50"
                          }
                          ${
                            selected && !active
                              ? "opacity-40 cursor-not-allowed"
                              : ""
                          }`}
                      >
                        <span>{v.label}</span>
                        <span>{v.price.toLocaleString()} so‘m</span>
                        {active && <FiCheck className="text-green-600" />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-[360px] bg-white rounded-2xl p-4 shadow">
          <h3 className="flex items-center gap-2 font-semibold mb-3">
            <FiUser /> Bemor
          </h3>

          <input
            className="border rounded-lg px-3 py-2 w-full mb-3"
            placeholder="Familiya Ism"
            value={patientName}
            onChange={(e) => setPatientName(formatName(e.target.value))}
          />

          <div className="space-y-2 mb-3">
            <AnimatePresence>
              {cart.map((i) => (
                <motion.div
                  key={i.type === "medicine" ? i._id : i.serviceId}
                  layout
                  className="flex justify-between items-center border rounded-lg px-2 py-2"
                >
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-gray-500">
                      {i.price.toLocaleString()} so‘m
                    </div>
                  </div>

                  {i.type === "medicine" ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => decMedicine(i._id)}>
                        <FiMinus />
                      </button>
                      <span className="font-semibold">{i.quantity}</span>
                      <button onClick={() => incMedicine(i._id)}>
                        <FiPlus />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCart((c) => c.filter((x) => x !== i))}
                    >
                      <FiTrash2 className="text-red-500" />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="font-semibold mb-3">
            Jami: {total.toLocaleString()} so‘m
          </div>

          <button
            onClick={save}
            disabled={!patientName || !cart.length || blocking}
            className="w-full py-3 rounded-xl font-semibold text-white bg-brand-red hover:bg-red-700"
          >
            <FiSave className="inline mr-1" />
            Saqlash va chek
          </button>
        </div>
      </div>
    </div>
  );
}
