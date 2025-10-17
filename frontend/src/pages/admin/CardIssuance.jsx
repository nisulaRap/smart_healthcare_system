import { useEffect, useState } from "react";
import axios from "../../api/axios";
import StatCard from "../../components/StatCard";

export default function CardIssuance() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch patients from backend
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err.message);
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.idNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleIssueCard = async (id) => {
    try {
      await axios.put(`/patients/${id}`, { status: "approved" });
      fetchPatients();
      alert("✅ Card issued successfully!");
    } catch (err) {
      console.error(err.message);
      alert("Failed to issue card.");
    }
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Health Card Issuance Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients Registered     👥"
          value={patients.length}
          color="bg-grey-200"
        />
        <StatCard
          title="Cards Issued   🗃️"
          value={patients.filter((p) => p.status === "approved").length}
          color="bg-grey-200"
        />
        <StatCard
          title="Pending Issuance   🕓"
          value={patients.filter((p) => p.status === "pending").length}
          color="bg-grey-200"
        />
        <StatCard
          title="Rejected Appointments  🚫 "
          value={patients.filter((p) => p.status === "rejected").length}
          color="bg-grey-200"
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Patient Name or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-blue-400"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/4 focus:outline-blue-400"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Health Card Issuance List
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-3 px-4 text-left text-blue-800">Patient ID</th>
              <th className="py-3 px-4 text-left text-blue-800">Patient Name</th>
              <th className="py-3 px-4 text-left text-blue-800">
                Registration Date
              </th>
              <th className="py-3 px-4 text-left text-blue-800">Status</th>
              <th className="py-3 px-4 text-center text-blue-800">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <tr key={p._id} className="border-t hover:bg-blue-50 transition">
                  <td className="py-2 px-4">{p._id}</td>
                  <td className="py-2 px-4">{p.name}</td>
                  <td className="py-2 px-4">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={p.status}
                      onChange={async (e) => {
                        try {
                          await axios.put(`/patients/${p._id}`, {
                            status: e.target.value,
                          });
                          fetchPatients();
                        } catch (err) {
                          console.error(err.message);
                        }
                      }}
                      className="p-1 border rounded-md focus:outline-blue-400"
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => alert(`Viewing details for ${p.name}`)}
                      className="px-3 py-1 text-xs rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleIssueCard(p._id)}
                      className="px-3 py-1 text-xs rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                    >
                      Issue Card
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
