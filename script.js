// --- BASE DE DATOS DE MAZOS (CON SPRITES) ---
const metaDecks = [
    { id: 'draga', name: 'Dragapult ex', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/887.png' },
    { id: 'garde', name: 'Gardevoir ex (Mirror)', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png' },
    { id: 'grimmsnarl', name: "Marnie's Grimmsnarl ex", img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/861.png' },
    { id: 'zoroark', name: "N's Zoroark ex", img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/571.png' },
    { id: 'gholdengo', name: 'Gholdengo ex', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1000.png' },
    { id: 'froslass', name: 'Froslass Munkidori', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/478.png' },
    { id: 'absol', name: 'Mega Absol Box', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/359.png' },
    { id: 'crustle', name: 'Crustle / Rock Inn', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/558.png' },
    { id: 'zard', name: 'Charizard ex', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png' },
    { id: 'ragingbolt', name: 'Raging Bolt ex', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1021.png' },
    { id: 'joltik', name: 'Joltik Box', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/595.png' },
    { id: 'other', name: 'Otro / Rogue', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png' }
];

// --- RUTAS DE TUS IMÁGENES EN GITHUB (RAW) ---
const URL_CARA = 'https://raw.githubusercontent.com/TrueZamba/PokemonTCGTracker/main/TCGP_Coin_Gardevoir.png';
const URL_CRUZ = 'https://raw.githubusercontent.com/TrueZamba/PokemonTCGTracker/main/TCGP_Coin_Pok%C3%A9_Ball.png';

let matches = JSON.parse(localStorage.getItem('gardeMatchesPro')) || [];
let currentTurn = 1; // 1 = Fui 1º, 2 = Fui 2º

function init() {
    const oppDeckSelect = document.getElementById('opp-deck');
    metaDecks.forEach(deck => {
        oppDeckSelect.add(new Option(deck.name, deck.id));
    });
    updateUI();
}

// --- SISTEMA DE TURNOS ---
function setTurn(turn) {
    currentTurn = turn;
    const btn1 = document.getElementById('btn-turn-1');
    const btn2 = document.getElementById('btn-turn-2');
    
    if(turn === 1) {
        btn1.className = "py-2 rounded-xl border-2 border-fuchsia-500 bg-fuchsia-500 text-white font-bold transition-colors";
        btn2.className = "py-2 rounded-xl border-2 border-fuchsia-200 bg-white text-fuchsia-500 font-bold transition-colors";
    } else {
        btn2.className = "py-2 rounded-xl border-2 border-fuchsia-500 bg-fuchsia-500 text-white font-bold transition-colors";
        btn1.className = "py-2 rounded-xl border-2 border-fuchsia-200 bg-white text-fuchsia-500 font-bold transition-colors";
    }
}

// --- GESTIÓN DE PARTIDAS ---
function addMatch(result) {
    const oppDeck = document.getElementById('opp-deck').value;
    const notes = document.getElementById('match-notes').value;
    const id = Date.now();
    
    matches.push({ id, oppDeck, result, turn: currentTurn, notes, date: id });
    localStorage.setItem('gardeMatchesPro', JSON.stringify(matches));
    
    document.getElementById('match-notes').value = ""; 
    updateUI();
}

function deleteMatch(id) {
    if(confirm('¿Borrar esta partida del historial?')) {
        matches = matches.filter(m => m.id !== id);
        localStorage.setItem('gardeMatchesPro', JSON.stringify(matches));
        updateUI();
    }
}

function clearHistory() {
    if(confirm('🚨 ¿Borrar TODAS las partidas? No se puede deshacer.')) {
        matches = [];
        localStorage.removeItem('gardeMatchesPro');
        updateUI();
    }
}

// --- ACTUALIZACIÓN DE INTERFAZ ---
function updateUI() {
    const totalMatches = matches.length;
    const totalWins = matches.filter(m => m.result === 'W').length;
    
    const globalWinrate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;
    document.getElementById('global-winrate').innerText = globalWinrate + '%';
    document.getElementById('total-matches-text').innerText = `${totalMatches} partidas registradas`;

    const matchesFirst = matches.filter(m => m.turn === 1);
    const matchesSecond = matches.filter(m => m.turn === 2);
    
    const wrFirst = matchesFirst.length > 0 ? ((matchesFirst.filter(m => m.result === 'W').length / matchesFirst.length) * 100).toFixed(1) : 0;
    const wrSecond = matchesSecond.length > 0 ? ((matchesSecond.filter(m => m.result === 'W').length / matchesSecond.length) * 100).toFixed(1) : 0;

    document.getElementById('winrate-first').innerText = wrFirst + '%';
    document.getElementById('matches-first').innerText = `${matchesFirst.length} partidas`;
    document.getElementById('winrate-second').innerText = wrSecond + '%';
    document.getElementById('matches-second').innerText = `${matchesSecond.length} partidas`;

    const historyContainer = document.getElementById('recent-history');
    historyContainer.innerHTML = '';
    
    if (matches.length === 0) {
        historyContainer.innerHTML = '<p class="text-sm text-gray-400 italic text-center py-4">No hay partidas recientes.</p>';
    } else {
        const recentMatches = [...matches].reverse().slice(0, 15);
        recentMatches.forEach(m => {
            const deckInfo = metaDecks.find(d => d.id === m.oppDeck) || { name: 'Desconocido' };
            let resultColor = m.result === 'W' ? 'bg-green-100 text-green-700 border-green-300' : (m.result === 'L' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-gray-100 text-gray-700 border-gray-300');
            let turnText = m.turn === 1 ? '1º' : '2º';
            
            historyContainer.innerHTML += `
                <div class="flex items-start gap-3 bg-white p-3 rounded-xl border border-fuchsia-100 shadow-sm relative group">
                    <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center font-black rounded-lg border ${resultColor}">
                        ${m.result}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-bold text-gray-800 truncate">vs ${deckInfo.name}</p>
                        <p class="text-xs text-fuchsia-600 font-bold mb-1">Fui ${turnText}</p>
                        ${m.notes ? `<p class="text-xs text-gray-500 italic truncate" title="${m.notes}">📝 ${m.notes}</p>` : ''}
                    </div>
                    <button onclick="deleteMatch(${m.id})" class="text-red-300 hover:text-red-600 p-2 transition-colors" title="Borrar partida">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            `;
        });
    }

    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = '';

    metaDecks.forEach(deck => {
        const deckMatches = matches.filter(m => m.oppDeck === deck.id);
        if (deckMatches.length === 0) return;

        const w = deckMatches.filter(m => m.result === 'W').length;
        const l = deckMatches.filter(m => m.result === 'L').length;
        const t = deckMatches.filter(m => m.result === 'T').length;
        const wr = ((w / deckMatches.length) * 100).toFixed(1);

        let wrColor = 'text-gray-500';
        let borderColor = 'border-gray-200';
        if(wr >= 55) { wrColor = 'text-green-500'; borderColor = 'border-green-400'; }
        else if (wr < 45) { wrColor = 'text-red-500'; borderColor = 'border-red-400'; }
        else { wrColor = 'text-yellow-500'; borderColor = 'border-yellow-400'; }

        const card = document.createElement('div');
        card.className = `deck-card glass-panel rounded-2xl shadow-md p-4 flex items-center gap-4 border-l-8 ${borderColor} relative overflow-hidden`;
        
        card.innerHTML = `
            <div class="absolute -right-6 -bottom-6 opacity-10 w-32 h-32 bg-contain bg-no-repeat z-0" style="background-image: url('${deck.img}')"></div>
            <img src="${deck.img}" alt="${deck.name}" class="w-16 h-16 object-contain bg-gradient-to-b from-white to-gray-100 rounded-xl shadow-inner border border-gray-100 z-10 relative">
            <div class="flex-1 z-10 relative">
                <h4 class="font-black text-lg text-fuchsia-950 leading-tight">${deck.name}</h4>
                <div class="flex gap-2 text-sm mt-2 bg-white/70 w-fit px-2 py-1 rounded-lg">
                    <span class="text-green-600 font-bold">${w}W</span>
                    <span class="text-red-600 font-bold">${l}L</span>
                    <span class="text-gray-500 font-bold">${t}T</span>
                </div>
            </div>
            <div class="text-right z-10 relative">
                <span class="block text-2xl font-black ${wrColor}">${wr}%</span>
            </div>
        `;
        statsGrid.appendChild(card);
    });
}

// --- VENTANA MODAL (ANIMACIÓN REAL DE MONEDA Y DADO) ---
function showModal(contentHTML) {
    const modal = document.getElementById('visual-modal');
    const content = document.getElementById('modal-content');
    content.innerHTML = contentHTML;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('visual-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function flipCoin() {
    const isCara = Math.random() < 0.5;
    const imgSrc = isCara ? URL_CARA : URL_CRUZ;
    const textResult = isCara ? "¡CARA!" : "¡CRUZ!";
    const textSub = isCara ? "(Gardevoir)" : "(Poké Ball)";

    showModal(`
        <h3 class="text-xl font-bold text-gray-500 mb-6 uppercase tracking-widest">Lanzando Moneda...</h3>
        
        <div class="relative w-48 h-48 mx-auto mb-6 perspective-1000">
            <img src="${imgSrc}" class="w-full h-full object-contain animate-coin drop-shadow-2xl">
        </div>
        
        <div class="animate-result flex flex-col items-center w-full">
            <h2 class="text-5xl font-black text-fuchsia-600">${textResult}</h2>
            <p class="text-fuchsia-400 font-bold mt-2 text-lg">${textSub}</p>
            <button onclick="closeModal()" class="mt-6 px-8 py-3 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 font-black rounded-xl transition-colors w-full border-2 border-fuchsia-300">Vale</button>
        </div>
    `);
}

function rollDice() {
    const result = Math.floor(Math.random() * 6) + 1;
    showModal(`
        <h3 class="text-xl font-bold text-gray-500 mb-6 uppercase tracking-widest">Tirando Dado...</h3>
        
        <div class="w-32 h-32 mx-auto bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-3xl flex items-center justify-center animate-dice shadow-2xl border-4 border-fuchsia-300 mb-6">
            <span class="text-7xl font-black text-white drop-shadow-md">${result}</span>
        </div>
        
        <div class="animate-result flex flex-col items-center w-full">
            <h2 class="text-4xl font-black text-fuchsia-900">¡Salió un ${result}!</h2>
            <button onclick="closeModal()" class="mt-6 px-8 py-3 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 font-black rounded-xl transition-colors w-full border-2 border-fuchsia-300">Vale</button>
        </div>
    `);
}

// --- TEMPORIZADOR ---
let timerSeconds = 50 * 60;
let timerInterval = null;

function updateTimerDisplay() {
    const m = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const s = (timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer-display').innerText = `${m}:${s}`;
}

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            pauseTimer();
            alert("¡TIEMPO CUMPLIDO! Inicia el Turno 0.");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 50 * 60;
    updateTimerDisplay();
}

// Inicializar al cargar
window.onload = init;
