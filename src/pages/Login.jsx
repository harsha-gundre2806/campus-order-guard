import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setStaff, setStudent }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Staff login
    if (trimmedUsername === "staff" && trimmedPassword === "admin123") {
      const staffData = { loggedIn: true };
      localStorage.setItem("staff", JSON.stringify(staffData));
      setStaff(staffData);
      setUsername("");
      setPassword("");
      navigate("/staff-dashboard");
      return;
    }

    // Student login
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students.find(
      (s) => s.rollNumber === trimmedUsername && s.password === trimmedPassword
    );

    if (student) {
      const studentData = { rollNumber: student.rollNumber };
      localStorage.setItem("student", JSON.stringify(studentData));
      setStudent(studentData);
      setUsername("");
      setPassword("");
      navigate("/student-dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Username / Roll Number"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
