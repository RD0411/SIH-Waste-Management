package com.example.wastemanagement;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.location.Location;
import android.os.Bundle;
import android.util.Base64;
import android.view.*;
import android.widget.*;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;

import org.osmdroid.api.IMapController;
import org.osmdroid.config.Configuration;
import org.osmdroid.events.MapEventsReceiver;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;
import org.osmdroid.views.overlay.Marker;
import org.osmdroid.views.overlay.MapEventsOverlay;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.UUID;

public class ReportFragment extends Fragment {
    private static final int REQ_IMAGE = 1001;
    private static final int REQ_PERM = 1002;

    ImageView ivPhoto;
    Button btnCapture, btnSubmit;
    EditText etCategory, etNotes;
    ProgressBar progress;
    Bitmap captured;
    FusedLocationProviderClient fused;
    Location lastLocation;
    FirebaseAuth auth;
    FirebaseFirestore db;

    MapView osmMap;
    Marker reportMarker;

    public ReportFragment() { }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup c, Bundle savedInstanceState) {
        View v = inflater.inflate(R.layout.fragment_report, c, false);

        // Auth guard
        auth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            Toast.makeText(requireContext(), "Please sign in first.", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return v;
        }

        ivPhoto = v.findViewById(R.id.ivPhoto);
        btnCapture = v.findViewById(R.id.btnCapture);
        btnSubmit = v.findViewById(R.id.btnSubmit);
        etCategory = v.findViewById(R.id.etCategory);
        etNotes = v.findViewById(R.id.etNotes);
        progress = v.findViewById(R.id.progressBar);

        fused = LocationServices.getFusedLocationProviderClient(requireActivity());
        db = FirebaseFirestore.getInstance();

        // Setup OSMDroid
        Configuration.getInstance().setUserAgentValue(requireContext().getPackageName());
        osmMap = v.findViewById(R.id.mapReport);
        osmMap.setTileSource(org.osmdroid.tileprovider.tilesource.TileSourceFactory.MAPNIK);
        osmMap.setMultiTouchControls(true);

        IMapController mapController = osmMap.getController();
        mapController.setZoom(15.0);

        // Default center (Mumbai)
        GeoPoint defaultPos = new GeoPoint(19.0760, 72.8777);
        mapController.setCenter(defaultPos);

        // Add tap listener
        MapEventsOverlay eventsOverlay = new MapEventsOverlay(new MapEventsReceiver() {
            @Override
            public boolean singleTapConfirmedHelper(GeoPoint p) {
                lastLocation = new Location("mapTap");
                lastLocation.setLatitude(p.getLatitude());
                lastLocation.setLongitude(p.getLongitude());
                updateMapMarker(p);
                Toast.makeText(getContext(), "Location selected", Toast.LENGTH_SHORT).show();
                return true;
            }

            @Override
            public boolean longPressHelper(GeoPoint p) {
                return false;
            }
        });
        osmMap.getOverlays().add(eventsOverlay);

        // Try GPS location
        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            fused.getLastLocation().addOnSuccessListener(loc -> {
                if (loc != null) {
                    lastLocation = loc;
                    GeoPoint userPoint = new GeoPoint(loc.getLatitude(), loc.getLongitude());
                    mapController.setCenter(userPoint);
                    updateMapMarker(userPoint);
                }
            });
        } else {
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQ_PERM);
        }

        btnCapture.setOnClickListener(x -> {
            if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.CAMERA}, REQ_PERM);
                return;
            }
            Intent it = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
            startActivityForResult(it, REQ_IMAGE);
        });

        btnSubmit.setOnClickListener(x -> submitReport());

        return v;
    }

    @Override
    public void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req,res,data);
        if (req == REQ_IMAGE && res == Activity.RESULT_OK && data != null) {
            Object obj = data.getExtras() != null ? data.getExtras().get("data") : null;
            if (obj instanceof Bitmap) {
                captured = (Bitmap) obj;
                ivPhoto.setImageBitmap(captured);
            } else {
                Toast.makeText(requireContext(), "Failed to capture image", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void submitReport(){
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) {
            Toast.makeText(requireContext(), "Please sign in first.", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return;
        }

        if (captured == null) {
            Toast.makeText(getContext(),"Capture photo first",Toast.LENGTH_SHORT).show();
            return;
        }
        progress.setVisibility(View.VISIBLE);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        captured.compress(Bitmap.CompressFormat.JPEG, 50, baos);
        String base64 = Base64.encodeToString(baos.toByteArray(), Base64.DEFAULT);

        HashMap<String,Object> doc = new HashMap<>();
        doc.put("userId", u.getUid());
        doc.put("photoBase64", base64);
        doc.put("category", etCategory.getText() != null ? etCategory.getText().toString().trim() : "");
        doc.put("notes", etNotes.getText() != null ? etNotes.getText().toString().trim() : "");
        doc.put("status", "open");
        doc.put("createdAt", Timestamp.now());

        if (lastLocation != null) {
            doc.put("lat", lastLocation.getLatitude());
            doc.put("lng", lastLocation.getLongitude());
        } else {
            doc.put("lat", 0);
            doc.put("lng", 0);
        }

        String id = UUID.randomUUID().toString();
        db.collection("reports").document(id).set(doc).addOnCompleteListener(task -> {
            progress.setVisibility(View.GONE);
            if (task.isSuccessful()) {
                Toast.makeText(getContext(),"Report submitted",Toast.LENGTH_LONG).show();
                showQrDialog(id); // 👉 Show QR after submit
                captured = null;
                ivPhoto.setImageResource(R.drawable.ic_image_placeholder);
                etCategory.setText("");
                etNotes.setText("");
            } else {
                Toast.makeText(getContext(),"Submit failed: "+
                                (task.getException() != null ? task.getException().getMessage() : "unknown"),
                        Toast.LENGTH_LONG).show();
            }
        });
    }

    /** Generate and show QR dialog */
    private void showQrDialog(String reportId){
        QRCodeWriter writer = new QRCodeWriter();
        try {
            BitMatrix bitMatrix = writer.encode(reportId, BarcodeFormat.QR_CODE, 400, 400);
            Bitmap bmp = Bitmap.createBitmap(400, 400, Bitmap.Config.RGB_565);
            for (int x = 0; x < 400; x++) {
                for (int y = 0; y < 400; y++) {
                    bmp.setPixel(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }

            ImageView iv = new ImageView(requireContext());
            iv.setImageBitmap(bmp);

            new AlertDialog.Builder(requireContext())
                    .setTitle("Show this QR to Driver")
                    .setView(iv)
                    .setPositiveButton("OK", null)
                    .show();

        } catch (WriterException e) {
            e.printStackTrace();
        }
    }

    private void updateMapMarker(GeoPoint point) {
        if (osmMap == null) return;

        if (reportMarker != null) osmMap.getOverlays().remove(reportMarker);

        reportMarker = new Marker(osmMap);
        reportMarker.setPosition(point);
        reportMarker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM);
        reportMarker.setTitle("Report location");
        osmMap.getOverlays().add(reportMarker);

        osmMap.invalidate();
    }

    /* Map lifecycle */
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
