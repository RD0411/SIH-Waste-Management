import { useEffect, useState } from "react";
import axios from "axios";

function StatsPage() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/api/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Statistics</h2>
      <ul>
        <li>Total Users: {stats.users}</li>
        <li>Total Reports: {stats.reports}</li>
        <li>Total Marketplace Items: {stats.marketplace}</li>
        <li>Total Routes: {stats.routes}</li>
      </ul>
    </div>
  );
}
export default StatsPage;
