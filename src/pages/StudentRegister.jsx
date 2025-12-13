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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔍 Check if roll number already exists
      const studentRef = doc(db, "students", form.rollNumber);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        alert("This roll number is already registered!");
        return;
      }

      // 🔐 Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 🗄 Save student details in Firestore
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
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
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
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
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
