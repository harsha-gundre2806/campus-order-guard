import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ student, setStudent, staff, setStaff }) {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  // Load notifications for student
  const loadNotifications = () => {
    if (student) {
      const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
      const studentNotifications = allNotifications[student.rollNumber] || [];
      const unreadCount = studentNotifications.filter(n => !n.deleted && !n.read).length;
      setNotificationCount(unreadCount);
    } else {
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    loadNotifications();
    const handleStorageChange = () => loadNotifications();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [student]);

  const handleLogout = () => {
    if (student) {
      localStorage.removeItem("student");
      setStudent(null);
    }
    if (staff) {
      localStorage.removeItem("staff");
      setStaff(null);
    }
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Campus Order Guard</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/student-register">Student Registration</Link>

        {student || staff ? (
          <>
            {student && (
              <Link to="/student-dashboard" className="relative">
                Student Dashboard
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-2">
                    {notificationCount}
                  </span>
                )}
              </Link>
            )}
            {staff && <Link to="/staff-dashboard">Staff Dashboard</Link>}
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
