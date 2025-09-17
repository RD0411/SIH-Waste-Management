package com.example.wastemanagement;

import android.content.Intent;
import android.location.Location;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;

import org.osmdroid.api.IMapController;
import org.osmdroid.config.Configuration;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Marker;
import org.osmdroid.views.overlay.Polyline;

import java.util.ArrayList;
import java.util.List;

public class DashboardFragment extends Fragment {
    TextView tvPoints, tvSchedule;
    FirebaseAuth auth;
    FirebaseFirestore db;

    private MapView osmMap;
    private FusedLocationProviderClient fused;

    RecyclerView rvRecent;
    RecentReportsAdapter adapter;
    List<DocumentSnapshot> reports = new ArrayList<>();

    public DashboardFragment() { }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s) {
        View v = inflater.inflate(R.layout.fragment_dashboard, c, false);

        // Initialize OSMDroid config
        Configuration.getInstance().setUserAgentValue(requireContext().getPackageName());

        // Firebase Auth
        auth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            Toast.makeText(requireContext(), "Please sign in first.", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return v;
        }

        tvPoints = v.findViewById(R.id.tvPoints);
        tvSchedule = v.findViewById(R.id.tvSchedule);
        osmMap = v.findViewById(R.id.osmMap);
        rvRecent = v.findViewById(R.id.rvRecentReports);

        db = FirebaseFirestore.getInstance();
        fused = LocationServices.getFusedLocationProviderClient(requireActivity());

        // Load user points
        String uid = currentUser.getUid();
        db.collection("users").document(uid).get().addOnSuccessListener(doc -> {
            if (doc.exists()) {
                Long gp = doc.getLong("greenPoints");
                tvPoints.setText(String.valueOf(gp != null ? gp : 0));
                tvSchedule.setText("Collection: Mon, Thu • 7:00 AM - 9:00 AM");
            }
        });

        // Setup map
        osmMap.setTileSource(org.osmdroid.tileprovider.tilesource.TileSourceFactory.MAPNIK);
        osmMap.setMultiTouchControls(true);
        IMapController mapController = osmMap.getController();
        mapController.setZoom(15.0);

        // Get user location and create nearby route
        if (androidx.core.app.ActivityCompat.checkSelfPermission(
                requireContext(), android.Manifest.permission.ACCESS_FINE_LOCATION)
                == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            fused.getLastLocation().addOnSuccessListener(loc -> {
                if (loc != null) {
                    GeoPoint user = new GeoPoint(loc.getLatitude(), loc.getLongitude());
                    mapController.setCenter(user);

                    // Add user marker
                    addMarker(user, "You (Start)");

                    // Create nearby sample collection points (just offsets from current location)
                    GeoPoint point1 = new GeoPoint(user.getLatitude() + 0.002, user.getLongitude() + 0.002);
                    GeoPoint point2 = new GeoPoint(user.getLatitude() + 0.004, user.getLongitude() + 0.0015);
                    GeoPoint point3 = new GeoPoint(user.getLatitude() + 0.006, user.getLongitude() + 0.003);

                    addMarker(point1, "Collection Point 1");
                    addMarker(point2, "Collection Point 2");
                    addMarker(point3, "End: Processing Center");

                    // Draw polyline connecting route
                    List<GeoPoint> routePoints = new ArrayList<>();
                    routePoints.add(user);
                    routePoints.add(point1);
                    routePoints.add(point2);
                    routePoints.add(point3);

                    Polyline routeLine = new Polyline();
                    routeLine.setPoints(routePoints);
                    routeLine.setColor(0xFF27AE60); // Green
                    routeLine.setWidth(8f);
                    routeLine.setTitle("Waste Collection Route");

                    osmMap.getOverlays().add(routeLine);
                    osmMap.invalidate();
                } else {
                    Toast.makeText(requireContext(), "Location not found", Toast.LENGTH_SHORT).show();
                }
            });
        } else {
            Toast.makeText(requireContext(), "Location permission not granted", Toast.LENGTH_SHORT).show();
        }

        // =====================
        // Recent Reports Section
        // =====================
        rvRecent.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new RecentReportsAdapter(reports);
        rvRecent.setAdapter(adapter);

        db.collection("reports")
                .whereEqualTo("userId", currentUser.getUid())
                .orderBy("createdAt", Query.Direction.DESCENDING)
                .limit(3)
                .addSnapshotListener((snap, e) -> {
                    if (e != null) return;
                    reports.clear();
                    if (snap != null) reports.addAll(snap.getDocuments());
                    adapter.notifyDataSetChanged();
                });

        return v;
    }

    private void addMarker(GeoPoint point, String title) {
        Marker marker = new Marker(osmMap);
        marker.setPosition(point);
        marker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM);
        marker.setTitle(title);
        osmMap.getOverlays().add(marker);
    }

    /* MapView lifecycle */
    @Override
    public void onResume() {
        super.onResume();
        if (osmMap != null) osmMap.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        if (osmMap != null) osmMap.onPause();
    }
}
