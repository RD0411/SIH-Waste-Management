import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip
} from '@mui/material';
import axios from 'axios';
import { auth } from '../firebase';
import MapComponent from './MapComponent';

const FleetView = () => {
  const [drivers, setDrivers] = useState([]);
  const [liveLocations, setLiveLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFleetData = async () => {
    try {
      setLoading(true);
      const idToken = await auth.currentUser.getIdToken(true);
      const config = { headers: { Authorization: `Bearer ${idToken}` } };

      // Mock data for demonstration - replace with actual API calls
      const mockDrivers = [
        { id: 1, name: "Rajesh Kumar", phone: "9876543210", vehicle_number: "KA01AB1234", is_active: true },
        { id: 2, name: "Suresh Patel", phone: "9765432109", vehicle_number: "KA01CD5678", is_active: true },
      ];

      const mockLocations = [
        { driver_id: 1, lat: 12.9716 + 0.01, lng: 77.5946 + 0.01, timestamp: new Date() },
        { driver_id: 2, lat: 12.9716 - 0.02, lng: 77.5946 - 0.01, timestamp: new Date() },
      ];

      setDrivers(mockDrivers);
      setLiveLocations(mockLocations);
      setError(null);

      // Actual API calls would look like this:
      /*
      const [driversResponse, locationsResponse] = await Promise.all([
        axios.get('http://localhost:8000/fleet/drivers', config),
        axios.get('http://localhost:8000/fleet/live-locations', config)
      ]);
      setDrivers(driversResponse.data);
      setLiveLocations(locationsResponse.data);
      */
    } catch (err) {
      console.error("Error fetching fleet data:", err);
      setError("Failed to load fleet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleetData();
    const intervalId = setInterval(fetchFleetData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <Typography>Loading fleet data...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const locationMap = {};
  liveLocations.forEach(loc => {
    locationMap[loc.driver_id] = loc;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Fleet & Workforce Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Live Driver Locations</Typography>
            <MapComponent locations={liveLocations} drivers={drivers} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Drivers</Typography>
                  <Typography variant="h5">{drivers.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Active Now</Typography>
                  <Typography variant="h5">{drivers.filter(d => d.is_active).length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>All Drivers</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Vehicle Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Location Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drivers.map((driver) => {
                    const location = locationMap[driver.id];
                    return (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.vehicle_number}</TableCell>
                        <TableCell>
                          <Chip
                            label={driver.is_active ? 'ACTIVE' : 'INACTIVE'}
                            size="small"
                            color={driver.is_active ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {location ? new Date(location.timestamp).toLocaleTimeString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FleetView;