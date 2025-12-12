import { useState, useEffect } from "react";

export default function SearchStudent() {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    mobile: "",
    rollNumber: "",
  });

  // Load students on start
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("students")) || [];
    setStudents(stored);
  }, []);

  // Update filter values
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply search filters
  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      s.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      s.mobile.includes(filters.mobile) &&
      s.rollNumber.toLowerCase().includes(filters.rollNumber.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Search Students</h2>

      {/* Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <input
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Search by Name"
          className="p-2 border rounded w-full"
        />

        <input
          name="email"
          value={filters.email}
          onChange={handleFilterChange}
          placeholder="Search by Email"
          className="p-2 border rounded w-full"
        />

        <input
          name="mobile"
          value={filters.mobile}
          onChange={handleFilterChange}
          placeholder="Search by Mobile Number"
          className="p-2 border rounded w-full"
        />

        <input
          name="rollNumber"
          value={filters.rollNumber}
          onChange={handleFilterChange}
          placeholder="Search by Roll Number"
          className="p-2 border rounded w-full"
        />

      </div>

      {/* Student results */}
      <div className="bg-gray-50 p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Student List</h3>

        {filteredStudents.length === 0 ? (
          <p>No matching students found.</p>
        ) : (
          <ul className="space-y-3">
            {filteredStudents.map((student, i) => (
              <li
                key={i}
                className="border p-3 rounded bg-white shadow-sm"
              >
                <p><span className="font-semibold">Name:</span> {student.name}</p>
                <p><span className="font-semibold">Email:</span> {student.email}</p>
                <p><span className="font-semibold">Mobile:</span> {student.mobile}</p>
                <p><span className="font-semibold">Roll No:</span> {student.rollNumber}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
