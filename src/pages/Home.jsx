export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Campus Order Guard</h1>
      <p className="text-lg">Manage student registrations and dashboards seamlessly.</p>
      <button
  onClick={() => {
    localStorage.clear();
    alert("All local storage data cleared!");
    window.location.reload(); // Optional: reload to reset app state
  }}
  className="bg-red-600 text-white px-4 py-2 rounded"
>
  Clear Local Storage
</button>

    </div>
  );
}
