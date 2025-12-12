import { useState, useEffect } from "react";

export default function StudentDashboard() {
  const student = JSON.parse(localStorage.getItem("student"));
  const [notifications, setNotifications] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const loadNotifications = () => {
    if (student) {
      const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
      const studentNotifications = Array.isArray(allNotifications[student.rollNumber])
        ? allNotifications[student.rollNumber]
        : [];
      setNotifications(studentNotifications.filter(n => !n.deleted));
      setDeletedNotifications(studentNotifications.filter(n => n.deleted));
    }
  };

  useEffect(() => {
    loadNotifications();
    const handleStorageChange = () => loadNotifications();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [student]);

  // Update a notification field safely by index
  const updateNotification = (index, field, value, isDeleted = false) => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
    const studentNotifications = Array.isArray(allNotifications[student.rollNumber])
      ? allNotifications[student.rollNumber]
      : [];

    // Determine which array we're updating
    const targetArray = isDeleted ? deletedNotifications : notifications;
    const actualIndex = studentNotifications.indexOf(targetArray[index]);

    if (actualIndex !== -1) {
      studentNotifications[actualIndex][field] = value;
      allNotifications[student.rollNumber] = studentNotifications;
      localStorage.setItem("notifications", JSON.stringify(allNotifications));
      loadNotifications();
    }
  };

  const handleDelete = (index) => {
    // Delete from active notifications
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
    const studentNotifications = Array.isArray(allNotifications[student.rollNumber])
      ? allNotifications[student.rollNumber]
      : [];

    // Move the notification to deleted
    const notification = notifications[index];
    if (notification) {
      studentNotifications[index].deleted = true;
      allNotifications[student.rollNumber] = studentNotifications;
      localStorage.setItem("notifications", JSON.stringify(allNotifications));
      loadNotifications();
    }
  };

  const handleMarkRead = (index) => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
    const studentNotifications = Array.isArray(allNotifications[student.rollNumber])
      ? allNotifications[student.rollNumber]
      : [];

    const notification = notifications[index];
    if (notification) {
      studentNotifications[index].read = true;
      allNotifications[student.rollNumber] = studentNotifications;
      localStorage.setItem("notifications", JSON.stringify(allNotifications));
      loadNotifications();
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Student Dashboard</h2>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => { setShowNotifications(!showNotifications); setShowDeleted(false); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Notifications ({notifications.length})
        </button>
        <button
          onClick={() => { setShowDeleted(!showDeleted); setShowNotifications(false); }}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Deleted Notifications ({deletedNotifications.length})
        </button>
      </div>

      {/* Active Notifications */}
      {showNotifications && (
        <div className="bg-gray-100 p-4 rounded shadow mb-4">
          {notifications.length === 0 ? (
            <p>No notifications.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {notifications.map((n, index) => (
                <li key={index} className="flex justify-between items-center">
                  <div>
                    <span className={`${n.read ? "text-gray-500" : "font-semibold"}`}>
                      {n.message}
                    </span>
                    <div className="text-xs text-gray-500">{n.timestamp}</div>
                  </div>
                  <div className="space-x-2">
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(index)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Deleted Notifications */}
      {showDeleted && (
        <div className="bg-gray-50 p-4 rounded shadow mb-4">
          {deletedNotifications.length === 0 ? (
            <p>No deleted notifications.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {deletedNotifications.map((n, index) => (
                <li key={index}>
                  <span>{n.message}</span>
                  <div className="text-xs text-gray-500">{n.timestamp}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {student && (
        <p className="mt-4">
          Welcome, <span className="font-semibold">{student.rollNumber}</span>!
        </p>
      )}
    </div>
  );
}
