package com.example.wastemanagementdriver;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.journeyapps.barcodescanner.BarcodeEncoder;

public class QRScanActivity extends AppCompatActivity {
    private ProgressBar progressBar;
    private TextView statusText;
    private ImageView qrImageView;

    @Override
    protected void onCreate(Bundle s) {
        super.onCreate(s);
        setContentView(R.layout.activity_qrscan);

        progressBar = findViewById(R.id.progressBar);
        statusText = findViewById(R.id.statusText);
        qrImageView = findViewById(R.id.qrImageView);

        String reportId = getIntent().getStringExtra("reportId");
        if (reportId == null) {
            Toast.makeText(this, "No reportId provided", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Generate and display QR
        generateQRCode(reportId);

        statusText.setText("Scanning QR...");
        progressBar.setIndeterminate(true);

        // simulate scanning delay (4 sec)
        new Handler().postDelayed(() -> {
            // return result to fragment
            Intent data = new Intent();
            data.putExtra("scanned", reportId);
            setResult(RESULT_OK, data);
            finish();
        }, 4000);
    }

    private void generateQRCode(String text) {
        try {
            BarcodeEncoder encoder = new BarcodeEncoder();
            Bitmap bitmap = encoder.encodeBitmap(text, BarcodeFormat.QR_CODE, 600, 600);
            qrImageView.setImageBitmap(bitmap);
        } catch (WriterException e) {
            e.printStackTrace();
        }
    }
}
