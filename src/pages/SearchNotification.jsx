import { useState } from "react";

export default function SearchNotification() {
  const [rollNumber, setRollNumber] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [deletedNotifications, setDeletedNotifications] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const allNotifications = JSON.parse(localStorage.getItem("notifications")) || {};
    const studentNotifications = Array.isArray(allNotifications[rollNumber])
      ? allNotifications[rollNumber]
      : [];

    setNotifications(studentNotifications.filter(n => !n.deleted));
    setDeletedNotifications(studentNotifications.filter(n => n.deleted));
    setSearched(true);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Search Notifications</h2>

      <form onSubmit={handleSearch} className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {searched && (
        <>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Active Notifications</h3>
            {notifications.length === 0 ? (
              <p>No active notifications found for {rollNumber}.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {notifications.map((n, index) => (
                  <li key={index}>
                    {n.message}{" "}
                    <span className="text-xs text-gray-500">({n.timestamp})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Deleted Notifications</h3>
            {deletedNotifications.length === 0 ? (
              <p>No deleted notifications found for {rollNumber}.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {deletedNotifications.map((n, index) => (
                  <li key={index}>
                    {n.message}{" "}
                    <span className="text-xs text-gray-500">({n.timestamp})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
