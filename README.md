这是一个简单的汉字、拼音翻牌凑对游戏。支持同音字和多音字。

字库与 HanziBomb 相同：欢乐伙伴2.0一至三年级的识读字（共1031字，来自 HanziQuery）。先选年级，再选单个课次或整个年级，并可调整每局字数（4～30，字数不够时全部使用），或输入自定义字表。

文件结构：
- `index.html` 页面
- `style.css` 样式
- `hanzilist.csv` 字库，五栏：年级,课次,生字,拼音1,拼音2（与 HanziBomb 相同）。拼音2 是多音字的第二个读音，没有就留空。加新年级或新课次只需往这个文件里加行。
- `js/hanzilist.js` 读取字库
- `js/game.js` 游戏逻辑

注意：页面要通过网址打开（GitHub Pages，或在文件夹里运行 `python3 -m http.server` 后访问 http://localhost:8000）。直接双击 index.html 打开时，浏览器不允许读取 hanzilist.csv。
