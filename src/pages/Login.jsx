import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { FaClinicMedical } from "react-icons/fa";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ===================== */
  /* AUTO LOGIN */
  /* ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      navigate(role === "manager" ? "/manager" : "/nurse", {
        replace: true,
      });
    }
  }, [navigate]);

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

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role } = res.data;

      if (!token || !role) {
        throw new Error("Auth xato");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Muvaffaqiyatli kirildi");

      setTimeout(() => {
        navigate(role === "manager" ? "/manager" : "/nurse", {
          replace: true,
        });
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Login yoki parol noto‘g‘ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient px-4">
      <Toaster position="top-center" reverseOrder={false} />

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

        {/* TITLE */}
        <h1 className="mt-10 text-3xl font-bold text-center text-brand-dark">
          Sampi Medline
        </h1>
        <p className="text-center text-gray-500 mt-1 mb-8">
          Klinikani boshqarish tizimi
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div className="relative">
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-violet focus:border-brand-violet outline-none transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-brand-violet focus:border-brand-violet outline-none transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-violet"
            >
              {showPassword ? (
                <HiOutlineEyeOff size={22} />
              ) : (
                <HiOutlineEye size={22} />
              )}
            </button>
          </div>

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-brand-red hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {loading ? "⏳ Kirilmoqda..." : "Kirish"}
          </motion.button>
        </form>

        {/* FOOTER */}
        <p className="text-xs text-center text-gray-400 mt-8">
          © {new Date().getFullYear()} Sampi Medline
        </p>
      </motion.div>
    </div>
  );
}
