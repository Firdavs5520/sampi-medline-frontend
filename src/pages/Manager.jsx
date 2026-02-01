import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  startOfMonth,
} from "date-fns";
import api from "../api/axios";
import { FiLayers, FiDollarSign, FiTrendingUp, FiBox } from "react-icons/fi";

/* ===================== */
const fmt = (d) => format(d, "yyyy-MM-dd");

export default function Manager() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("medicines");

  const [fromDate, setFromDate] = useState(startOfDay(new Date()));
  const [toDate, setToDate] = useState(endOfDay(new Date()));

  const [summary, setSummary] = useState([]);
  const [store, setStore] = useState([]);

  const [totalQty, setTotalQty] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [topItem, setTopItem] = useState("-");
  const [typesCount, setTypesCount] = useState(0);

  const [loading, setLoading] = useState(true);

  /* ===================== */
  /* GUARD */
  /* ===================== */
  useEffect(() => {
    if (localStorage.getItem("role") !== "manager") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  /* ===================== */
  /* FETCH */
  /* ===================== */
  const fetchSummary = async (f, t) => {
    const res = await api.get("/reports/summary", {
      params: { from: fmt(f), to: fmt(t) },
    });
    setSummary(res.data.table || []);
    setLoading(false);
  };

  const fetchStore = async () => {
    const res = await api.get("/medicines");
    setStore(res.data || []);
  };

  useEffect(() => {
    setToday();
    fetchStore();
  }, []);

  /* ===================== */
  /* KPI */
  /* ===================== */
  useEffect(() => {
    if (tab === "store") return;

    const filtered =
      tab === "services"
        ? summary.filter((r) => r.type === "service")
        : summary.filter((r) => r.type === "medicine");

    setTotalQty(filtered.reduce((s, i) => s + i.qty, 0));
    setTotalSum(filtered.reduce((s, i) => s + i.sum, 0));
    setTypesCount(filtered.length);
    setTopItem(
      filtered.length
        ? filtered.reduce((a, b) => (a.qty > b.qty ? a : b))._id
        : "-",
    );
  }, [summary, tab]);

  /* ===================== */
  /* QUICK FILTERS */
  /* ===================== */
  const setToday = () => {
    const d = new Date();
    setFromDate(startOfDay(d));
    setToDate(endOfDay(d));
    fetchSummary(startOfDay(d), endOfDay(d));
  };

  const setYesterday = () => {
    const d = subDays(new Date(), 1);
    setFromDate(startOfDay(d));
    setToDate(endOfDay(d));
    fetchSummary(startOfDay(d), endOfDay(d));
  };

  const setWeek = () => {
    const now = new Date();
    const from = startOfWeek(now, { weekStartsOn: 1 });
    const to = endOfDay(now);
    setFromDate(from);
    setToDate(to);
    fetchSummary(from, to);
  };

  const setMonth = () => {
    const now = new Date();
    const from = startOfMonth(now);
    const to = endOfDay(now);
    setFromDate(from);
    setToDate(to);
    fetchSummary(from, to);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* TABS */}
        <div className="flex gap-2 flex-wrap">
          <Tab active={tab === "medicines"} onClick={() => setTab("medicines")}>
            Dorilar
          </Tab>
          <Tab active={tab === "services"} onClick={() => setTab("services")}>
            Xizmatlar
          </Tab>
          <Tab active={tab === "store"} onClick={() => setTab("store")}>
            Ombor
          </Tab>
        </div>

        {/* DATE */}
        {tab !== "store" && (
          <div className="bg-white rounded-xl p-3 flex flex-wrap gap-2 items-center">
            <Btn onClick={setToday}>Bugun</Btn>
            <Btn onClick={setYesterday}>Kecha</Btn>
            <Btn onClick={setWeek}>Haftalik</Btn>
            <Btn onClick={setMonth}>Oylik</Btn>

            <div className="ml-auto text-xs text-gray-500">
              {format(fromDate, "dd.MM.yyyy")} — {format(toDate, "dd.MM.yyyy")}
            </div>
          </div>
        )}

        {/* KPI */}
        {tab !== "store" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Kpi title="Jami miqdor" value={totalQty} icon={<FiLayers />} />
            <Kpi
              title="Jami summa"
              value={`${totalSum.toLocaleString()} so‘m`}
              icon={<FiDollarSign />}
            />
            <Kpi
              title="Eng ko‘p ishlatilgan"
              value={topItem}
              icon={<FiTrendingUp />}
            />
            <Kpi title="Turlar soni" value={typesCount} icon={<FiBox />} />
          </div>
        )}

        {/* LIST */}
        <div className="bg-white rounded-xl p-4">
          {(tab === "store" ? store : summary).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-3 mb-2"
            >
              <div className="font-medium">{item.name || item._id}</div>

              {/* ===================== */}
              {/* OMBOR STATUS */}
              {/* ===================== */}
              {tab === "store" ? (
                item.quantity === 0 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                    QOLMADI
                  </span>
                ) : item.quantity <= 5 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white">
                    KAM QOLDI ({item.quantity})
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">
                    {item.quantity} dona
                  </span>
                )
              ) : (
                <span className="font-semibold text-brand-violet">
                  {item.sum.toLocaleString()} so‘m
                </span>
              )}
            </motion.div>
          ))}

          {!loading && tab !== "store" && summary.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              Ma’lumot topilmadi
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== */
/* UI */
function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        active
          ? "bg-brand-violet text-white"
          : "bg-white text-gray-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function Btn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full bg-slate-100 hover:bg-brand-violet hover:text-white transition text-sm"
    >
      {children}
    </button>
  );
}

function Kpi({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="text-xs text-gray-400 flex items-center gap-1">
        {icon} {title}
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
