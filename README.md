这是一个简单的汉字、拼音配对游戏。支持同音字和多音字。

“翻翻乐”模式较难，要翻开可以配对的字才可以消除。这样同时考验记忆力。

字库与 HanziBomb 相同：欢乐伙伴2.0一至三年级及四年级上册的识读字（共1184字，来自 HanziQuery）。先选年级，再选单个课次或整个年级，并可选择每局字数（6、10、15、20、30，字数不够时全部使用），或输入自定义字表。

## 安卓版

`android/` 是安卓 App（WebView 打包本仓库的网页）。每次推送到 main，GitHub Actions 会分别生成 `.apk`（GitHub 版，带检查更新）和 `.aab`（Google Play 版，按 Play 政策不含自行更新），作为 Release 的两个独立文件发布（不打包压缩）。发布新版本时，提高 `android/version.properties` 里的 `VERSION_NAME` 和 `VERSION_CODE`。

App 启动时会自动检查 GitHub 上的最新版本，也可以在设置页点“检查更新”。发现新版本时可选择“安装”或“忽略”。

签名需要在仓库 Settings → Secrets and variables → Actions 中设置：`ANDROID_KEYSTORE_BASE64`、`ANDROID_KEYSTORE_PASSWORD`、`ANDROID_KEY_ALIAS`、`ANDROID_KEY_PASSWORD`。
