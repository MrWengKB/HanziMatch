// 安卓 App 专用：显示版本号和“检查更新”按钮（网页版中不显示）
(function () {
    if (!window.AndroidApp) return;
    var box = document.getElementById('appUpdate');
    var ver = document.getElementById('appVersion');
    try { ver.textContent = '版本 ' + AndroidApp.getVersion(); } catch (e) { }
    var canUpdate = true;
    try { canUpdate = AndroidApp.canUpdate(); } catch (e) { }
    if (!canUpdate) box.querySelector('.link-btn').style.display = 'none';
    box.classList.remove('hidden');
})();
