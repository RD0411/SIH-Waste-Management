import React, { useState, useEffect, useCallback } from "react";
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
	IconButton,
	LinearProgress,
	Alert,
	Tooltip,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import {
	Refresh as RefreshIcon,
	LocationOn as LocationIcon,
	DirectionsCar as VehicleIcon,
	Person as DriverIcon,
} from "@mui/icons-material";
import { auth } from "../firebase";
import MapComponent from "./MapComponent";

// Reusable Stat Card
const StatCard = ({ title, value, icon, color = "primary" }) => (
	<Card sx={{ height: 100, minWidth: 150, mb: 2 }} elevation={3}>
		<CardContent>
			<Box display="flex" justifyContent="space-between" alignItems="center">
				<Box>
					<Typography variant="overline" color="textSecondary">
						{title}
					</Typography>
					<Typography variant="h5" fontWeight={600}>
						{value}
					</Typography>
				</Box>
				<Box
					sx={{ fontSize: "2rem", color: (theme) => theme.palette[color].main }}
				>
					{icon}
				</Box>
			</Box>
		</CardContent>
	</Card>
);

// Scrollable Card wrapper
const ScrollableCard = ({ children, height = 400 }) => (
	<Paper
		sx={{
			p: 2,
			height,
			overflowY: "auto",
			scrollbarWidth: "none",
			"&::-webkit-scrollbar": { display: "none" },
		}}
		elevation={2}
	>
		{children}
	</Paper>
);

