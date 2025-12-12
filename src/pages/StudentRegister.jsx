import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    rollNumber: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get existing students from localStorage
    const students = JSON.parse(localStorage.getItem("students")) || [];

    // Check if roll number already exists
    const existingStudent = students.find(s => s.rollNumber === form.rollNumber);
    if (existingStudent) {
      alert("This roll number is already registered!");
      return;
    }

    // Add new student
    students.push(form);
    localStorage.setItem("students", JSON.stringify(students));

    alert(`Student Registered Successfully!\nRoll No: ${form.rollNumber}`);

    // Clear form
    setForm({ name: "", email: "", mobile: "", rollNumber: "", password: "" });

    // Optionally redirect to login page
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Student Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          type="tel"
          className="w-full p-2 border rounded"
          required
        />
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
          Register
        </button>
      </form>
    </div>
  );
}
