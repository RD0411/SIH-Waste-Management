package com.example.wastemanagementgreenchampion;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import java.util.HashMap;
import java.util.Map;

public class GreenMainActivity extends AppCompatActivity {
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

        setContentView(R.layout.activity_green_main);

        fragmentMap.put(R.id.menu_home, new HomeFragment());
        fragmentMap.put(R.id.menu_reports, new ReportsFragment());
        fragmentMap.put(R.id.menu_map, new MapFragment());
        fragmentMap.put(R.id.menu_profile, new ProfileFragment());

        BottomNavigationView nav = findViewById(R.id.bottomNav);
        nav.setOnItemSelectedListener(item -> {
            Fragment f = fragmentMap.get(item.getItemId());
            if (f != null) getSupportFragmentManager().beginTransaction().replace(R.id.container, f).commit();
            return true;
        });

        nav.setSelectedItemId(R.id.menu_home);
    }
}
