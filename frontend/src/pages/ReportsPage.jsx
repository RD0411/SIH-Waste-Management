import { useEffect, useState } from "react";
import axios from "axios";

function ReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/reports")
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  const assignToDriver = (id) => {
    const driverId = prompt("Enter Driver ID to assign:");
    if (!driverId) return;
    axios.put(`http://localhost:5000/api/reports/assign/${id}`, { driverId })
      .then(() => alert("Assigned"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Reports</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Status</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.category || "-"}</td>
              <td>{r.status}</td>
              <td><button onClick={() => assignToDriver(r.id)}>Assign</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ReportsPage;
