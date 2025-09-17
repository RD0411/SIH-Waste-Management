package com.example.wastemanagementdriver;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.*;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textview.MaterialTextView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class DriverProfileFragment extends Fragment {

    MaterialTextView tvName, tvEmail;
    TextInputEditText etPhone, etVehicle, etAddress;
    MaterialButton btnLogout, btnSaveInfo,btnTraining;
    FirebaseAuth auth;
    FirebaseFirestore db;

    public DriverProfileFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState){
        View v = inflater.inflate(R.layout.fragment_driver_profile, container, false);

        tvName = v.findViewById(R.id.tvName);
        tvEmail = v.findViewById(R.id.tvEmail);
        etPhone = v.findViewById(R.id.etPhone);
        etVehicle = v.findViewById(R.id.etVehicle);
        etAddress = v.findViewById(R.id.etAddress);
        btnLogout = v.findViewById(R.id.btnLogout);
        btnSaveInfo = v.findViewById(R.id.btnSaveInfo);
        btnTraining=v.findViewById(R.id.btnTraining);

        auth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        FirebaseUser user = auth.getCurrentUser();
        if (user == null) {
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return v;
        }

        // Fetch user info
        db.collection("users").document(user.getUid()).get().addOnSuccessListener(doc -> {
            if (doc.exists()){
                tvName.setText(doc.getString("name"));
                tvEmail.setText(doc.getString("email"));

                // Prefill additional info
                if (doc.contains("phone")) etPhone.setText(doc.getString("phone"));
                if (doc.contains("vehicle")) etVehicle.setText(doc.getString("vehicle"));
                if (doc.contains("address")) etAddress.setText(doc.getString("address"));
            }
        });

        btnSaveInfo.setOnClickListener(x -> {
            String phone = etPhone.getText().toString().trim();
            String vehicle = etVehicle.getText().toString().trim();
            String address = etAddress.getText().toString().trim();

            if (TextUtils.isEmpty(phone) || TextUtils.isEmpty(vehicle) || TextUtils.isEmpty(address)){
                Toast.makeText(requireContext(), "Please fill all fields", Toast.LENGTH_SHORT).show();
                return;
            }

            Map<String, Object> updates = new HashMap<>();
            updates.put("phone", phone);
            updates.put("vehicle", vehicle);
            updates.put("address", address);

            db.collection("users").document(user.getUid()).update(updates)
                    .addOnSuccessListener(aVoid -> Toast.makeText(requireContext(), "Info saved successfully", Toast.LENGTH_SHORT).show())
                    .addOnFailureListener(e -> Toast.makeText(requireContext(), "Failed to save info", Toast.LENGTH_SHORT).show());
        });
        btnTraining.setOnClickListener(view -> {
            requireActivity().getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.container, new TrainingFragment())
                    .addToBackStack(null)
                    .commit();
        });


        btnLogout.setOnClickListener(x -> {
            auth.signOut();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
        });

        return v;
    }
}
