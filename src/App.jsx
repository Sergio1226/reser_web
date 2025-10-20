import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login/login.jsx";
import AdminPage from "./pages/admin.jsx";
import Bookings from "./pages/bookings/bookings.jsx";
import ModifyUser from "./pages/modifyUser.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
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
        <Route path="/unauthorized" element={<h1>No autorizado</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
