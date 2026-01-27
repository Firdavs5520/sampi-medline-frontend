import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    localStorage.clear();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data;

      if (!token || !role) {
        throw new Error("Auth data xato");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "nurse") {
        navigate("/nurse", { replace: true });
      } else if (role === "manager") {
        navigate("/manager", { replace: true });
      } else {
        throw new Error("Role noto‘g‘ri");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Login yoki parol noto‘g‘ri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-100 to-teal-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-700 mb-1">
          Sampi Medline
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Klinikani boshqarish tizimi
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Parol</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold
                       disabled:opacity-60"
          >
            {loading ? "⏳ Kirilmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          © {new Date().getFullYear()} Sampi Medline
        </p>
      </div>
    </div>
  );
}
