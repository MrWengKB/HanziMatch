// ===== 字表来源：年级 + 课次选择（数据来自 hanzilist.csv） =====
const ALL_KEY = 'ALL';          // 整个年级
const CUSTOM_KEY = 'CUSTOM';    // 自定义字表
const STORAGE_KEY = 'hanzimatch.selection';

let GRADES = {};                // { 年级: { 课次: [{ char, pinyin }] } }

const gradeSelect = document.getElementById('gradeSelect');
const lessonSelect = document.getElementById('lessonSelect');
const wordCountInput = document.getElementById('wordCount');   // 每局字数
const flipModeInput = document.getElementById('flipMode');     // 翻翻乐模式

function loadSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { return {}; }
}

function saveSelection() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ grade: gradeSelect.value, lesson: lessonSelect.value, count: wordCountInput.value, flip: flipModeInput.checked }));
    } catch (e) { /* 忽略 */ }
}

function addOption(select, value, text) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    select.appendChild(opt);
}

function hasOption(select, value) {
    return [...select.options].some(o => o.value === value);
}

async function initSelectors() {
    try {
        GRADES = await loadHanziList();
    } catch (err) {
        GRADES = {};
        document.getElementById('lessonInfo').textContent = hanziListErrorMessage(err);
    }

    for (const grade in GRADES) addOption(gradeSelect, grade, grade);
    if (gradeSelect.options.length === 0) addOption(gradeSelect, '', '（无字库）');

    const saved = loadSaved();
    if (saved.count && hasOption(wordCountInput, saved.count)) wordCountInput.value = saved.count;
    flipModeInput.checked = !!saved.flip;
    if (saved.grade && hasOption(gradeSelect, saved.grade)) gradeSelect.value = saved.grade;
    fillLessonOptions();
    if (saved.lesson && hasOption(lessonSelect, saved.lesson)) lessonSelect.value = saved.lesson;
    else if (gradeSelect.value === '') lessonSelect.value = CUSTOM_KEY;

    updateLessonInfo();
}

function fillLessonOptions() {
    const grade = gradeSelect.value;
    lessonSelect.innerHTML = '';
    if (GRADES[grade]) {
        addOption(lessonSelect, ALL_KEY, `整个${grade}`);
        for (const lesson in GRADES[grade]) addOption(lessonSelect, lesson, lesson);
    }
    addOption(lessonSelect, CUSTOM_KEY, '自定义字表');
}

function onGradeChange() {
    fillLessonOptions();
    updateLessonInfo();
}

function lessonLabel() {
    const key = lessonSelect.value;
    if (key === CUSTOM_KEY) return '自定义字表';
    if (key === ALL_KEY) return `整个${gradeSelect.value}`;
    return `${gradeSelect.value} · ${key}`;
}

function updateLessonInfo() {
    const grade = gradeSelect.value;
    const key = lessonSelect.value;
    const info = document.getElementById('lessonInfo');
    const preview = document.getElementById('lessonPreview');
    const customArea = document.getElementById('customArea');

    saveSelection();

    // 自定义字表用全部输入的字，不显示字数
    document.getElementById('countPicker').classList.toggle('hidden', key === CUSTOM_KEY);

    if (key === CUSTOM_KEY) {
        customArea.classList.remove('hidden');
        preview.classList.add('hidden');
        if (GRADES[grade]) info.textContent = '';
        return;
    }

    customArea.classList.add('hidden');

    if (key === ALL_KEY) {
        const n = Object.keys(GRADES[grade]).length;
        const total = gradeWords(GRADES, grade).length;
        info.textContent = `共 ${n} 课 ${total} 字，${roundText(gradeWords(GRADES, grade))}`;
        preview.classList.add('hidden');
    } else {
        const entries = GRADES[grade][key] || [];
        info.textContent = `共 ${entries.length} 字，${roundText(entries)}`;
        preview.textContent = entries.map(e => e.char).join(' ');
        preview.classList.remove('hidden');
    }
}

function roundSize() {
    return parseInt(wordCountInput.value, 10) || 20;
}

function roundText(entries) {
    const n = roundSize();
    if (entries.length >= n) return `每局随机抽取 ${n} 字`;
    const extra = toWords(entries, n).reduce((sum, w) => sum + w.pinyins.length - 1, 0);
    return extra > 0
        ? `每局全部使用，字数不够，用 ${extra} 个多音字的第二个读音补充`
        : '每局全部使用';
}

// 字库格式 { char, pinyin } → 游戏内部格式 { character, pinyins }
// 多音字优先只用拼音1（课文中的读音）。
// 只有字数不够“每局字数”时，才用多音字的拼音2 补充配对。
// （自定义字表仍然可以一个字写多个读音）
function toWords(entries, targetPairs) {
    const words = entries.map(e => ({
        character: e.char,
        pinyins: [e.pinyin],
        extra: e.pinyins.slice(1)
    }));

    let missing = targetPairs - words.length;
    if (missing > 0) {
        // “同样的字不能重复配同样的拼音”保证了补充后一定能全部配完
        const polyphones = words.filter(w => w.extra.length > 0);
        shuffleArray(polyphones);
        for (const w of polyphones) {
            if (missing <= 0) break;
            w.pinyins.push(w.extra[0]);
            missing--;
        }
    }
    return words.map(({ character, pinyins }) => ({ character, pinyins }));
}

function parseCustomInput() {
    const input = document.getElementById('wordInput').value.trim();
    const result = [];
    for (const line of input.split('\n')) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
            result.push({ character: parts[0], pinyins: parts.slice(1) });
        }
    }
    return result;
}

// 根据当前课次生成本局字表
function buildWords() {
    const grade = gradeSelect.value;
    const key = lessonSelect.value;
    if (key === CUSTOM_KEY) return parseCustomInput();
    const pool = (key === ALL_KEY ? gradeWords(GRADES, grade) : (GRADES[grade] || {})[key] || []).slice();
    // 字数超过“每局字数”时随机抽取；不够时用多音字的拼音2 补充
    shuffleArray(pool);
    return toWords(pool.slice(0, roundSize()), roundSize());
}

// ===== 游戏 =====
let words = [];
let cards = [];
let selectedCards = [];
let matchedPairs = 0;
let usedPairs = new Set();   // 已经配过的“字|拼音”
const PREVIEW_SECONDS = 3;   // 翻翻乐：开始前看卡片的秒数
let flipMode = false;
let previewing = false;
let previewTimer = null;
let totalPairs = 0;
let startTime = null;
let timerInterval = null;

// 音效生成器
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'correct') {
    if (audioContext.state === 'suspended') audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'correct') {
        // 正确音效：愉快的上升音调
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.currentTime + duration);
        oscillator.type = 'sine';
    } else {
        // 错误音效：低沉的音调
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'triangle';
    }

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function startGame() {
    words = buildWords();

    if (words.length === 0) {
        if (lessonSelect.value === CUSTOM_KEY) {
            alert('请输入有效的字表！格式：汉字 拼音1 拼音2 ...');
        } else {
            alert('这个课次没有字！');
        }
        return;
    }

    document.getElementById('gameLesson').textContent = lessonLabel();

    // 显示游戏界面
    document.getElementById('inputScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    document.body.classList.add('playing');

    initGame();
}

function initGame() {
    // 多音字：为每个读音生成一对卡片
    cards = [];
    totalPairs = 0;

    words.forEach((word, wordIndex) => {
        word.pinyins.forEach((pinyin, pinyinIndex) => {
            // 汉字卡片 - 存储该字的所有读音
            cards.push({
                type: 'character',
                value: word.character,
                pinyins: word.pinyins,
                wordIndex: wordIndex,
                pinyinIndex: pinyinIndex
            });
            // 拼音卡片
            cards.push({
                type: 'pinyin',
                value: pinyin,
                pinyin: pinyin,
                wordIndex: wordIndex,
                pinyinIndex: pinyinIndex
            });
            totalPairs++;
        });
    });

    // 随机打散
    shuffleArray(cards);

    // 渲染游戏板
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card ' + (card.type === 'character' ? 'card-char' : 'card-pinyin');
        cardElement.textContent = card.value;
        cardElement.dataset.index = index;
        cardElement.onclick = () => selectCard(index);
        gameBoard.appendChild(cardElement);
    });

    // 重置游戏状态
    selectedCards = [];
    matchedPairs = 0;
    usedPairs = new Set();

    // 本局有多音字时显示提示
    document.getElementById('gameHint').classList.toggle('hidden', !words.some(w => w.pinyins.length > 1));

    fitBoard();

    // 翻翻乐：先给 3 秒看卡片，然后全部翻过去，再开始计时
    clearTimeout(previewTimer);
    flipMode = flipModeInput.checked;
    if (flipMode) {
        previewing = true;
        let left = PREVIEW_SECONDS;
        const timerEl = document.getElementById('timer');
        clearInterval(timerInterval);
        const tick = () => {
            if (left > 0) {
                timerEl.textContent = `记住卡片！${left}`;
                left--;
                previewTimer = setTimeout(tick, 1000);
            } else {
                document.querySelectorAll('.card').forEach(el => setFaceDown(el, true));
                previewing = false;
                startTimer();
            }
        };
        tick();
    } else {
        previewing = false;
        startTimer();
    }
}

// 翻牌（带翻转动画）
function setFaceDown(el, down) {
    el.classList.toggle('face-down', down);
    el.classList.remove('flip');
    void el.offsetWidth;   // 重新触发动画
    el.classList.add('flip');
}

