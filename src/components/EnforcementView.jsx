import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Warning, MonetizationOn, Block } from '@mui/icons-material';
import { auth } from '../firebase';

const EnforcementView = () => {
  const [penalties, setPenalties] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyType, setPenaltyType] = useState('warning');

  // Mock data for demonstration
  const mockViolations = [
    {
      id: 1,
      household_id: 'H1001',
      household_name: 'Apartment 101, Sunshine Residency',
      address: '123 Main Street, Bengaluru',
      violation_type: 'non_segregation',
      violation_date: new Date('2024-01-15'),
      reported_by: 'Driver Rajesh',
      evidence_photos: [],
      status: 'pending'
    },
    {
      id: 2,
      household_id: 'H1002',
      household_name: 'Green Valley Apartments - B102',
      address: '456 Oak Avenue, Bengaluru',
      violation_type: 'illegal_dumping',
      violation_date: new Date('2024-01-14'),
      reported_by: 'Green Champion Suresh',
      evidence_photos: [],
      status: 'penalty_issued'
    },
    {
      id: 3,
      household_id: 'C2001',
      household_name: 'City Mall Food Court',
      address: '789 Commercial Street, Bengaluru',
      violation_type: 'non_segregation',
      violation_date: new Date('2024-01-13'),
      reported_by: 'ULB Inspector',
      evidence_photos: [],
      status: 'warning_issued'
    }
  ];

  const mockPenalties = [
    {
      id: 1,
      violation_id: 2,
      household_id: 'H1002',
      amount: 500,
      type: 'fine',
      issued_date: new Date('2024-01-14'),
      due_date: new Date('2024-01-28'),
      status: 'unpaid'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setViolations(mockViolations);
      setPenalties(mockPenalties);
      setLoading(false);
    }, 1000);
  }, []);

  const handleIssuePenalty = (violation) => {
    setSelectedViolation(violation);
    setPenaltyAmount('');
    setPenaltyType('warning');
    setIssueDialogOpen(true);
  };

  const handleSubmitPenalty = () => {
    // Simulate penalty issuance
    const newPenalty = {
      id: penalties.length + 1,
      violation_id: selectedViolation.id,
      household_id: selectedViolation.household_id,
      amount: penaltyType === 'fine' ? parseInt(penaltyAmount) : 0,
      type: penaltyType,
      issued_date: new Date(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: penaltyType === 'warning' ? 'na' : 'unpaid'
    };

    setPenalties([...penalties, newPenalty]);
    
    // Update violation status
    const updatedViolations = violations.map(v => 
      v.id === selectedViolation.id 
        ? { ...v, status: penaltyType === 'warning' ? 'warning_issued' : 'penalty_issued' }
        : v
    );
    setViolations(updatedViolations);

    setIssueDialogOpen(false);
    setSelectedViolation(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'warning_issued': return 'info';
      case 'penalty_issued': return 'error';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getViolationTypeText = (type) => {
    switch (type) {
      case 'non_segregation': return 'Non-Segregation';
      case 'illegal_dumping': return 'Illegal Dumping';
      case 'missed_pickup': return 'Missed Pickup';
      default: return type;
    }
  };

  if (loading) return <Typography>Loading enforcement data...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Enforcement & Penalty Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Violations
              </Typography>
              <Typography variant="h4">
                {violations.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Actions
              </Typography>
              <Typography variant="h4">
                {violations.filter(v => v.status === 'pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Fines Issued
              </Typography>
              <Typography variant="h4">
                ₹{penalties.filter(p => p.type === 'fine').reduce((sum, p) => sum + p.amount, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Violations
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Household</TableCell>
                    <TableCell>Violation Type</TableCell>
                    <TableCell>Reported By</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {violations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{violation.household_name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {violation.address}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getViolationTypeText(violation.violation_type)}</TableCell>
                      <TableCell>{violation.reported_by}</TableCell>
                      <TableCell>{new Date(violation.violation_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={violation.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(violation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {violation.status === 'pending' && (
                          <Button
                            size="small"
                            startIcon={<Warning />}
                            onClick={() => handleIssuePenalty(violation)}
                          >
                            Take Action
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

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Penalties
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Household</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {penalties.map((penalty) => (
                    <TableRow key={penalty.id}>
                      <TableCell>H{penalty.household_id}</TableCell>
                      <TableCell>
                        <Chip
                          label={penalty.type.toUpperCase()}
                          color={penalty.type === 'fine' ? 'error' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {penalty.type === 'fine' ? `₹${penalty.amount}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={penalty.status.toUpperCase()}
                          color={penalty.status === 'unpaid' ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={issueDialogOpen} onClose={() => setIssueDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Issue Penalty for {selectedViolation?.household_name}
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ mb: 2 }}>
            Violation: {selectedViolation && getViolationTypeText(selectedViolation.violation_type)}
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={penaltyType}
              onChange={(e) => setPenaltyType(e.target.value)}
              label="Action Type"
            >
              <MenuItem value="warning">Warning Notice</MenuItem>
              <MenuItem value="fine">Monetary Fine</MenuItem>
              <MenuItem value="suspension">Collection Suspension</MenuItem>
            </Select>
          </FormControl>

          {penaltyType === 'fine' && (
            <TextField
              fullWidth
              label="Fine Amount (₹)"
              type="number"
              value={penaltyAmount}
              onChange={(e) => setPenaltyAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {penaltyType === 'suspension' && (
            <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
              Warning: This will suspend waste collection for this household until the issue is resolved.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIssueDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitPenalty} variant="contained" color="primary">
            {penaltyType === 'warning' ? 'Issue Warning' : 
             penaltyType === 'fine' ? 'Issue Fine' : 'Suspend Service'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnforcementView;