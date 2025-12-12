import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple placeholder: password is 'admin123'
    if (password === "admin123") {
      localStorage.setItem("staff", JSON.stringify({ loggedIn: true }));
      navigate("/staff-dashboard");
    } else {
      alert("Incorrect password!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Staff Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
