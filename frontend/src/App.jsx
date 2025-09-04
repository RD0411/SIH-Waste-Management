import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import RoutesPage from "./pages/RoutesPage";
import MarketplacePage from "./pages/MarketplacePage";
import StatsPage from "./pages/StatsPage";


function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <nav style={{ width: "200px", background: "#2C3E50", color: "#fff", padding: "20px" }}>
          <h2>Admin</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li><Link to="/users" style={{ color: "#fff" }}>Users</Link></li>
            <li><Link to="/reports" style={{ color: "#fff" }}>Reports</Link></li>
            <li><Link to="/routes" style={{ color: "#fff" }}>Routes</Link></li>
            <li><Link to="/marketplace" style={{ color: "#fff" }}>Marketplace</Link></li>
            <li><Link to="/stats" style={{ color: "#fff" }}>Statistics</Link></li>
          </ul>
        </nav>

        {/* Main */}
        <main style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
