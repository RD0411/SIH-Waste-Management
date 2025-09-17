package com.example.wastemanagementdriver;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.*;
import com.google.firebase.auth.*;
import com.google.firebase.firestore.*;
import java.util.*;

public class TrainingFragment extends Fragment {
    RecyclerView rvTrainings;
    TrainingAdapter adapter;
    List<DocumentSnapshot> items = new ArrayList<>();
    FirebaseFirestore db;
    FirebaseAuth auth;

    public TrainingFragment() {}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s) {
        View v = inflater.inflate(R.layout.fragment_training, c, false);
        rvTrainings = v.findViewById(R.id.rvTrainings);

        db = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();

        adapter = new TrainingAdapter();
        rvTrainings.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvTrainings.setAdapter(adapter);

        // Insert detailed trainings if collection is empty
        db.collection("trainings").get().addOnSuccessListener(snap -> {
            if (snap.isEmpty()) {
                Map<String, Object> compost = new HashMap<>();
                compost.put("title", "Composting at Home");
                compost.put("description",
                        "Learn how to compost effectively at home:\n\n" +
                                "1. Collect GREEN materials: fruit & veggie scraps, coffee grounds.\n" +
                                "2. Collect BROWN materials: dry leaves, paper, straw.\n" +
                                "3. Layer browns and greens in a bin or pile (more browns than greens).\n" +
                                "4. Keep the pile moist (like a wrung-out sponge), aerate by turning weekly.\n" +
                                "5. Finished compost (~3-6 months) will be dark, crumbly, and earthy smelling.\n\n" +
                                "Benefits: reduces waste, enriches soil, eco-friendly fertilizer.");
                compost.put("videoUrl", "https://www.youtube.com/watch?v=zy70DAaeFBI");
                db.collection("trainings").document().set(compost);

                Map<String, Object> waste = new HashMap<>();
                waste.put("title", "Waste Segregation Basics");
                waste.put("description",
                        "Understand how to segregate waste properly:\n\n" +
                                "1. DRY waste: paper, plastics, glass, metals.\n" +
                                "2. WET (organic) waste: food scraps, vegetable peels.\n" +
                                "3. HAZARDOUS waste: batteries, e-waste, chemicals (keep separate).\n\n" +
                                "Why it matters: improves recycling, reduces pollution, supports circular economy.");
                waste.put("videoUrl", "https://www.youtube.com/watch?v=O1qTFFF0zd8");
                db.collection("trainings").document().set(waste);
            }
        });

        db.collection("trainings").addSnapshotListener((snap, e) -> {
            if (e != null) return;
            items.clear();
            if (snap != null) items.addAll(snap.getDocuments());
            adapter.notifyDataSetChanged();
        });

        return v;
    }

    class TrainingAdapter extends RecyclerView.Adapter<TrainingAdapter.VH> {
        @NonNull @Override
        public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View it = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_training, parent, false);
            return new VH(it);
        }

        @Override
        public void onBindViewHolder(@NonNull VH h, int pos) {
            DocumentSnapshot d = items.get(pos);
            h.tvTitle.setText(d.getString("title"));
            h.tvDesc.setText(d.getString("description"));

            String videoUrl = d.getString("videoUrl");
            if (videoUrl != null && !videoUrl.isEmpty()) {
                h.btnVideo.setVisibility(View.VISIBLE);
                h.btnVideo.setOnClickListener(x -> {
                    Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(videoUrl));
                    startActivity(i);
                });
            } else {
                h.btnVideo.setVisibility(View.GONE);
            }

            h.btnComplete.setOnClickListener(x -> markTrainingDone());
        }

        @Override
        public int getItemCount() {
            return items.size();
        }

        class VH extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDesc;
            Button btnVideo, btnComplete;

            VH(View item) {
                super(item);
                tvTitle = item.findViewById(R.id.tvTitle);
                tvDesc = item.findViewById(R.id.tvDesc);
                btnVideo = item.findViewById(R.id.btnVideo);
                btnComplete = item.findViewById(R.id.btnComplete);
            }
        }
    }

    private void markTrainingDone() {
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) return;
        db.collection("users").document(u.getUid())
                .update("trainingDone", true,
                        "greenPoints", FieldValue.increment(15))
                .addOnSuccessListener(a ->
                        Toast.makeText(requireContext(),
                                "Training Completed ✅ +15 points",
                                Toast.LENGTH_SHORT).show()
                );
    }
}
