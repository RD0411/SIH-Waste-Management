package com.example.wastemanagementgreenchampion;

import android.content.Intent;
import android.os.Bundle;
import android.widget.*;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;

public class LoginActivity extends AppCompatActivity {
    EditText etEmail, etPassword;
    Button btnLogin, btnGotoRegister;
    ProgressBar progress;
    FirebaseAuth auth;

    @Override protected void onCreate(Bundle s) {
        super.onCreate(s);
        setContentView(R.layout.activity_login);

        auth = FirebaseAuth.getInstance();
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
        btnGotoRegister = findViewById(R.id.btnGotoRegister);
        progress = findViewById(R.id.progressBar);

        btnGotoRegister.setOnClickListener(v -> startActivity(new Intent(this, RegisterActivity.class)));

        btnLogin.setOnClickListener(v -> {
            String e = etEmail.getText().toString().trim();
            String p = etPassword.getText().toString().trim();
            if (e.isEmpty() || p.isEmpty()) { Toast.makeText(this,"Enter email & password",Toast.LENGTH_SHORT).show(); return; }
            progress.setIndeterminate(true);
            auth.signInWithEmailAndPassword(e,p).addOnCompleteListener(task -> {
                progress.setIndeterminate(false);
                if (task.isSuccessful()) {
                    startActivity(new Intent(LoginActivity.this, GreenMainActivity.class));
                    finish();
                } else {
                    Toast.makeText(LoginActivity.this, "Login failed: "+(task.getException()!=null?task.getException().getMessage():"unknown"), Toast.LENGTH_LONG).show();
                }
            });
        });
    }
}
