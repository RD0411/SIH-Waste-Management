package com.example.wastemanagementgreenchampion;

import android.os.Bundle;
import android.view.*;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.*;

import java.util.ArrayList;
import java.util.List;

public class HomeFragment extends Fragment {
    TextView tvVerified, tvPending, tvPoints;
    FirebaseAuth auth;
    FirebaseFirestore db;

    public HomeFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s){
        View v = inflater.inflate(R.layout.fragment_home, c, false);
        tvVerified = v.findViewById(R.id.tvVerified);
        tvPending = v.findViewById(R.id.tvPending);
        tvPoints = v.findViewById(R.id.tvPoints);

        auth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        String uid = auth.getCurrentUser() != null ? auth.getCurrentUser().getUid() : null;
        if (uid == null) {
            Toast.makeText(requireContext(), "Please sign in", Toast.LENGTH_SHORT).show();
            requireActivity().finish();
            return v;
        }

        // Verified reports count
        db.collection("reports").whereEqualTo("status","verified")
                .addSnapshotListener((snap,e)->{
                    if (snap != null) tvVerified.setText(String.valueOf(snap.size()));
                });

        // Pending reports count (status != rejected && status != verified)
        db.collection("reports").addSnapshotListener((snap,e)->{
            if (snap != null) {
                List<DocumentSnapshot> pending = new ArrayList<>();
                for (DocumentSnapshot doc : snap.getDocuments()) {
                    String status = doc.getString("status");
                    if (status == null || (!status.equals("verified") && !status.equals("rejected"))) {
                        pending.add(doc);
                    }
                }
                tvPending.setText(String.valueOf(pending.size()));
            }
        });

        // User green points
        db.collection("users").document(uid).addSnapshotListener((snap,e)->{
            if (snap != null && snap.exists()) {
                Long gp = snap.getLong("greenPoints");
                tvPoints.setText("20");
            }
        });

        return v;
    }
}
