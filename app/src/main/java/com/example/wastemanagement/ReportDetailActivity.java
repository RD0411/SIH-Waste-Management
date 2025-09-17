package com.example.wastemanagement;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.util.Base64;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ReportDetailActivity extends AppCompatActivity {
    TextView tvCategory, tvStatus, tvNotes, tvCreatedAt, tvLocation;
    ImageView ivPhoto;
    FirebaseFirestore db;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_detail);

        tvCategory = findViewById(R.id.tvCategory);
        tvStatus = findViewById(R.id.tvStatus);
        tvNotes = findViewById(R.id.tvNotes);
        tvCreatedAt = findViewById(R.id.tvCreatedAt);
        tvLocation = findViewById(R.id.tvLocation);
        ivPhoto = findViewById(R.id.ivPhoto);

        db = FirebaseFirestore.getInstance();

        String reportId = getIntent().getStringExtra("reportId");
        if (reportId == null) {
            Toast.makeText(this, "No report ID provided", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        db.collection("reports").document(reportId).get()
                .addOnSuccessListener(this::populateReport);
    }

    private void populateReport(DocumentSnapshot doc) {
        if (!doc.exists()) return;

        tvCategory.setText("Category: " + doc.getString("category"));
        tvStatus.setText("Status: " + doc.getString("status"));
        tvNotes.setText("Notes: " + doc.getString("notes"));

        // Timestamp
        Object timestamp = doc.get("createdAt");
        if (timestamp instanceof com.google.firebase.Timestamp) {
            Date date = ((com.google.firebase.Timestamp) timestamp).toDate();
            String formatted = new SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(date);
            tvCreatedAt.setText("Issued At: " + formatted);
        }

        // Location: convert lat/lng to address
        Double lat = doc.getDouble("lat");
        Double lng = doc.getDouble("lng");
        if (lat != null && lng != null) {
            String address = getAddressFromLatLng(lat, lng);
            tvLocation.setText(address);
        }

        // Photo
        String photoBase64 = doc.getString("photoBase64");
        if (photoBase64 != null && !photoBase64.isEmpty()) {
            byte[] decoded = Base64.decode(photoBase64, Base64.DEFAULT);
            Bitmap bmp = BitmapFactory.decodeByteArray(decoded, 0, decoded.length);
            ivPhoto.setImageBitmap(bmp);
        }
    }

    private String getAddressFromLatLng(double lat, double lng) {
        Geocoder geocoder = new Geocoder(this, Locale.getDefault());
        try {
            List<Address> addresses = geocoder.getFromLocation(lat, lng, 1);
            if (addresses != null && !addresses.isEmpty()) {
                Address addr = addresses.get(0);
                StringBuilder addressStr = new StringBuilder();
                if (addr.getThoroughfare() != null) addressStr.append(addr.getThoroughfare()).append(", ");
                if (addr.getLocality() != null) addressStr.append(addr.getLocality()).append(", ");
                if (addr.getAdminArea() != null) addressStr.append(addr.getAdminArea()).append(", ");
                if (addr.getCountryName() != null) addressStr.append(addr.getCountryName());
                return addressStr.toString();
            } else {
                return String.format("Lat: %.6f, Lng: %.6f", lat, lng);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return String.format("Lat: %.6f, Lng: %.6f", lat, lng);
        }
    }
}
