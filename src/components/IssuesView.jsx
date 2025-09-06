import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

const IssuesView = () => {
  const [issues, setIssues] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [issueDetails, setIssueDetails] = useState(null);

  // Mock data for demonstration
  const mockIssues = [
    {
      id: 1,
      type: 'illegal_dumping',
      status: 'RECEIVED',
      description: "Large pile of construction waste near Central Park entrance",
      reporter_id: 1001,
      location_lat: 12.9784,
      location_lng: 77.6408,
      created_at: new Date('2023-05-15'),
      assigned_to: null,
      reporter_name: "Rahul Sharma",
      reporter_phone: "+91 9876543210",
      address: "Near Central Park, Brigade Road, Bengaluru"
    },
    {
      id: 2,
      type: 'missed_pickup',
      status: 'ASSIGNED',
      description: "Dry waste not collected from Building A, Sigma Apartments",
      reporter_id: 1002,
      location_lat: 12.9345,
      location_lng: 77.6265,
      created_at: new Date('2023-05-16'),
      assigned_to: 1,
      reporter_name: "Priya Patel",
      reporter_phone: "+91 8765432109",
      address: "Sigma Apartments, Koramangala, Bengaluru"
    },
    {
      id: 3,
      type: 'illegal_dumping',
      status: 'RECEIVED',
      description: "Household garbage dumped in vacant lot next to supermarket",
      reporter_id: 1003,
      location_lat: 12.9716,
      location_lng: 77.5946,
      created_at: new Date('2023-05-17'),
      assigned_to: null,
      reporter_name: "Vikram Singh",
      reporter_phone: "+91 7654321098",
      address: "Commercial Street, Shivajinagar, Bengaluru"
    },
    {
      id: 4,
      type: 'overflowing_bins',
      status: 'IN_PROGRESS',
      description: "Community bin overflowing for 2 days near bus stop",
      reporter_id: 1004,
      location_lat: 12.9300,
      location_lng: 77.6830,
      created_at: new Date('2023-05-14'),
      assigned_to: 2,
      reporter_name: "Anjali Mehta",
      reporter_phone: "+91 6543210987",
      address: "BTM Layout 2nd Stage, Bengaluru"
    },
    {
      id: 5,
      type: 'missed_pickup',
      status: 'RESOLVED',
      description: "Wet waste not collected on Tuesday as scheduled",
      reporter_id: 1005,
      location_lat: 12.9581,
      location_lng: 77.7010,
      created_at: new Date('2023-05-12'),
      assigned_to: 1,
      reporter_name: "Sanjay Kumar",
      reporter_phone: "+91 9432109876",
      address: "Indiranagar 100 Feet Road, Bengaluru"
    },
  ];

  const mockDrivers = [
    { id: 1, name: "Rajesh Kumar", vehicle_number: "KA01AB1234", is_active: true, phone: "+91 9123456780" },
    { id: 2, name: "Suresh Patel", vehicle_number: "KA01CD5678", is_active: true, phone: "+91 8987654321" },
    { id: 3, name: "Mahesh Reddy", vehicle_number: "KA02EF9012", is_active: true, phone: "+91 7890123456" },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIssues(mockIssues);
      setDrivers(mockDrivers.filter(driver => driver.is_active));
      setLoading(false);
    }, 1000);
  }, [filters]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleOpenAssignDialog = (issue) => {
    setSelectedIssue(issue);
    setSelectedDriver(issue.assigned_to || '');
    setAssignDialogOpen(true);
  };

  const handleViewDetails = (issue) => {
    setIssueDetails(issue);
    setViewDialogOpen(true);
  };

  const handleAssignIssue = async () => {
    // Simulate API call
    console.log(`Assigning issue ${selectedIssue.id} to driver ${selectedDriver}`);
    // Update the issue in the local state
    const updatedIssues = issues.map(issue => 
      issue.id === selectedIssue.id ? { ...issue, assigned_to: selectedDriver } : issue
    );
    setIssues(updatedIssues);
    setAssignDialogOpen(false);
  };

  // Filter issues based on filters
  const filteredIssues = issues.filter(issue => {
    return (
      (filters.status === '' || issue.status === filters.status) &&
      (filters.type === '' || issue.type === filters.type) &&
      (filters.search === '' || 
        issue.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.id.toString().includes(filters.search) ||
        (issue.assigned_to && drivers.find(d => d.id === issue.assigned_to)?.name.toLowerCase().includes(filters.search.toLowerCase()))
      )
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + rowsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'RECEIVED': { class: 'bg-secondary', text: 'Received' },
      'ASSIGNED': { class: 'bg-info', text: 'Assigned' },
      'IN_PROGRESS': { class: 'bg-primary', text: 'In Progress' },
      'RESOLVED': { class: 'bg-success', text: 'Resolved' },
      'CLOSED': { class: 'bg-dark', text: 'Closed' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return `<span class="badge ${config.class}">${config.text}</span>`;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      'illegal_dumping': { class: 'bg-danger', text: 'Illegal Dumping' },
      'missed_pickup': { class: 'bg-warning text-dark', text: 'Missed Pickup' },
      'overflowing_bins': { class: 'bg-warning', text: 'Overflowing Bins' }
    };
    
    const config = typeConfig[type] || { class: 'bg-secondary', text: type };
    return `<span class="badge ${config.class}">${config.text}</span>`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading issues...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header pb-0 d-flex justify-content-between align-items-center">
              <h2
						className="fw-bold mb-1"
						style={{
							background:
								"linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
              fontSize:"2.5rem"
						}}
					>
						Issue Resolution Dashboard
					</h2>
              <div className="d-flex">
                <button className="btn btn-sm btn-outline-primary me-2">
                  <i className="fas fa-sync-alt me-1"></i> Refresh
                </button>
                <button className="btn btn-sm btn-primary">
                  <i className="fas fa-plus me-1"></i> New Issue
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="search" className="form-label">Search</label>
                    <input
                      type="text"
                      className="form-control"
                      id="search"
                      placeholder="Search issues..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="statusFilter" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="statusFilter"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="">All Statuses</option>
                      <option value="RECEIVED">Received</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="typeFilter" className="form-label">Type</label>
                    <select
                      className="form-select"
                      id="typeFilter"
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                      <option value="">All Types</option>
                      <option value="illegal_dumping">Illegal Dumping</option>
                      <option value="missed_pickup">Missed Pickup</option>
                      <option value="overflowing_bins">Overflowing Bins</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="rowsPerPage" className="form-label">Items per page</label>
                    <select
                      className="form-select"
                      id="rowsPerPage"
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Issues Table */}
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Type</th>
                      <th scope="col">Description</th>
                      <th scope="col">Status</th>
                      <th scope="col">Assigned To</th>
                      <th scope="col">Reported On</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedIssues.length > 0 ? (
                      paginatedIssues.map((issue) => {
                        const assignedDriver = drivers.find(d => d.id === issue.assigned_to);
                        return (
                          <tr key={issue.id}>
                            <td className="fw-bold">#{issue.id}</td>
                            <td>
                              <span dangerouslySetInnerHTML={{ __html: getTypeBadge(issue.type) }} />
                            </td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: '200px' }} title={issue.description}>
                                {issue.description}
                              </div>
                            </td>
                            <td>
                              <span dangerouslySetInnerHTML={{ __html: getStatusBadge(issue.status) }} />
                            </td>
                            <td>
                              {assignedDriver ? (
                                <div>
                                  <div className="fw-bold">{assignedDriver.name}</div>
                                  <small className="text-muted">{assignedDriver.vehicle_number}</small>
                                </div>
                              ) : (
                                <span className="text-muted">Unassigned</span>
                              )}
                            </td>
                            <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                            <td>
                              <div className="btn-group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleViewDetails(issue)}
                                  title="View Details"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleOpenAssignDialog(issue)}
                                  title="Assign Issue"
                                >
                                  <i className="fas fa-user-check"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-info" title="Track Location">
                                  <i className="fas fa-map-marker-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">
                          <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                          <p className="text-muted">No issues found matching your criteria</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredIssues.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredIssues.length)} of {filteredIssues.length} entries
                  </div>
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''} mx-2`}>
                          <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Issue Modal */}
      <div className={`modal fade ${assignDialogOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: assignDialogOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign Issue #{selectedIssue?.id}</h5>
              <button type="button" className="btn-close" onClick={() => setAssignDialogOpen(false)}></button>
            </div>
            <div className="modal-body">
              <p className="mb-3">{selectedIssue?.description}</p>
              <div className="form-group">
                <label className="form-label">Select a driver:</label>
                <select 
                  className="form-select"
                  value={selectedDriver} 
                  onChange={(e) => setSelectedDriver(e.target.value)}
                >
                  <option value="">Unassign</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.vehicle_number})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setAssignDialogOpen(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleAssignIssue}>Confirm Assignment</button>
            </div>
          </div>
        </div>
      </div>

      {/* View Issue Details Modal */}
      <div className={`modal fade ${viewDialogOpen ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: viewDialogOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Issue Details #{issueDetails?.id}</h5>
              <button type="button" className="btn-close" onClick={() => setViewDialogOpen(false)}></button>
            </div>
            <div className="modal-body">
              {issueDetails && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Issue Information</h6>
                      </div>
                      <div className="card-body">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <th width="30%">Type:</th>
                              <td>
                                <span dangerouslySetInnerHTML={{ __html: getTypeBadge(issueDetails.type) }} />
                              </td>
                            </tr>
                            <tr>
                              <th>Status:</th>
                              <td>
                                <span dangerouslySetInnerHTML={{ __html: getStatusBadge(issueDetails.status) }} />
                              </td>
                            </tr>
                            <tr>
                              <th>Description:</th>
                              <td>{issueDetails.description}</td>
                            </tr>
                            <tr>
                              <th>Reported On:</th>
                              <td>{new Date(issueDetails.created_at).toLocaleString()}</td>
                            </tr>
                            <tr>
                              <th>Address:</th>
                              <td>{issueDetails.address}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-header">
                        <h6 className="mb-0">Reporter Information</h6>
                      </div>
                      <div className="card-body">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <th width="30%">Name:</th>
                              <td>{issueDetails.reporter_name}</td>
                            </tr>
                            <tr>
                              <th>Phone:</th>
                              <td>{issueDetails.reporter_phone}</td>
                            </tr>
                            <tr>
                              <th>Reporter ID:</th>
                              <td>#{issueDetails.reporter_id}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {issueDetails.assigned_to && (
                      <div className="card">
                        <div className="card-header">
                          <h6 className="mb-0">Assigned Driver</h6>
                        </div>
                        <div className="card-body">
                          {(() => {
                            const driver = drivers.find(d => d.id === issueDetails.assigned_to);
                            return driver ? (
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <th width="30%">Name:</th>
                                    <td>{driver.name}</td>
                                  </tr>
                                  <tr>
                                    <th>Vehicle No:</th>
                                    <td>{driver.vehicle_number}</td>
                                  </tr>
                                  <tr>
                                    <th>Phone:</th>
                                    <td>{driver.phone}</td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setViewDialogOpen(false)}>Close</button>
              {!issueDetails?.assigned_to && (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleOpenAssignDialog(issueDetails);
                  }}
                >
                  Assign Driver
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuesView;