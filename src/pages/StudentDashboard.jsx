export default function StudentDashboard() {
  const student = JSON.parse(localStorage.getItem("student"));

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Student Dashboard</h2>
      {student ? (
        <p>Welcome, Roll Number: <span className="font-semibold">{student.rollNumber}</span></p>
      ) : (
        <p>Please log in to see your dashboard.</p>
      )}
    </div>
  );
}
