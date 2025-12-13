import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    rollNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ NEW
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true); // ✅ show loader

    try {
      // Check roll number
      const studentRef = doc(db, "students", form.rollNumber);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        alert("This roll number is already registered!");
        setLoading(false);
        return;
      }

      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Save student
      await setDoc(studentRef, {
        uid: userCredential.user.uid,
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        rollNumber: form.rollNumber,
        createdAt: new Date(),
      });

      alert(`Student Registered Successfully!\nRoll No: ${form.rollNumber}`);

      setForm({
        name: "",
        email: "",
        mobile: "",
        rollNumber: "",
        password: "",
      });

      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* ✅ Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-700 font-semibold">
              Registering student...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full p-6 bg-white shadow rounded z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Student Registration
        </h2>

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
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
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

          {/* Password field */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
