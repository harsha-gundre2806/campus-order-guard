import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    setStudent(JSON.parse(localStorage.getItem("student")));
    setStaff(JSON.parse(localStorage.getItem("staff")));
  }, []);

  const handleStudentLogout = () => {
    localStorage.removeItem("student");
    setStudent(null);
    navigate("/student-login");
  };

  const handleStaffLogout = () => {
    localStorage.removeItem("staff");
    setStaff(null);
    navigate("/staff-login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Campus Order Guard</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        {!student && <Link to="/student-register">Student Register</Link>}
        {!student && <Link to="/student-login">Student Login</Link>}
        {student && (
          <>
            <span>Student: {student.rollNumber}</span>
            <button
              onClick={handleStudentLogout}
              className="bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        )}
        {!staff && <Link to="/staff-login">Staff Login</Link>}
        {staff && staff.loggedIn && (
          <>
            <span>Staff</span>
            <button
              onClick={handleStaffLogout}
              className="bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
