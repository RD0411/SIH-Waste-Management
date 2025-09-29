import React, { useState } from "react";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import FleetView from "./FleetView";
import IssuesView from "./IssuesView";
import EnforcementView from "./EnforcementView";
import ChampionsView from "./ChampionsView";
import RouteManagementView from "./RouteManagementView";
import InventoryManagement from "./Inventory/InventoryManagement";
import EventsManagement from "./Events/EventsManagement";
import TrainingManagement from "./Training/TrainingManagement";
export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleNavClick = (itemName) => setActiveItem(itemName);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar component */}
      <Navbar activeItem={activeItem} setActiveItem={handleNavClick} />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 4 }}>
        <Routes>
          <Route path="/" element={<RouteManagementView />} />
          <Route path="/fleet" element={<FleetView />} />
          <Route path="/issues" element={<IssuesView />} />
          <Route path="/enforcement" element={<EnforcementView />} />
          <Route path="/champions" element={<ChampionsView />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="/events" element={<EventsManagement />} />
          <Route path="/training" element={<TrainingManagement />} />
        </Routes>
      </Box>
    </Box>
  );
}
