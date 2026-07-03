import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import OrphanageLayout from "../layouts/OrphanageLayout";
import ParentLayout from "../layouts/ParentLayout";
import AdminDashboard from "../pages/AdminDashboard";
import Alerts from "../pages/Alerts";
import ChildProfile from "../pages/ChildProfile";
import Children from "../pages/Children";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import OrphanageDashboard from "../pages/OrphanageDashboard";
import OrphanageDetail from "../pages/OrphanageDetail";
import OrphanageFullProfile from "../pages/OrphanageFullProfile";
import ManageVisitRequests from "../pages/ManageVisitRequests";
import Orphanages from "../pages/Orphanages";
import ParentDashboard from "../pages/ParentDashboard";
import ParentProfile from "../pages/ParentProfile";
import Profile from "../pages/Profile";
import RegisterChild from "../pages/RegisterChild";
import RegisterOrphanage from "../pages/RegisterOrphanage";
import Reports from "../pages/Reports";
import VisitRequest from "../pages/VisitRequest";
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
          <Route path="children/:childId" element={<ChildProfile />} />
          <Route path="parent-profiles/:parentId" element={<ParentProfile />} />
          <Route path="register-child" element={<RegisterChild />} />
          <Route path="register-orphanage" element={<RegisterOrphanage />} />
          <Route path="orphanages" element={<Orphanages />} />
          <Route path="orphanages/:orphanageId" element={<OrphanageDetail />} />
          <Route path="orphanages/:orphanageId/profile" element={<OrphanageFullProfile />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="visit-request" element={<VisitRequest />} />
          <Route path="notifications" element={<Alerts />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["orphanage"]} />}>
        <Route path="/orphanage" element={<OrphanageLayout />}>
          <Route index element={<OrphanageDashboard />} />
          <Route path="visit-requests" element={<ManageVisitRequests />} />
          <Route path="children" element={<Children />} />
          <Route path="children/:childId" element={<ChildProfile />} />
          <Route path="parent-profiles/:parentId" element={<ParentProfile />} />
          <Route path="register-child" element={<RegisterChild />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
