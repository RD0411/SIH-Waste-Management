package com.example.wastemanagement;

import android.os.Bundle;
import android.view.*;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.*;

import java.util.*;

public class EventsFragment extends Fragment {
    RecyclerView rvEvents;
    EventAdapter adapter;
    List<DocumentSnapshot> items = new ArrayList<>();
    FirebaseFirestore db;
    FirebaseAuth auth;

    public EventsFragment(){}

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup c, Bundle s){
        View v = inflater.inflate(R.layout.fragment_events, c, false);
        rvEvents = v.findViewById(R.id.rvEvents);

        db = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();

        adapter = new EventAdapter();
        rvEvents.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvEvents.setAdapter(adapter);

        // Insert sample events if empty
        db.collection("events").get().addOnSuccessListener(snap -> {
            if (snap.isEmpty()) {
                Map<String,Object> e1 = new HashMap<>();
                e1.put("title", "Beach Cleaning Drive");
                e1.put("date", "2025-09-05");
                e1.put("location", "Mumbai Juhu Beach");

                Map<String,Object> e2 = new HashMap<>();
                e2.put("title", "Plastic-Free Awareness Walk");
                e2.put("date", "2025-09-10");
                e2.put("location", "Pune City Center");

                db.collection("events").document().set(e1);
                db.collection("events").document().set(e2);
            }
        });

        // Listen for events
        db.collection("events").addSnapshotListener((snap,e)->{
            if (e!=null) return;
            items.clear();
            if (snap!=null) items.addAll(snap.getDocuments());
            adapter.notifyDataSetChanged();
        });

        return v;
    }

    class EventAdapter extends RecyclerView.Adapter<EventAdapter.VH>{
        @NonNull @Override
        public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View it = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_event, parent, false);
            return new VH(it);
        }

        @Override
        public void onBindViewHolder(@NonNull VH h, int pos) {
            DocumentSnapshot d = items.get(pos);
            h.tvTitle.setText(d.getString("title"));
            h.tvDate.setText("Date: " + d.getString("date"));
            h.tvLoc.setText("Location: " + d.getString("location"));

            h.btnAttend.setOnClickListener(x -> attendEvent(d.getId()));
        }

        @Override public int getItemCount(){ return items.size(); }

        class VH extends RecyclerView.ViewHolder {
            TextView tvTitle, tvDate, tvLoc;
            Button btnAttend;
            VH(View item){
                super(item);
                tvTitle = item.findViewById(R.id.tvTitle);
                tvDate = item.findViewById(R.id.tvDate);
                tvLoc = item.findViewById(R.id.tvLoc);
                btnAttend = item.findViewById(R.id.btnAttend);
            }
        }
    }

    private void attendEvent(String eventId){
        FirebaseUser u = auth.getCurrentUser();
        if (u == null) {
            Toast.makeText(requireContext(),"Please sign in first",Toast.LENGTH_SHORT).show();
            return;
        }
        String uid = u.getUid();
        db.collection("users").document(uid).update("eventDone", true, "greenPoints", FieldValue.increment(10))
                .addOnSuccessListener(a-> Toast.makeText(requireContext(),"Marked attended ✅ +10 points",Toast.LENGTH_SHORT).show())
                .addOnFailureListener(err-> Toast.makeText(requireContext(),"Error: "+err.getMessage(),Toast.LENGTH_LONG).show());
    }
}
