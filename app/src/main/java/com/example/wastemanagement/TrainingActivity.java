package com.example.wastemanagement;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;
import java.util.HashMap;

public class TrainingActivity extends AppCompatActivity {
    Button btnComplete;
    FirebaseAuth auth;
    FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle s) {
        super.onCreate(s);
        setContentView(R.layout.activity_training);
        btnComplete = findViewById(R.id.btnComplete);
        auth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        btnComplete.setOnClickListener(v -> {
            String uid = auth.getCurrentUser().getUid();
            HashMap<String,Object> upd = new HashMap<>();
            upd.put("trainingCompleted", true);
            db.collection("users").document(uid).update(upd)
                    .addOnSuccessListener(aVoid -> {
                        startActivity(new Intent(TrainingActivity.this, MainActivity.class));
                        finish();
                    });
        });
    }
}
