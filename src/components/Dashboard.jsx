import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box, Drawer, AppBar as MuiAppBar, Toolbar, List, Typography,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReportIcon from '@mui/icons-material/Report';
import GavelIcon from '@mui/icons-material/Gavel';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import FleetView from './FleetView';
import IssuesView from './IssuesView';
import EnforcementView from './EnforcementView';
import ChampionsView from './ChampionsView';
import RouteManagementView from './RouteManagementView';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const mainMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Fleet Management', icon: <LocalShippingIcon />, path: '/fleet' },
  { text: 'Issue Resolution', icon: <ReportIcon />, path: '/issues' },
  { text: 'Enforcement', icon: <GavelIcon />, path: '/enforcement' },
  { text: 'Green Champions', icon: <GroupsIcon />, path: '/champions' },
  { text: 'Reports & Analytics', icon: <BarChartIcon />, path: '/analytics' },
];

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const currentPageTitle = mainMenuItems.find(item => item.path === location.pathname)?.text || 'Dashboard';

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            ULB Operator Portal - {currentPageTitle}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader />
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleMenuClick(item.path)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<RouteManagementView />} />
          <Route path="/fleet" element={<FleetView />} />
          <Route path="/issues" element={<IssuesView />} />
          <Route path="/enforcement" element={<EnforcementView />} />
          <Route path="/champions" element={<ChampionsView />} />
          <Route path="/analytics" element={<div>Analytics View - Coming Soon</div>} />
        </Routes>
      </Box>
    </Box>
  );
}