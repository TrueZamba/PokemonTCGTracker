// ==========================================
// CONFIGURACIÓN (SPRITES Y MONEDAS)
// ==========================================
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

const URL_CARA = 'https://raw.githubusercontent.com/TrueZamba/PokemonTCGTracker/main/TCGP_Coin_Gardevoir.png';
const URL_CRUZ = 'https://raw.githubusercontent.com/TrueZamba/PokemonTCGTracker/main/TCGP_Coin_Pok%C3%A9_Ball.png';

let matches = JSON.parse(localStorage.getItem('gardeMatchesPro')) || [];
let currentTurn = 1; 

function init() {
    const oppDeckSelect = document.getElementById('opp-deck');
    metaDecks.forEach(deck => { oppDeckSelect.add(new Option(deck.name, deck.id)); });
    updateUI();
}

// ==========================================
// NAVEGACIÓN Y TRACKER
// ==========================================
function switchTab(tabId) {
    document.getElementById('tab-tracker').classList.add('hidden');
    document.getElementById('tab-tournament').classList.add('hidden');
    document.getElementById('nav-tracker').classList.remove('tab-active');
    document.getElementById('nav-tournament').classList.remove('tab-active');
    document.getElementById('tab-' + tabId).classList.remove('hidden');
    document.getElementById('nav-' + tabId).classList.add('tab-active');
}

function setTurn(turn) {
    currentTurn = turn;
    const btn1 = document.getElementById('btn-turn-1'), btn2 = document.getElementById('btn-turn-2');
    if(turn === 1) {
        btn1.className = "py-2 rounded-xl border-2 border-fuchsia-500 bg-fuchsia-500 text-white font-bold transition-colors";
        btn2.className = "py-2 rounded-xl border-2 border-fuchsia-200 bg-white text-fuchsia-500 font-bold transition-colors";
    } else {
        btn2.className = "py-2 rounded-xl border-2 border-fuchsia-500 bg-fuchsia-500 text-white font-bold transition-colors";
        btn1.className = "py-2 rounded-xl border-2 border-fuchsia-200 bg-white text-fuchsia-500 font-bold transition-colors";
    }
}

function addMatch(result) {
    const oppDeck = document.getElementById('opp-deck').value;
    const notes = document.getElementById('match-notes').value;
    matches.push({ id: Date.now(), oppDeck, result, turn: currentTurn, notes });
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
        matches = []; localStorage.removeItem('gardeMatchesPro'); updateUI();
    }
}

function updateUI() {
    const totalWins = matches.filter(m => m.result === 'W').length;
    document.getElementById('global-winrate').innerText = matches.length > 0 ? ((totalWins / matches.length) * 100).toFixed(1) + '%' : '0%';
    document.getElementById('total-matches-text').innerText = `${matches.length} partidas registradas`;

    const mFirst = matches.filter(m => m.turn === 1), mSec = matches.filter(m => m.turn === 2);
    document.getElementById('winrate-first').innerText = mFirst.length > 0 ? ((mFirst.filter(m => m.result === 'W').length / mFirst.length) * 100).toFixed(1) + '%' : '0%';
    document.getElementById('matches-first').innerText = `${mFirst.length} partidas`;
    document.getElementById('winrate-second').innerText = mSec.length > 0 ? ((mSec.filter(m => m.result === 'W').length / mSec.length) * 100).toFixed(1) + '%' : '0%';
    document.getElementById('matches-second').innerText = `${mSec.length} partidas`;

    // --- REPARACIÓN: LOGS DE DUELOS ---
    const hist = document.getElementById('recent-history'); 
    hist.innerHTML = '';
    if (matches.length === 0) {
        hist.innerHTML = '<p class="text-sm text-gray-400 italic text-center py-4">No hay partidas recientes.</p>';
    } else {
        [...matches].reverse().forEach(m => {
            const dInfo = metaDecks.find(d => d.id === m.oppDeck) || { name: 'Desconocido' };
            let c = m.result === 'W' ? 'bg-green-100 text-green-700 border-green-300' : (m.result === 'L' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-gray-100 text-gray-700 border-gray-300');
            hist.innerHTML += `
                <div class="flex items-center gap-3 bg-white p-3 rounded-xl border border-fuchsia-100 shadow-sm relative group mb-2">
                    <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center font-black rounded-lg border-2 ${c}">${m.result}</div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-bold text-gray-800 truncate">vs ${dInfo.name}</p>
                        <p class="text-xs text-fuchsia-600 font-bold mb-1">Fui ${m.turn === 1 ? '1º' : '2º'}</p>
                        ${m.notes ? `<p class="text-xs text-gray-500 italic truncate" title="${m.notes}">📝 ${m.notes}</p>` : ''}
                    </div>
                    <button onclick="deleteMatch(${m.id})" class="text-red-300 hover:text-red-600 p-2 transition-colors">❌</button>
                </div>`;
        });
    }

    const grid = document.getElementById('stats-grid'); grid.innerHTML = '';
    metaDecks.forEach(deck => {
        const dm = matches.filter(m => m.oppDeck === deck.id);
        if (dm.length === 0) return;
        const w = dm.filter(m => m.result === 'W').length, l = dm.filter(m => m.result === 'L').length, t = dm.filter(m => m.result === 'T').length;
        const wr = ((w / dm.length) * 100).toFixed(1);
        let col = wr >= 55 ? 'text-green-500' : (wr < 45 ? 'text-red-500' : 'text-yellow-500');
        let bCol = wr >= 55 ? 'border-green-400' : (wr < 45 ? 'border-red-400' : 'border-yellow-400');
        
        grid.innerHTML += `
            <div class="deck-card glass-panel rounded-2xl shadow-md p-4 flex items-center gap-4 border-l-8 ${bCol} relative overflow-hidden">
                <img src="${deck.img}" class="w-16 h-16 object-contain bg-gradient-to-b from-white to-gray-100 rounded-xl shadow-inner border border-gray-100 z-10 relative" style="image-rendering: pixelated;">
                <div class="flex-1 z-10 relative">
                    <h4 class="font-black text-lg text-fuchsia-950 leading-tight">${deck.name}</h4>
                    <div class="flex gap-2 text-sm mt-2 bg-white/70 w-fit px-2 py-1 rounded-lg">
                        <span class="text-green-600 font-bold">${w}W</span><span class="text-red-600 font-bold">${l}L</span><span class="text-gray-500 font-bold">${t}T</span>
                    </div>
                </div>
                <div class="text-right z-10 relative">
                    <span class="block text-2xl font-black ${wrColor}">${wr}%</span>
                </div>
            </div>`;
    });
}

// ==========================================
// MODAL: DADO Y MONEDA 3D
// ==========================================
function showModal(contentHTML) {
    const modal = document.getElementById('visual-modal');
    document.getElementById('modal-content').innerHTML = contentHTML;
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
    const textResult = isCara ? "¡CARA!" : "¡CRUZ!";
    const textSub = isCara ? "(Gardevoir)" : "(Poké Ball)";
    const animClass = isCara ? 'animate-coin-heads' : 'animate-coin-tails';

    // 0 grados siempre es Gardevoir. 180 grados siempre es Pokéball.
    // La animación de CSS está arreglada para terminar en la cara correcta.
    showModal(`
        <h3 class="text-xl font-bold text-gray-500 mb-6 uppercase tracking-widest">Lanzando Moneda...</h3>
        
        <div class="relative w-48 h-48 mx-auto mb-6 perspective-1000">
            <div class="w-full h-full relative preserve-3d ${animClass}">
                <div class="absolute top-0 left-0 w-full h-full backface-hidden">
                    <img src="${URL_CARA}" class="w-full h-full object-contain drop-shadow-lg">
                </div>
                <div class="absolute top-0 left-0 w-full h-full backface-hidden" style="transform: rotateY(180deg);">
                    <img src="${URL_CRUZ}" class="w-full h-full object-contain drop-shadow-lg">
                </div>
            </div>
        </div>
        
        <div class="animate-result flex flex-col items-center w-full" style="animation-delay: 2s;">
            <h2 class="text-5xl font-black text-fuchsia-600">${textResult}</h2>
            <p class="text-fuchsia-400 font-bold mt-2 text-lg">${textSub}</p>
            <button onclick="closeModal()" class="mt-6 px-8 py-3 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 font-black rounded-xl transition-colors w-full border-2 border-fuchsia-300">Vale</button>
        </div>
    `);
}

function rollDice() {
    const finalResult = Math.floor(Math.random() * 6) + 1;
    
    showModal(`
        <h3 class="text-xl font-bold text-gray-500 mb-6 uppercase tracking-widest">Tirando Dado...</h3>
        <div class="w-32 h-32 mx-auto bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-3xl flex items-center justify-center animate-dice shadow-2xl border-4 border-fuchsia-300 mb-6">
            <span id="dice-number" class="text-7xl font-black text-white drop-shadow-md">?</span>
        </div>
        <div class="animate-result flex flex-col items-center w-full" style="animation-delay: 1.5s;">
            <h2 class="text-4xl font-black text-fuchsia-900" id="final-dice-text">¡Salió un ${finalResult}!</h2>
            <button onclick="closeModal()" class="mt-6 px-8 py-3 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 font-black rounded-xl transition-colors w-full border-2 border-fuchsia-300">Vale</button>
        </div>
    `);

    setTimeout(() => {
        const diceEl = document.getElementById('dice-number');
        if(!diceEl) return;
        let rolls = 0;
        const rollInterval = setInterval(() => {
            diceEl.innerText = Math.floor(Math.random() * 6) + 1; 
            rolls++;
            if (rolls >= 15) { clearInterval(rollInterval); diceEl.innerText = finalResult; }
        }, 80); 
    }, 50);
}

// ==========================================
// TEMPORIZADOR
// ==========================================
let timerSeconds = 50 * 60, timerInterval = null;
function updateTimerDisplay() {
    document.getElementById('timer-display').innerText = `${Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:${(timerSeconds % 60).toString().padStart(2, '0')}`;
}
function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) { timerSeconds--; updateTimerDisplay(); } 
        else { pauseTimer(); alert("¡TIEMPO CUMPLIDO! Inicia el Turno 0."); }
    }, 1000);
}
function pauseTimer() { clearInterval(timerInterval); timerInterval = null; }
function resetTimer() { pauseTimer(); timerSeconds = 50 * 60; updateTimerDisplay(); }

