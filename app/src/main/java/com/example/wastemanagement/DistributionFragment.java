package com.example.wastemanagement;

import android.os.Bundle;
import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.*;
import com.bumptech.glide.Glide;   // ✅ add Glide dependency
import com.google.firebase.auth.*;
import com.google.firebase.firestore.*;
import java.util.*;

public class DistributionFragment extends Fragment {
    RecyclerView rvDistributions;
    DistributionAdapter adapter;
    List<DocumentSnapshot> items = new ArrayList<>();
    FirebaseFirestore db;
    FirebaseAuth auth;

    public DistributionFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s){
        View v = inflater.inflate(R.layout.fragment_distribution, c, false);
        rvDistributions = v.findViewById(R.id.rvDistributions);

        db = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();

        adapter = new DistributionAdapter();
        rvDistributions.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvDistributions.setAdapter(adapter);

        // Insert sample distributions if empty
        db.collection("distributions").get().addOnSuccessListener(snap -> {
            if (snap.isEmpty()) {
                Map<String,Object> d1 = new HashMap<>();
                d1.put("title", "3-bin Set");
                d1.put("description", "Dry, Wet, Hazardous waste bins.");
                d1.put("imageUrl", "https://socleanindia.com/wp-content/uploads/2016/11/Waste-Segregation-System-3-Bin-60-Ltr.jpg");
                db.collection("distributions").document().set(d1);

                Map<String,Object> d2 = new HashMap<>();
                d2.put("title", "Compost Kit");
                d2.put("description", "Kit for household composting.");
                d2.put("imageUrl", "https://m.media-amazon.com/images/I/61LHC7S2B-L.jpg");
                db.collection("distributions").document().set(d2);
            }
        });

        db.collection("distributions").addSnapshotListener((snap,e)->{
            if (e!=null) return;
            items.clear();
            if (snap!=null) items.addAll(snap.getDocuments());
            adapter.notifyDataSetChanged();
        });

        return v;
    }

    class DistributionAdapter extends RecyclerView.Adapter<DistributionAdapter.VH>{
        @NonNull @Override
        public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View it = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_distribution, parent, false);
            return new VH(it);
        }

        @Override public void onBindViewHolder(@NonNull VH h, int pos) {
            DocumentSnapshot d = items.get(pos);
            h.tvTitle.setText(d.getString("title"));
            h.tvDesc.setText(d.getString("description"));

            // ✅ Load image from Firestore field
            String imageUrl = d.getString("imageUrl");
            if (imageUrl != null && !imageUrl.isEmpty()) {
                Glide.with(h.itemView.getContext())
                        .load(imageUrl)
                        .placeholder(R.drawable.ic_launcher_background)
                        .into(h.ivImage);
            }

            h.btnReceived.setOnClickListener(x -> markDistributionDone());
        }

        @Override public int getItemCount(){ return items.size(); }

        class VH extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDesc;
            Button btnReceived;
            ImageView ivImage;
            VH(View item){
                super(item);
                tvTitle = item.findViewById(R.id.tvTitle);
                tvDesc = item.findViewById(R.id.tvDesc);
                btnReceived = item.findViewById(R.id.btnReceived);
                ivImage = item.findViewById(R.id.ivImage);
            }
        }
    }

    private void markDistributionDone(){
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) return;
        db.collection("users").document(u.getUid())
                .update("distributionDone", true, "greenPoints", FieldValue.increment(20))
                .addOnSuccessListener(a-> Toast.makeText(requireContext(),
                        "Distribution Received ✅ +20 points",Toast.LENGTH_SHORT).show());
    }
}
