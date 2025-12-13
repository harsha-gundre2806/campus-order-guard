import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Animation1 from "../pages/animation1"; // ✅ background animation

export default function StaffDashboard() {
  const staff = JSON.parse(localStorage.getItem("staff"));

  const [showSendForm, setShowSendForm] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [platform, setPlatform] = useState("Amazon");
  const [customPlatform, setCustomPlatform] = useState("");
  const [orderId, setOrderId] = useState("");
  const [otp, setOtp] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [allNotifications, setAllNotifications] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");

  const [sending, setSending] = useState(false); // ✅ loading state

  /* -------------------- Load students -------------------- */
  useEffect(() => {
    const studentsCol = collection(db, "students");
    const unsubscribe = onSnapshot(studentsCol, (snapshot) => {
      setStudents(snapshot.docs.map((d) => d.data()));
    });
    return () => unsubscribe();
  }, []);

  /* -------------------- Load notifications -------------------- */
  useEffect(() => {
    const notificationsCol = collection(db, "notifications");
    const unsubscribe = onSnapshot(notificationsCol, (snapshot) => {
      const notifObj = {};
      snapshot.docs.forEach((d) => {
        notifObj[d.id] = d.data().messages || [];
      });
      setAllNotifications(notifObj);
    });
    return () => unsubscribe();
  }, []);

  /* -------------------- Send Notification -------------------- */
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!rollNumber || !platform || !orderId || !otp) return;

    setSending(true); // ✅ show animation overlay

    try {
      const platformName =
        platform === "Other" ? customPlatform.trim() : platform;

      if (!/^\d{6}$/.test(otp)) {
        alert("OTP must be a 6-digit number");
        setSending(false);
        return;
      }

      const studentRef = doc(db, "students", rollNumber);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        alert("Student not registered");
        setSending(false);
        return;
      }

      const messageText = `Order from ${platformName} | Order ID: ${orderId} | OTP: ${otp}`;

      const notifRef = doc(db, "notifications", rollNumber);
      const notifSnap = await getDoc(notifRef);

      const newMessage = {
        message: messageText,
        timestamp: new Date().toISOString(),
        deleted: false,
        read: false,
      };

      if (notifSnap.exists()) {
        await updateDoc(notifRef, {
          messages: [...notifSnap.data().messages, newMessage],
        });
      } else {
        await setDoc(notifRef, { messages: [newMessage] });
      }

      setSuccessMsg(`Notification sent to ${rollNumber}`);
      setRollNumber("");
      setPlatform("Amazon");
      setCustomPlatform("");
      setOrderId("");
      setOtp("");

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Failed to send notification");
      console.error(err);
    } finally {
      setSending(false); // ✅ hide animation
    }
  };

  /* -------------------- Delete notification -------------------- */
  const handleDeleteNotification = async (roll, index) => {
    const notifRef = doc(db, "notifications", roll);
    const notifSnap = await getDoc(notifRef);

    if (notifSnap.exists()) {
      const updated = [...notifSnap.data().messages];
      if (updated[index]) {
        updated[index].deleted = true;
        await updateDoc(notifRef, { messages: updated });
      }
    }
  };

  if (!staff || !staff.loggedIn) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold">Access Denied</h2>
      </div>
    );
  }

  const filteredNotifications = Object.entries(allNotifications).filter(
    ([roll]) => roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.mobile.includes(studentSearch) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ✅ Background Animation */}
      <Animation1 />

      {/* ✅ Sending overlay animation */}
      {sending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
          <Animation1 />
          <p className="absolute bottom-20 text-lg font-semibold text-gray-700">
            Sending notification...
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="p-8 max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-6">Staff Dashboard</h2>

        <button
          onClick={() => setShowSendForm(!showSendForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          {showSendForm ? "Cancel" : "Send Notification"}
        </button>

        {showSendForm && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <form onSubmit={handleSendNotification} className="space-y-3">
              <input
                placeholder="Student Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option>Amazon</option>
                <option>Flipkart</option>
                <option>Meesho</option>
                <option>Blinkit</option>
                <option>Other</option>
              </select>

              {platform === "Other" && (
                <input
                  placeholder="Platform name"
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              )}

              <input
                placeholder="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </form>

            {successMsg && (
              <p className="text-green-600 mt-2">{successMsg}</p>
            )}
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
         <div className="bg-white p-4 rounded shadow mb-10">
                    <h3 className="font-semibold mb-2">All Notifications</h3>
                    {filteredNotifications.length === 0 ? (
                        <p>No notifications found.</p>
                    ) : (
                        <ul className="space-y-2">
                            {filteredNotifications.map(([roll, notes]) =>
                                notes.map((n, index) => (
                                    <li
                                        key={`${roll}-${index}`}
                                        className="border-b pb-1 flex justify-between items-center bg-gray-50 p-2 rounded"
                                    >
                                        <div>
                                            <span className="font-semibold text-blue-600">{roll}:</span> {n.message}
                                            <span className="text-xs text-gray-500"> ({new Date(n.timestamp).toLocaleString()})</span>
                                            {n.deleted && (
                                                <span className="text-red-500 text-xs ml-2 font-medium">Deleted</span>
                                            )}
                                            {n.read && !n.deleted && (
                                                <span className="text-green-500 text-xs ml-2 font-medium">Read by Student</span>
                                            )}
                                        </div>
                                        {!n.deleted && (
                                            <button
                                                onClick={() => handleDeleteNotification(roll, index)}
                                                className="text-red-600 hover:text-red-800 text-sm p-1 rounded transition"
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
<div className="bg-white p-4 rounded shadow">
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
                                <li key={i} className="border p-3 rounded bg-gray-50 shadow-sm text-sm">
                                    <p><strong className="text-blue-600">Roll:</strong> {s.rollNumber}</p>
                                    <p><strong>Name:</strong> {s.name}</p>
                                    <p><strong>Email:</strong> {s.email}</p>
                                    <p><strong>Mobile:</strong> {s.mobile}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <p className="mt-4 text-gray-700">Welcome, Staff! You are logged in.</p>


      </div>
    </div>
  );
}
