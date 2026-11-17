这是一个简单的汉字、拼音翻牌凑对游戏。支持同音字和多音字。

字库与 HanziBomb 相同：欢乐伙伴2.0一年级所有识读字（19课，共364字）。先选年级，再选单个课次或整个年级（每局随机20字），或输入自定义字表。

文件结构：
- `index.html` 页面
- `style.css` 样式
- `hanzilist.csv` 字库，四栏：年级,课次,汉字,拼音（与 HanziBomb 相同）。多音字的读音用空格分隔。加新年级或新课次只需往这个文件里加行。
- `js/hanzilist.js` 读取字库
- `js/game.js` 游戏逻辑

注意：页面要通过网址打开（GitHub Pages，或在文件夹里运行 `python3 -m http.server` 后访问 http://localhost:8000）。直接双击 index.html 打开时，浏览器不允许读取 hanzilist.csv。
