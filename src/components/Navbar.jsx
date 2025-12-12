import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="font-bold text-xl">Campus Order Guard</div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/student-register">Student Register</Link>
        <Link to="/student-login">Student Login</Link>
        <Link to="/staff-dashboard">Staff Dashboard</Link>
      </div>
    </nav>
  );
}
