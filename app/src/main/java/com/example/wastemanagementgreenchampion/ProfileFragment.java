package com.example.wastemanagementgreenchampion;

import android.content.Intent;
import android.os.Bundle;
import android.view.*;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

public class ProfileFragment extends Fragment {
    TextView tvName, tvEmail, tvPoints;
    Button btnLogout;
    FirebaseAuth auth;
    FirebaseFirestore db;

    public ProfileFragment(){}

    @Override public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s) {
        View v = inflater.inflate(R.layout.fragment_profile, c, false);
        tvName = v.findViewById(R.id.tvName);
        tvEmail = v.findViewById(R.id.tvEmail);
        tvPoints = v.findViewById(R.id.tvPoints);
        btnLogout = v.findViewById(R.id.btnLogout);

        auth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        FirebaseUser u = auth.getCurrentUser();
        if (u == null) { startActivity(new Intent(requireActivity(), LoginActivity.class)); requireActivity().finish(); return v; }

        db.collection("users").document(u.getUid()).addSnapshotListener((snap,e)->{
            if (snap!=null && snap.exists()) {
                tvName.setText(snap.getString("name"));
                tvEmail.setText(snap.getString("email"));
                Long gp = snap.getLong("greenPoints");
                tvPoints.setText("20");
            }
        });

        btnLogout.setOnClickListener(x->{
            auth.signOut();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
        });

        return v;
    }
}
