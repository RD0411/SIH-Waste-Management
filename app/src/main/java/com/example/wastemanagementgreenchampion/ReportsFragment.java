package com.example.wastemanagementgreenchampion;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.*;

import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.*;

import java.util.*;

public class ReportsFragment extends Fragment {
    RecyclerView rvPending, rvVerified;
    ReportAdapter adapterPending, adapterVerified;
    List<DocumentSnapshot> pendingReports = new ArrayList<>();
    List<DocumentSnapshot> verifiedReports = new ArrayList<>();
    FirebaseFirestore db;
    FirebaseAuth auth;

    public ReportsFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s) {
        View v = inflater.inflate(R.layout.fragment_reports, c, false);
        rvPending = v.findViewById(R.id.rvPendingReports);
        rvVerified = v.findViewById(R.id.rvVerifiedReports);

        db = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();

        adapterPending = new ReportAdapter(pendingReports, requireContext(), this::onReportAction);
        adapterVerified = new ReportAdapter(verifiedReports, requireContext(), this::onReportAction);

        rvPending.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvPending.setAdapter(adapterPending);

        rvVerified.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvVerified.setAdapter(adapterVerified);

        // Listen to all reports
        db.collection("reports").orderBy("createdAt", Query.Direction.DESCENDING)
                .addSnapshotListener((snap,e)->{
                    if (e!=null) return;

                    pendingReports.clear();
                    verifiedReports.clear();

                    if (snap != null) {
                        for (DocumentSnapshot doc : snap.getDocuments()) {
                            String status = doc.getString("status");
                            if ("rejected".equals(status)) continue;
                            else if ("verified".equals(status)) verifiedReports.add(doc);
                            else pendingReports.add(doc);
                        }
                    }

                    adapterPending.notifyDataSetChanged();
                    adapterVerified.notifyDataSetChanged();
                });

        return v;
    }

    private void onReportAction(DocumentSnapshot report, String action) {
        if ("view".equals(action)) {
            showReportDialog(report);
            return;
        }

        String reportId = report.getId();
        Map<String,Object> upd = new HashMap<>();
        if ("verify".equals(action)) {
            upd.put("status","verified");
            upd.put("verifiedBy", auth.getCurrentUser().getUid());
            upd.put("verifiedAt", Timestamp.now());
        } else if ("reject".equals(action)) {
            upd.put("status","rejected");
            upd.put("verifiedBy", auth.getCurrentUser().getUid());
            upd.put("verifiedAt", Timestamp.now());
        }

        db.collection("reports").document(reportId).update(upd)
                .addOnSuccessListener(a -> {
                    if ("verify".equals(action)) {
                        // award points to report owner
                        String owner = report.getString("userId");
                        if (owner != null && !owner.isEmpty()) {
                            DocumentReference userRef = db.collection("users").document(owner);
                            db.runTransaction((Transaction.Function<Void>) transaction -> {
                                DocumentSnapshot userSnap = transaction.get(userRef);
                                long cur = 0;
                                if (userSnap.exists() && userSnap.getLong("greenPoints") != null) {
                                    cur = userSnap.getLong("greenPoints");
                                }
                                transaction.update(userRef, "greenPoints", cur + 10);
                                return null;
                            }).addOnSuccessListener(x ->
                                    Toast.makeText(requireContext(),"Report verified — points awarded.",Toast.LENGTH_SHORT).show()
                            ).addOnFailureListener(err ->
                                    Toast.makeText(requireContext(),"Verified but failed to award points: "+err.getMessage(),Toast.LENGTH_LONG).show()
                            );
                        }
                    } else {
                        Toast.makeText(requireContext(),"Report "+action,Toast.LENGTH_SHORT).show();
                    }
                }).addOnFailureListener(err ->
                        Toast.makeText(requireContext(),"Failed: "+err.getMessage(),Toast.LENGTH_LONG).show()
                );
    }

    private void showReportDialog(DocumentSnapshot report) {
        View dialogView = LayoutInflater.from(requireContext())
                .inflate(R.layout.dialog_report_details, null);
        ImageView iv = dialogView.findViewById(R.id.ivPhoto);
        TextView tvCat = dialogView.findViewById(R.id.tvCategory);
        TextView tvNotes = dialogView.findViewById(R.id.tvNotes);
        TextView tvLoc = dialogView.findViewById(R.id.tvLocation);

        String base64 = report.getString("photoBase64");
        if (base64 != null && !base64.isEmpty()) {
            try {
                byte[] bytes = android.util.Base64.decode(base64, android.util.Base64.DEFAULT);
                android.graphics.Bitmap bmp = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
                iv.setImageBitmap(bmp);
            } catch (Exception ignored) {}
        } else {
            iv.setImageResource(R.drawable.ic_image_placeholder);
        }

        tvCat.setText(report.getString("category") != null ? report.getString("category") : "—");
        tvNotes.setText(report.getString("notes") != null ? report.getString("notes") : "");
        Double lat = report.getDouble("lat");
        Double lng = report.getDouble("lng");
        tvLoc.setText((lat!=null && lng!=null) ? (lat + ", " + lng) : "No location");

        new AlertDialog.Builder(requireContext())
                .setTitle("Report details")
                .setView(dialogView)
                .setPositiveButton("Verify", (d, w) -> onReportAction(report, "verify"))
                .setNeutralButton("Reject", (d, w) -> onReportAction(report, "reject"))
                .setNegativeButton("Close", null)
                .show();
    }
}
