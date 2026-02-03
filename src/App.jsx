import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Check from "./pages/Check";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Nurse from "./pages/Nurse";
import Medicines from "./pages/Medicines";
import NurseServices from "./pages/NurseServices";
import Manager from "./pages/Manager";
import Delivery from "./pages/Delivery";

import Toast from "./components/Toast";

export default function App() {
  return (
    <>
      {/* 🔔 GLOBAL TOAST */}
      <Toast />

      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* ✅ CHECK — LAYOUT YO‘Q, LEKIN HIMOYALANGAN */}
        <Route element={<ProtectedRoute roles={["nurse"]} />}>
          <Route path="/nurse/check/:orderId" element={<Check />} />
        </Route>

        {/* 👩‍⚕️ NURSE — DASHBOARD ICHIDA */}
        <Route element={<ProtectedRoute roles={["nurse"]} />}>
          <Route element={<DashboardLayout role="nurse" />}>
            <Route path="/nurse" element={<Nurse />} />
            <Route path="/nurse/medicines" element={<Medicines />} />
            <Route path="/nurse/services" element={<NurseServices />} />
          </Route>
        </Route>

        {/* 👨‍💼 MANAGER */}
        <Route element={<ProtectedRoute roles={["manager"]} />}>
          <Route element={<DashboardLayout role="manager" />}>
            <Route path="/manager" element={<Manager />} />
          </Route>
        </Route>

        {/* 🚚 DELIVERY */}
        <Route element={<ProtectedRoute role="delivery" />}>
          <Route path="/delivery" element={<Delivery />} />
        </Route>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
