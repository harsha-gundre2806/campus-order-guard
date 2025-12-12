import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StudentRegister from "./pages/StudentRegister";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";

// Private route for students
function PrivateRoute({ student, children }) {
  return student ? children : <Navigate to="/login" replace />;
}

// Private route for staff
function StaffRoute({ staff, children }) {
  return staff ? children : <Navigate to="/login" replace />;
}

function App() {
  const [student, setStudent] = useState(
    JSON.parse(localStorage.getItem("student")) || null
  );
  const [staff, setStaff] = useState(
    JSON.parse(localStorage.getItem("staff")) || null
  );

  return (
    <Router>
      <Navbar
        student={student}
        setStudent={setStudent}
        staff={staff}
        setStaff={setStaff}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route
          path="/login"
          element={<Login setStudent={setStudent} setStaff={setStaff} />}
        />
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoute student={student}>
              <StudentDashboard setStudent={setStudent} />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <StaffRoute staff={staff}>
              <StaffDashboard setStaff={setStaff} />
            </StaffRoute>
          }
        />
        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