// ===== 根据屏幕大小排列卡片，尽量让所有卡片一屏显示 =====
function fitBoard() {
    const board = document.getElementById('gameBoard');
    const n = cards.length;
    if (!n || board.offsetParent === null) return;

    const W = board.clientWidth;
    const H = board.clientHeight;
    const gap = Math.max(4, Math.min(14, Math.min(W, H) / 50));
    const maxLen = Math.max(...cards.filter(c => c.type === 'pinyin').map(c => c.value.length), 2);

    let best = null;
    for (let cols = 1; cols <= n; cols++) {
        const rows = Math.ceil(n / cols);
        const cellW = (W - gap * (cols - 1)) / cols;
        const cellH = (H - gap * (rows - 1)) / rows;
        if (cellW <= 0 || cellH <= 0) continue;
        const h = Math.min(cellH, cellW * 1.1);       // 卡片不要太瘦长
        const w = Math.min(cellW, h * 2);             // 也不要太扁
        // 拼音字号受卡片宽度（最长拼音）和高度限制
        const font = Math.min(h * 0.45, w * 0.9 / (maxLen * 0.62));
        if (!best || font > best.font + 0.01) best = { cols, w, h, font };
    }
    if (!best) return;

    board.style.gap = gap + 'px';
    board.style.gridTemplateColumns = `repeat(${best.cols}, ${Math.floor(best.w)}px)`;
    board.style.gridAutoRows = Math.floor(best.h) + 'px';
    // 字号设上限，卡片少时不会大得夸张
    board.style.setProperty('--pinyin-font', Math.max(10, Math.floor(Math.min(best.font, 56))) + 'px');
    board.style.setProperty('--char-font', Math.max(12, Math.floor(Math.min(best.font * 1.5, best.h * 0.6, best.w * 0.7, 84))) + 'px');
}

window.addEventListener('resize', fitBoard);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function selectCard(index) {
    const cardElement = document.querySelectorAll('.card')[index];

    // 如果已经选中或已匹配，忽略
    if (cardElement.classList.contains('selected') ||
        cardElement.classList.contains('matched')) {
        return;
    }

    // 如果已经选了两张，或翻翻乐还在预览，忽略
    if (selectedCards.length >= 2 || previewing) {
        return;
    }

    // 翻翻乐：点开翻回正面
    if (flipMode) setFaceDown(cardElement, false);

    cardElement.classList.add('selected');
    selectedCards.push({ index, card: cards[index] });

    if (selectedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = selectedCards;

    // 一张汉字卡 + 一张拼音卡，且汉字的读音中包含该拼音即可配对
    // （同音字可以互相配对）
    // 同样的字不能重复配同样的拼音（多音字的每个读音只能配一次）
    let isMatch = false;
    let pairKey = null;

    const charCard = first.card.type === 'character' ? first.card : second.card;
    const pinyinCard = first.card.type === 'pinyin' ? first.card : second.card;
    if (charCard.type === 'character' && pinyinCard.type === 'pinyin') {
        pairKey = charCard.wordIndex + '|' + pinyinCard.pinyin;
        isMatch = charCard.pinyins.includes(pinyinCard.pinyin) && !usedPairs.has(pairKey);
    }

    if (isMatch) {
        playSound(523.25, 0.2, 'correct'); // C5音
        usedPairs.add(pairKey);

        setTimeout(() => {
            const cardElements = document.querySelectorAll('.card');
            cardElements[first.index].classList.add('matched');
            cardElements[second.index].classList.add('matched');

            cardElements[first.index].classList.remove('selected');
            cardElements[second.index].classList.remove('selected');

            matchedPairs++;
            selectedCards = [];

            if (matchedPairs === totalPairs) {
                setTimeout(gameComplete, 500);
            }
        }, 300);
    } else {
        playSound(196.00, 0.3, 'wrong'); // G3音

        setTimeout(() => {
            const cardElements = document.querySelectorAll('.card');
            cardElements[first.index].classList.remove('selected');
            cardElements[second.index].classList.remove('selected');
            // 翻翻乐：配不上就两张都翻回去
            if (flipMode) {
                setFaceDown(cardElements[first.index], true);
                setFaceDown(cardElements[second.index], true);
            }
            selectedCards = [];
        }, flipMode ? 1000 : 800);
    }
}

function startTimer() {
    clearInterval(timerInterval);
    startTime = Date.now();
    updateTimer();
    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent =
        `时间：${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function gameComplete() {
    clearInterval(timerInterval);
    const finalTime = document.getElementById('timer').textContent.replace('时间：', '');
    document.getElementById('finalTime').textContent = finalTime;
    document.getElementById('successModal').style.display = 'flex';
}

function replayGame() {
    document.getElementById('successModal').style.display = 'none';
    // 每局重新随机抽字（自定义字表除外）
    if (lessonSelect.value !== CUSTOM_KEY) words = buildWords();
    initGame();
}

function backToMenu() {
    clearInterval(timerInterval);
    clearTimeout(previewTimer);
    document.body.classList.remove('playing');
    document.getElementById('successModal').style.display = 'none';
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('inputScreen').classList.remove('hidden');
}


initSelectors();
