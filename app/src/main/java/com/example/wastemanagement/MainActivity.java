package com.example.wastemanagement;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private final Map<Integer, Fragment> fragmentMap = new HashMap<>();
    private FirebaseAuth auth;

    @Override
    protected void onCreate(Bundle s) {
        super.onCreate(s);

        auth = FirebaseAuth.getInstance();
        FirebaseUser user = auth.getCurrentUser();
        if (user == null) {
            // No signed-in user → send to LoginActivity
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_main);

        // Map menu IDs to fragments
        fragmentMap.put(R.id.menu_dashboard, new DashboardFragment());
        fragmentMap.put(R.id.menu_report, new ReportFragment());
        fragmentMap.put(R.id.menu_market, new MarketplaceFragment());
        fragmentMap.put(R.id.menu_profile, new ProfileFragment());

        BottomNavigationView nav = findViewById(R.id.bottomNav);
        nav.setOnItemSelectedListener(item -> {
            Fragment f = fragmentMap.get(item.getItemId());
            if (f != null) {
                getSupportFragmentManager()
                        .beginTransaction()
                        .replace(R.id.container, f)
                        .commit();
            }
            return true;
        });

        // Default selection
        nav.setSelectedItemId(R.id.menu_dashboard);
    }
}