// ==========================================
// LÓGICA DEL TORNEO SUIZO
// ==========================================
let tPlayers = [], tRound = 1, tMaxRounds = 3, tPairings = [];

function startTournament() {
    const input = document.getElementById('player-names').value;
    const names = input.split(',').map(n => n.trim()).filter(n => n !== '');
    if(names.length < 3) return alert("¡Necesitas al menos 3 jugadores!");

    tPlayers = names.map((name, i) => ({ id: i, name: name, points: 0, playedAgainst: [] }));
    tMaxRounds = tPlayers.length <= 4 ? 2 : (tPlayers.length <= 8 ? 3 : (tPlayers.length <= 16 ? 4 : 5));
    tRound = 1;
    
    document.getElementById('tourney-setup').classList.add('hidden');
    document.getElementById('tourney-active').classList.remove('hidden');
    document.getElementById('tourney-active').classList.add('grid');
    document.getElementById('btn-next-round').style.display = 'block';

    generatePairings(); renderTournament();
}

function endTournament() {
    if(confirm("¿Seguro que quieres cancelar este torneo?")) {
        document.getElementById('tourney-setup').classList.remove('hidden');
        document.getElementById('tourney-active').classList.add('hidden');
        document.getElementById('tourney-active').classList.remove('grid');
        tPlayers = [];
    }
}

