package com.example.wastemanagement;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.*;

import java.util.*;

public class MarketplaceFragment extends Fragment {
    RecyclerView rv;
    Button btnAdd;
    List<Map<String,Object>> items = new ArrayList<>();
    MarketplaceAdapter adapter;
    FirebaseFirestore db;
    FirebaseAuth auth;

    private static final String TAG = "MarketplaceFragment";

    public MarketplaceFragment(){}

    @Override
    public View onCreateView(@NonNull android.view.LayoutInflater inflater, ViewGroup c, Bundle s){
        android.view.View v = inflater.inflate(R.layout.fragment_marketplace, c, false);

        auth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = auth.getCurrentUser();
        if (currentUser == null) {
            Toast.makeText(requireContext(), "Please sign in first.", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return v;
        }

        rv = v.findViewById(R.id.rvMarket);
        btnAdd = v.findViewById(R.id.btnAdd);

        // DEBUG: Check if views are found
        Log.d(TAG, "RecyclerView found: " + (rv != null));
        Log.d(TAG, "Button found: " + (btnAdd != null));

        if (btnAdd == null) {
            Toast.makeText(requireContext(), "BUTTON IS NULL! Check layout file.", Toast.LENGTH_LONG).show();
            Log.e(TAG, "Button is null - creating programmatically");

            // Create button programmatically as fallback
            createButtonProgrammatically(v);
        } else {
            Toast.makeText(requireContext(), "BUY THE ITEM", Toast.LENGTH_SHORT).show();
        }

        db = FirebaseFirestore.getInstance();

        adapter = new MarketplaceAdapter(items, requireContext(), (item)-> {
            showBuyDialog(item);
        });
        rv.setLayoutManager(new LinearLayoutManager(requireContext()));
        rv.setAdapter(adapter);

        loadItems();

        // Set click listener
        if (btnAdd != null) {
            btnAdd.setOnClickListener(x -> showAddDialog());
        }

        return v;
    }

    // Create button programmatically if XML one doesn't work
    private void createButtonProgrammatically(View parentView) {
        if (parentView instanceof ViewGroup) {
            ViewGroup parent = (ViewGroup) parentView;

            btnAdd = new Button(requireContext());
            btnAdd.setText("Add Item");
            btnAdd.setTextColor(android.graphics.Color.WHITE);
            btnAdd.setBackgroundColor(android.graphics.Color.RED);

            // Create layout params
            RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
                    RelativeLayout.LayoutParams.WRAP_CONTENT,
                    RelativeLayout.LayoutParams.WRAP_CONTENT
            );
            params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
            params.addRule(RelativeLayout.ALIGN_PARENT_END);
            params.setMargins(16, 16, 16, 16);

            parent.addView(btnAdd, params);

            btnAdd.setOnClickListener(x -> showAddDialog());

            Toast.makeText(requireContext(), "Programmatic Button created", Toast.LENGTH_LONG).show();
            Log.d(TAG, "Programmatic Button created and added");
        }
    }

    private void loadItems(){
        db.collection("marketplace").orderBy("createdAt", Query.Direction.DESCENDING)
                .addSnapshotListener((snap, e) -> {
                    if (e != null) {
                        Log.e(TAG, "Error loading items", e);
                        return;
                    }
                    if (snap == null) {
                        Log.d(TAG, "Snapshot is null");
                        return;
                    }

                    items.clear();
                    for (DocumentSnapshot d: snap.getDocuments()){
                        if (d != null && d.getData() != null) {
                            items.add(d.getData());
                        }
                    }
                    adapter.notifyDataSetChanged();

                    if (items.isEmpty()) {
                        seedSampleMarketplaceData();
                    }
                });
    }

    private void seedSampleMarketplaceData() {
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) return;

        Map<String,Object> item1 = new HashMap<>();
        item1.put("title", "Recycled Paper Bag");
        item1.put("description", "Eco-friendly shopping bag made from recycled paper.");
        item1.put("price", 25);
        item1.put("sellerId", u.getUid());
        item1.put("photoBase64", "");
        item1.put("createdAt", Timestamp.now());

        Map<String,Object> item2 = new HashMap<>();
        item2.put("title", "Plastic Bottle Scrap");
        item2.put("description", "Bundle of 50 used plastic bottles for recycling.");
        item2.put("price", 100);
        item2.put("sellerId", u.getUid());
        item2.put("photoBase64", "");
        item2.put("createdAt", Timestamp.now());

        Map<String,Object> item3 = new HashMap<>();
        item3.put("title", "Compost Fertilizer");
        item3.put("description", "Organic compost fertilizer, 5kg pack.");
        item3.put("price", 80);
        item3.put("sellerId", u.getUid());
        item3.put("photoBase64", "");
        item3.put("createdAt", Timestamp.now());

        db.collection("marketplace").add(item1);
        db.collection("marketplace").add(item2);
        db.collection("marketplace").add(item3);

        Toast.makeText(requireContext(), "Sample items added to marketplace", Toast.LENGTH_SHORT).show();
    }

    private void showAddDialog(){
        android.view.View layout = getLayoutInflater().inflate(R.layout.dialog_add_market, null);
        EditText etTitle = layout.findViewById(R.id.etTitle);
        EditText etDesc = layout.findViewById(R.id.etDesc);
        EditText etPrice = layout.findViewById(R.id.etPrice);

        new AlertDialog.Builder(requireContext())
                .setTitle("Add Listing")
                .setView(layout)
                .setPositiveButton("Add", (dialog, which) -> {
                    String t = etTitle.getText() != null ? etTitle.getText().toString().trim() : "";
                    String d = etDesc.getText() != null ? etDesc.getText().toString().trim() : "";
                    double p = 0;
                    try {
                        String priceText = etPrice.getText() != null ? etPrice.getText().toString().trim() : "";
                        if (!priceText.isEmpty()) p = Double.parseDouble(priceText);
                    } catch (NumberFormatException ex) {
                        Toast.makeText(requireContext(), "Invalid price", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    FirebaseUser u = auth.getCurrentUser();
                    if (u == null) return;

                    Map<String,Object> doc = new HashMap<>();
                    doc.put("sellerId", u.getUid());
                    doc.put("title", t);
                    doc.put("description", d);
                    doc.put("price", p);
                    doc.put("photoBase64", "");
                    doc.put("createdAt", Timestamp.now());
                    db.collection("marketplace").add(doc);
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void showBuyDialog(Map<String,Object> item){
        double price = 0;
        if (item.containsKey("price") && item.get("price") instanceof Number) {
            price = ((Number)item.get("price")).doubleValue();
        }
        double finalPrice = price;
        new AlertDialog.Builder(requireContext())
                .setTitle("Confirm Payment")
                .setMessage("Pay \u20B9"+price+" (mock payment)?")
                .setPositiveButton("Confirm", (d,w) -> {
                    FirebaseUser u = auth.getCurrentUser();
                    if (u == null) return;
                    Map<String,Object> order = new HashMap<>();
                    order.put("buyerId", u.getUid());
                    order.put("itemTitle", item.get("title"));
                    order.put("amount", finalPrice);
                    order.put("status", "paid");
                    order.put("createdAt", Timestamp.now());
                    db.collection("orders").add(order);
                    Toast.makeText(requireContext(),"Payment successful (mock).",Toast.LENGTH_LONG).show();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }
}