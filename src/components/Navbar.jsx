import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ student, setStudent, staff, setStaff }) {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Calculate navbar height dynamically to push content down
  const baseHeight = 64; // base height of navbar in pixels
  const menuHeight = isMenuOpen ? 160 : 0; // approximate menu height when open
  const totalHeight = baseHeight + menuHeight;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white z-50 shadow-md">
        <div className="flex justify-between items-center p-4">
          {/* Logo */}
          <div className="font-bold text-xl">Campus Order Guard</div>

          {/* Hamburger button (mobile) */}
          <button
            className="md:hidden block"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex md:space-x-4">
            <Link to="/">Home</Link>
            <Link to="/student-register">Student Registration</Link>
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
            {(student || staff) && (
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-2 py-1 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            )}
            {!student && !staff && <Link to="/login">Login</Link>}
          </div>
        </div>

        {/* Mobile Links */}
        {isMenuOpen && (
          <div className="flex flex-col md:hidden bg-blue-600 w-full">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/student-register"
              className="block px-4 py-2 hover:bg-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Student Registration
            </Link>
            {student && (
              <Link
                to="/student-dashboard"
                className="relative block px-4 py-2 hover:bg-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Student Dashboard
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-2 text-[10px] md:text-xs bg-red-500 rounded-full px-1.5">
                    {notificationCount}
                  </span>
                )}
              </Link>
            )}
            {staff && (
              <Link
                to="/staff-dashboard"
                className="block px-4 py-2 hover:bg-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Staff Dashboard
              </Link>
            )}
            {(student || staff) && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block px-4 py-2 text-blue-600 bg-white rounded hover:bg-gray-200"
              >
                Logout
              </button>
            )}
            {!student && !staff && (
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-blue-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Spacer to push content down */}
      <div style={{ height: isMenuOpen ? `${totalHeight}px` : `${baseHeight}px` }}></div>
    </>
  );
}
