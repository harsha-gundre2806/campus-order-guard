import { useState, useEffect } from "react";
import { collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// --- Background Animation Component (Slow, Astroid-like Float) ---
function BackgroundAnimation() {
  // Use 20 parcels for subtle background noise
  const parcels = [...Array(20)]; 

  return (
    <>
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {parcels.map((_, i) => {
          const size = 18 + Math.random() * 12; // 18-30px font size
          const startX = Math.random() * 100; // % start position X
          const startY = Math.random() * 100; // % start position Y
          const duration = 150 + Math.random() * 100; // 150s - 250s for VERY slow float
          const delay = Math.random() * 50; // stagger start
          
          // Randomize a large offset (X and Y) for the final position
          const targetX = (Math.random() - 0.5) * 800; // -400px to +400px
          const targetY = (Math.random() - 0.5) * 600; // -300px to +300px

          return (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                fontSize: `${size}px`,
                left: `${startX}%`,
                top: `${startY}%`,
                animation: `floatSpace ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                opacity: 0.05 + Math.random() * 0.1, // Very subtle opacity
                
                // Set the non-animating properties (the random end point)
                '--end-x': `${targetX}px`,
                '--end-y': `${targetY}px`,
              }}
            >
              📦
            </div>
          );
        })}
      </div>

      {/* Global CSS Styles for Slow Floating Animation */}
      {/* We use CSS variables to allow each parcel to follow a unique, non-repeating path */}
      <style global jsx>
        {`
        @keyframes floatSpace {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            /* Moves from (0,0) to the randomized (targetX, targetY) over a long period */
            transform: translate(var(--end-x), var(--end-y)) rotate(360deg);
          }
        }
        `}
      </style>
    </>
  );
}
// --- End Background Animation Component ---


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

    // Load students from Firestore (real-time)
    useEffect(() => {
        const studentsCol = collection(db, "students");
        const unsubscribe = onSnapshot(studentsCol, (snapshot) => {
            const studentList = snapshot.docs.map(doc => doc.data());
            setStudents(studentList);
        });
        return () => unsubscribe();
    }, []);

    // Load notifications from Firestore (real-time)
    useEffect(() => {
        const notificationsCol = collection(db, "notifications");
        const unsubscribe = onSnapshot(notificationsCol, (snapshot) => {
            const notifObj = {};
            snapshot.docs.forEach(doc => {
                // Use doc.id (Roll Number) as the key
                notifObj[doc.id] = doc.data().messages || [];
            });
            setAllNotifications(notifObj);
        });
        return () => unsubscribe();
    }, []);

    const handleSendClick = () => setShowSendForm(!showSendForm);

    const handleSendNotification = async (e) => {
        e.preventDefault();
        if (!rollNumber || !platform || !orderId || !otp) return;

        // Determine the platform name
        const platformName = platform === "Other" ? customPlatform.trim() : platform;

        // Validate OTP
        if (!/^\d{6}$/.test(otp)) {
            alert("OTP must be a 6-digit number");
            return;
        }

        // Check if student exists
        const studentDocRef = doc(db, "students", rollNumber);
        const studentDoc = await getDoc(studentDocRef);
        if (!studentDoc.exists()) {
            alert("Student not registered");
            return;
        }

        // Compose the notification message
        const notificationMessage = `Order from ${platformName} | Order ID: ${orderId} | OTP: ${otp}`;

        const notifRef = doc(db, "notifications", rollNumber);
        const notifSnap = await getDoc(notifRef);

        const newMessage = {
            message: notificationMessage,
            timestamp: new Date().toISOString(),
            deleted: false,
            read: false,
        };

        if (notifSnap.exists()) {
            const existingMessages = notifSnap.data().messages || [];
            await updateDoc(notifRef, { messages: [...existingMessages, newMessage] });
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
    };

    const handleDeleteNotification = async (roll, messageIndex) => {
        const notifRef = doc(db, "notifications", roll);
        const notifSnap = await getDoc(notifRef);

        if (notifSnap.exists()) {
            const messages = notifSnap.data().messages || [];
            // Use spread to create a new array before modification to avoid state mutation warnings
            const updatedMessages = [...messages]; 
            
            // Mark the specific message as deleted
            if (updatedMessages[messageIndex]) {
                updatedMessages[messageIndex].deleted = true;
                await updateDoc(notifRef, { messages: updatedMessages });
            }
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

    const filteredStudents = students.filter((s) =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.mobile.includes(studentSearch) ||
        s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase())
    );

    return (
        <div className="p-8 max-w-3xl mx-auto relative min-h-screen overflow-hidden">
            {/* The Background Animation is placed here */}
            <BackgroundAnimation />

            {/* All main content needs a higher z-index to appear over the background */}
            <div className="relative z-10"> 
                <h2 className="text-3xl font-bold mb-6">Staff Dashboard</h2>

                <button
                    onClick={handleSendClick}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6"
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
                                    placeholder="Enter platform name"
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

                {/* Students List */}
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