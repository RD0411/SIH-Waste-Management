import React, { useState, useEffect } from "react";
import {
	Box,
	Paper,
	Typography,
	Grid,
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Switch,
	Tab,
	Tabs,
	AppBar,
	Toolbar,
} from "@mui/material";
import {
	Edit,
	Delete,
	Add,
	Directions,
	Assignment,
	Person,
	LocationOn,
	Schedule,
	AssignmentInd,
} from "@mui/icons-material";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Polyline,
} from "react-leaflet";
import L from "leaflet";
import { auth } from "../firebase";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const RouteManagementView = () => {
	const [drivers, setDrivers] = useState([]);
	const [routes, setRoutes] = useState([]);
	const [collectionSpots, setCollectionSpots] = useState([]);
	const [loading, setLoading] = useState(true);
	const [assignDialogOpen, setAssignDialogOpen] = useState(false);
	const [spotDialogOpen, setSpotDialogOpen] = useState(false);
	const [driverAssignmentDialogOpen, setDriverAssignmentDialogOpen] =
		useState(false);
	const [selectedRoute, setSelectedRoute] = useState(null);
	const [selectedSpot, setSelectedSpot] = useState(null);
	const [routeForDriverAssignment, setRouteForDriverAssignment] =
		useState(null);
	const [selectedDriverForAssignment, setSelectedDriverForAssignment] =
		useState("");
	const [activeTab, setActiveTab] = useState(0);
	const [mapCenter] = useState([12.9716, 77.5946]);

	// Mock data
	const mockDrivers = [
		{
			id: 1,
			name: "Rajesh Kumar",
			phone: "9876543210",
			vehicle: "KA01AB1234",
			is_available: true,
			current_route: null,
		},
		{
			id: 2,
			name: "Suresh Patel",
			phone: "9765432109",
			vehicle: "KA01CD5678",
			is_available: true,
			current_route: null,
		},
		{
			id: 3,
			name: "Mahesh Singh",
			phone: "9654321098",
			vehicle: "KA01EF9012",
			is_available: false,
			current_route: 1,
		},
	];

	const mockCollectionSpots = [
		{
			id: 1,
			name: "Sunshine Apartments",
			address: "123 Main Street",
			lat: 12.9756,
			lng: 77.6006,
			type: "residential",
			frequency: "daily",
		},
		{
			id: 2,
			name: "Central Market",
			address: "456 Commercial Road",
			lat: 12.9686,
			lng: 77.5886,
			type: "commercial",
			frequency: "twice_daily",
		},
		{
			id: 3,
			name: "Green Valley Society",
			address: "789 Park Avenue",
			lat: 12.9736,
			lng: 77.5906,
			type: "residential",
			frequency: "daily",
		},
	];

	const mockRoutes = [
		{
			id: 1,
			name: "Central Ward Morning Route",
			driver_id: 3,
			driver_name: "Mahesh Singh",
			spots: [1, 3],
			schedule: "mon_wed_fri",
			start_time: "08:00",
			end_time: "12:00",
			status: "active",
			assigned_date: new Date("2024-01-15"),
		},
		{
			id: 2,
			name: "Commercial Area Route",
			driver_id: null,
			driver_name: null,
			spots: [2],
			schedule: "tue_thu_sat",
			start_time: "09:00",
			end_time: "13:00",
			status: "pending",
			assigned_date: null,
		},
	];

	useEffect(() => {
		setTimeout(() => {
			setDrivers(mockDrivers);
			setRoutes(mockRoutes);
			setCollectionSpots(mockCollectionSpots);
			setLoading(false);
		}, 1000);
	}, []);

	const handleAssignDriver = (route) => {
		setRouteForDriverAssignment(route);
		setSelectedDriverForAssignment(route.driver_id || "");
		setDriverAssignmentDialogOpen(true);
	};

	const handleSaveDriverAssignment = () => {
		if (!routeForDriverAssignment || !selectedDriverForAssignment) return;

		const driver = drivers.find(
			(d) => d.id === parseInt(selectedDriverForAssignment)
		);

		// Update route with driver assignment
		const updatedRoutes = routes.map((route) =>
			route.id === routeForDriverAssignment.id
				? {
						...route,
						driver_id: parseInt(selectedDriverForAssignment),
						driver_name: driver?.name,
						status: "active",
						assigned_date: new Date(),
				  }
				: route
		);

		// Update driver availability and current route
		const updatedDrivers = drivers.map((d) => {
			if (d.id === parseInt(selectedDriverForAssignment)) {
				return {
					...d,
					current_route: routeForDriverAssignment.id,
					is_available: false,
				};
			}
			// If driver was previously assigned to this route, make them available
			if (
				d.current_route === routeForDriverAssignment.id &&
				d.id !== parseInt(selectedDriverForAssignment)
			) {
				return { ...d, current_route: null, is_available: true };
			}
			return d;
		});

		setRoutes(updatedRoutes);
		setDrivers(updatedDrivers);
		setDriverAssignmentDialogOpen(false);
	};

	const handleUnassignDriver = (routeId) => {
		const route = routes.find((r) => r.id === routeId);
		if (route && route.driver_id) {
			// Update driver availability
			const updatedDrivers = drivers.map((driver) =>
				driver.id === route.driver_id
					? { ...driver, current_route: null, is_available: true }
					: driver
			);

			// Remove driver from route
			const updatedRoutes = routes.map((r) =>
				r.id === routeId
					? {
							...r,
							driver_id: null,
							driver_name: null,
							status: "pending",
							assigned_date: null,
					  }
					: r
			);

			setDrivers(updatedDrivers);
			setRoutes(updatedRoutes);
		}
	};

	const getAvailableDrivers = () => {
		return drivers.filter((driver) => driver.is_available);
	};

	const getRouteSpots = (route) => {
		return route.spots
			.map((spotId) => collectionSpots.find((s) => s.id === spotId))
			.filter(Boolean);
	};

	const getScheduleText = (schedule) => {
		const scheduleMap = {
			daily: "Daily",
			mon_wed_fri: "Mon, Wed, Fri",
			tue_thu_sat: "Tue, Thu, Sat",
			weekly: "Weekly",
			twice_daily: "Twice Daily",
		};
		return scheduleMap[schedule] || schedule;
	};

	if (loading) return <Typography>Loading route data...</Typography>;

	return (
		<Box>
			<div className="container-fluid px-4 py-4">
				{/* Header Section */}
				<div className="d-flex justify-content-between align-items-center mb-5">
					<div>
						<h1 className="display-6 fw-bold text-dark mb-1">
							Route & Driver Assignment
						</h1>
						<p className="text-muted mb-0">
							Manage collection routes and driver assignments efficiently
						</p>
					</div>
					<div className="d-flex">
						<button
							className="btn btn-outline-primary me-3 glass-btn"
							onClick={() => setSpotDialogOpen(true)}
						>
							<i className="fas fa-plus-circle me-2"></i>
							Add Collection Spot
						</button>
						<button
							className="btn btn-primary glass-btn-primary"
							onClick={() => setAssignDialogOpen(true)}
						>
							<i className="fas fa-route me-2"></i>
							Create New Route
						</button>
					</div>
				</div>

				{/* Tabs Navigation */}
				<div className="card glass-card border-0 shadow-sm mb-4">
					<div className="card-body p-2">
						<ul className="nav nav-pills nav-fill" role="tablist">
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === 0 ? "active" : ""
									} d-flex justify-content-center`}
									onClick={() => setActiveTab(0)}
									type="button"
									role="tab"
								>
									<i className="fas fa-map-marked-alt me-2"></i>
									Route Map
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === 1 ? "active" : ""
									} d-flex justify-content-center`}
									onClick={() => setActiveTab(1)}
									type="button"
									role="tab"
								>
									<i className="fas fa-user-check me-2"></i>
									Driver Assignment
								</button>
							</li>
							<li className="nav-item" role="presentation">
								<button
									className={`nav-link ${
										activeTab === 2 ? "active" : ""
									} d-flex justify-content-center`}
									onClick={() => setActiveTab(2)}
									type="button"
									role="tab"
								>
									<i className="fas fa-location-dot me-2"></i>
									Collection Spots
								</button>
							</li>
						</ul>
					</div>
				</div>

				{/* CSS */}
				<style>{`
    /* Glassmorphism effects */
    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 12px;
    }

    .glass-btn {
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .glass-btn:hover {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(13, 110, 253, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);
      color : #257CFD;
    }

    .glass-btn-primary {
      background: rgba(13, 110, 253, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 0.6rem 1.2rem;
      font-weight: 500;
      color: white;
      transition: all 0.3s ease;
    }

    .glass-btn-primary:hover {
      background: rgba(13, 110, 253, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
      color: white;
    }

    /* Navigation pills styling */
    .nav-pills .nav-link {
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      color: var(--dark-text);
      font-weight: 500;
      transition: all 0.3s ease;
      margin: 0 0.25rem;
    }

    .nav-pills .nav-link:hover {
      background: rgba(13, 110, 253, 0.1);
      color: var(--primary-color);
    }

    .nav-pills .nav-link.active {
      background: rgba(13, 110, 253, 0.9);
      color: white;
      box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);
    }

    /* Header text styles */
    .display-6 {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .d-flex.justify-content-between {
        flex-direction: column;
        text-align: center;
      }
      
      .d-flex.justify-content-between > div {
        width: 100%;
      }
      
      .d-flex.justify-content-between > div:first-child {
        margin-bottom: 1.5rem;
      }
      
      .d-flex {
        justify-content: center !important;
      }
      
      .nav-pills .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
      }
    }
  `}</style>
			</div>

			{activeTab === 0 && (
				<div className="container-fluid py-4">
					<div className="row g-4">
						{/* Collection Routes Map */}
						<div className="col-lg-8">
							<div className="card glass-card border-0 shadow-lg overflow-hidden">
								<div className="card-header bg-transparent border-0 pt-4">
									<h5 className="card-title mb-0 text-dark fw-bold">
										<i className="fas fa-map-marked-alt me-2"></i>
										Collection Routes Map
									</h5>
								</div>
								<div className="card-body p-0 position-relative">
									<div className="map-overlay-blur"></div>
									<MapContainer
										center={mapCenter}
										zoom={12}
										style={{ height: "400px", width: "100%" }}
										className="position-relative z-1"
									>
										<TileLayer
											attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
											url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										/>
										{collectionSpots.map((spot) => (
											<Marker key={spot.id} position={[spot.lat, spot.lng]}>
												<Popup className="custom-popup">
													<div className="p-2">
														<h6 className="fw-bold text-primary mb-1">
															{spot.name}
														</h6>
														<p className="mb-1 small">{spot.address}</p>
														<span className="badge bg-info">{spot.type}</span>
													</div>
												</Popup>
											</Marker>
										))}
										{routes.map((route) => {
											const spots = getRouteSpots(route);
											if (spots.length > 1) {
												const positions = spots.map((spot) => [
													spot.lat,
													spot.lng,
												]);
												return (
													<Polyline
														key={route.id}
														positions={positions}
														color={
															route.driver_id
																? "var(--bs-primary)"
																: "var(--bs-secondary)"
														}
														weight={4}
														opacity={0.8}
													/>
												);
											}
											return null;
										})}
									</MapContainer>
								</div>
							</div>
						</div>

						{/* Route Status Summary */}
						<div className="col-lg-4">
							<div className="card glass-card border-0 shadow-lg h-100">
								<div className="card-header bg-transparent border-0 pt-4">
									<h5 className="card-title mb-0 text-dark fw-bold">
										<i className="fas fa-chart-pie me-2"></i>
										Route Status Summary
									</h5>
								</div>
								<div className="card-body">
									<div className="row g-3">
										<div className="col-6">
											<div className="stats-card bg-primary-blur p-3 rounded-4 text-center">
												<div className="stats-icon mb-2">
													<i className="fas fa-route fa-2x text-primary"></i>
												</div>
												<h3 className="fw-bold mb-0">{routes.length}</h3>
												<p className="text-muted small mb-0">Total Routes</p>
											</div>
										</div>
										<div className="col-6">
											<div className="stats-card bg-success-blur p-3 rounded-4 text-center">
												<div className="stats-icon mb-2">
													<i className="fas fa-user-check fa-2x text-success"></i>
												</div>
												<h3 className="fw-bold text-success mb-0">
													{routes.filter((r) => r.driver_id).length}
												</h3>
												<p className="text-muted small mb-0">Assigned</p>
											</div>
										</div>
										<div className="col-6">
											<div className="stats-card bg-warning-blur p-3 rounded-4 text-center">
												<div className="stats-icon mb-2">
													<i className="fas fa-clock fa-2x text-warning"></i>
												</div>
												<h3 className="fw-bold text-warning mb-0">
													{routes.filter((r) => !r.driver_id).length}
												</h3>
												<p className="text-muted small mb-0">Pending</p>
											</div>
										</div>
										<div className="col-6">
											<div className="stats-card bg-info-blur p-3 rounded-4 text-center">
												<div className="stats-icon mb-2">
													<i className="fas fa-users fa-2x text-info"></i>
												</div>
												<h3 className="fw-bold mb-0">
													{drivers.filter((d) => d.is_available).length}
												</h3>
												<p className="text-muted small mb-0">Active Drivers</p>
											</div>
										</div>
									</div>

									{/* Quick Actions */}
									<div className="mt-4 pt-3 border-top">
										<h6 className="fw-semibold mb-3">Quick Actions</h6>
										<div className="d-grid gap-2">
											<button className="btn btn-outline-primary">
												<i className="fas fa-download me-2"></i>
												Export Report
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{activeTab === 1 && (
				<div className="container-fluid">
					<div className="row g-4">
						{/* Routes for Assignment */}
						<div className="col-lg-8">
							<div className="card glass-card border-0 shadow-lg">
								<div className="card-header bg-transparent border-0 pt-4">
									<h5 className="card-title mb-0 text-dark fw-bold">
										<i className="fas fa-route me-2"></i>
										Routes for Assignment
									</h5>
								</div>
								<div className="card-body p-0">
									<div className="table-responsive overflow-auto custom-scroll">
										<table className="table table-hover align-middle mb-0">
											<thead className="table-light">
												<tr>
													<th scope="col" className="ps-4">
														Route Name
													</th>
													<th scope="col">Schedule</th>
													<th scope="col">Spots</th>
													<th scope="col">Assigned Driver</th>
													<th scope="col">Status</th>
													<th scope="col" className="text-center pe-4">
														Actions
													</th>
												</tr>
											</thead>
											<tbody>
												{routes.map((route) => (
													<tr key={route.id} className="py-3">
														<td className="ps-4">
															<div className="d-flex align-items-center">
																<i className="fas fa-route text-primary me-2"></i>
																<span className="fw-semibold">
																	{route.name}
																</span>
															</div>
														</td>
														<td>
															<span className="badge bg-light text-dark">
																{getScheduleText(route.schedule)}
															</span>
														</td>
														<td>
															<span className="badge bg-primary rounded-pill">
																{route.spots.length}
															</span>
														</td>
														<td>
															{route.driver_name ? (
																<div>
																	<div className="fw-semibold">
																		{route.driver_name}
																	</div>
																	<small className="text-muted">
																		Assigned:{" "}
																		{route.assigned_date
																			? new Date(
																					route.assigned_date
																			  ).toLocaleDateString()
																			: "N/A"}
																	</small>
																</div>
															) : (
																<span className="text-muted">Unassigned</span>
															)}
														</td>
														<td>
															<span
																className={`badge ${
																	route.status === "active"
																		? "bg-success"
																		: "bg-warning"
																} rounded-pill`}
															>
																{route.status.toUpperCase()}
															</span>
														</td>
														<td className="text-center pe-4">
															{route.driver_id ? (
																<button
																	className="btn btn-sm btn-outline-danger"
																	onClick={() => handleUnassignDriver(route.id)}
																>
																	<i className="fas fa-user-times me-1"></i>
																	Unassign
																</button>
															) : (
																<button
																	className="btn btn-sm btn-primary"
																	onClick={() => handleAssignDriver(route)}
																>
																	<i className="fas fa-user-check me-1"></i>
																	Assign Driver
																</button>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>

						{/* Available Drivers */}
						<div className="col-lg-4">
							<div className="card glass-card border-0 shadow-lg h-100">
								<div className="card-header bg-transparent border-0 pt-4">
									<h5 className="card-title mb-0 text-dark fw-bold">
										<i className="fas fa-users me-2"></i>
										Available Drivers
									</h5>
								</div>
								<div className="card-body">
									<div className="container">
										<div className="list-group list-group-flush">
											{drivers.map((driver) => (
												<div
													key={driver.id}
													className="list-group-item bg-transparent border-0 px-4 py-3"
												>
													<div className="d-flex align-items-start">
														<div
															className={`flex-shrink-0 rounded-circle p-2 ${
																driver.is_available
																	? "bg-success-blur"
																	: "bg-secondary-blur"
															}`}
														>
															<i
																className={`fas fa-user ${
																	driver.is_available
																		? "text-success"
																		: "text-secondary"
																}`}
															></i>
														</div>
														<div className="flex-grow-1 ms-3">
															<div className="d-flex justify-content-between align-items-center">
																<h6 className="mb-0 fw-semibold">
																	{driver.name}
																</h6>
																<span
																	className={`badge ${
																		driver.is_available
																			? "bg-success"
																			: "bg-secondary"
																	} rounded-pill`}
																>
																	{driver.is_available
																		? "AVAILABLE"
																		: "ON ROUTE"}
																</span>
															</div>
															<p className="text-muted small mb-1 text-lg-start text-center">
																{driver.vehicle} • {driver.phone}
															</p>
															{driver.current_route && (
																<p className="small mb-0 text-lg-start text-center">
																	<i className="fas fa-route text-info me-1"></i>
																	Route:{" "}
																	{
																		routes.find(
																			(r) => r.id === driver.current_route
																		)?.name
																	}
																</p>
															)}
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* CSS */}
					<style>{`
      .glass-card {
        background: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: var(--card-radius);
        overflow: hidden;
      }

      .bg-success-blur {
        background: rgba(25, 135, 84, 0.15) !important;
      }

      .bg-secondary-blur {
        background: rgba(108, 117, 125, 0.15) !important;
      }

      .table thead th {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.8rem;
        letter-spacing: 0.5px;
      }

      .table tbody tr {
        transition: all 0.2s ease;
        border-bottom: 1px solid rgba(0, 0, 0, 0.03);
      }

      .table tbody tr:hover {
        background: rgba(13, 110, 253, 0.05) !important;
        transform: translateY(-1px);
      }

      .list-group-item {
        transition: all 0.2s ease;
      }

      .list-group-item:hover {
        background: rgba(13, 110, 253, 0.05) !important;
      }

      .btn {
        transition: all 0.2s ease;
      }

      .btn-outline-danger {
        box-shadow: 0 2px 4px rgba(220, 53, 69, 0.1);
      }

      .btn-outline-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(220, 53, 69, 0.15);
      }

      .badge {
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .badge.rounded-pill {
        padding: 0.35em 0.65em;
      }

      @media (max-width: 992px) {
        .table-responsive {
          border-radius: var(--card-radius);
          overflow: hidden;
        }

        .glass-card {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      }
    `}</style>
				</div>
			)}

			{/* Driver Assignment Dialog */}
			<Dialog
				open={driverAssignmentDialogOpen}
				onClose={() => setDriverAssignmentDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					Assign Driver to Route: {routeForDriverAssignment?.name}
				</DialogTitle>
				<DialogContent>
					<Typography gutterBottom sx={{ mb: 2 }}>
						Schedule:{" "}
						{routeForDriverAssignment &&
							getScheduleText(routeForDriverAssignment.schedule)}
					</Typography>

					<FormControl fullWidth>
						<InputLabel>Select Driver</InputLabel>
						<Select
							value={selectedDriverForAssignment}
							onChange={(e) => setSelectedDriverForAssignment(e.target.value)}
							label="Select Driver"
						>
							<MenuItem value="">Unassign</MenuItem>
							{getAvailableDrivers().map((driver) => (
								<MenuItem key={driver.id} value={driver.id}>
									{driver.name} ({driver.vehicle}) - {driver.phone}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{selectedDriverForAssignment && (
						<Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
							<Typography variant="subtitle2" gutterBottom>
								Route Details:
							</Typography>
							<Typography variant="body2">
								• {routeForDriverAssignment?.spots.length} collection spots
							</Typography>
							<Typography variant="body2">
								• Timing: {routeForDriverAssignment?.start_time} -{" "}
								{routeForDriverAssignment?.end_time}
							</Typography>
							<Typography variant="body2">
								• Frequency:{" "}
								{routeForDriverAssignment &&
									getScheduleText(routeForDriverAssignment.schedule)}
							</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDriverAssignmentDialogOpen(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSaveDriverAssignment}
						variant="contained"
						disabled={!selectedDriverForAssignment}
					>
						Assign Driver
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add other dialogs (route creation, spot management) from previous implementation */}
		</Box>
	);
};

export default RouteManagementView;
