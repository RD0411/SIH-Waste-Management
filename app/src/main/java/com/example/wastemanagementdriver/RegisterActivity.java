package com.example.wastemanagementdriver;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import java.util.HashMap;

public class RegisterActivity extends AppCompatActivity {
    EditText etName, etEmail, etPassword;
    Button btnRegister;
    ProgressBar progress;
    FirebaseAuth auth;
    FirebaseFirestore db;

    @Override protected void onCreate(Bundle s) {
        super.onCreate(s);
        setContentView(R.layout.activity_register);
        auth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        etName = findViewById(R.id.etName);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnRegister = findViewById(R.id.btnRegister);
        progress = findViewById(R.id.progressBar);

        btnRegister.setOnClickListener(v -> {
            String name = etName.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String pass = etPassword.getText().toString().trim();
            if (name.isEmpty()||email.isEmpty()||pass.isEmpty()){ Toast.makeText(this,"Fill all fields",Toast.LENGTH_SHORT).show(); return; }
            progress.setIndeterminate(true);
            auth.createUserWithEmailAndPassword(email, pass).addOnCompleteListener(task -> {
                progress.setIndeterminate(false);
                if (task.isSuccessful()) {
                    String uid = auth.getCurrentUser().getUid();
                    HashMap<String,Object> doc = new HashMap<>();
                    doc.put("name", name);
                    doc.put("email", email);
                    doc.put("role", "driver");
                    doc.put("greenPoints", 0);
                    db.collection("users").document(uid).set(doc).addOnSuccessListener(a->{
                        startActivity(new Intent(RegisterActivity.this, DriverMainActivity.class));
                        finish();
                    });
                } else {
                    Toast.makeText(RegisterActivity.this, "Register failed: "+(task.getException()!=null?task.getException().getMessage():"unknown"), Toast.LENGTH_LONG).show();
                }
            });
        });
    }
}

