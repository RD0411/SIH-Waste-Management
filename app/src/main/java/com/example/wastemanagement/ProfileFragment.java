package com.example.wastemanagement;

import android.content.Intent;
import android.os.Bundle;
import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.*;

import java.util.HashMap;
import java.util.Map;

public class ProfileFragment extends Fragment {
    TextView tvName, tvEmail, tvPoints, statusTraining, statusDistribution, statusEvents;
    EditText etPhone, etAddress, etAge, etGender;
    Button btnLogout, btnTraining, btnDistribution, btnEvents, btnSaveInfo;
    FirebaseAuth auth;
    FirebaseFirestore db;

    public ProfileFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s){
        View v = inflater.inflate(R.layout.fragment_profile, c, false);

        auth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return v;
        }

        // UI references
        tvName = v.findViewById(R.id.tvName);
        tvEmail = v.findViewById(R.id.tvEmail);
        tvPoints = v.findViewById(R.id.tvPoints);

        etPhone = v.findViewById(R.id.etPhone);
        etAddress = v.findViewById(R.id.etAddress);
        etAge = v.findViewById(R.id.etAge);
        etGender = v.findViewById(R.id.etGender);
        btnSaveInfo = v.findViewById(R.id.btnSaveInfo);

        btnLogout = v.findViewById(R.id.btnLogout);
        btnTraining = v.findViewById(R.id.btnTraining);
        btnDistribution = v.findViewById(R.id.btnDistribution);
        btnEvents = v.findViewById(R.id.btnEvents);

        statusTraining = v.findViewById(R.id.statusTraining);
        statusDistribution = v.findViewById(R.id.statusDistribution);
        statusEvents = v.findViewById(R.id.statusEvents);

        db = FirebaseFirestore.getInstance();
        String uid = currentUser.getUid();

        // Insert sample data if missing
        db.collection("users").document(uid).get().addOnSuccessListener(doc -> {
            if (!doc.exists()) {
                Map<String, Object> init = new HashMap<>();
                init.put("name", currentUser.getDisplayName() != null ? currentUser.getDisplayName() : "Citizen");
                init.put("email", currentUser.getEmail());
                init.put("greenPoints", 0);
                init.put("trainingDone", false);
                init.put("distributionDone", false);
                init.put("eventDone", false);
                init.put("phone", "");
                init.put("address", "");
                init.put("age", 0);
                init.put("gender", "");
                db.collection("users").document(uid).set(init);
            }
        });

        // Listen for updates
        db.collection("users").document(uid).addSnapshotListener((doc, e) -> {
            if (doc != null && doc.exists()) {
                tvName.setText(doc.getString("name"));
                tvEmail.setText(doc.getString("email"));
                Long gp = doc.getLong("greenPoints");
                tvPoints.setText("Points: " + (gp != null ? gp : 0));

                etPhone.setText(doc.getString("phone"));
                etAddress.setText(doc.getString("address"));
                Long age = doc.getLong("age");
                etAge.setText(age != null ? String.valueOf(age) : "");
                etGender.setText(doc.getString("gender"));

                updateStatus(statusTraining, doc.getBoolean("trainingDone"));
                updateStatus(statusDistribution, doc.getBoolean("distributionDone"));
                updateStatus(statusEvents, doc.getBoolean("eventDone"));
            }
        });

        // Save Info button
        btnSaveInfo.setOnClickListener(x -> {
            Map<String, Object> updates = new HashMap<>();
            updates.put("phone", etPhone.getText().toString().trim());
            updates.put("address", etAddress.getText().toString().trim());
            String ageStr = etAge.getText().toString().trim();
            updates.put("age", ageStr.isEmpty() ? 0 : Integer.parseInt(ageStr));
            updates.put("gender", etGender.getText().toString().trim());

            db.collection("users").document(uid).update(updates)
                    .addOnSuccessListener(unused -> Toast.makeText(getContext(), "Info updated", Toast.LENGTH_SHORT).show())
                    .addOnFailureListener(err -> Toast.makeText(getContext(), "Update failed", Toast.LENGTH_SHORT).show());
        });

        btnTraining.setOnClickListener(x -> openFragment(new TrainingFragment()));
        btnDistribution.setOnClickListener(x -> openFragment(new DistributionFragment()));
        btnEvents.setOnClickListener(x -> openFragment(new EventsFragment()));

        btnLogout.setOnClickListener(x -> {
            auth.signOut();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
        });

        return v;
    }

    private void updateStatus(TextView tv, Boolean done) {
        if (done != null && done) {
            tv.setText("✅ Done");
            tv.setTextColor(getResources().getColor(android.R.color.holo_green_dark));
        } else {
            tv.setText("❌ Pending");
            tv.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
        }
    }

    private void openFragment(Fragment fragment){
        FragmentTransaction ft = requireActivity().getSupportFragmentManager().beginTransaction();
        ft.replace(((ViewGroup)getView().getParent()).getId(), fragment);
        ft.addToBackStack(null);
        ft.commit();
    }
}
