// StatePolicyView.jsx
import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Button, Grid, 
  TextField, FormControl, InputLabel, Select, MenuItem, 
  Paper, Chip, Divider 
} from '@mui/material';
import { Upload, Analytics, Policy, TrendingUp, Assessment } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatePolicyView = () => {
  const [policyArea, setPolicyArea] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [impactData, setImpactData] = useState([
    { name: 'Current', cost: 45, efficiency: 65, compliance: 70 },
    { name: 'Policy A', cost: 40, efficiency: 75, compliance: 80 },
    { name: 'Policy B', cost: 50, efficiency: 85, compliance: 85 },
    { name: 'Policy C', cost: 55, efficiency: 90, compliance: 90 },
  ]);

  const policyTools = [
    { 
      id: 1, 
      title: 'Policy Impact Simulator', 
      description: 'Simulate the potential impact of new waste management policies before implementation',
      icon: <Analytics fontSize="large" color="primary" />,
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Infrastructure Planner', 
      description: 'Plan optimal locations for new waste processing facilities based on current data',
      icon: <Policy fontSize="large" color="secondary" />,
      status: 'active'
    },
    { 
      id: 3, 
      title: 'Awareness Campaign Manager', 
      description: 'Design and track the effectiveness of public awareness campaigns',
      icon: <Upload fontSize="large" color="action" />,
      status: 'development'
    },
  ];

  const policyRecommendations = [
    { id: 1, area: 'Plastic Recycling', impact: 'High', cost: 'Medium', timeframe: '6 months' },
    { id: 2, area: 'Organic Waste Processing', impact: 'Very High', cost: 'High', timeframe: '12 months' },
    { id: 3, area: 'Hazardous Waste Management', impact: 'High', cost: 'Medium', timeframe: '9 months' },
    { id: 4, area: 'Public Awareness', impact: 'Medium', cost: 'Low', timeframe: '3 months' },
  ];

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'Very High': return 'success';
      case 'High': return 'primary';
      case 'Medium': return 'warning';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getCostColor = (cost) => {
    switch(cost) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, 
        background: "linear-gradient(135deg, #1a237e, #283593)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        Policy Planning Tools
      </Typography>

      {/* Policy Impact Visualization */}
      <Card sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          <Box display="flex" alignItems="center">
            <TrendingUp sx={{ mr: 1 }} />
            Policy Impact Comparison
          </Box>
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={impactData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cost" fill="#1a237e" name="Cost Efficiency" />
            <Bar dataKey="efficiency" fill="#4caf50" name="Processing Efficiency" />
            <Bar dataKey="compliance" fill="#ff9800" name="Compliance Rate" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Grid container spacing={3}>
        {/* Policy Tools */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {policyTools.map((tool) => (
              <Grid item xs={12} md={6} key={tool.id}>
                <Card sx={{ height: '100%', p: 2, position: 'relative' }}>
                  {tool.status === 'development' && (
                    <Chip 
                      label="In Development" 
                      color="warning" 
                      size="small" 
                      sx={{ position: 'absolute', top: 10, right: 10 }}
                    />
                  )}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    {tool.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom align="center">
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {tool.description}
                  </Typography>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      variant={tool.status === 'active' ? 'contained' : 'outlined'} 
                      disabled={tool.status !== 'active'}
                    >
                      {tool.status === 'active' ? 'Launch Tool' : 'Coming Soon'}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Policy Recommendations */}
          <Card sx={{ p: 3, mt: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              <Box display="flex" alignItems="center">
                <Assessment sx={{ mr: 1 }} />
                Policy Recommendations
              </Box>
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {policyRecommendations.map((rec) => (
                <Grid item xs={12} key={rec.id}>
                  <Paper sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{rec.area}</Typography>
                      <Box display="flex" gap={1}>
                        <Chip label={`Impact: ${rec.impact}`} color={getImpactColor(rec.impact)} size="small" />
                        <Chip label={`Cost: ${rec.cost}`} color={getCostColor(rec.cost)} size="small" />
                        <Chip label={`Time: ${rec.timeframe}`} variant="outlined" size="small" />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Push New Guidelines */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Push New Guidelines
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Distribute updated waste management guidelines and training materials to all ULBs
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Policy Area</InputLabel>
                  <Select
                    value={policyArea}
                    label="Policy Area"
                    onChange={(e) => setPolicyArea(e.target.value)}
                  >
                    <MenuItem value="segregation">Source Segregation</MenuItem>
                    <MenuItem value="recycling">Recycling Guidelines</MenuItem>
                    <MenuItem value="hazardous">Hazardous Waste Handling</MenuItem>
                    <MenuItem value="composting">Home Composting</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Implementation Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    label="Implementation Timeframe"
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <MenuItem value="immediate">Immediate</MenuItem>
                    <MenuItem value="30days">30 Days</MenuItem>
                    <MenuItem value="90days">90 Days</MenuItem>
                    <MenuItem value="custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Instructions"
                  multiline
                  rows={4}
                  placeholder="Add any specific instructions or context for this policy update..."
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" startIcon={<Upload />} fullWidth>
                  Upload Documents & Distribute
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatePolicyView;