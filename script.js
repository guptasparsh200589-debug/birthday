const $ = (id) => document.getElementById(id);

let candlesBlown = false;
let cakeCut = false;
let cakeTimerStarted = false;

// NAVIGATION & BUTTONS
$('forYouButton').addEventListener('click', () => {
    $('homePage').classList.add('hidden');
    $('birthdayPage').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('complimentButton').addEventListener('click', () => {
    const box = $('compliment');
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) {
        $('complimentButton').textContent = 'Hide Secret Confession 💗';
        launchPartyEmojis(['💖', '🫂', '✨', '💌', '🥰']);
    } else {
        $('complimentButton').textContent = 'Tap for a Secret Confession ✨👀';
    }
});

// STEP 1: BLOW CANDLES
$('blowButton').addEventListener('click', () => {
    if (candlesBlown) return;
    candlesBlown = true;

    $('blowButton').classList.add('hidden');
    $('micStatus').textContent = 'Candles are out! Ab cake kaatne ki baari hai 👇';

    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, index) => {
        setTimeout(() => candle.classList.add('out'), index * 220);
    });

    playBirthdaySound();
    launchConfetti(60);

    setTimeout(() => {
        $('cakeInstruction').textContent = 'Tap below to slice your birthday cake! 🔪🍰';
        $('cutButton').classList.remove('hidden');
    }, 850);
});

// STEP 2: CUT THE CAKE
$('cutButton').addEventListener('click', () => {
    if (cakeCut) return;
    cakeCut = true;

    $('knife').classList.add('cutting');
    $('cutButton').disabled = true;
    $('cutButton').textContent = 'Cake Cut Ho Gaya! 🍰🎉';

    setTimeout(() => {
        $('cakeEmoji').classList.add('sliced');
        $('cakeSlice').classList.remove('hidden');
        $('cakeBox').classList.add('party-mode');
        $('micStatus').textContent = 'Yummy! Happy Birthday Sonali! 🥳';

        launchConfetti(110);
        launchFireworks();
        launchPartyEmojis();
        playBirthdaySound();

        $('celebration').classList.remove('hidden');
    }, 500);
});

// OPEN GIFT / PARTY PAGE
$('giftButton').addEventListener('click', () => {
    $('birthdayPage').classList.add('hidden');
    $('giftPage').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    launchConfetti(90);
    launchPartyEmojis(['🍕', '🍔', '🍦', '😂', '🎁', '🎉']);
});

// BACK TO CELEBRATION / CAKE CUTTING PAGE
function goToCakeCuttingPage() {
    $('giftPage').classList.add('hidden');
    $('birthdayPage').classList.remove('hidden');
    $('cakeBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

$('backButton').addEventListener('click', goToCakeCuttingPage);
$('cakeCuttingPageBtn').addEventListener('click', goToCakeCuttingPage);

// SPECIAL SURPRISE POPUP + RUNAWAY "NO" BUTTON + 30 SEC TIMER
const noTeaseLines = [
    "Arre 'No' pe click nahi hoga bitti! 😂",
    "Pakad ke dikhao toh maane! 😜🏃‍♂️",
    "Itna bhaav mat khao, 'Yes' dabao! 💕",
    "No button chutti pe gaya hai aaj! 🤣",
    "Bas 'Yes' hi option hai tumhare paas! 💖"
];
let teaseIndex = 0;

function moveNoButton() {
    const noBtn = $('noSurpriseBtn');
    noBtn.style.position = 'fixed';
    noBtn.style.zIndex = '250';

    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    const randomX = Math.max(15, Math.floor(Math.random() * maxX));
    const randomY = Math.max(15, Math.floor(Math.random() * maxY));

    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    $('noTeaseMsg').textContent = noTeaseLines[teaseIndex % noTeaseLines.length];
    teaseIndex++;
}

$('specialSurpriseBtn').addEventListener('click', () => {
    // Reset modal to question state
    $('modalAsk').classList.remove('hidden');
    $('modalReveal').classList.add('hidden');
    $('noTeaseMsg').textContent = 'Soch samajh kar click karna… 😜';

    const noBtn = $('noSurpriseBtn');
    noBtn.style.position = 'static';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';

    $('surpriseModal').classList.remove('hidden');

    // Start 30-second timer to update "Back to Celebration" & add Cake Cutting Page option
    if (!cakeTimerStarted) {
        cakeTimerStarted = true;
        setTimeout(() => {
            $('backButton').textContent = 'Back to Celebration (Cake Page) 🎂';
            $('cakeCuttingPageBtn').classList.remove('hidden');
        }, 30000); // 30 seconds
    }
});

// Runaway on click or hover/touch
$('noSurpriseBtn').addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});
$('noSurpriseBtn').addEventListener('mouseover', moveNoButton);

