import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-5 space-y-4" style={{ textAlign: "left" }}>
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/patientrecords" className="hover:text-yellow-300">Patient Records</Link>
          <Link to="/admin/cardissuance" className="hover:text-yellow-300">Card Issuance</Link>
          <Link to="/admin/appoinments" className="hover:text-yellow-300">Appoinments</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8" style={{ textAlign: "left" }}>
        <Outlet />
      </main>
    </div>
  );
}