const FleetView = () => {
	const [drivers, setDrivers] = useState([]);
	const [liveLocations, setLiveLocations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(null);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const fetchFleetData = useCallback(async () => {
		try {
			setRefreshing(true);
			setError(null);

			// Mock data
			const mockDrivers = [
				{
					id: 1,
					name: "Rajesh Kumar",
					phone: "9876543210",
					vehicle_number: "KA01AB1234",
					is_active: true,
					vehicle_type: "Tata Ace",
					capacity: "750 kg",
				},
				{
					id: 2,
					name: "Suresh Patel",
					phone: "9765432109",
					vehicle_number: "KA01CD5678",
					is_active: true,
					vehicle_type: "Ashok Leyland",
					capacity: "1500 kg",
				},
				{
					id: 3,
					name: "Mohan Singh",
					phone: "9654321098",
					vehicle_number: "KA01EF9012",
					is_active: false,
					vehicle_type: "Mahindra Bolero",
					capacity: "1000 kg",
				},
			];

			const mockLocations = [
				{
					driver_id: 1,
					lat: 12.9816,
					lng: 77.6046,
					timestamp: new Date(),
					speed: 32,
				},
				{
					driver_id: 2,
					lat: 12.9516,
					lng: 77.5846,
					timestamp: new Date(),
					speed: 0,
				},
			];

			await new Promise((resolve) => setTimeout(resolve, 500));
			setDrivers(mockDrivers);
			setLiveLocations(mockLocations);
			setLastUpdated(new Date());
		} catch (err) {
			console.error(err);
			setError("Failed to load fleet data.");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		fetchFleetData();
		const interval = setInterval(fetchFleetData, 30000);
		return () => clearInterval(interval);
	}, [fetchFleetData]);

	const handleRefresh = () => fetchFleetData();

	const activeDrivers = drivers.filter((d) => d.is_active).length;
	const idleDrivers = liveLocations.filter((loc) => loc.speed === 0).length;
	const movingDrivers = liveLocations.filter((loc) => loc.speed > 0).length;

	const locationMap = {};
	liveLocations.forEach((loc) => (locationMap[loc.driver_id] = loc));

	if (loading)
		return (
			<Box>
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
					Fleet & Workforce Management
				</h2>
				<LinearProgress />
				<Typography sx={{ mt: 1 }} variant="body2">
					Loading fleet data...
				</Typography>
			</Box>
		);

	return (
		<div className="container">
			{/* Header */}
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={3}
			>
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
					Fleet & Workforce Management
				</h2>

				<Box display="flex" alignItems="center">
					<Tooltip title="Refresh">
						<IconButton
							onClick={handleRefresh}
							disabled={refreshing}
							color="primary"
						>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
					{lastUpdated && (
						<Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
							Updated: {lastUpdated.toLocaleTimeString()}
						</Typography>
					)}
				</Box>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
					{error}
				</Alert>
			)}

			{/* Top Section: Map + Stats */}
			<Grid
				container
				spacing={2}
				display="flex"
				justifyContent="space-between"
				alignItems="space-between"
				mb={3}
			>
				{/* Left Column: Map */}
				<Grid item xs={12} md={8} sx={{ width: { xs: "100%", md: "80%" } }}>
					<ScrollableCard height={isMobile ? 250 : 500}>
						<Typography variant="h6" fontWeight={500} mb={1}>
							Live Driver Locations
						</Typography>
						<MapComponent locations={liveLocations} drivers={drivers} />
					</ScrollableCard>
				</Grid>

				{/* Right Column: Stats */}
				<Grid
					item
					xs={12}
					md={4}
					sx={{ width: { xs: "100%", md: "18%" } }}
					display="flex"
					justifyContent="space-between"
					alignItems="space-between"
					flexDirection="column"
				>
					<StatCard
						title="Total Drivers"
						value={drivers.length}
						icon={<DriverIcon />}
					/>
					<StatCard
						title="Active Drivers"
						value={activeDrivers}
						icon={<LocationIcon />}
						color="success"
					/>
					<StatCard
						title="Idle Vehicles"
						value={idleDrivers}
						icon={<VehicleIcon />}
						color="warning"
					/>
					<StatCard
						title="In Motion Vehicles"
						value={movingDrivers}
						icon={<VehicleIcon />}
						color="info"
					/>
				</Grid>
			</Grid>

			{/* Bottom Section: Tables */}
			<div className="row w-100 g-3">
				{/* Left Column: Driver Status Summary */}
				<div className="col-12 col-md-5">
					<div
						className="card h-100 overflow-auto"
						style={{ maxHeight: "400px", scrollbarWidth: "none" }}
					>
						<div className="card-body">
							<h6 className="card-title fw-bold mb-3">Driver Status Summary</h6>
							<div className="row g-2">
								{drivers.map((driver) => {
									const loc = locationMap[driver.id];
									return (
										<div className="col-12 col-sm-6 col-lg-4" key={driver.id}>
											<div className="card border">
												<div className="card-body p-2 d-flex justify-content-between align-items-center">
													<div>
														<div className="fw-semibold">{driver.name}</div>
														<div className="text-muted small">
															{driver.vehicle_number}
														</div>
													</div>
													<span
														className={`badge ${
															!driver.is_active
																? "bg-secondary"
																: loc?.speed > 0
																? "bg-primary"
																: "bg-warning"
														}`}
													>
														{loc
															? loc.speed > 0
																? "MOVING"
																: "IDLE"
															: "OFFLINE"}
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				{/* Right Column: All Drivers Table */}
				<div className="col-12 col-md-7">
					<div
						className="card h-100 overflow-auto"
						style={{ maxHeight: "400px", scrollbarWidth: "none" }}
					>
						<div className="card-body">
							<h6 className="card-title fw-bold mb-3">All Drivers</h6>
							<div className="table-responsive">
								<table className="table table-sm table-hover">
									<thead className="table-light">
										<tr>
											<th>Driver</th>
											<th>Contact</th>
											<th>Vehicle</th>
											<th>Status</th>
											<th>Last Update</th>
											<th>Speed</th>
										</tr>
									</thead>
									<tbody>
										{drivers.map((driver) => {
											const loc = locationMap[driver.id];
											return (
												<tr key={driver.id}>
													<td>{driver.name}</td>
													<td>{driver.phone}</td>
													<td>
														<div>{driver.vehicle_number}</div>
														<div className="text-muted small">
															{driver.vehicle_type} • {driver.capacity}
														</div>
													</td>
													<td>
														<span
															className={`badge ${
																!driver.is_active
																	? "bg-secondary"
																	: loc
																	? "bg-success"
																	: "bg-warning"
															}`}
														>
															{driver.is_active
																? loc
																	? "ACTIVE"
																	: "INACTIVE"
																: "OFFLINE"}
														</span>
													</td>
													<td>
														{loc
															? new Date(loc.timestamp).toLocaleTimeString()
															: "N/A"}
													</td>
													<td>{loc ? `${loc.speed} km/h` : "N/A"}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FleetView;
