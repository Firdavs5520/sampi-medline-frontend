import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Nurse from "./pages/Nurse";
import Medicines from "./pages/Medicines";
import NurseServices from "./pages/NurseServices";
import Manager from "./pages/Manager";
import Delivery from "./pages/Delivery";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* NURSE */}
      <Route element={<ProtectedRoute roles={["nurse"]} />}>
        <Route element={<DashboardLayout role="nurse" />}>
          <Route path="/nurse" element={<Nurse />} />
          <Route path="/nurse/medicines" element={<Medicines />} />
          <Route path="/nurse/services" element={<NurseServices />} />
        </Route>
      </Route>

      {/* MANAGER */}
      <Route element={<ProtectedRoute roles={["manager"]} />}>
        <Route element={<DashboardLayout role="manager" />}>
          <Route path="/manager" element={<Manager />} />
        </Route>
      </Route>
      {/* DELIVERY */}
      <Route element={<ProtectedRoute role="delivery" />}>
        <Route path="/delivery" element={<Delivery />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
