package com.example.wastemanagementgreenchampion;

import android.content.Context;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.google.firebase.firestore.DocumentSnapshot;
import java.util.List;

public class ReportAdapter extends RecyclerView.Adapter<ReportAdapter.VH> {
    private final List<DocumentSnapshot> items;
    private final Context ctx;
    private final OnActionListener listener;

    public interface OnActionListener {
        void onAction(DocumentSnapshot report, String action);
    }

    public ReportAdapter(List<DocumentSnapshot> items, Context ctx, OnActionListener listener) {
        this.items = items;
        this.ctx = ctx;
        this.listener = listener;
    }

    @NonNull @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(ctx).inflate(R.layout.item_report, parent, false);
        return new VH(v);
    }

    @Override public void onBindViewHolder(@NonNull VH holder, int pos) {
        DocumentSnapshot d = items.get(pos);
        holder.tvCategory.setText(d.getString("category") != null ? d.getString("category") : "—");
        holder.tvStatus.setText(d.getString("status") != null ? d.getString("status") : "—");
        holder.tvUser.setText("User: " + (d.getString("userId") != null ? d.getString("userId") : "-"));

        String base64 = d.getString("photoBase64");
        if (base64 != null && !base64.isEmpty()) {
            try {
                byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
                holder.ivPhoto.setImageBitmap(BitmapFactory.decodeByteArray(bytes, 0, bytes.length));
            } catch (Exception ex) {
                holder.ivPhoto.setImageResource(R.drawable.ic_image_placeholder);
            }
        } else {
            holder.ivPhoto.setImageResource(R.drawable.ic_image_placeholder);
        }

        holder.btnView.setOnClickListener(x -> listener.onAction(d, "view"));
        holder.btnVerify.setOnClickListener(x -> listener.onAction(d, "verify"));
        holder.btnReject.setOnClickListener(x -> listener.onAction(d, "reject"));
    }

    @Override public int getItemCount(){ return items.size(); }

    static class VH extends RecyclerView.ViewHolder {
        ImageView ivPhoto;
        TextView tvCategory, tvStatus, tvUser;
        Button btnView, btnVerify, btnReject;
        VH(View v) {
            super(v);
            ivPhoto = v.findViewById(R.id.ivPhoto);
            tvCategory = v.findViewById(R.id.tvCategory);
            tvStatus = v.findViewById(R.id.tvStatus);
            tvUser = v.findViewById(R.id.tvUser);
            btnView = v.findViewById(R.id.btnView);
            btnVerify = v.findViewById(R.id.btnVerify);
            btnReject = v.findViewById(R.id.btnReject);
        }
    }
}
