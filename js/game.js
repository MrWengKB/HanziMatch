// ===== 字表来源：课次选择 =====
const ALL_KEY = 'ALL';          // 整个一年级
const CUSTOM_KEY = 'CUSTOM';    // 自定义字表
const ALL_ROUND_SIZE = 20;      // 选“整个一年级”时，每局随机抽取的字数
const STORAGE_KEY = 'hanzimatch.lesson';

const lessonSelect = document.getElementById('lessonSelect');

function initLessonOptions() {
    const allOpt = document.createElement('option');
    allOpt.value = ALL_KEY;
    allOpt.textContent = '整个一年级';
    lessonSelect.appendChild(allOpt);

    for (const lesson in ALL_LESSONS) {
        const opt = document.createElement('option');
        opt.value = lesson;
        opt.textContent = lesson;
        lessonSelect.appendChild(opt);
    }

    const customOpt = document.createElement('option');
    customOpt.value = CUSTOM_KEY;
    customOpt.textContent = '自定义字表';
    lessonSelect.appendChild(customOpt);

    // 记住上次选择的课次
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && [...lessonSelect.options].some(o => o.value === saved)) {
            lessonSelect.value = saved;
        }
    } catch (e) { /* 忽略 */ }

    updateLessonInfo();
}

function getAllEntries() {
    let list = [];
    for (const k in ALL_LESSONS) list = list.concat(ALL_LESSONS[k]);
    return list;
}

function lessonLabel(key) {
    if (key === ALL_KEY) return '整个一年级';
    if (key === CUSTOM_KEY) return '自定义字表';
    return key;
}

function updateLessonInfo() {
    const key = lessonSelect.value;
    const info = document.getElementById('lessonInfo');
    const preview = document.getElementById('lessonPreview');
    const customArea = document.getElementById('customArea');

    try { localStorage.setItem(STORAGE_KEY, key); } catch (e) { /* 忽略 */ }

    if (key === CUSTOM_KEY) {
        customArea.classList.remove('hidden');
        info.textContent = '';
        preview.classList.add('hidden');
        return;
    }

    customArea.classList.add('hidden');
    preview.classList.remove('hidden');

    if (key === ALL_KEY) {
        const total = getAllEntries().length;
        const n = Object.keys(ALL_LESSONS).length;
        info.textContent = `共 ${n} 课 ${total} 字，每局随机抽取 ${ALL_ROUND_SIZE} 字`;
        preview.classList.add('hidden');
    } else {
        const entries = ALL_LESSONS[key] || [];
        info.textContent = `共 ${entries.length} 字`;
        preview.textContent = entries.map(e => e.char).join(' ');
    }
}

// HanziBomb 格式 { char, pinyin } → 游戏内部格式 { character, pinyins }
// pinyin 中用空格分隔的多个读音会当作多音字处理
function toWords(entries) {
    return entries.map(e => ({
        character: e.char,
        pinyins: String(e.pinyin).trim().split(/\s+/)
    }));
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
    const key = lessonSelect.value;
    if (key === CUSTOM_KEY) return parseCustomInput();
    if (key === ALL_KEY) {
        const all = getAllEntries().slice();
        shuffleArray(all);
        return toWords(all.slice(0, ALL_ROUND_SIZE));
    }
    return toWords(ALL_LESSONS[key] || []);
}

// ===== 游戏 =====
let words = [];
let cards = [];
let selectedCards = [];
let matchedPairs = 0;
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

    document.getElementById('gameLesson').textContent = lessonLabel(lessonSelect.value);

    // 显示游戏界面
    document.getElementById('inputScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

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
        cardElement.className = 'card';
        cardElement.textContent = card.value;
        cardElement.dataset.index = index;
        cardElement.onclick = () => selectCard(index);
        gameBoard.appendChild(cardElement);
    });

    // 重置游戏状态
    selectedCards = [];
    matchedPairs = 0;

    startTimer();
}

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

    // 如果已经选了两张，忽略
    if (selectedCards.length >= 2) {
        return;
    }

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
    let isMatch = false;

    if (first.card.type === 'character' && second.card.type === 'pinyin') {
        isMatch = first.card.pinyins.includes(second.card.pinyin);
    } else if (first.card.type === 'pinyin' && second.card.type === 'character') {
        isMatch = second.card.pinyins.includes(first.card.pinyin);
    }

    if (isMatch) {
        playSound(523.25, 0.2, 'correct'); // C5音

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
            selectedCards = [];
        }, 800);
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
    // “整个一年级”每局重新随机抽字
    if (lessonSelect.value === ALL_KEY) words = buildWords();
    initGame();
}

function backToMenu() {
    clearInterval(timerInterval);
    document.getElementById('successModal').style.display = 'none';
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('inputScreen').classList.remove('hidden');
}

function closeGame() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('successModal').style.display = 'none';
    document.getElementById('endScreen').classList.remove('hidden');
}

initLessonOptions();
