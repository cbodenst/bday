function nextStep(stepIndex) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(el => el.classList.remove('active'));
    
    document.getElementById(`step-${stepIndex}`).classList.add('active');
}

function wrongAnswer(btn) {
    if (btn.classList.contains('error')) return;

    const originalText = btn.innerText;
    btn.innerText = 'Leider falsch! ❌';
    btn.classList.add('error');
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove('error');
    }, 1500);
}

// --- Zahlenschloss Logik ---
let lockCode = [0, 0, 0];

function rollDigit(idx) {
    lockCode[idx - 1] = (lockCode[idx - 1] + 1) % 10;
    document.getElementById(`digit-${idx}`).innerText = lockCode[idx - 1];
}

function checkLock(btn) {
    if (lockCode.join('') === '873') {
        nextStep(3);
    } else {
        wrongAnswer(btn);
    }
}

// --- Schiebepuzzle Logik ---
const targetState = [
    { id: 0, letter: 'M' },
    { id: 1, letter: 'A' },
    { id: 2, letter: 'I' },
    { id: 3, letter: 'T' },
    { id: 4, letter: 'H' },
    { id: 5, letter: 'I' },
    { id: 6, letter: 'N' },
    { id: 7, letter: 'K' },
    { id: 8, letter: '' }
];
let currentState = [...targetState];

function initPuzzle() {
    // Mische das Puzzle durch 150 gültige Züge, damit es garantiert lösbar bleibt
    let emptyIdx = 8;
    for (let i = 0; i < 150; i++) {
        const validMoves = [];
        if (emptyIdx % 3 !== 0) validMoves.push(emptyIdx - 1); // links
        if (emptyIdx % 3 !== 2) validMoves.push(emptyIdx + 1); // rechts
        if (emptyIdx >= 3) validMoves.push(emptyIdx - 3); // oben
        if (emptyIdx <= 5) validMoves.push(emptyIdx + 3); // unten
        
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        // Tauschen
        [currentState[emptyIdx], currentState[randomMove]] = [currentState[randomMove], currentState[emptyIdx]];
        emptyIdx = randomMove;
    }
    renderPuzzle();
}

function renderPuzzle() {
    const board = document.getElementById('puzzle-board');
    if (!board) return;
    
    board.innerHTML = '';
    currentState.forEach((item, index) => {
        const tile = document.createElement('div');
        tile.className = item.letter === '' ? 'tile empty' : 'tile';
        
        if (item.letter !== '') {
            tile.innerHTML = `<span class="letter-shadow">${item.letter}</span>`;
            tile.onclick = () => moveTile(index);
            
            // Hintergrundbild-Position berechnen
            // Ein Tile ist ca. 96px breit/hoch + 6px Abstand = 102px Schrittweite
            const row = Math.floor(item.id / 3);
            const col = item.id % 3;
            tile.style.backgroundPosition = `-${col * 102}px -${row * 102}px`;
        }
        board.appendChild(tile);
    });
}

function moveTile(index) {
    const emptyIdx = currentState.findIndex(item => item.id === 8);
    const isAdjacent = 
        (index === emptyIdx - 1 && emptyIdx % 3 !== 0) || // links davon
        (index === emptyIdx + 1 && index % 3 !== 0) || // rechts davon
        (index === emptyIdx - 3) || // oben drüber
        (index === emptyIdx + 3);   // unten drunter

    if (isAdjacent) {
        // Tauschen
        [currentState[emptyIdx], currentState[index]] = [currentState[index], currentState[emptyIdx]];
        renderPuzzle();
        checkPuzzleWin();
    }
}

function checkPuzzleWin() {
    const isWin = currentState.every((item, index) => item.id === targetState[index].id);
    if (isWin) {
        setTimeout(() => {
            nextStep(4);
        }, 500);
    }
}

// Puzzle beim Laden der Seite initialisieren
document.addEventListener('DOMContentLoaded', initPuzzle);
