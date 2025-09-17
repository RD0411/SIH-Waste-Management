package com.example.wastemanagementdriver;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import java.util.HashMap;
import java.util.Map;

public class DriverMainActivity extends AppCompatActivity {
    private final Map<Integer, Fragment> fragmentMap = new HashMap<>();
    private FirebaseAuth auth;

    @Override protected void onCreate(Bundle s) {
        super.onCreate(s);

        auth = FirebaseAuth.getInstance();
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) {
            startActivity(new Intent(this, LoginActivity.class));
            finish(); return;
        }

        setContentView(R.layout.activity_driver_main);

        fragmentMap.put(R.id.menu_dash, new DriverDashboardFragment());
        fragmentMap.put(R.id.menu_assigned, new AssignedReportsFragment());
        fragmentMap.put(R.id.menu_profile, new DriverProfileFragment());

        BottomNavigationView nav = findViewById(R.id.bottomNav);
        nav.setOnItemSelectedListener(item -> {
            Fragment f = fragmentMap.get(item.getItemId());
            if (f != null) getSupportFragmentManager().beginTransaction().replace(R.id.container, f).commit();
            return true;
        });

        nav.setSelectedItemId(R.id.menu_dash);
    }
}

