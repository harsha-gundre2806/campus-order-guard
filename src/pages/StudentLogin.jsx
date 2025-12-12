import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [form, setForm] = useState({ rollNumber: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login: in a real app, validate with backend
    // Store logged-in student info in localStorage
    localStorage.setItem(
      "student",
      JSON.stringify({ rollNumber: form.rollNumber })
    );

    // Redirect to Student Dashboard
    navigate("/student-dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Student Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="rollNumber"
          placeholder="Roll Number"
          value={form.rollNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          type="password"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
