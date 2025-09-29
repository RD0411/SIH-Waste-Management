// StateAnalystDashboard.jsx
import React, { useState } from "react";
import { Box } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import StateAnalystNavbar from "./StateAnalystNavbar";
import StateAnalystView from "./StateAnalystView";
import StateReportsView from "./StateReportsView";
import StatePolicyView from "./StatePolicyView";

export default function StateAnalystDashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const location = useLocation();

  // Update active item based on current path
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes("/state-analysis-reports")) {
      setActiveItem("state-analysis-reports");
    } else if (path.includes("/state-analysis-policy")) {
      setActiveItem("state-analysis-policy");
    } else {
      setActiveItem("dashboard");
    }
  }, [location]);

  const handleNavClick = (itemName) => setActiveItem(itemName);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* State Analyst Navbar component */}
      <StateAnalystNavbar activeItem={activeItem} setActiveItem={handleNavClick} />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
          <Route index element={<StateAnalystView />} />
          <Route path="state-analysis-reports" element={<StateReportsView />} />
          <Route path="state-analysis-policy" element={<StatePolicyView />} />
        </Routes>
      </Box>
    </Box>
  );
}