import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { FaClinicMedical } from "react-icons/fa";

import api from "../api/axios";
import { isLoggedIn, getRole, setAuthData } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  /* ===================== */
  /* AUTO REDIRECT (AGAR OLDIN LOGIN BO‘LGAN BO‘LSA) */
  /* ===================== */
  useEffect(() => {
    if (isLoggedIn()) {
      const role = getRole();
      redirectByRole(role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectByRole = (role) => {
    if (role === "manager") {
      navigate("/manager", { replace: true });
    } else if (role === "nurse") {
      navigate("/nurse", { replace: true });
    } else if (role === "delivery") {
      navigate("/delivery", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  /* ===================== */
  /* LOGIN HANDLER */
  /* ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email va parolni kiriting");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Kirish tekshirilmoqda...");

    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        {
          timeout: 20000, // 🔥 Render cold start uchun
        },
      );

      const { token, role, user } = res.data;

      // 🔐 AUTH MA’LUMOTLARINI SAQLAYMIZ
      setAuthData({ token, role, user });

      toast.success("Muvaffaqiyatli kirdingiz", { id: toastId });

      // 🔥 KECHIKTIRMASDAN REDIRECT
      redirectByRole(role);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Email yoki parol noto‘g‘ri";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 relative"
      >
        {/* ICON */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-red text-white p-4 rounded-full shadow-lg">
          <FaClinicMedical size={32} />
        </div>

        <h1 className="mt-10 text-3xl font-bold text-center text-brand-dark">
          Sampi Medline
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-8">
          Klinikani boshqarish tizimi
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div className="relative" onClick={() => emailRef.current?.focus()}>
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3
                border rounded-xl
                focus:ring-2 focus:ring-brand-violet
                outline-none
              "
            />
          </div>

          {/* PASSWORD */}
          <div
            className="relative"
            onClick={() => passwordRef.current?.focus()}
          >
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full pl-12 pr-12 py-3
                border rounded-xl
                focus:ring-2 focus:ring-brand-violet
                outline-none
              "
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPassword((p) => !p);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <HiOutlineEyeOff size={22} />
              ) : (
                <HiOutlineEye size={22} />
              )}
            </button>
          </div>

          {/* SUBMIT */}
          <motion.button
            type="submit" // 🔥 MUHIM
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="
              w-full bg-brand-red hover:bg-red-700
              text-white py-3 rounded-xl font-semibold
              disabled:opacity-60
            "
          >
            {loading ? "Kutilmoqda..." : "Kirish"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