// YES CLICK -> LOVE UUUU BITTI + CHIDANA
$('yesSurpriseBtn').addEventListener('click', () => {
    $('noSurpriseBtn').style.position = 'static';
    $('modalAsk').classList.add('hidden');
    $('modalReveal').classList.remove('hidden');

    playBirthdaySound();
    launchConfetti(100);
    launchFireworks();
    launchPartyEmojis(['💖', '🫂', '😘', '🎉', '✨', '😜']);
});

$('closeModalBtn').addEventListener('click', () => {
    $('surpriseModal').classList.add('hidden');
});

// BIRTHDAY SOUND (Web Audio API)
function playBirthdaySound() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContextClass();
        const notes = [523, 659, 784, 1047, 784, 1047, 1318];

        notes.forEach((freq, idx) => {
            const osc = context.createOscillator();
            const gain = context.createGain();
            const start = context.currentTime + idx * 0.13;

            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.001, start);
            gain.gain.exponentialRampToValueAtTime(0.1, start + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

            osc.connect(gain);
            gain.connect(context.destination);
            osc.start(start);
            osc.stop(start + 0.24);
        });
        setTimeout(() => context.close(), 2500);
    } catch (e) {}
}

// CONFETTI
function launchConfetti(count = 90) {
    const colors = ['#ff85b3', '#ffb547', '#65cfff', '#a9dfcf', '#d4a5ff'];
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('span');
        piece.className = 'confetti';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.background = colors[i % colors.length];
        piece.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
        piece.style.animationDelay = Math.random() * 0.7 + 's';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 4200);
    }
}

// FLOATING PARTY EMOJIS
function launchPartyEmojis(customList) {
    const emojis = customList || ['🎉', '🎊', '🦋', '🌸', '🎀', '✨', '🧁', '🥳', '💖'];
    for (let i = 0; i < 14; i++) {
        const item = document.createElement('span');
        item.className = 'party-float';
        item.textContent = emojis[i % emojis.length];
        item.style.left = (5 + Math.random() * 90) + 'vw';
        item.style.bottom = (5 + Math.random() * 18) + 'vh';
        item.style.animationDelay = Math.random() * 0.6 + 's';
        document.body.appendChild(item);
        setTimeout(() => item.remove(), 3800);
    }
}

// FIREWORKS
function launchFireworks() {
    const colors = ['#8ed9ff', '#ffd96e', '#bda0ff', '#ff85b3', '#75e8a8'];
    const centers = [
        { x: 25, y: 25 },
        { x: 75, y: 22 },
        { x: 50, y: 18 }
    ];

    centers.forEach(center => {
        for (let i = 0; i < 18; i++) {
            const spark = document.createElement('span');
            const angle = (Math.PI * 2 * i) / 18;
            const distance = 50 + Math.random() * 65;

            spark.className = 'firework';
            spark.style.left = center.x + 'vw';
            spark.style.top = center.y + 'vh';
            spark.style.background = colors[Math.floor(Math.random() * colors.length)];
            spark.style.setProperty('--x', Math.cos(angle) * distance + 'px');
            spark.style.setProperty('--y', Math.sin(angle) * distance + 'px');

            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 1300);
        }
    });
}