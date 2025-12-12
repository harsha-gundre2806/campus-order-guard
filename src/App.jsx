import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StudentRegister from "./pages/StudentRegister";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StaffLogin from "./pages/StaffLogin";

// PrivateRoute component to protect student dashboard
function PrivateRoute({ children }) {
  const student = JSON.parse(localStorage.getItem("student"));
  return student ? children : <Navigate to="/student-login" />;
}

// StaffRoute component to protect staff dashboard
function StaffRoute({ children }) {
  const staff = JSON.parse(localStorage.getItem("staff"));
  return staff && staff.loggedIn ? children : <Navigate to="/staff-login" />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route
          path="/staff-dashboard"
          element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
