import { useEffect, useState } from "react";
import axios from "axios";

function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [name, setName] = useState("");
  const [driverId, setDriverId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/routes")
      .then(res => setRoutes(res.data))
      .catch(err => console.error(err));
  }, []);

  const createRoute = () => {
    axios.post("http://localhost:5000/api/routes", {
      driverId,
      name,
      stops: [
        { lat: 18.4516, lng: 73.8544, label: "Source" },
        { lat: 18.5018, lng: 73.8636, label: "Destination" }
      ]
    }).then(() => alert("Route created"));
  };

  return (
    <div>
      <h2>Routes</h2>
      <div>
        <input placeholder="Route Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Driver ID" value={driverId} onChange={e=>setDriverId(e.target.value)} />
        <button onClick={createRoute}>Create</button>
      </div>

      <ul>
        {routes.map(r => (
          <li key={r.id}>{r.name} → Driver: {r.driverId}</li>
        ))}
      </ul>
    </div>
  );
}
export default RoutesPage;
