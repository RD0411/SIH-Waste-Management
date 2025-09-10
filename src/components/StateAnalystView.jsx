// StateAnalystView.jsx
import React, { useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Button,
  Select, MenuItem, FormControl, InputLabel, Paper
} from '@mui/material';
import {
  Analytics, TrendingUp, Assessment, Policy,
  People, Report, Recycling, Route, Warning
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const StateAnalystView = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [timeFrame, setTimeFrame] = useState('monthly');

  // Mock data for demonstration
  const districtData = [
    { name: 'District A', reports: 1245, resolved: 980, citizens: 12500, recycled: 2450, performance: 78 },
    { name: 'District B', reports: 980, resolved: 820, citizens: 9800, recycled: 1980, performance: 84 },
    { name: 'District C', reports: 1560, resolved: 1240, citizens: 15800, recycled: 3120, performance: 79 },
    { name: 'District D', reports: 870, resolved: 720, citizens: 9200, recycled: 1740, performance: 83 },
    { name: 'District E', reports: 1120, resolved: 890, citizens: 11500, recycled: 2240, performance: 79 },
  ];

  const performanceData = [
    { month: 'Jan', reports: 2400, resolved: 1800, recycled: 1200, greenPoints: 4500 },
    { month: 'Feb', reports: 2210, resolved: 1700, recycled: 980, greenPoints: 4200 },
    { month: 'Mar', reports: 3290, resolved: 2500, recycled: 1800, greenPoints: 5200 },
    { month: 'Apr', reports: 2780, resolved: 2200, recycled: 1500, greenPoints: 4800 },
    { month: 'May', reports: 3890, resolved: 3200, recycled: 2100, greenPoints: 6100 },
    { month: 'Jun', reports: 3490, resolved: 2900, recycled: 1900, greenPoints: 5800 },
  ];

  const wasteTypeData = [
    { name: 'Organic', value: 45 },
    { name: 'Plastic', value: 25 },
    { name: 'Paper', value: 15 },
    { name: 'Metal', value: 8 },
    { name: 'Glass', value: 5 },
    { name: 'Hazardous', value: 2 },
  ];

  const hotspotData = [
    { area: 'North Zone', reports: 245, type: 'Illegal Dumping', priority: 'High' },
    { area: 'South Zone', reports: 180, type: 'Missed Collection', priority: 'Medium' },
    { area: 'East Zone', reports: 320, type: 'Segregation Issues', priority: 'High' },
    { area: 'West Zone', reports: 150, type: 'Infrastructure', priority: 'Low' },
    { area: 'Central Zone', reports: 275, type: 'Illegal Dumping', priority: 'High' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000'];

  const dashboardCards = [
    {
      id: 1,
      title: 'Registered Citizens',
      value: '58,200',
      description: 'Across all districts',
      icon: <People fontSize="large" color="primary" />,
      color: 'linear-gradient(135deg, #1a237e, #283593)',
      trend: '+12% from last month'
    },
    {
      id: 2,
      title: 'Total Reports',
      value: '6,775',
      description: 'Issues reported this month',
      icon: <Report fontSize="large" color="secondary" />,
      color: 'linear-gradient(135deg, #7b1fa2, #9c27b0)',
      trend: '-5% from last month'
    },
    {
      id: 3,
      title: 'Recycled Materials',
      value: '12.4K',
      description: 'Tons processed this quarter',
      icon: <Recycling fontSize="large" color="success" />,
      color: 'linear-gradient(135deg, #2e7d32, #4caf50)',
      trend: '+18% from last quarter'
    },
    {
      id: 4,
      title: 'Routes Completed',
      value: '98%',
      description: 'Collection efficiency',
      icon: <Route fontSize="large" color="warning" />,
      color: 'linear-gradient(135deg, #f57c00, #ff9800)',
      trend: '+2% from last month'
    }
  ];

  const quickActions = [
    { id: 1, title: 'Generate Performance Report', description: 'Create comprehensive state report' },
    { id: 2, title: 'Compare District Metrics', description: 'Analyze district-level performance' },
    { id: 3, title: 'Identify Hotspots', description: 'Locate areas needing intervention' },
    { id: 4, title: 'Policy Impact Analysis', description: 'Evaluate policy effectiveness' }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{
          background: "linear-gradient(135deg, #1a237e, #283593)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          State Waste Management Analytics
        </Typography>
        
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>District</InputLabel>
            <Select
              value={selectedDistrict}
              label="District"
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <MenuItem value="all">All Districts</MenuItem>
              <MenuItem value="districtA">District A</MenuItem>
              <MenuItem value="districtB">District B</MenuItem>
              <MenuItem value="districtC">District C</MenuItem>
              <MenuItem value="districtD">District D</MenuItem>
              <MenuItem value="districtE">District E</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Frame</InputLabel>
            <Select
              value={timeFrame}
              label="Time Frame"
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.id}>
            <Card sx={{ 
              background: card.color,
              color: 'white',
              textAlign: 'center',
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              height: '100%'
            }}>
              <Box sx={{ mb: 2 }}>
                {card.icon}
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {card.value}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                {card.description}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {card.trend}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Visualizations */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trends ({timeFrame})
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="reports" stroke="#1a237e" activeDot={{ r: 8 }} name="Reports" />
                <Line type="monotone" dataKey="resolved" stroke="#4caf50" name="Resolved" />
                <Line type="monotone" dataKey="recycled" stroke="#ff9800" name="Recycled (tons)" />
                <Line type="monotone" dataKey="greenPoints" stroke="#9c27b0" name="Green Points" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Waste Composition
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* District Comparison */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              District Performance Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={districtData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reports" fill="#1a237e" name="Total Reports" />
                <Bar dataKey="resolved" fill="#4caf50" name="Resolved" />
                <Bar dataKey="recycled" fill="#ff9800" name="Recycled (tons)" />
                <Bar dataKey="performance" fill="#9c27b0" name="Performance %" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Hotspot Areas */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Box display="flex" alignItems="center">
                <Warning color="error" sx={{ mr: 1 }} />
                Hotspot Areas
              </Box>
            </Typography>
            <Box sx={{ mt: 2 }}>
              {hotspotData.map((hotspot, index) => (
                <Box key={index} sx={{ 
                  p: 2, 
                  mb: 2, 
                  border: '1px solid',
                  borderColor: hotspot.priority === 'High' ? 'error.main' : 
                              hotspot.priority === 'Medium' ? 'warning.main' : 'grey.300',
                  borderRadius: 1,
                  backgroundColor: hotspot.priority === 'High' ? 'error.light' : 
                                  hotspot.priority === 'Medium' ? 'warning.light' : 'grey.50'
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {hotspot.area}
                  </Typography>
                  <Typography variant="body2">
                    {hotspot.reports} reports - {hotspot.type}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Priority: {hotspot.priority}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Export Options */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Export Reports
        </Typography>
        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" color="primary">
            Download CSV
          </Button>
          <Button variant="contained" color="secondary">
            Generate PDF Report
          </Button>
          <Button variant="outlined">
            Share Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StateAnalystView;