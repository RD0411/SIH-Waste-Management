package com.example.wastemanagementdriver;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.os.Bundle;
import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.*;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.*;

import java.util.*;

public class AssignedReportsFragment extends Fragment {
    RecyclerView rv;
    AssignedAdapter adapter;
    List<DocumentSnapshot> items = new ArrayList<>();
    FirebaseFirestore db;
    FirebaseAuth auth;

    private String lastExpectedReportId = null;
    private static final int REQ_QR = 1200;

    // location
    private FusedLocationProviderClient fusedLocationClient;
    private Location currentLocation;

    public AssignedReportsFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s){
        View v = inflater.inflate(R.layout.fragment_assigned_reports, c, false);
        rv = v.findViewById(R.id.rvAssigned);
        db = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireActivity());

        adapter = new AssignedAdapter();
        rv.setLayoutManager(new LinearLayoutManager(requireContext()));
        rv.setAdapter(adapter);

        FirebaseUser u = auth.getCurrentUser();
        if (u == null) {
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return v;
        }

        // fetch location
        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 100);
        } else {
            fusedLocationClient.getLastLocation().addOnSuccessListener(loc -> {
                if (loc != null) currentLocation = loc;
            });
        }

        // listen only reports with pending/assigned
        db.collection("reports")
                .whereIn("status", Arrays.asList("pending","assigned"))
                .addSnapshotListener((snap,e)->{
                    if (e!=null) return;
                    items.clear();
                    if (snap!=null) items.addAll(snap.getDocuments());
                    adapter.notifyDataSetChanged();
                });

        return v;
    }

    // receive QR result
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_QR && data != null) {
            String scanned = data.getStringExtra("scanned");
            if (lastExpectedReportId != null && scanned != null) {
                db.collection("reports").document(lastExpectedReportId).get()
                        .addOnSuccessListener(doc -> {
                            String expected = doc.getString("qrCode");
                            if (expected != null && expected.equals(scanned)) {
                                markCollected(lastExpectedReportId);
                                db.collection("reports").document(lastExpectedReportId)
                                        .update("qrCode", FieldValue.delete());
                            } else {
                                Toast.makeText(requireContext(), "QR does not match", Toast.LENGTH_LONG).show();
                            }
                        });
            }
            lastExpectedReportId = null;
        }
    }

    class AssignedAdapter extends RecyclerView.Adapter<AssignedAdapter.VH> {
        @NonNull @Override
        public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View it = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_assigned_report, parent, false);
            return new VH(it);
        }

        @Override public void onBindViewHolder(@NonNull VH h, int pos) {
            DocumentSnapshot d = items.get(pos);
            h.tvTitle.setText(d.getString("category") != null ? d.getString("category") : "Report");
            h.tvUser.setText("Reported User");
            String reportId = d.getId();

            // Notes
            h.tvNotes.setText("Notes: " + (d.getString("notes") != null ? d.getString("notes") : "-"));

            // Location
            // Location (convert lat/lng to address)
            if (d.contains("lat") && d.contains("lng")) {
                double repLat = d.getDouble("lat");
                double repLng = d.getDouble("lng");

                Geocoder geocoder = new Geocoder(requireContext(), Locale.getDefault());
                try {
                    List<Address> addresses = geocoder.getFromLocation(repLat, repLng, 1);
                    if (addresses != null && !addresses.isEmpty()) {
                        Address addr = addresses.get(0);
                        String addressText = addr.getAddressLine(0); // Full address
                        h.tvLocation.setText("Location: " + addressText);
                    } else {
                        h.tvLocation.setText(String.format("Lat/Lng: %.5f / %.5f", repLat, repLng));
                    }
                } catch (Exception e) {
                    h.tvLocation.setText(String.format("Lat/Lng: %.5f / %.5f", repLat, repLng));
                }
            } else {
                h.tvLocation.setText("Location: -");
            }


            h.btnScan.setEnabled(false);

            // location-based check
            if (currentLocation != null && d.contains("lat") && d.contains("lng")) {
                double repLat = d.getDouble("lat");
                double repLng = d.getDouble("lng");
                float[] results = new float[1];
                Location.distanceBetween(currentLocation.getLatitude(), currentLocation.getLongitude(),
                        repLat, repLng, results);

                float distance = results[0]; // meters
                if (distance <= 100) {
                    // enable scan button
                    h.btnScan.setEnabled(true);
                    h.btnScan.setOnClickListener(v -> {
                        lastExpectedReportId = reportId;
                        Intent i = new Intent(requireActivity(), QRScanActivity.class);
                        i.putExtra("reportId", reportId);
                        startActivityForResult(i, REQ_QR);
                    });
                }
            }
        }

        @Override public int getItemCount(){ return items.size(); }

        class VH extends RecyclerView.ViewHolder {
            TextView tvTitle, tvUser, tvCreatedAt, tvNotes, tvLocation;
            Button btnScan;
            ImageView ivQR;
            VH(View item) { super(item);
                tvTitle = item.findViewById(R.id.tvTitle);
                tvUser = item.findViewById(R.id.tvUser);
                tvNotes = item.findViewById(R.id.tvNotes);
                tvLocation = item.findViewById(R.id.tvLocation);
                btnScan = item.findViewById(R.id.btnScan);
                ivQR = item.findViewById(R.id.ivQR);
            }
        }
    }

    private void markCollected(String reportId){
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) {
            Toast.makeText(requireContext(),"Sign in required",Toast.LENGTH_SHORT).show();
            return;
        }
        Map<String,Object> upd = new HashMap<>();
        upd.put("status","collected");
        upd.put("collectedAt", FieldValue.serverTimestamp());
        upd.put("collectedBy", u.getUid());
        db.collection("reports").document(reportId).update(upd)
                .addOnSuccessListener(a->{
                    Map<String,Object> log = new HashMap<>();
                    log.put("driverId", u.getUid());
                    log.put("reportId", reportId);
                    log.put("action", "collected");
                    log.put("ts", FieldValue.serverTimestamp());
                    db.collection("driver_logs").document().set(log);
                    Toast.makeText(requireContext(),"Marked collected",Toast.LENGTH_SHORT).show();
                }).addOnFailureListener(err->
                        Toast.makeText(requireContext(),"Failed: "+err.getMessage(),Toast.LENGTH_LONG).show());
    }
}
