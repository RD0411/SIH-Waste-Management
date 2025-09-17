package com.example.wastemanagement;

import android.content.Intent;
import android.view.*;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.firestore.DocumentSnapshot;

import java.text.SimpleDateFormat;
import java.util.*;

public class RecentReportsAdapter extends RecyclerView.Adapter<RecentReportsAdapter.VH> {
    List<DocumentSnapshot> items;

    public RecentReportsAdapter(List<DocumentSnapshot> items) {
        this.items = items;
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_recent_report, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH h, int pos) {
        DocumentSnapshot d = items.get(pos);
        String category = d.getString("category");
        String status = d.getString("status");

        h.tvCategory.setText(category != null ? category : "Unknown");
        h.tvStatus.setText("Status: " + (status != null ? status : "Pending"));

        Date createdAt = d.getDate("createdAt");
        if (createdAt != null) {
            String dateStr = new SimpleDateFormat("dd MMM, hh:mm a", Locale.getDefault()).format(createdAt);
            h.tvDate.setText(dateStr);
        } else {
            h.tvDate.setText("No Date");
        }

        // On click → open detail
        h.itemView.setOnClickListener(v -> {
            Intent i = new Intent(v.getContext(), ReportDetailActivity.class);
            i.putExtra("reportId", d.getId());
            v.getContext().startActivity(i);
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        TextView tvCategory, tvStatus, tvDate;

        VH(View v) {
            super(v);
            tvCategory = v.findViewById(R.id.tvCategory);
            tvStatus = v.findViewById(R.id.tvStatus);
            tvDate = v.findViewById(R.id.tvDate);
        }
    }
}
