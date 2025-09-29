// StateAnalystNavbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Analytics, Assessment, Policy } from "@mui/icons-material";

const StateAnalystNavbar = ({ activeItem, setActiveItem }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleNavigation = (path, itemName) => {
    setActiveItem(itemName);
    navigate(`/${path}`);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: "linear-gradient(135deg, #1a237e, #283593)" }}>
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Analytics sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mr: 2 }}>
            State Waste Management Analytics
          </Typography>
          <Chip 
            label="Analyst Dashboard" 
            color="secondary" 
            size="small" 
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button 
            color="inherit" 
            onClick={() => handleNavigation("", "dashboard")}
            startIcon={<Assessment />}
            sx={{ 
              fontWeight: activeItem === "dashboard" ? "bold" : "normal",
              backgroundColor: activeItem === "dashboard" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              borderRadius: 2
            }}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleNavigation("state-analysis-reports", "state-analysis-reports")}
            startIcon={<Analytics />}
            sx={{ 
              fontWeight: activeItem === "state-analysis-reports" ? "bold" : "normal",
              backgroundColor: activeItem === "state-analysis-reports" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              borderRadius: 2
            }}
          >
            Reports
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleNavigation("state-analysis-policy", "state-analysis-policy")}
            startIcon={<Policy />}
            sx={{ 
              fontWeight: activeItem === "state-analysis-policy" ? "bold" : "normal",
              backgroundColor: activeItem === "state-analysis-policy" ? "rgba(255, 255, 255, 0.1)" : "transparent",
              borderRadius: 2
            }}
          >
            Policy Tools
          </Button>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default StateAnalystNavbar;