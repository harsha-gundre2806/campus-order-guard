import { useState, useEffect } from "react";

export default function StaffDashboard() {
  const staff = JSON.parse(localStorage.getItem("staff"));
  const [showSendForm, setShowSendForm] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [allNotifications, setAllNotifications] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  const loadNotifications = () => {
    const notifications = JSON.parse(localStorage.getItem("notifications")) || {};
    setAllNotifications(notifications);
  };

  const loadStudents = () => {
    const stored = JSON.parse(localStorage.getItem("students")) || [];
    setStudents(stored);
  };

  useEffect(() => {
    loadNotifications();
    loadStudents();

    const handleStorageChange = () => {
      loadNotifications();
      loadStudents();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSendClick = () => setShowSendForm(!showSendForm);

  // ✅ UPDATED: Allow sending only to registered students
  const handleSendNotification = (e) => {
    e.preventDefault();
    if (!rollNumber || !message) return;

    // Check if student exists
    const studentExists = students.some(
      (s) => s.rollNumber.toLowerCase() === rollNumber.toLowerCase()
    );

    if (!studentExists) {
      alert("Student not registered");
      return;
    }

    const notifications = JSON.parse(localStorage.getItem("notifications")) || {};
    if (!Array.isArray(notifications[rollNumber])) notifications[rollNumber] = [];

    notifications[rollNumber].push({
      message,
      timestamp: new Date().toLocaleString(),
      deleted: false,
      read: false,
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));
    setAllNotifications(notifications);

    setSuccessMsg(`Notification sent to ${rollNumber}`);
    setRollNumber("");
    setMessage("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteNotification = (roll, index) => {
    const notifications = JSON.parse(localStorage.getItem("notifications")) || {};

    if (notifications[roll] && Array.isArray(notifications[roll])) {
      notifications[roll][index].deleted = true;
      localStorage.setItem("notifications", JSON.stringify(notifications));
      loadNotifications();
    }
  };

  if (!staff || !staff.loggedIn) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p>You must be logged in as staff to view this page.</p>
      </div>
    );
  }

  const filteredNotifications = Object.entries(allNotifications).filter(([roll]) =>
    roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.mobile.includes(studentSearch) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase())
    );
  });

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Staff Dashboard</h2>

      <button
        onClick={handleSendClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        {showSendForm ? "Cancel" : "Send Notification"}
      </button>

      {showSendForm && (
        <div className="bg-gray-100 p-4 rounded shadow mb-6">
          <form onSubmit={handleSendNotification} className="space-y-3">
            <input
              placeholder="Student Roll Number"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Send
            </button>
          </form>
          {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
        </div>
      )}

      {/* Search notifications */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Roll Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Notifications */}
      <div className="bg-gray-50 p-4 rounded shadow mb-10">
        <h3 className="font-semibold mb-2">All Notifications</h3>

        {filteredNotifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <ul className="space-y-2">
            {filteredNotifications.map(([roll, notes]) =>
              notes.map((n, index) => (
                <li
                  key={`${roll}-${index}`}
                  className="border-b pb-1 flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold">{roll}:</span> {n.message}
                    <span className="text-xs text-gray-500"> ({n.timestamp})</span>
                    {n.deleted && (
                      <span className="text-red-500 text-xs ml-2">Deleted</span>
                    )}
                  </div>

                  {!n.deleted && (
                    <button
                      onClick={() => handleDeleteNotification(roll, index)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Students List */}
      <div className="bg-gray-100 p-4 rounded shadow">
        <h3 className="font-semibold mb-3">All Students</h3>

        <input
          type="text"
          placeholder="Search name, email, mobile, roll"
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {filteredStudents.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <ul className="space-y-3">
            {filteredStudents.map((s, i) => (
              <li key={i} className="border p-3 rounded bg-white shadow-sm">
                <p><strong>Name:</strong> {s.name}</p>
                <p><strong>Email:</strong> {s.email}</p>
                <p><strong>Mobile:</strong> {s.mobile}</p>
                <p><strong>Roll Number:</strong> {s.rollNumber}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4">Welcome, Staff! You are logged in.</p>
    </div>
  );
}
