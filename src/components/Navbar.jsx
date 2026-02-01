import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser,
  FiPackage,
  FiRefreshCw,
  FiLogOut,
  FiTruck,
} from "react-icons/fi";
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

  /* ================================================= */
  /* 🖥 MANAGER — DESKTOP */
  /* ================================================= */
  if (role === "manager") {
    return (
      <>
        <header className="hidden lg:flex bg-white/70 backdrop-blur-xl border-b px-6 py-3 items-center justify-between">
          <span className="font-semibold text-brand-violet text-lg">
            Sampi Medline
          </span>

          <div className="flex gap-3">
            <button
              onClick={refresh}
              className="p-2 rounded-xl hover:bg-black/5"
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

        <MobileManagerNav refresh={refresh} logout={logout} />
      </>
    );
  }

  /* ================================================= */
  /* 🚚 DELIVERY */
  /* ================================================= */
  if (role === "delivery") {
    return <MobileDeliveryNav />;
  }

  /* ================================================= */
  /* 🧑‍⚕️ NURSE */
  /* ================================================= */
  return <MobileNurseNav />;
}

/* ================================================= */
/* 📱 MOBILE BUTTON STYLE */
/* ================================================= */
const item = (active) =>
  `w-12 h-12 flex items-center justify-center rounded-xl transition
   ${
     active
       ? "bg-white/80 text-brand-violet"
       : "text-gray-600 hover:bg-white/40"
   }`;

/* ================================================= */
/* 📱 NURSE NAV */
/* ================================================= */
function MobileNurseNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BottomNav>
      <NavBtn
        active={location.pathname === "/nurse"}
        onClick={() => navigate("/nurse")}
      >
        <FiUser size={28} />
      </NavBtn>

      <NavBtn
        active={location.pathname === "/nurse/services"}
        onClick={() => navigate("/nurse/services")}
      >
        <FiActivity size={28} />
      </NavBtn>

      <NavBtn
        active={location.pathname === "/nurse/medicines"}
        onClick={() => navigate("/nurse/medicines")}
      >
        <FiPackage size={28} />
      </NavBtn>

      <NavBtn onClick={() => window.location.reload()}>
        <FiRefreshCw size={28} />
      </NavBtn>

      <NavBtn
        danger
        onClick={() => {
          localStorage.clear();
          navigate("/login", { replace: true });
        }}
      >
        <FiLogOut size={28} />
      </NavBtn>
    </BottomNav>
  );
}

/* ================================================= */
/* 📱 DELIVERY NAV (YANGI 🔥) */
/* ================================================= */
function MobileDeliveryNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BottomNav width="w-[70%]">
      <NavBtn onClick={() => window.location.reload()}>
        <FiRefreshCw size={30} />
      </NavBtn>

      <NavBtn
        danger
        onClick={() => {
          localStorage.clear();
          navigate("/login", { replace: true });
        }}
      >
        <FiLogOut size={30} />
      </NavBtn>
    </BottomNav>
  );
}

/* ================================================= */
/* 📱 MANAGER NAV */
/* ================================================= */
function MobileManagerNav({ refresh, logout }) {
  return (
    <BottomNav width="w-[50%]">
      <NavBtn onClick={refresh}>
        <FiRefreshCw size={32} />
      </NavBtn>

      <NavBtn danger onClick={logout}>
        <FiLogOut size={32} />
      </NavBtn>
    </BottomNav>
  );
}

/* ================================================= */
/* 🧩 SHARED COMPONENTS */
/* ================================================= */
function BottomNav({ children, width = "w-[92%]" }) {
  return (
    <nav
      className={`
        fixed bottom-[calc(env(safe-area-inset-bottom)+16px)]
        left-1/2 -translate-x-1/2
        ${width} max-w-md z-[999] lg:hidden
      `}
    >
      <div
        className="flex justify-around items-center px-4 py-3 rounded-3xl
        bg-white/55 backdrop-blur-2xl border border-white/40
        shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
      >
        {children}
      </div>
    </nav>
  );
}

function NavBtn({ children, onClick, active, danger }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={
        danger
          ? "w-12 h-12 flex items-center justify-center rounded-xl text-brand-red hover:bg-red-50"
          : item(active)
      }
    >
      {children}
    </motion.button>
  );
}
