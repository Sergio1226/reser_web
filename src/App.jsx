import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login/login.jsx";
import AdminPage from "./pages/admin/admin.jsx";
import Bookings from "./pages/bookings/bookings.jsx";
import ModifyUser from "./pages/modifyUser.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import DashBoard from "./pages/admin/dashboard.jsx";
import PageNotFound from "./pages/pageNotFound.jsx";
import BookingAdmin from "./pages/admin/bookingsAdmin.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modifyUser"
          element={
            <ProtectedRoute allowedRoles={["client", "admin"]}>
              <ModifyUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookingAdmin"
          element={
            <ProtectedRoute allowedRoles={ ["admin"]}>
              <BookingAdmin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
