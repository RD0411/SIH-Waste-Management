import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, Chip,
  Button, MenuItem, Select, FormControl, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { AssignmentInd, Visibility } from '@mui/icons-material';
import { auth } from '../firebase';

const IssuesView = () => {
  const [issues, setIssues] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ status: '', type: '' });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');

  // Mock data for demonstration
  const mockIssues = [
    {
      id: 1,
      type: 'illegal_dumping',
      status: 'RECEIVED',
      description: "Pile of construction waste near the park",
      reporter_id: 1001,
      location_lat: 12.9784,
      location_lng: 77.6408,
      created_at: new Date(),
      assigned_to: null
    },
    {
      id: 2,
      type: 'missed_pickup',
      status: 'ASSIGNED',
      description: "Dry waste not collected from Building A",
      reporter_id: 1002,
      location_lat: 12.9345,
      location_lng: 77.6265,
      created_at: new Date(),
      assigned_to: 1
    },
  ];

  const mockDrivers = [
    { id: 1, name: "Rajesh Kumar", vehicle_number: "KA01AB1234", is_active: true },
    { id: 2, name: "Suresh Patel", vehicle_number: "KA01CD5678", is_active: true },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIssues(mockIssues);
      setDrivers(mockDrivers.filter(driver => driver.is_active));
      setLoading(false);
    }, 1000);
  }, [filters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAssignDialog = (issue) => {
    setSelectedIssue(issue);
    setSelectedDriver(issue.assigned_to || '');
    setAssignDialogOpen(true);
  };

  const handleAssignIssue = async () => {
    // Simulate API call
    console.log(`Assigning issue ${selectedIssue.id} to driver ${selectedDriver}`);
    setAssignDialogOpen(false);
  };

  if (loading) return <Typography>Loading issues...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Issue Resolution</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} displayEmpty>
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="RECEIVED">Received</MenuItem>
              <MenuItem value="ASSIGNED">Assigned</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} displayEmpty>
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="illegal_dumping">Illegal Dumping</MenuItem>
              <MenuItem value="missed_pickup">Missed Pickup</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Reported At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((issue) => {
                const assignedDriver = drivers.find(d => d.id === issue.assigned_to);
                return (
                  <TableRow hover key={issue.id}>
                    <TableCell>{issue.id}</TableCell>
                    <TableCell>{issue.type}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}><Typography noWrap>{issue.description}</Typography></TableCell>
                    <TableCell><Chip label={issue.status} color={issue.status === 'RECEIVED' ? 'default' : 'primary'} size="small" /></TableCell>
                    <TableCell>{assignedDriver ? `${assignedDriver.name} (${assignedDriver.vehicle_number})` : 'Unassigned'}</TableCell>
                    <TableCell>{new Date(issue.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<AssignmentInd />} onClick={() => handleOpenAssignDialog(issue)}>Assign</Button>
                      <Button size="small" startIcon={<Visibility />}>View</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={issues.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Issue #{selectedIssue?.id}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Select a driver:</Typography>
          <FormControl fullWidth>
            <Select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)} displayEmpty>
              <MenuItem value="">Unassign</MenuItem>
              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>{driver.name} ({driver.vehicle_number})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignIssue} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IssuesView;