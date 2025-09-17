package com.example.wastemanagement;

import android.graphics.Bitmap;
import android.util.Base64;
import android.view.*;
import android.widget.*;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.*;

public class MarketplaceAdapter extends RecyclerView.Adapter<MarketplaceAdapter.VH> {
    List<Map<String,Object>> items;
    android.content.Context ctx;
    OnItemClick listener;

    interface OnItemClick {
        void onClick(Map<String,Object> item);
    }

    public MarketplaceAdapter(List<Map<String,Object>> items, android.content.Context ctx, OnItemClick listener){
        this.items = items;
        this.ctx = ctx;
        this.listener = listener;
    }

    @NonNull
    @Override
    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType){
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_marketplace, parent, false);
        return new VH(v);
    }

    @Override
    public void onBindViewHolder(@NonNull VH holder, int pos){
        Map<String,Object> it = items.get(pos);

        // Set title
        holder.title.setText(String.valueOf(it.get("title")));

        // Set price
        holder.price.setText("₹" + String.valueOf(it.get("price")));

        // Set description
        holder.description.setText(String.valueOf(it.get("description")));

        // Decode and set image
        String b64 = (String) it.get("photoBase64");
        if (b64 != null && !b64.isEmpty()) {
            byte[] bytes = Base64.decode(b64, Base64.DEFAULT);
            Bitmap bm = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
            holder.iv.setImageBitmap(bm);
        } else {
            holder.iv.setImageResource(R.drawable.ic_image_placeholder);
        }

        // Handle click
        holder.itemView.setOnClickListener(v -> listener.onClick(it));
    }

    @Override
    public int getItemCount(){
        return items.size();
    }

    static class VH extends RecyclerView.ViewHolder {
        ImageView iv;
        TextView title, price, description;

        VH(View item) {
            super(item);
            iv = item.findViewById(R.id.ivItem);
            title = item.findViewById(R.id.tvTitle);
            price = item.findViewById(R.id.tvPrice);
            description = item.findViewById(R.id.tvDescription); // NEW
        }
    }
}
