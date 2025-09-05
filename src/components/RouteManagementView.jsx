import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, FormControl, InputLabel, IconButton,
  List, ListItem, ListItemText, ListItemSecondaryAction, Switch,
  Tab, Tabs, AppBar, Toolbar
} from '@mui/material';
import {
  Edit, Delete, Add, Directions, Assignment,
  Person, LocationOn, Schedule, AssignmentInd
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { auth } from '../firebase';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RouteManagementView = () => {
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [collectionSpots, setCollectionSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [spotDialogOpen, setSpotDialogOpen] = useState(false);
  const [driverAssignmentDialogOpen, setDriverAssignmentDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [routeForDriverAssignment, setRouteForDriverAssignment] = useState(null);
  const [selectedDriverForAssignment, setSelectedDriverForAssignment] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [mapCenter] = useState([12.9716, 77.5946]);

  // Mock data
  const mockDrivers = [
    { id: 1, name: "Rajesh Kumar", phone: "9876543210", vehicle: "KA01AB1234", is_available: true, current_route: null },
    { id: 2, name: "Suresh Patel", phone: "9765432109", vehicle: "KA01CD5678", is_available: true, current_route: null },
    { id: 3, name: "Mahesh Singh", phone: "9654321098", vehicle: "KA01EF9012", is_available: false, current_route: 1 },
  ];

  const mockCollectionSpots = [
    { id: 1, name: "Sunshine Apartments", address: "123 Main Street", lat: 12.9756, lng: 77.6006, type: "residential", frequency: "daily" },
    { id: 2, name: "Central Market", address: "456 Commercial Road", lat: 12.9686, lng: 77.5886, type: "commercial", frequency: "twice_daily" },
    { id: 3, name: "Green Valley Society", address: "789 Park Avenue", lat: 12.9736, lng: 77.5906, type: "residential", frequency: "daily" },
  ];

  const mockRoutes = [
    {
      id: 1,
      name: "Central Ward Morning Route",
      driver_id: 3,
      driver_name: "Mahesh Singh",
      spots: [1, 3],
      schedule: "mon_wed_fri",
      start_time: "08:00",
      end_time: "12:00",
      status: "active",
      assigned_date: new Date('2024-01-15')
    },
    {
      id: 2,
      name: "Commercial Area Route",
      driver_id: null,
      driver_name: null,
      spots: [2],
      schedule: "tue_thu_sat",
      start_time: "09:00",
      end_time: "13:00",
      status: "pending",
      assigned_date: null
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDrivers(mockDrivers);
      setRoutes(mockRoutes);
      setCollectionSpots(mockCollectionSpots);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAssignDriver = (route) => {
    setRouteForDriverAssignment(route);
    setSelectedDriverForAssignment(route.driver_id || '');
    setDriverAssignmentDialogOpen(true);
  };

  const handleSaveDriverAssignment = () => {
    if (!routeForDriverAssignment || !selectedDriverForAssignment) return;

    const driver = drivers.find(d => d.id === parseInt(selectedDriverForAssignment));
    
    // Update route with driver assignment
    const updatedRoutes = routes.map(route => 
      route.id === routeForDriverAssignment.id
        ? { ...route, driver_id: parseInt(selectedDriverForAssignment), driver_name: driver?.name, status: 'active', assigned_date: new Date() }
        : route
    );

    // Update driver availability and current route
    const updatedDrivers = drivers.map(d => {
      if (d.id === parseInt(selectedDriverForAssignment)) {
        return { ...d, current_route: routeForDriverAssignment.id, is_available: false };
      }
      // If driver was previously assigned to this route, make them available
      if (d.current_route === routeForDriverAssignment.id && d.id !== parseInt(selectedDriverForAssignment)) {
        return { ...d, current_route: null, is_available: true };
      }
      return d;
    });

    setRoutes(updatedRoutes);
    setDrivers(updatedDrivers);
    setDriverAssignmentDialogOpen(false);
  };

  const handleUnassignDriver = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    if (route && route.driver_id) {
      // Update driver availability
      const updatedDrivers = drivers.map(driver =>
        driver.id === route.driver_id
          ? { ...driver, current_route: null, is_available: true }
          : driver
      );

      // Remove driver from route
      const updatedRoutes = routes.map(r =>
        r.id === routeId
          ? { ...r, driver_id: null, driver_name: null, status: 'pending', assigned_date: null }
          : r
      );

      setDrivers(updatedDrivers);
      setRoutes(updatedRoutes);
    }
  };

  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.is_available);
  };

  const getRouteSpots = (route) => {
    return route.spots.map(spotId => collectionSpots.find(s => s.id === spotId)).filter(Boolean);
  };

  const getScheduleText = (schedule) => {
    const scheduleMap = {
      daily: 'Daily',
      mon_wed_fri: 'Mon, Wed, Fri',
      tue_thu_sat: 'Tue, Thu, Sat',
      weekly: 'Weekly',
      twice_daily: 'Twice Daily'
    };
    return scheduleMap[schedule] || schedule;
  };

  if (loading) return <Typography>Loading route data...</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Route & Driver Assignment
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setSpotDialogOpen(true)}
            sx={{ mr: 2 }}
          >
            Add Collection Spot
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAssignDialogOpen(true)}
          >
            Create New Route
          </Button>
        </Box>
      </Box>

      <AppBar position="static" color="default" sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Route Map" />
          <Tab label="Driver Assignment" />
          <Tab label="Collection Spots" />
        </Tabs>
      </AppBar>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, mb: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Collection Routes Map
              </Typography>
              <MapContainer center={mapCenter} zoom={12} style={{ height: '300px', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {collectionSpots.map(spot => (
                  <Marker key={spot.id} position={[spot.lat, spot.lng]}>
                    <Popup>
                      <div>
                        <strong>{spot.name}</strong><br />
                        {spot.address}<br />
                        Type: {spot.type}
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {routes.map(route => {
                  const spots = getRouteSpots(route);
                  if (spots.length > 1) {
                    const positions = spots.map(spot => [spot.lat, spot.lng]);
                    return <Polyline key={route.id} positions={positions} color={route.driver_id ? "blue" : "gray"} />;
                  }
                  return null;
                })}
              </MapContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Route Status Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography color="textSecondary">Total Routes</Typography>
                      <Typography variant="h5">{routes.length}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography color="textSecondary">Assigned</Typography>
                      <Typography variant="h5" color="success.main">
                        {routes.filter(r => r.driver_id).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography color="textSecondary">Pending</Typography>
                      <Typography variant="h5" color="warning.main">
                        {routes.filter(r => !r.driver_id).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography color="textSecondary">Active Drivers</Typography>
                      <Typography variant="h5">
                        {drivers.filter(d => d.is_available).length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Routes for Assignment
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Route Name</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Spots</TableCell>
                      <TableCell>Assigned Driver</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {routes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Directions sx={{ mr: 1, color: 'primary.main' }} />
                            {route.name}
                          </Box>
                        </TableCell>
                        <TableCell>{getScheduleText(route.schedule)}</TableCell>
                        <TableCell>
                          <Chip label={route.spots.length} size="small" />
                        </TableCell>
                        <TableCell>
                          {route.driver_name ? (
                            <Box>
                              <Typography variant="subtitle2">{route.driver_name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Assigned: {route.assigned_date ? new Date(route.assigned_date).toLocaleDateString() : 'N/A'}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography color="textSecondary">Unassigned</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={route.status.toUpperCase()}
                            color={route.status === 'active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {route.driver_id ? (
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleUnassignDriver(route.id)}
                            >
                              Unassign
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<AssignmentInd />}
                              onClick={() => handleAssignDriver(route)}
                            >
                              Assign Driver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Available Drivers
              </Typography>
              <List>
                {drivers.map((driver) => (
                  <ListItem key={driver.id} divider>
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Person sx={{ mr: 2, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2">{driver.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {driver.vehicle} • {driver.phone}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={driver.is_available ? 'AVAILABLE' : 'ON ROUTE'}
                          color={driver.is_available ? 'success' : 'default'}
                          size="small"
                        />
                        {driver.current_route && (
                          <Typography variant="body2" color="textSecondary">
                            Route: {routes.find(r => r.id === driver.current_route)?.name}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Driver Assignment Dialog */}
      <Dialog open={driverAssignmentDialogOpen} onClose={() => setDriverAssignmentDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Assign Driver to Route: {routeForDriverAssignment?.name}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ mb: 2 }}>
            Schedule: {routeForDriverAssignment && getScheduleText(routeForDriverAssignment.schedule)}
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel>Select Driver</InputLabel>
            <Select
              value={selectedDriverForAssignment}
              onChange={(e) => setSelectedDriverForAssignment(e.target.value)}
              label="Select Driver"
            >
              <MenuItem value="">Unassign</MenuItem>
              {getAvailableDrivers().map(driver => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.name} ({driver.vehicle}) - {driver.phone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedDriverForAssignment && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Route Details:
              </Typography>
              <Typography variant="body2">
                • {routeForDriverAssignment?.spots.length} collection spots
              </Typography>
              <Typography variant="body2">
                • Timing: {routeForDriverAssignment?.start_time} - {routeForDriverAssignment?.end_time}
              </Typography>
              <Typography variant="body2">
                • Frequency: {routeForDriverAssignment && getScheduleText(routeForDriverAssignment.schedule)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDriverAssignmentDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveDriverAssignment}
            variant="contained"
            disabled={!selectedDriverForAssignment}
          >
            Assign Driver
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add other dialogs (route creation, spot management) from previous implementation */}
    </Box>
  );
};

export default RouteManagementView;