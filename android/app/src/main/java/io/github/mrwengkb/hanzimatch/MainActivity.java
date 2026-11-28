package io.github.mrwengkb.hanzimatch;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.view.WindowInsets;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import android.window.OnBackInvokedDispatcher;

import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends Activity {

    private static final String RELEASES_API =
            "https://api.github.com/repos/MrWengKB/HanziMatch/releases/latest";
    private static final String START_URL =
            "https://appassets.androidplatform.net/assets/www/index.html";
    private static final String PREFS = "update";
    private static final String KEY_IGNORED = "ignoredVersion";

    private WebView webView;
    private final Handler main = new Handler(Looper.getMainLooper());
    private long downloadId = -1;
    private File pendingApk;
    private BroadcastReceiver downloadReceiver;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        webView.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("appassets.androidplatform.net".equals(uri.getHost())) {
                    return false; // 本地页面，留在 App 内
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri)); // 外部链接交给浏览器打开
                } catch (android.content.ActivityNotFoundException ignored) {
                }
                return true;
            }
        });
        webView.addJavascriptInterface(new AppBridge(), "AndroidApp");
        android.widget.FrameLayout root = new android.widget.FrameLayout(this);
        root.setBackgroundColor(0xFF6F65C6);
        root.addView(webView, new android.widget.FrameLayout.LayoutParams(-1, -1));
        // Android 15+ 强制全面屏：给状态栏、导航栏和刘海留出空间
        root.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets b = insets.getInsets(
                        WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(b.left, b.top, b.right, b.bottom);
            }
            return insets;
        });
        setContentView(root);

        // Android 13+ 返回手势（targetSdk 36 起不再调用 onBackPressed）
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, this::handleBack);
        }

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        } else {
            webView.loadUrl(START_URL);
            if (BuildConfig.SELF_UPDATE) checkForUpdate(false);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @Override
    public void onBackPressed() {
        handleBack();
    }

    private void handleBack() {
        if (webView.canGoBack()) webView.goBack();
        else finish();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // 用户从“允许安装未知应用”设置页返回后继续安装
        if (pendingApk != null && canInstall()) {
            File f = pendingApk;
            pendingApk = null;
            installApk(f);
        }
    }

    @Override
    protected void onDestroy() {
        if (downloadReceiver != null) {
            try { unregisterReceiver(downloadReceiver); } catch (Exception ignored) { }
        }
        super.onDestroy();
    }

    /** 网页里调用：window.AndroidApp.checkUpdate() / getVersion() */
    private class AppBridge {
        @JavascriptInterface
        public void checkUpdate() { if (BuildConfig.SELF_UPDATE) main.post(() -> checkForUpdate(true)); }

        @JavascriptInterface
        public boolean canUpdate() { return BuildConfig.SELF_UPDATE; }

        @JavascriptInterface
        public String getVersion() { return BuildConfig.VERSION_NAME; }
    }

    // ===== 检查更新 =====

    private void checkForUpdate(final boolean manual) {
        if (manual) toast("正在检查更新…");
        new Thread(() -> {
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(RELEASES_API).openConnection();
                c.setRequestProperty("Accept", "application/vnd.github+json");
                c.setConnectTimeout(10000);
                c.setReadTimeout(10000);
                if (c.getResponseCode() != 200) throw new Exception("HTTP " + c.getResponseCode());
                StringBuilder sb = new StringBuilder();
                try (BufferedReader r = new BufferedReader(new InputStreamReader(c.getInputStream(), "UTF-8"))) {
                    String line;
                    while ((line = r.readLine()) != null) sb.append(line);
                }
                JSONObject rel = new JSONObject(sb.toString());
                String latest = rel.optString("tag_name", "").replaceFirst("^[vV]", "");
                String notes = rel.optString("body", "");
                String apkUrl = null;
                JSONArray assets = rel.optJSONArray("assets");
                if (assets != null) {
                    for (int i = 0; i < assets.length(); i++) {
                        JSONObject a = assets.getJSONObject(i);
                        if (a.optString("name").toLowerCase().endsWith(".apk")) {
                            apkUrl = a.optString("browser_download_url");
                            break;
                        }
                    }
                }
                final String fLatest = latest, fUrl = apkUrl, fNotes = notes;
                main.post(() -> onUpdateInfo(manual, fLatest, fUrl, fNotes));
            } catch (Exception e) {
                if (manual) main.post(() -> toast("检查更新失败，请检查网络"));
            }
        }).start();
    }

    private void onUpdateInfo(boolean manual, String latest, String apkUrl, String notes) {
        if (isFinishing()) return;
        if (latest.isEmpty() || apkUrl == null || compareVersions(latest, BuildConfig.VERSION_NAME) <= 0) {
            if (manual) toast("已经是最新版本（" + BuildConfig.VERSION_NAME + "）");
            return;
        }
        final SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        if (!manual && latest.equals(prefs.getString(KEY_IGNORED, ""))) return;

        String msg = "当前版本：" + BuildConfig.VERSION_NAME + "\n最新版本：" + latest;
        if (notes != null && !notes.trim().isEmpty()) msg += "\n\n" + notes.trim();
        new AlertDialog.Builder(this)
                .setTitle("发现新版本")
                .setMessage(msg)
                .setPositiveButton("安装", (d, w) -> downloadAndInstall(apkUrl, latest))
                .setNegativeButton("忽略", (d, w) -> prefs.edit().putString(KEY_IGNORED, latest).apply())
                .setNeutralButton("稍后", null)
                .show();
    }

    static int compareVersions(String a, String b) {
        String[] pa = a.split("[^0-9]+"), pb = b.split("[^0-9]+");
        int n = Math.max(pa.length, pb.length);
        for (int i = 0; i < n; i++) {
            int x = i < pa.length && !pa[i].isEmpty() ? Integer.parseInt(pa[i]) : 0;
            int y = i < pb.length && !pb[i].isEmpty() ? Integer.parseInt(pb[i]) : 0;
            if (x != y) return Integer.compare(x, y);
        }
        return 0;
    }

    // ===== 下载并安装 =====

    private void downloadAndInstall(String url, String version) {
        File dir = new File(getExternalFilesDir(null), "updates");
        if (!dir.exists()) dir.mkdirs();
        File[] old = dir.listFiles();
        if (old != null) for (File f : old) f.delete();
        final File apk = new File(dir, "HanziMatch-" + version + ".apk");

        DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
        DownloadManager.Request req = new DownloadManager.Request(Uri.parse(url))
                .setTitle("拼音配对 " + version)
                .setDescription("正在下载更新")
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                .setDestinationUri(Uri.fromFile(apk));

        if (downloadReceiver != null) {
            try { unregisterReceiver(downloadReceiver); } catch (Exception ignored) { }
        }
        downloadReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context ctx, Intent intent) {
                long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                if (id != downloadId) return;
                if (downloadSucceeded(dm, id)) installApk(apk);
                else toast("下载失败，请稍后重试");
            }
        };
        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= 33) {
            registerReceiver(downloadReceiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            registerReceiver(downloadReceiver, filter);
        }
        downloadId = dm.enqueue(req);
        toast("开始下载更新…");
    }

    private boolean downloadSucceeded(DownloadManager dm, long id) {
        try (Cursor c = dm.query(new DownloadManager.Query().setFilterById(id))) {
            if (c != null && c.moveToFirst()) {
                int col = c.getColumnIndex(DownloadManager.COLUMN_STATUS);
                return col >= 0 && c.getInt(col) == DownloadManager.STATUS_SUCCESSFUL;
            }
        }
        return false;
    }

    private boolean canInstall() {
        return Build.VERSION.SDK_INT < 26 || getPackageManager().canRequestPackageInstalls();
    }

    private void installApk(File apk) {
        if (!canInstall()) {
            pendingApk = apk;
            toast("请允许本应用安装更新，然后返回");
            startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                    Uri.parse("package:" + getPackageName())));
            return;
        }
        Uri uri = FileProvider.getUriForFile(this, getPackageName() + ".fileprovider", apk);
        Intent i = new Intent(Intent.ACTION_VIEW)
                .setDataAndType(uri, "application/vnd.android.package-archive")
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
    }

    private void toast(String m) { Toast.makeText(this, m, Toast.LENGTH_SHORT).show(); }
}
