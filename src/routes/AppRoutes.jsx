import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import OrphanageLayout from "../layouts/OrphanageLayout";
import ParentLayout from "../layouts/ParentLayout";
import AdminDashboard from "../pages/AdminDashboard";
import Alerts from "../pages/Alerts";
import Children from "../pages/Children";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import OrphanageDashboard from "../pages/OrphanageDashboard";
import Orphanages from "../pages/Orphanages";
import ParentDashboard from "../pages/ParentDashboard";
import Profile from "../pages/Profile";
import Reports from "../pages/Reports";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="children" element={<Children />} />
          <Route path="orphanages" element={<Orphanages />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Alerts />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["orphanage"]} />}>
        <Route path="/orphanage" element={<OrphanageLayout />}>
          <Route index element={<OrphanageDashboard />} />
          <Route path="children" element={<Children />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
