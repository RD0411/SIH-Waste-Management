import React, { useState, useEffect } from 'react';

const EnforcementView = () => {
  const [penalties, setPenalties] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [penaltyType, setPenaltyType] = useState('warning');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
      evidence_photos: ['photo1.jpg', 'photo2.jpg'],
      status: 'pending',
      description: 'Waste was not segregated into wet and dry categories. Mixed waste found in the same bin.'
    },
    {
      id: 2,
      household_id: 'H1002',
      household_name: 'Green Valley Apartments - B102',
      address: '456 Oak Avenue, Bengaluru',
      violation_type: 'illegal_dumping',
      violation_date: new Date('2024-01-14'),
      reported_by: 'Green Champion Suresh',
      evidence_photos: ['photo3.jpg'],
      status: 'penalty_issued',
      description: 'Household waste dumped in non-designated area near the park.'
    },
    {
      id: 3,
      household_id: 'C2001',
      household_name: 'City Mall Food Court',
      address: '789 Commercial Street, Bengaluru',
      violation_type: 'non_segregation',
      violation_date: new Date('2024-01-13'),
      reported_by: 'ULB Inspector',
      evidence_photos: ['photo4.jpg', 'photo5.jpg', 'photo6.jpg'],
      status: 'warning_issued',
      description: 'Food court vendors not following segregation guidelines. Mixed waste observed during inspection.'
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

  const handleViewDetails = (violation) => {
    setSelectedViolation(violation);
    setViewDialogOpen(true);
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
      case 'penalty_issued': return 'danger';
      case 'resolved': return 'success';
      default: return 'secondary';
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

  const getViolationTypeIcon = (type) => {
    switch (type) {
      case 'non_segregation': return '🚮';
      case 'illegal_dumping': return '⚠️';
      case 'missed_pickup': return '🗑️';
      default: return '❓';
    }
  };

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.household_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.reported_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-gray-800" style={{
							background:
								"linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							backgroundClip: "text",
              fontSize: "2.5rem"
						}}>Enforcement & Penalty Management</h2>
        <button className="btn btn-primary">
          <i className="fas fa-download me-2"></i>
          Export Report
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Violations
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{violations.length}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
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
                    Pending Actions
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {violations.filter(v => v.status === 'pending').length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-filter fa-2x text-gray-300"></i>
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
                    Total Fines Issued
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    ₹{penalties.filter(p => p.type === 'fine').reduce((sum, p) => sum + p.amount, 0)}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-money-bill-wave fa-2x text-gray-300"></i>
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
                    Resolved Cases
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {violations.filter(v => v.status === 'resolved').length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Violations</h6>
              <div className="d-flex flex-md-row flex-column">
                <div className="input-group me-2" style={{ width: '250px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search violations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="warning_issued">Warning Issued</option>
                  <option value="penalty_issued">Penalty Issued</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead className="thead-light">
                    <tr>
                      <th>Household</th>
                      <th>Violation Type</th>
                      <th>Reported By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredViolations.map((violation) => (
                      <tr key={violation.id}>
                        <td>
                          <div className="font-weight-bold text-primary">{violation.household_name}</div>
                          <small className="text-muted">{violation.address}</small>
                        </td>
                        <td>
                          <span className="me-2">{getViolationTypeIcon(violation.violation_type)}</span>
                          {getViolationTypeText(violation.violation_type)}
                        </td>
                        <td>{violation.reported_by}</td>
                        <td>{new Date(violation.violation_date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(violation.status)}`}>
                            {violation.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleViewDetails(violation)}
                            >
                              <i className="fas fa-eye me-1"></i>
                              View
                            </button>
                            {violation.status === 'pending' && (
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleIssuePenalty(violation)}
                              >
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                Take Action
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredViolations.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No violations found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Recent Penalties</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead className="thead-light">
                    <tr>
                      <th>Household</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {penalties.map((penalty) => (
                      <tr key={penalty.id}>
                        <td>H{penalty.household_id}</td>
                        <td>
                          <span className={`badge bg-${penalty.type === 'fine' ? 'danger' : 'warning'}`}>
                            {penalty.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="font-weight-bold">
                          {penalty.type === 'fine' ? `₹${penalty.amount}` : '-'}
                        </td>
                        <td>
                          <span className={`badge bg-${penalty.status === 'unpaid' ? 'danger' : 'success'}`}>
                            {penalty.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {penalties.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No penalties issued yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Violation Statistics</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Non-Segregation</span>
                  <span className="font-weight-bold">
                    {violations.filter(v => v.violation_type === 'non_segregation').length}
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: `${(violations.filter(v => v.violation_type === 'non_segregation').length / violations.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Illegal Dumping</span>
                  <span className="font-weight-bold">
                    {violations.filter(v => v.violation_type === 'illegal_dumping').length}
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: `${(violations.filter(v => v.violation_type === 'illegal_dumping').length / violations.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Missed Pickup</span>
                  <span className="font-weight-bold">
                    {violations.filter(v => v.violation_type === 'missed_pickup').length}
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${(violations.filter(v => v.violation_type === 'missed_pickup').length / violations.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Penalty Modal */}
      {issueDialogOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Issue Penalty for {selectedViolation?.household_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIssueDialogOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  <strong>Violation:</strong> {selectedViolation && getViolationTypeText(selectedViolation.violation_type)}
                </p>
                
                <div className="mb-3">
                  <label className="form-label">Action Type</label>
                  <select
                    className="form-select"
                    value={penaltyType}
                    onChange={(e) => setPenaltyType(e.target.value)}
                  >
                    <option value="warning">Warning Notice</option>
                    <option value="fine">Monetary Fine</option>
                    <option value="suspension">Collection Suspension</option>
                  </select>
                </div>

                {penaltyType === 'fine' && (
                  <div className="mb-3">
                    <label className="form-label">Fine Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={penaltyAmount}
                      onChange={(e) => setPenaltyAmount(e.target.value)}
                    />
                  </div>
                )}

                {penaltyType === 'suspension' && (
                  <div className="alert alert-warning">
                    <strong>Warning:</strong> This will suspend waste collection for this household until the issue is resolved.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIssueDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitPenalty}
                >
                  {penaltyType === 'warning' ? 'Issue Warning' : 
                   penaltyType === 'fine' ? 'Issue Fine' : 'Suspend Service'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Details Modal */}
      {viewDialogOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Violation Details - {selectedViolation?.household_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewDialogOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-primary">Violation Information</h6>
                    <p><strong>Type:</strong> {getViolationTypeText(selectedViolation.violation_type)}</p>
                    <p><strong>Date:</strong> {new Date(selectedViolation.violation_date).toLocaleDateString()}</p>
                    <p><strong>Reported By:</strong> {selectedViolation.reported_by}</p>
                    <p><strong>Status:</strong> 
                      <span className={`badge bg-${getStatusColor(selectedViolation.status)} ms-2`}>
                        {selectedViolation.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary">Household Details</h6>
                    <p><strong>Household ID:</strong> {selectedViolation.household_id}</p>
                    <p><strong>Name:</strong> {selectedViolation.household_name}</p>
                    <p><strong>Address:</strong> {selectedViolation.address}</p>
                  </div>
                </div>
                
                <h6 className="text-primary">Description</h6>
                <p className="p-3 bg-light rounded">{selectedViolation.description}</p>
                
                <h6 className="text-primary mt-4">Evidence Photos</h6>
                <div className="d-flex flex-wrap gap-2">
                  {selectedViolation.evidence_photos.map((photo, index) => (
                    <div key={index} className="border rounded p-2" style={{ width: '100px', height: '100px' }}>
                      <div className="bg-secondary h-75 d-flex align-items-center justify-content-center">
                        <i className="fas fa-image text-white"></i>
                      </div>
                      <small className="d-block text-truncate">{photo}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </button>
                {selectedViolation.status === 'pending' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleIssuePenalty(selectedViolation);
                    }}
                  >
                    Take Action
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {(issueDialogOpen || viewDialogOpen) && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default EnforcementView;