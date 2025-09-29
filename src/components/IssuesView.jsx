import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const IssuesView = () => {
  const [issues, setIssues] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [issueDetails, setIssueDetails] = useState(null);

  // Fetch drivers from Firebase users collection where role is 'driver'
  const fetchDrivers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'driver'));
      const querySnapshot = await getDocs(q);
      
      const driversData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        driversData.push({
          id: doc.id,
          name: data.name || 'Unknown Driver',
          vehicle: data.vehicle || 'Not assigned',
          phone: data.phone || 'Not provided',
          email: data.email || '',
          address: data.address || ''
        });
      });
      
      setDrivers(driversData);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  // Fetch issues from Firebase reports collection
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const reportsRef = collection(db, 'reports');
      let q = query(reportsRef, orderBy('createdAt', 'desc'));
      
      // Apply filters if they exist
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      const querySnapshot = await getDocs(q);
      const issuesData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        issuesData.push({
          id: doc.id,
          category: data.category || 'unknown',
          status: data.status || 'pending',
          notes: data.notes || 'No description provided',
          lat: data.lat || 0,
          lng: data.lng || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          assignedDriverId: data.assignedDriverId || null,
          userId: data.userId || 'Anonymous',
          qrCode: data.qrCode || '',
          verifiedAt: data.verifiedAt?.toDate() || null,
          verifiedBy: data.verifiedBy || '',
          photoBase64: data.photoBase64 || null // Add this field
        });
      });
      
      setIssues(issuesData);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    fetchIssues();
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
    setSelectedDriver(issue.assignedDriverId || '');
    setAssignDialogOpen(true);
  };

  const handleViewDetails = (issue) => {
    setIssueDetails(issue);
    setViewDialogOpen(true);
  };

  const handleAssignIssue = async () => {
    try {
      if (!selectedIssue) return;
      
      // Update the issue in Firebase
      const issueRef = doc(db, 'reports', selectedIssue.id);
      await updateDoc(issueRef, {
        assignedDriverId: selectedDriver || null,
        status: selectedDriver ? 'assigned' : 'pending'
      });
      
      // Update the issue in the local state
      const updatedIssues = issues.map(issue => 
        issue.id === selectedIssue.id ? { 
          ...issue, 
          assignedDriverId: selectedDriver,
          status: selectedDriver ? 'assigned' : 'pending'
        } : issue
      );
      
      setIssues(updatedIssues);
      setAssignDialogOpen(false);
      
      console.log(`Issue ${selectedIssue.id} assigned to driver ${selectedDriver}`);
    } catch (error) {
      console.error('Error assigning issue:', error);
    }
  };

  // Filter issues based on search filter
  const filteredIssues = issues.filter(issue => {
    return (
      (filters.search === '' || 
        issue.notes.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        (issue.assignedDriverId && drivers.find(d => d.id === issue.assignedDriverId)?.name.toLowerCase().includes(filters.search.toLowerCase()))
      )
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + rowsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'bg-secondary', text: 'Pending' },
      'assigned': { class: 'bg-info', text: 'Assigned' },
      'in_progress': { class: 'bg-primary', text: 'In Progress' },
      'resolved': { class: 'bg-success', text: 'Resolved' },
      'closed': { class: 'bg-dark', text: 'Closed' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return `<span class="badge ${config.class}">${config.text}</span>`;
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      'Still': { class: 'bg-danger', text: 'Still Dumping' },
      'Moving': { class: 'bg-warning text-dark', text: 'Moving Violation' },
      'Other': { class: 'bg-info', text: 'Other Issue' }
    };
    
    const config = categoryConfig[category] || { class: 'bg-secondary', text: category };
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
                  background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontSize: "2.5rem"
                }}
              >
                Issue Resolution Dashboard
              </h2>
              <div className="d-flex">
                <button className="btn btn-sm btn-outline-primary me-2" onClick={fetchIssues}>
                  <i className="fas fa-sync-alt me-1"></i> Refresh
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
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="categoryFilter" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="categoryFilter"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                      <option value="">All Categories</option>
                      <option value="Still">Still Dumping</option>
                      <option value="Moving">Moving Violation</option>
                      <option value="Other">Other Issue</option>
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
                      <th scope="col">Image</th>
                      <th scope="col">Category</th>
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
                        const assignedDriver = drivers.find(d => d.id === issue.assignedDriverId);
                        return (
                          <tr key={issue.id}>
                            <td className="fw-bold">
                              {issue.photoBase64 ? (
                                <img 
                                  src={`data:image/jpeg;base64,${issue.photoBase64}`} 
                                  alt="Issue" 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                              ) : (
                                `#${issue.id.substring(0, 8)}...`
                              )}
                            </td>
                            <td>
                              <span dangerouslySetInnerHTML={{ __html: getCategoryBadge(issue.category) }} />
                            </td>
                            <td>
                              <div className="text-truncate" style={{ maxWidth: '200px' }} title={issue.notes}>
                                {issue.notes}
                              </div>
                            </td>
                            <td>
                              <span dangerouslySetInnerHTML={{ __html: getStatusBadge(issue.status) }} />
                            </td>
                            <td>
                              {assignedDriver ? (
                                <div>
                                  <div className="fw-bold">{assignedDriver.name}</div>
                                  <small className="text-muted">{assignedDriver.vehicle}</small>
                                </div>
                              ) : (
                                <span className="text-muted">Unassigned</span>
                              )}
                            </td>
                            <td>{issue.createdAt.toLocaleDateString()}</td>
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
              <h5 className="modal-title">Assign Issue #{selectedIssue?.id?.substring(0, 8)}...</h5>
              <button type="button" className="btn-close" onClick={() => setAssignDialogOpen(false)}></button>
            </div>
            <div className="modal-body">
              {selectedIssue?.photoBase64 && (
                <div className="text-center mb-3">
                  <img 
                    src={`data:image/jpeg;base64,${selectedIssue.photoBase64}`} 
                    alt="Issue" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                  />
                </div>
              )}
              <p className="mb-3">{selectedIssue?.notes}</p>
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
                      {driver.name} ({driver.vehicle})
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
              <h5 className="modal-title">Issue Details #{issueDetails?.id?.substring(0, 8)}...</h5>
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
                        {issueDetails.photoBase64 && (
                          <div className="text-center mb-3">
                            <img 
                              src={`data:image/jpeg;base64,${issueDetails.photoBase64}`} 
                              alt="Issue" 
                              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
                            />
                          </div>
                        )}
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <th width="30%">Category:</th>
                              <td>
                                <span dangerouslySetInnerHTML={{ __html: getCategoryBadge(issueDetails.category) }} />
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
                              <td>{issueDetails.notes}</td>
                            </tr>
                            <tr>
                              <th>Reported On:</th>
                              <td>{issueDetails.createdAt.toLocaleString()}</td>
                            </tr>
                            <tr>
                              <th>Location:</th>
                              <td>Lat: {issueDetails.lat}, Lng: {issueDetails.lng}</td>
                            </tr>
                            {issueDetails.qrCode && (
                              <tr>
                                <th>QR Code:</th>
                                <td>{issueDetails.qrCode}</td>
                              </tr>
                            )}
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
                              <th width="30%">User ID:</th>
                              <td>{issueDetails.userId}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {issueDetails.assignedDriverId && (
                      <div className="card">
                        <div className="card-header">
                          <h6 className="mb-0">Assigned Driver</h6>
                        </div>
                        <div className="card-body">
                          {(() => {
                            const driver = drivers.find(d => d.id === issueDetails.assignedDriverId);
                            return driver ? (
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <th width="30%">Name:</th>
                                    <td>{driver.name}</td>
                                  </tr>
                                  <tr>
                                    <th>Vehicle:</th>
                                    <td>{driver.vehicle}</td>
                                  </tr>
                                  <tr>
                                    <th>Phone:</th>
                                    <td>{driver.phone}</td>
                                  </tr>
                                  <tr>
                                    <th>Email:</th>
                                    <td>{driver.email}</td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-muted">Driver information not available</p>
                            );
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
              {!issueDetails?.assignedDriverId && (
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