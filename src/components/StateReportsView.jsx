// StateReportsView.jsx
import React, { useState } from 'react';
import StateAnalystNavbar from './StateAnalystNavbar';
import { Box, Card, CardContent, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { Download, PictureAsPdf, InsertDriveFile, Analytics, TrendingUp } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StateReportsView = () => {
  const [reports] = useState([
    { id: 1, title: 'Monthly Performance Report', date: '2024-01-31', type: 'pdf', size: '2.4 MB', category: 'performance' },
    { id: 2, title: 'Waste Generation Trends', date: '2024-01-28', type: 'xlsx', size: '1.8 MB', category: 'trends' },
    { id: 3, title: 'District Comparison Analysis', date: '2024-01-25', type: 'pdf', size: '3.1 MB', category: 'comparison' },
    { id: 4, title: 'Policy Impact Assessment', date: '2024-01-20', type: 'docx', size: '2.1 MB', category: 'policy' },
    { id: 5, title: 'Infrastructure Planning Data', date: '2024-01-15', type: 'xlsx', size: '4.2 MB', category: 'infrastructure' },
    { id: 6, title: 'Annual Waste Management Report', date: '2023-12-31', type: 'pdf', size: '5.7 MB', category: 'annual' },
  ]);
  
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  const reportData = [
    { name: 'Jan', performance: 78, compliance: 82, recycling: 65 },
    { name: 'Feb', performance: 82, compliance: 85, recycling: 68 },
    { name: 'Mar', performance: 85, compliance: 87, recycling: 72 },
    { name: 'Apr', performance: 79, compliance: 80, recycling: 70 },
    { name: 'May', performance: 88, compliance: 90, recycling: 75 },
    { name: 'Jun', performance: 90, compliance: 92, recycling: 78 },
  ];

  const handleDownload = (report) => {
    console.log(`Downloading ${report.title}`);
    alert(`Downloading ${report.title}`);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'pdf': return <PictureAsPdf color="error" />;
      case 'xlsx': return <InsertDriveFile color="success" />;
      case 'docx': return <InsertDriveFile color="info" />;
      default: return <InsertDriveFile />;
    }
  };

  const getCategoryChip = (category) => {
    let color = 'default';
    switch (category) {
      case 'performance': color = 'primary'; break;
      case 'trends': color = 'secondary'; break;
      case 'comparison': color = 'info'; break;
      case 'policy': color = 'success'; break;
      case 'infrastructure': color = 'warning'; break;
      case 'annual': color = 'error'; break;
      default: color = 'default';
    }
    
    return (
      <Chip 
        label={category.charAt(0).toUpperCase() + category.slice(1)} 
        color={color} 
        size="small" 
        sx={{ ml: 1 }}
      />
    );
  };

  const filteredReports = reports.filter(report => {
    if (filter !== 'all' && report.category !== filter) return false;
    return true;
  });

  return (
    <>
    <StateAnalystNavbar activeItem="state-analysis-reports" />
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, 
        background: "linear-gradient(135deg, #1a237e, #283593)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        State Reports Repository
      </Typography>

      {/* Performance Overview */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          <Box display="flex" alignItems="center">
            <Analytics sx={{ mr: 1 }} />
            Performance Overview
          </Box>
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={reportData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="performance" fill="#1a237e" name="Performance %" />
            <Bar dataKey="compliance" fill="#4caf50" name="Compliance %" />
            <Bar dataKey="recycling" fill="#ff9800" name="Recycling Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filter}
            label="Category"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="performance">Performance</MenuItem>
            <MenuItem value="trends">Trends</MenuItem>
            <MenuItem value="comparison">Comparison</MenuItem>
            <MenuItem value="policy">Policy</MenuItem>
            <MenuItem value="infrastructure">Infrastructure</MenuItem>
            <MenuItem value="annual">Annual</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
            <MenuItem value="year">This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reports Grid */}
      <Grid container spacing={3}>
        {filteredReports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {getIcon(report.type)}
                  <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                    {report.title}
                  </Typography>
                  {getCategoryChip(report.category)}
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  Generated: {new Date(report.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Size: {report.size}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  fullWidth
                  onClick={() => handleDownload(report)}
                  sx={{ 
                    background: "linear-gradient(135deg, #1a237e, #283593)",
                    '&:hover': {
                      background: "linear-gradient(135deg, #283593, #3949ab)",
                    }
                  }}
                >
                  Download Report
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Generate Custom Report
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Select parameters to generate a customized report for specific time periods, districts, or metrics.
        </Typography>
        <Button variant="outlined" color="primary">
          Configure Report Parameters
        </Button>
      </Box>
    </Box>
    </>
  );
};

export default StateReportsView;