import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import RegistUser from "./pages/registUser.jsx";
import LoginAdmin from "./pages/loginAdmin.jsx";
import AdminPage from "./pages/admin.jsx";
import Bookings from "./pages/bookings.jsx"
import SeeBookings from "./pages/seeBookings.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registUser" element={<RegistUser />} />
          <Route path="/loginAdmin" element={<LoginAdmin />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/seeBookings" element={<SeeBookings />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
