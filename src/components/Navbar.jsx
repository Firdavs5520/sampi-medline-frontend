import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiPackage, FiRefreshCw, FiLogOut } from "react-icons/fi";
import { FiActivity } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const refresh = () => window.location.reload();

  const isActive = (path) => location.pathname === path;

  /* ================================================= */
  /* 🖥 MANAGER — DESKTOP TOP NAVBAR */
  /* ================================================= */
  if (role === "manager") {
    return (
      <>
        {/* DESKTOP */}
        <header
          className=" hidden lg:flex  top-0 left-0 right-0 z-50
          bg-white/70 backdrop-blur-xl
          border-b border-white/40
          px-6 py-3 
          items-center justify-between
        "
        >
          <span className="font-semibold text-brand-violet text-lg">
            Sampi Medline
          </span>

          <div className="flex gap-3 ">
            <button
              onClick={refresh}
              className="p-2 rounded-xl hover:bg-black/5 transition"
            >
              <FiRefreshCw size={20} />
            </button>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-brand-red text-white"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </header>

        {/* MOBILE → bottom */}
        <MobileManagerNav refresh={refresh} logout={logout} />
      </>
    );
  }

  /* ================================================= */
  /* 🧑‍⚕️ NURSE — MOBILE ONLY */
  /* ================================================= */
  return <MobileNurseNav />;
}

/* ================================================= */
/* 📱 MOBILE NURSE NAVBAR */
/* ================================================= */
function MobileNurseNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const item = (active) =>
    `w-12 h-12 flex items-center justify-center rounded-xl
     transition
     ${active ? "bg-white/80 text-brand-violet" : "text-gray-600 hover:bg-white/40"}
    `;

  return (
    <nav
      className="
        fixed
        bottom-[calc(env(safe-area-inset-bottom)+16px)]
        left-1/2 -translate-x-1/2
        w-[92%] max-w-md
        z-[999]
        lg:hidden
      "
    >
      <div
        className="
          flex justify-around items-center
          px-4 py-3
          rounded-3xl
          bg-white/55 backdrop-blur-2xl
          border border-white/40
          shadow-[0_20px_50px_rgba(0,0,0,0.18)]
        "
      >
        {/* 👤 Nurse main */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/nurse")}
          className={item(location.pathname === "/nurse")}
        >
          <FiUser size={30} />
        </motion.button>

        {/* 🩺 Services */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/nurse/services")}
          className={item(location.pathname === "/nurse/services")}
        >
          <FiActivity size={30} />
        </motion.button>

        {/* 📦 Medicines */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/nurse/medicines")}
          className={item(location.pathname === "/nurse/medicines")}
        >
          <FiPackage size={30} />
        </motion.button>

        {/* 🔄 Refresh */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.reload()}
          className={item(false)}
        >
          <FiRefreshCw size={30} />
        </motion.button>

        {/* 🚪 Logout */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            localStorage.clear();
            navigate("/login", { replace: true });
          }}
          className="w-12 h-12 flex items-center justify-center
            rounded-xl text-brand-red hover:bg-red-50 transition"
        >
          <FiLogOut size={30} />
        </motion.button>
      </div>
    </nav>
  );
}

/* ================================================= */
/* 📱 MOBILE MANAGER NAVBAR */
/* ================================================= */
function MobileManagerNav({ refresh, logout }) {
  return (
    <nav
      className="
        fixed
        bottom-[calc(env(safe-area-inset-bottom)+16px)]
        left-1/2 -translate-x-1/2
        w-[50%] max-w-sm
        z-[999]
        lg:hidden
      "
    >
      <div
        className="
          flex justify-around items-center
          px-4 py-3
          rounded-3xl
          bg-white/55 backdrop-blur-2xl
          border border-white/40
          shadow-[0_20px_50px_rgba(0,0,0,0.18)]
        "
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={refresh}
          className="w-12 h-12 flex items-center justify-center rounded-full
            text-gray-700 hover:bg-black/5 transition"
        >
          <FiRefreshCw size={34} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={logout}
          className="w-12 h-12 flex items-center justify-center
            rounded-full text-brand-red "
        >
          <FiLogOut size={34} />
        </motion.button>
      </div>
    </nav>
  );
}
