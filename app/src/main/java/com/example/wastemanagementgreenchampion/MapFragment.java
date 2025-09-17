package com.example.wastemanagementgreenchampion;

import android.os.Bundle;
import android.view.*;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import org.osmdroid.api.IMapController;
import org.osmdroid.config.Configuration;
import org.osmdroid.tileprovider.tilesource.TileSourceFactory;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Marker;

public class MapFragment extends Fragment {
    private MapView osmMap;
    private FirebaseFirestore db;

    public MapFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s) {
        View v = inflater.inflate(R.layout.fragment_map, c, false);

        osmMap = v.findViewById(R.id.mapChampion);
        db = FirebaseFirestore.getInstance();

        // configure osmdroid
        Configuration.getInstance().setUserAgentValue(requireContext().getPackageName());
        osmMap.setTileSource(TileSourceFactory.MAPNIK);
        osmMap.setMultiTouchControls(true);

        loadMarkers();

        return v;
    }

    private void loadMarkers() {
        if (osmMap == null) return;

        db.collection("reports").get().addOnSuccessListener(snap -> {
            osmMap.getOverlays().clear();

            if (!snap.isEmpty()) {
                boolean firstMarker = true;
                IMapController mapController = osmMap.getController();
                mapController.setZoom(12.0);

                for (DocumentSnapshot d : snap.getDocuments()) {
                    Double lat = d.getDouble("lat");
                    Double lng = d.getDouble("lng");
                    if (lat != null && lng != null) {
                        GeoPoint pos = new GeoPoint(lat, lng);
                        Marker marker = new Marker(osmMap);
                        marker.setPosition(pos);
                        marker.setTitle(d.getString("category"));
                        marker.setSnippet(d.getId());

                        marker.setOnMarkerClickListener((m, mapView) -> {
                            String gid = m.getSnippet();
                            if (gid != null) {
                                db.collection("reports").document(gid).get()
                                        .addOnSuccessListener(doc -> {
                                            if (doc.exists()) {
                                                String cat = doc.getString("category");
                                                Toast.makeText(requireContext(),
                                                        (cat != null ? cat : "Report") + " - " + gid,
                                                        Toast.LENGTH_SHORT).show();
                                            }
                                        });
                            }
                            return true; // consume click
                        });

                        osmMap.getOverlays().add(marker);

                        if (firstMarker) {
                            mapController.setCenter(pos);
                            firstMarker = false;
                        }
                    }
                }
                osmMap.invalidate();
            }
        });
    }

    /* lifecycle */
    @Override public void onResume(){ super.onResume(); if (osmMap!=null) osmMap.onResume(); }
    @Override public void onPause(){ super.onPause(); if (osmMap!=null) osmMap.onPause(); }
}
