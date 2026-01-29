import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Nurse from "./pages/Nurse";
import Medicines from "./pages/Medicines";
import Manager from "./pages/Manager";
import ProtectedRoute from "./components/ProtectedRoute";
import NurseLayout from "./layouts/NurseLayout";

export default function App() {
  return (
    <Routes className="font-golos">
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* NURSE */}
      <Route element={<ProtectedRoute role="nurse" />}>
        <Route element={<NurseLayout />}>
          <Route path="/nurse" element={<Nurse />} />
          <Route path="/nurse/medicines" element={<Medicines />} />
        </Route>
      </Route>

      {/* MANAGER */}
      <Route element={<ProtectedRoute role="manager" />}>
        <Route path="/manager" element={<Manager />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
