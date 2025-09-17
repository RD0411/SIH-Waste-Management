package com.example.wastemanagementdriver;

import android.Manifest;
import android.content.Intent;
import android.location.Location;
import android.os.Bundle;
import android.view.*;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

import org.osmdroid.api.IMapController;
import org.osmdroid.config.Configuration;
import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.util.BoundingBox;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Marker;
import org.osmdroid.views.overlay.Polyline;

import java.util.*;

public class DriverDashboardFragment extends Fragment {

    private MapView osmMap;
    private FusedLocationProviderClient fused;
    private Location lastLocation;
    private FirebaseAuth auth;
    private FirebaseFirestore db;
    private TextView tvRouteInfo;
    private Button btnStartRoute;

    // Coordinates
    private final GeoPoint SOURCE = new GeoPoint(18.4516, 73.8544);
    private final GeoPoint DESTINATION = new GeoPoint(18.5018, 73.8636);

    // Sample stops
    private final List<GeoPoint> stops = Arrays.asList(
            new GeoPoint(18.4630, 73.8570),
            new GeoPoint(18.4725, 73.8605),
            new GeoPoint(18.4890, 73.8612)
    );

    public DriverDashboardFragment() {}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s){
        View v = inflater.inflate(R.layout.fragment_driver_dashboard, c, false);

        tvRouteInfo = v.findViewById(R.id.tvRouteInfo);
        btnStartRoute = v.findViewById(R.id.btnStartRoute);
        osmMap = v.findViewById(R.id.osmDriverMap);

        // Configure OSMDroid
        Configuration.getInstance().setUserAgentValue(requireContext().getPackageName());
        osmMap.setTileSource(TileSourceFactory.MAPNIK);
        osmMap.setMultiTouchControls(true);

        auth = FirebaseAuth.getInstance();
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) {
            Toast.makeText(requireContext(),"Please sign in",Toast.LENGTH_SHORT).show();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return v;
        }

        db = FirebaseFirestore.getInstance();
        fused = LocationServices.getFusedLocationProviderClient(requireActivity());

        tvRouteInfo.setText("Route: Source → Stops → Destination (" + stops.size() + " stops)");

        btnStartRoute.setOnClickListener(x -> startRoute());

        // Center map to driver’s current location (optional)
        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            fused.getLastLocation().addOnSuccessListener(loc -> {
                if (loc != null) {
                    lastLocation = loc;
                    IMapController mapController = osmMap.getController();
                    mapController.setZoom(14.0);
                    mapController.setCenter(new GeoPoint(loc.getLatitude(), loc.getLongitude()));
                } else {
                    osmMap.getController().setZoom(13.0);
                    osmMap.getController().setCenter(SOURCE);
                }
            });
        }

        return v;
    }

    private void startRoute() {
        osmMap.getOverlays().clear();

        List<GeoPoint> routePoints = new ArrayList<>();
        routePoints.add(SOURCE);

        // Source Marker
        Marker srcMarker = new Marker(osmMap);
        srcMarker.setPosition(SOURCE);
        srcMarker.setTitle("Source");
        srcMarker.setSubDescription("Start Point");
        srcMarker.setIcon(requireContext().getDrawable(R.drawable.ic_source)); // Add custom drawable
        osmMap.getOverlays().add(srcMarker);

        // Stops
        int i = 1;
        for (GeoPoint stop : stops) {
            Marker m = new Marker(osmMap);
            m.setPosition(stop);
            m.setTitle("Stop " + i);
            m.setSubDescription("Collection Point");
            m.setIcon(requireContext().getDrawable(R.drawable.ic_stop)); // Add custom drawable
            osmMap.getOverlays().add(m);
            routePoints.add(stop);
            i++;
        }

        // Destination Marker
        Marker dstMarker = new Marker(osmMap);
        dstMarker.setPosition(DESTINATION);
        dstMarker.setTitle("Destination");
        dstMarker.setSubDescription("End Point");
        dstMarker.setIcon(requireContext().getDrawable(R.drawable.ic_destination)); // Add custom drawable
        osmMap.getOverlays().add(dstMarker);
        routePoints.add(DESTINATION);

        // Polyline
        Polyline line = new Polyline();
        line.setPoints(routePoints);
        line.setColor(0xFF1E90FF); // Dodger Blue
        line.setWidth(6f);
        osmMap.getOverlays().add(line);

        // Auto center map
        centerMapToRoute(routePoints);

        osmMap.invalidate();
        Toast.makeText(requireContext(), "Route started with " + stops.size() + " stops.", Toast.LENGTH_LONG).show();
    }

    private void centerMapToRoute(List<GeoPoint> points) {
        if (points.isEmpty()) return;
        double north = points.get(0).getLatitude();
        double south = points.get(0).getLatitude();
        double east = points.get(0).getLongitude();
        double west = points.get(0).getLongitude();

        for (GeoPoint p : points) {
            north = Math.max(north, p.getLatitude());
            south = Math.min(south, p.getLatitude());
            east = Math.max(east, p.getLongitude());
            west = Math.min(west, p.getLongitude());
        }

        BoundingBox bb = new BoundingBox(north, east, south, west);
        osmMap.zoomToBoundingBox(bb, true);
    }

    @Override public void onResume() { super.onResume(); if (osmMap!=null) osmMap.onResume(); }
    @Override public void onPause() { super.onPause(); if (osmMap!=null) osmMap.onPause(); }
}
