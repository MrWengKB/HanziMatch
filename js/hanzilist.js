// 字库读取：从 hanzilist.csv 加载年级、课次和汉字
//
// hanzilist.csv 格式（第一行为表头，按表头名称识别各栏，栏的顺序可以调整）：
//   年级,课次,生字,拼音1,拼音2
//   一年级,第一课,二,èr,
//   一年级,第二课,的,de,dì
// 拼音2 为多音字的第二个读音，没有就留空。
// 年级、课次的显示顺序 = 在文件中第一次出现的顺序。
//
// 加载结果 GRADES 的结构：
//   { "一年级": { "第一课": [{ char, pinyin, pinyins }, ...], ... }, ... }
//   pinyin  = 第一个读音（拼音1）
//   pinyins = 所有读音，例如 ["de", "dì"]

const HANZI_LIST_URL = 'hanzilist.csv';

// 表头名称（可接受的写法）
const HANZI_COLUMNS = {
    grade: ['年级'],
    lesson: ['课次'],
    char: ['生字', '汉字'],
    pinyin1: ['拼音1', '拼音'],
    pinyin2: ['拼音2']
};

// 解析一行 csv（支持双引号包起来的字段）
function splitCsvLine(line) {
    const cols = [];
    let cur = '', quoted = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (quoted) {
            if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
            else if (ch === '"') quoted = false;
            else cur += ch;
        } else if (ch === '"') quoted = true;
        else if (ch === ',') { cols.push(cur.trim()); cur = ''; }
        else cur += ch;
    }
    cols.push(cur.trim());
    return cols;
}

function parseHanziCsv(text) {
    const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) return {};

    const header = splitCsvLine(lines[0]);
    const idx = {};
    for (const key in HANZI_COLUMNS) {
        idx[key] = header.findIndex(h => HANZI_COLUMNS[key].includes(h));
    }
    for (const key of ['grade', 'lesson', 'char', 'pinyin1']) {
        if (idx[key] < 0) throw new Error(`hanzilist.csv 缺少“${HANZI_COLUMNS[key][0]}”栏`);
    }

    const grades = {};
    for (const line of lines.slice(1)) {
        const cols = splitCsvLine(line);
        const get = key => (idx[key] >= 0 ? cols[idx[key]] || '' : '');
        const grade = get('grade'), lesson = get('lesson'), char = get('char');
        const pinyins = [get('pinyin1'), get('pinyin2')].filter(Boolean);
        if (!grade || !lesson || !char || pinyins.length === 0) continue;
        if (!grades[grade]) grades[grade] = {};
        if (!grades[grade][lesson]) grades[grade][lesson] = [];
        grades[grade][lesson].push({ char, pinyin: pinyins[0], pinyins });
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
