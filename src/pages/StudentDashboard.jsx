import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// --- Background Animation Component (Slow Floating Parcels) ---
function BackgroundAnimation() {
  const parcels = [...Array(30)]; // Number of floating parcels

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {parcels.map((_, i) => {
        const size = 18 + Math.random() * 12; // 18-30px
        const startX = Math.random() * 100; // % horizontal start
        const startY = Math.random() * 100; // % vertical start
        const duration = 200 + Math.random() * 100; // 200-300s for ultra-slow drift
        const delay = Math.random() * 50; // stagger start
        const directionX = (Math.random() - 0.5) * 200; // random horizontal drift
        const directionY = (Math.random() - 0.5) * 150; // random vertical drift

        return (
          <div
            key={i}
            className="absolute text-2xl"
            style={{
              fontSize: `${size}px`,
              left: `${startX}%`,
              top: `${startY}%`,
              animation: `floatAsteroid ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              opacity: 0.05 + Math.random() * 0.1,
              '--dx': `${directionX}px`,
              '--dy': `${directionY}px`,
            }}
          >
            📦
          </div>
        );
      })}

      <style>
        {`
          @keyframes floatAsteroid {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(calc(var(--dx)/2), calc(var(--dy)/2)) rotate(45deg); }
            50% { transform: translate(var(--dx), var(--dy)) rotate(90deg); }
            75% { transform: translate(calc(var(--dx)/2), calc(var(--dy)/2)) rotate(135deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
// --- End Background Animation Component ---


export default function StudentDashboard() {
  const student = JSON.parse(localStorage.getItem("student"));
  const [notifications, setNotifications] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    if (!student) return;

    const notifRef = doc(db, "notifications", student.rollNumber);

    const unsubscribe = onSnapshot(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const messages = snapshot.data().messages || [];
        setNotifications(messages.filter((n) => !n.deleted));
        setDeletedNotifications(messages.filter((n) => n.deleted));
      } else {
        setNotifications([]);
        setDeletedNotifications([]);
      }
    });

    return () => unsubscribe();
  }, [student]);

  const handleMarkRead = async (index) => {
    const notifRef = doc(db, "notifications", student.rollNumber);
    const message = notifications[index];
    if (!message) return;

    const allMessages = [...notifications, ...deletedNotifications];
    const msgIndex = allMessages.findIndex(
      (m) => m.timestamp === message.timestamp && m.message === message.message
    );

    if (msgIndex !== -1) {
      allMessages[msgIndex].read = true;
      await updateDoc(notifRef, { messages: allMessages });
    }
  };

  const handleDelete = async (index) => {
    const notifRef = doc(db, "notifications", student.rollNumber);
    const message = notifications[index];
    if (!message) return;

    const allMessages = [...notifications, ...deletedNotifications];
    const msgIndex = allMessages.findIndex(
      (m) => m.timestamp === message.timestamp && m.message === message.message
    );

    if (msgIndex !== -1) {
      allMessages[msgIndex].deleted = true;
      await updateDoc(notifRef, { messages: allMessages });
    }
  };

  if (!student) {
    return (
      <div className="p-8 max-w-2xl mx-auto relative overflow-hidden min-h-screen">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p>You must be logged in as a student to view this page.</p>
        <BackgroundAnimation />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto relative overflow-hidden min-h-screen">
      <BackgroundAnimation />

      <h2 className="text-3xl font-bold mb-6 relative z-10">Student Dashboard</h2>

      <div className="flex space-x-4 mb-4 relative z-10">
        <button
          onClick={() => { setShowNotifications(true); setShowDeleted(false); }}
          className={`px-4 py-2 rounded transition ${showNotifications ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}`}
        >
          Notifications ({notifications.length})
        </button>
        <button
          onClick={() => { setShowDeleted(true); setShowNotifications(false); }}
          className={`px-4 py-2 rounded transition ${showDeleted ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
        >
          Deleted Notifications ({deletedNotifications.length})
        </button>
      </div>

      {/* Active Notifications */}
      {showNotifications && (
        <div className="bg-white p-4 rounded shadow-lg mb-4 relative z-10 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2">Active Notifications</h3>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No active notifications. Time to relax!</p>
          ) : (
            <ul className="list-none space-y-3">
              {notifications.map((n, index) => (
                <li key={index} className={`flex justify-between items-center p-3 rounded-lg border transition-all ${n.read ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"}`}>
                  <div>
                    <span className={`${n.read ? "text-gray-500" : "font-semibold text-gray-800"}`}>
                      {n.message}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="space-x-2 flex items-center">
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(index)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm p-1 rounded hover:bg-green-100 transition"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm p-1 rounded hover:bg-red-100 transition"
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
        <div className="bg-white p-4 rounded shadow-lg mb-4 relative z-10 transition-all duration-300">
          <h3 className="text-xl font-semibold mb-3 border-b pb-2">Deleted Notifications</h3>
          {deletedNotifications.length === 0 ? (
            <p className="text-gray-500">No deleted notifications.</p>
          ) : (
            <ul className="list-none space-y-3">
              {deletedNotifications.map((n, index) => (
                <li key={index} className="p-3 rounded-lg border bg-gray-100 text-gray-500">
                  <span className="line-through">{n.message}</span>
                  <div className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="mt-4 relative z-10 text-gray-700">
        Welcome, <span className="font-bold text-teal-600">{student.rollNumber}</span>!
      </p>
    </div>
  );
}
