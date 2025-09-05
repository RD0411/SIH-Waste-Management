import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, Avatar, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { 
  PersonAdd, Visibility, Star, Group, LocationOn, 
  Assignment, EventAvailable 
} from '@mui/icons-material';
import { auth } from '../firebase';

const ChampionsView = () => {
  const [champions, setChampions] = useState([]);
  const [zones, setZones] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newChampion, setNewChampion] = useState({
    name: '',
    email: '',
    phone: '',
    zone: '',
    role: 'volunteer'
  });

  // Mock data for demonstration
  const mockChampions = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '9876543210',
      zone: 'Zone A - Central Ward',
      role: 'volunteer',
      status: 'active',
      join_date: new Date('2024-01-01'),
      points: 1250,
      tasks_completed: 45,
      avatar: '/avatars/1.jpg'
    },
    {
      id: 2,
      name: 'Suresh Patel',
      email: 'suresh.patel@example.com',
      phone: '9765432109',
      zone: 'Zone B - East Ward',
      role: 'coordinator',
      status: 'active',
      join_date: new Date('2023-12-15'),
      points: 2100,
      tasks_completed: 78,
      avatar: '/avatars/2.jpg'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9654321098',
      zone: 'Zone C - West Ward',
      role: 'volunteer',
      status: 'inactive',
      join_date: new Date('2024-01-10'),
      points: 800,
      tasks_completed: 22,
      avatar: '/avatars/3.jpg'
    }
  ];

  const mockZones = [
    { id: 'zone-a', name: 'Zone A - Central Ward' },
    { id: 'zone-b', name: 'Zone B - East Ward' },
    { id: 'zone-c', name: 'Zone C - West Ward' },
    { id: 'zone-d', name: 'Zone D - South Ward' },
    { id: 'zone-e', name: 'Zone E - North Ward' }
  ];

  const mockActivities = [
    {
      id: 1,
      champion_id: 1,
      champion_name: 'Rajesh Kumar',
      type: 'audit',
      description: 'Conducted segregation audit in Central Market area',
      points_earned: 50,
      date: new Date('2024-01-15')
    },
    {
      id: 2,
      champion_id: 2,
      champion_name: 'Suresh Patel',
      type: 'cleanup',
      description: 'Organized community cleaning drive in East Park',
      points_earned: 100,
      date: new Date('2024-01-14')
    },
    {
      id: 3,
      champion_id: 1,
      champion_name: 'Rajesh Kumar',
      type: 'training',
      description: 'Conducted training session for new volunteers',
      points_earned: 75,
      date: new Date('2024-01-13')
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChampions(mockChampions);
      setZones(mockZones);
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddChampion = () => {
    // Simulate adding new champion
    const champion = {
      id: champions.length + 1,
      ...newChampion,
      status: 'active',
      join_date: new Date(),
      points: 0,
      tasks_completed: 0,
      avatar: '/avatars/default.jpg'
    };
    
    setChampions([...champions, champion]);
    setAddDialogOpen(false);
    setNewChampion({ name: '', email: '', phone: '', zone: '', role: 'volunteer' });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getRoleColor = (role) => {
    return role === 'coordinator' ? 'primary' : 'default';
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case 'audit': return 'info';
      case 'cleanup': return 'success';
      case 'training': return 'warning';
      case 'report': return 'error';
      default: return 'default';
    }
  };

  if (loading) return <Typography>Loading champions data...</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Green Champions Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => setAddDialogOpen(true)}
        >
          Add New Champion
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Group sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography color="textSecondary" gutterBottom>
                Total Champions
              </Typography>
              <Typography variant="h4">
                {champions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Star sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography color="textSecondary" gutterBottom>
                Active Champions
              </Typography>
              <Typography variant="h4">
                {champions.filter(c => c.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography color="textSecondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4">
                {champions.reduce((sum, c) => sum + c.tasks_completed, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventAvailable sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography color="textSecondary" gutterBottom>
                This Week
              </Typography>
              <Typography variant="h4">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Green Champions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Champion</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {champions.map((champion) => (
                    <TableRow key={champion.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ width: 40, height: 40, mr: 2 }} src={champion.avatar}>
                            {champion.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{champion.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              Since {new Date(champion.join_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{champion.email}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {champion.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          {champion.zone}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={champion.role.toUpperCase()}
                          color={getRoleColor(champion.role)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Star sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                          {champion.points}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={champion.status.toUpperCase()}
                          color={getStatusColor(champion.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<Visibility />}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {activities.map((activity) => (
                <Box key={activity.id} sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Typography variant="subtitle2">{activity.champion_name}</Typography>
                    <Chip
                      label={activity.type.toUpperCase()}
                      color={getActivityTypeColor(activity.type)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {activity.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(activity.date).toLocaleDateString()}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Star sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                      <Typography variant="body2">+{activity.points_earned}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Zone Distribution
            </Typography>
            {zones.map((zone) => (
              <Box key={zone.id} display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2">{zone.name}</Typography>
                <Chip
                  label={champions.filter(c => c.zone === zone.name).length}
                  size="small"
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Green Champion</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={newChampion.name}
            onChange={(e) => setNewChampion({ ...newChampion, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={newChampion.email}
            onChange={(e) => setNewChampion({ ...newChampion, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={newChampion.phone}
            onChange={(e) => setNewChampion({ ...newChampion, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Zone Assignment</InputLabel>
            <Select
              value={newChampion.zone}
              onChange={(e) => setNewChampion({ ...newChampion, zone: e.target.value })}
              label="Zone Assignment"
            >
              {zones.map((zone) => (
                <MenuItem key={zone.id} value={zone.name}>
                  {zone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={newChampion.role}
              onChange={(e) => setNewChampion({ ...newChampion, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="volunteer">Volunteer</MenuItem>
              <MenuItem value="coordinator">Zone Coordinator</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddChampion} 
            variant="contained" 
            disabled={!newChampion.name || !newChampion.email || !newChampion.zone}
          >
            Add Champion
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChampionsView;