import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Login({ setStaff, setStudent }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Staff login
    if (trimmedUsername === "staff" && trimmedPassword === "admin123") {
      const staffData = { loggedIn: true };
      localStorage.setItem("staff", JSON.stringify(staffData));
      setStaff(staffData);
      setUsername("");
      setPassword("");
      setLoading(false);
      navigate("/staff-dashboard");
      return;
    }

    try {
      let emailToUse = trimmedUsername;

      // If roll number, fetch email
      if (!trimmedUsername.includes("@")) {
        const studentRef = doc(db, "students", trimmedUsername);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          setError("Invalid roll number or password");
          setLoading(false);
          return;
        }

        emailToUse = studentSnap.data().email;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        trimmedPassword
      );

      const studentData = {
        uid: userCredential.user.uid,
        rollNumber: trimmedUsername.includes("@") ? null : trimmedUsername,
      };

      localStorage.setItem("student", JSON.stringify(studentData));
      setStudent(studentData);

      setUsername("");
      setPassword("");
      navigate("/student-dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* ✅ Full screen loader */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-gray-700 font-semibold">Logging in...</p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full p-6 bg-white shadow rounded z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Email or Roll Number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Password field */}
          <div className="relative">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 pr-10 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