function generatePairings() {
    let sorted = [...tPlayers].sort(() => Math.random() - 0.5).sort((a, b) => b.points - a.points);
    tPairings = []; let pairedIds = new Set();
    
    for (let i = 0; i < sorted.length; i++) {
        let p1 = sorted[i]; if (pairedIds.has(p1.id)) continue;
        let p2 = null;
        for (let j = i + 1; j < sorted.length; j++) if (!pairedIds.has(sorted[j].id) && !p1.playedAgainst.includes(sorted[j].id)) { p2 = sorted[j]; break; }
        if (!p2) for (let j = i + 1; j < sorted.length; j++) if (!pairedIds.has(sorted[j].id)) { p2 = sorted[j]; break; }

        if (p2) { tPairings.push({ p1: p1, p2: p2 }); pairedIds.add(p1.id); pairedIds.add(p2.id); } 
        else { tPairings.push({ p1: p1, p2: null }); pairedIds.add(p1.id); }
    }
}

function renderTournament() {
    document.getElementById('round-title').innerText = `Ronda ${tRound}`;
    document.getElementById('round-progress').innerText = `Ronda ${tRound} de ${tMaxRounds}`;
    const pContainer = document.getElementById('pairings-container'); pContainer.innerHTML = '';
    
    tPairings.forEach((table, index) => {
        if(table.p2 === null) {
            pContainer.innerHTML += `<div class="bg-gray-50 border p-4 rounded-xl flex justify-between items-center opacity-70"><span class="font-bold text-gray-500">Mesa ${index + 1}</span><span class="font-black text-gray-800">${table.p1.name}</span><span class="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">BYE (+3 Puntos)</span></div>`;
        } else {
            pContainer.innerHTML += `<div class="bg-white border-2 border-fuchsia-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm"><span class="font-bold text-fuchsia-400 text-sm hidden sm:block">Mesa ${index + 1}</span><div class="flex-1 text-right font-black text-lg text-gray-800">${table.p1.name}</div><select id="result-table-${index}" class="bg-gray-100 border border-gray-300 rounded-lg p-2 font-bold focus:outline-none focus:ring-2 focus:ring-fuchsia-400"><option value="p1">Gana ${table.p1.name}</option><option value="p2">Gana ${table.p2.name}</option><option value="tie">Empate</option></select><div class="flex-1 text-left font-black text-lg text-gray-800">${table.p2.name}</div></div>`;
        }
    });
    
    const sContainer = document.getElementById('standings-container'); sContainer.innerHTML = '';
    [...tPlayers].sort((a, b) => b.points - a.points).forEach((p, i) => {
        let badge = i === 0 ? '👑' : (i < 3 ? '⭐' : '');
        sContainer.innerHTML += `<div class="flex justify-between items-center p-2 border-b border-gray-100"><span class="font-bold text-gray-700">${i + 1}. ${p.name} ${badge}</span><span class="bg-fuchsia-600 text-white font-black w-8 h-8 rounded flex items-center justify-center">${p.points}</span></div>`;
    });
}

function submitRound() {
    tPairings.forEach((table, index) => {
        if(table.p2 === null) tPlayers.find(p => p.id === table.p1.id).points += 3;
        else {
            let select = document.getElementById(`result-table-${index}`).value;
            let p1 = tPlayers.find(p => p.id === table.p1.id), p2 = tPlayers.find(p => p.id === table.p2.id);
            p1.playedAgainst.push(p2.id); p2.playedAgainst.push(p1.id);
            if (select === 'p1') p1.points += 3; else if (select === 'p2') p2.points += 3; else if (select === 'tie') { p1.points += 1; p2.points += 1; }
        }
    });
    
    if (tRound >= tMaxRounds) {
        renderTournament(); 
        document.getElementById('pairings-container').innerHTML = `<div class="bg-green-100 border-2 border-green-500 p-8 rounded-xl text-center"><h2 class="text-4xl font-black text-green-700 mb-2">¡TORNEO FINALIZADO!</h2><p class="text-green-800 font-bold">El ganador es 👑 ${[...tPlayers].sort((a, b) => b.points - a.points)[0].name}</p></div>`;
        document.getElementById('btn-next-round').style.display = 'none';
    } else { tRound++; generatePairings(); renderTournament(); resetTimer(); startTimer(); }
}

window.onload = init;
