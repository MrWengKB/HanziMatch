// 字库读取：从 hanzilist.csv 加载年级、课次和汉字
//
// hanzilist.csv 格式（第一行为表头）：
//   年级,课次,汉字,拼音
//   一年级,第一课,二,èr
// 多音字的多个读音用空格分隔，例如：一年级,第三课,地,dì de
// 年级、课次的显示顺序 = 在文件中第一次出现的顺序。
//
// 加载结果 GRADES 的结构：
//   { "一年级": { "第一课": [{ char, pinyin }, ...], ... }, ... }
// 每个年级下的数据和以前的 ALL_LESSONS 格式一样。

const HANZI_LIST_URL = 'hanzilist.csv';

function parseHanziCsv(text) {
    const grades = {};
    const lines = text.replace(/^﻿/, '').split(/\r?\n/);
    let header = true;
    for (const raw of lines) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const cols = line.split(',').map(c => c.trim().replace(/^"(.*)"$/, '$1').trim());
        if (header) { header = false; if (cols[0] === '年级') continue; }
        const [grade, lesson, char, pinyin] = cols;
        if (!grade || !lesson || !char || !pinyin) continue;
        if (!grades[grade]) grades[grade] = {};
        if (!grades[grade][lesson]) grades[grade][lesson] = [];
        grades[grade][lesson].push({ char, pinyin });
    }
    return grades;
}

async function loadHanziList(url = HANZI_LIST_URL) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`读取 ${url} 失败（${res.status}）`);
    return parseHanziCsv(await res.text());
}

// 某个年级全部的字
function gradeWords(grades, grade) {
    let list = [];
    for (const lesson in (grades[grade] || {})) list = list.concat(grades[grade][lesson]);
    return list;
}

// 所有年级全部的字
function allWords(grades) {
    let list = [];
    for (const grade in grades) list = list.concat(gradeWords(grades, grade));
    return list;
}

// 页面直接用 file:// 打开时浏览器不允许读取 csv，给出提示
function hanziListErrorMessage(err) {
    if (location.protocol === 'file:') {
        return '无法读取字库 hanzilist.csv：直接双击打开网页时浏览器不允许读取文件。' +
            '请用网址（GitHub Pages）打开，或在文件夹里运行 python3 -m http.server 后访问 http://localhost:8000';
    }
    return '无法读取字库 hanzilist.csv：' + (err && err.message ? err.message : err);
}
