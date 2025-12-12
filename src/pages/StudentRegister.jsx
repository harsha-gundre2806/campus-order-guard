import { useState } from "react";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    rollNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we just show an alert. You can replace with API call later.
    alert(
      `Student Registered:\nName: ${form.name}\nEmail: ${form.email}\nMobile: ${form.mobile}\nRoll No: ${form.rollNumber}`
    );
    setForm({ name: "", email: "", mobile: "", rollNumber: "", password: "" });
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
