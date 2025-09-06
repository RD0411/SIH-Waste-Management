import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

const ChampionsView = () => {
  const [champions, setChampions] = useState([]);
  const [zones, setZones] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedChampion, setSelectedChampion] = useState(null);
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
      performance: 'Excellent',
      last_active: new Date('2024-01-15')
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
      performance: 'Outstanding',
      last_active: new Date('2024-01-16')
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
      performance: 'Good',
      last_active: new Date('2024-01-10')
    },
    {
      id: 4,
      name: 'Amit Verma',
      email: 'amit.verma@example.com',
      phone: '9543210987',
      zone: 'Zone D - South Ward',
      role: 'volunteer',
      status: 'active',
      join_date: new Date('2024-01-05'),
      points: 950,
      tasks_completed: 32,
      performance: 'Very Good',
      last_active: new Date('2024-01-14')
    },
    {
      id: 5,
      name: 'Yash Singh',
      email: 'yash.singh@example.com',
      phone: '9432109876',
      zone: 'Zone E - North Ward',
      role: 'volunteer',
      status: 'active',
      join_date: new Date('2024-01-08'),
      points: 1100,
      tasks_completed: 38,
      performance: 'Excellent',
      last_active: new Date('2024-01-15')
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
    },
    {
      id: 4,
      champion_id: 4,
      champion_name: 'Amit Verma',
      type: 'report',
      description: 'Reported illegal dumping site in South Ward',
      points_earned: 25,
      date: new Date('2024-01-14')
    },
    {
      id: 5,
      champion_id: 5,
      champion_name: 'Yash Singh',
      type: 'cleanup',
      description: 'Led neighborhood cleanup initiative',
      points_earned: 85,
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
      performance: 'New',
      last_active: new Date()
    };
    
    setChampions([...champions, champion]);
    setAddDialogOpen(false);
    setNewChampion({ name: '', email: '', phone: '', zone: '', role: 'volunteer' });
  };

  const handleViewChampion = (champion) => {
    setSelectedChampion(champion);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? '<span class="badge bg-success">Active</span>' 
      : '<span class="badge bg-secondary">Inactive</span>';
  };

  const getRoleBadge = (role) => {
    return role === 'coordinator' 
      ? '<span class="badge bg-primary">Coordinator</span>' 
      : '<span class="badge bg-info text-dark">Volunteer</span>';
  };

  const getPerformanceBadge = (performance) => {
    const performanceConfig = {
      'Outstanding': 'bg-warning',
      'Excellent': 'bg-success',
      'Very Good': 'bg-info',
      'Good': 'bg-primary',
      'New': 'bg-secondary'
    };
    
    return `<span class="badge ${performanceConfig[performance] || 'bg-secondary'}">${performance}</span>`;
  };

  const getActivityTypeBadge = (type) => {
    const typeConfig = {
      'audit': { class: 'bg-info', text: 'Audit' },
      'cleanup': { class: 'bg-success', text: 'Cleanup' },
      'training': { class: 'bg-warning text-dark', text: 'Training' },
      'report': { class: 'bg-danger', text: 'Report' }
    };
    
    const config = typeConfig[type] || { class: 'bg-secondary', text: type };
    return `<span class="badge ${config.class}">${config.text}</span>`;
  };

  // Function to generate avatar with initials
  const generateAvatar = (name, size = 40) => {
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#f8f9fc', '#5a5c69'];
    const colorIndex = initials.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];
    
    return (
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center me-3 text-white fw-bold"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          backgroundColor: bgColor,
          fontSize: `${size * 0.4}px`
        }}
      >
        {initials}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading champions data...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              {/* <h4>Green Champions Management</h4> */}
              <h2
					className="fw-bold mb-1"
					style={{
						background:
							"linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
						fontSize: "2.5rem",
					}}
				>
					Green Champions Management
				</h2>
              <button
                className="btn btn-primary"
                onClick={() => setAddDialogOpen(true)}
              >
                <i className="fas fa-plus me-2"></i>Add New Champion
              </button>
            </div>
            <div className="card-body">
              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Total Champions
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">{champions.length}</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-users fa-2x text-primary"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Active Champions
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {champions.filter(c => c.status === 'active').length}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-star fa-2x text-warning"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Total Tasks Completed
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {champions.reduce((sum, c) => sum + c.tasks_completed, 0)}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-clipboard-check fa-2x text-success"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            This Week's Activities
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">12</div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-calendar fa-2x text-info"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title">Green Champions</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th scope="col">Champion</th>
                              <th scope="col">Zone</th>
                              <th scope="col">Role</th>
                              <th scope="col">Points</th>
                              <th scope="col">Status</th>
                              <th scope="col">Performance</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {champions.map((champion) => (
                              <tr key={champion.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    {generateAvatar(champion.name)}
                                    <div>
                                      <div className="fw-bold">{champion.name}</div>
                                      <div className="text-muted small">{champion.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-map-marker-alt text-muted me-2"></i>
                                    {champion.zone}
                                  </div>
                                </td>
                                <td>
                                  <span dangerouslySetInnerHTML={{ __html: getRoleBadge(champion.role) }} />
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <i className="fas fa-star text-warning me-1"></i>
                                    {champion.points}
                                  </div>
                                </td>
                                <td>
                                  <span dangerouslySetInnerHTML={{ __html: getStatusBadge(champion.status) }} />
                                </td>
                                <td>
                                  <span dangerouslySetInnerHTML={{ __html: getPerformanceBadge(champion.performance) }} />
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleViewChampion(champion)}
                                    title="View Details"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title">Recent Activities</h5>
                    </div>
                    <div className="card-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {activities.map((activity) => (
                        <div key={activity.id} className="mb-3 p-2 border-start border-3 border-info">
                          <div className="d-flex justify-content-between">
                            <div className="fw-bold">{activity.champion_name}</div>
                            <small className="text-muted">{new Date(activity.date).toLocaleDateString()}</small>
                          </div>
                          <div className="mb-1">
                            <span dangerouslySetInnerHTML={{ __html: getActivityTypeBadge(activity.type) }} />
                          </div>
                          <p className="mb-1 small">{activity.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{activity.type}</small>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-star text-warning me-1"></i>
                              <span>+{activity.points_earned}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title">Zone Distribution</h5>
                    </div>
                    <div className="card-body">
                      {zones.map((zone) => {
                        const count = champions.filter(c => c.zone === zone.name).length;
                        return (
                          <div key={zone.id} className="mb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>{zone.name}</span>
                              <span className="badge bg-primary rounded-pill">{count}</span>
                            </div>
                            <div className="progress" style={{ height: '5px' }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: `${(count / champions.length) * 100}%` }}
                                aria-valuenow={count}
                                aria-valuemin="0"
                                aria-valuemax={champions.length}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Champion Modal */}
      <div className={`modal fade ${addDialogOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: addDialogOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Green Champion</h5>
              <button type="button" className="btn-close" onClick={() => setAddDialogOpen(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={newChampion.name}
                  onChange={(e) => setNewChampion({ ...newChampion, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={newChampion.email}
                  onChange={(e) => setNewChampion({ ...newChampion, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  value={newChampion.phone}
                  onChange={(e) => setNewChampion({ ...newChampion, phone: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="zone" className="form-label">Zone Assignment</label>
                <select
                  className="form-select"
                  id="zone"
                  value={newChampion.zone}
                  onChange={(e) => setNewChampion({ ...newChampion, zone: e.target.value })}
                >
                  <option value="">Select a zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.name}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Role</label>
                <select
                  className="form-select"
                  id="role"
                  value={newChampion.role}
                  onChange={(e) => setNewChampion({ ...newChampion, role: e.target.value })}
                >
                  <option value="volunteer">Volunteer</option>
                  <option value="coordinator">Zone Coordinator</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setAddDialogOpen(false)}>Cancel</button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleAddChampion}
                disabled={!newChampion.name || !newChampion.email || !newChampion.zone}
              >
                Add Champion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Champion Details Modal */}
      <div className={`modal fade ${viewDialogOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: viewDialogOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Champion Details</h5>
              <button type="button" className="btn-close" onClick={() => setViewDialogOpen(false)}></button>
            </div>
            <div className="modal-body">
              {selectedChampion && (
                <div className="row">
                  <div className="col-md-4 text-center">
                    {generateAvatar(selectedChampion.name, 120)}
                    <h4 className="mt-3">{selectedChampion.name}</h4>
                    <div className="mb-2">
                      <span dangerouslySetInnerHTML={{ __html: getRoleBadge(selectedChampion.role) }} />
                    </div>
                    <div className="mb-2">
                      <span dangerouslySetInnerHTML={{ __html: getStatusBadge(selectedChampion.status) }} />
                    </div>
                    <div className="mb-2">
                      <span dangerouslySetInnerHTML={{ __html: getPerformanceBadge(selectedChampion.performance) }} />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="card bg-light">
                          <div className="card-body text-center">
                            <h5 className="card-title">{selectedChampion.points}</h5>
                            <p className="card-text small">Total Points</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="card bg-light">
                          <div className="card-body text-center">
                            <h5 className="card-title">{selectedChampion.tasks_completed}</h5>
                            <p className="card-text small">Tasks Completed</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h6>Contact Information</h6>
                      <table className="table table-sm">
                        <tbody>
                          <tr>
                            <th width="30%">Email</th>
                            <td>{selectedChampion.email}</td>
                          </tr>
                          <tr>
                            <th>Phone</th>
                            <td>{selectedChampion.phone}</td>
                          </tr>
                          <tr>
                            <th>Zone</th>
                            <td>{selectedChampion.zone}</td>
                          </tr>
                          <tr>
                            <th>Joined</th>
                            <td>{new Date(selectedChampion.join_date).toLocaleDateString()}</td>
                          </tr>
                          <tr>
                            <th>Last Active</th>
                            <td>{new Date(selectedChampion.last_active).toLocaleDateString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mb-3">
                      <h6>Activity History</h6>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {activities
                          .filter(a => a.champion_id === selectedChampion.id)
                          .map(activity => (
                            <div key={activity.id} className="border-bottom pb-2 mb-2">
                              <div className="d-flex justify-content-between">
                                <strong>{activity.description}</strong>
                                <span className="badge bg-info">{activity.type}</span>
                              </div>
                              <div className="d-flex justify-content-between text-muted small">
                                <span>{new Date(activity.date).toLocaleDateString()}</span>
                                <span>+{activity.points_earned} points</span>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setViewDialogOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionsView;