const openButton = document.getElementById("open-button");
const welcomeScreen = document.querySelector(".welcome");
const passwordScreen = document.getElementById("password-screen");
const letterScreen = document.getElementById("letter-screen");

const passwordForm = document.getElementById("password-form");
const birthdayInput = document.getElementById("birthday-input");
const passwordMessage = document.getElementById("password-message");

const letter = document.querySelector(".letter");

const candleSection = document.getElementById("candle-section");
const candle = document.getElementById("candle");
const candleText = document.getElementById("candle-text");
const blowButton = document.getElementById("blow-button");
const finalPhoto = document.getElementById("final-photo");

// 🔑 HIS BIRTHDAY, digits only, format DDMMYYYY
// Example: 5 March 1992 -> "05031992"
const SECRET_BIRTHDAY = "23102003";

const rand = (min, max) => Math.random() * (max - min) + min;

/* ---------- Magic helpers ---------- */

// Sparkle trail
let lastSparkle = 0;
document.addEventListener("pointermove", (e) => {
    const now = Date.now();
    if (now - lastSparkle < 45) return;
    lastSparkle = now;

    const s = document.createElement("span");
    s.className = "sparkle";
    s.style.left = e.clientX + rand(-6, 6) + "px";
    s.style.top = e.clientY + rand(-6, 6) + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 900);
});

// Burst of emojis from a point
function burst(x, y, emojis, count = 14) {
    for (let i = 0; i < count; i++) {
        const p = document.createElement("span");
        p.className = "particle";
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.fontSize = rand(14, 28) + "px";

        const angle = rand(0, Math.PI * 2);
        const distance = rand(60, 160);
        p.style.setProperty("--dx", Math.cos(angle) * distance + "px");
        p.style.setProperty("--dy", Math.sin(angle) * distance + "px");

        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1500);
    }
}

// Tap anywhere for a little burst
document.addEventListener("pointerdown", (e) => {
    burst(e.clientX, e.clientY, ["✨", "⭐", "💫"], 6);
});

// Rain of hearts and stars
function rain(duration = 5000) {
    const symbols = ["❤️", "✨", "💜", "⭐", "💫"];
    const timer = setInterval(() => {
        const f = document.createElement("span");
        f.className = "falling";
        f.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        f.style.left = rand(0, 100) + "vw";
        f.style.fontSize = rand(16, 30) + "px";
        f.style.animationDuration = rand(4, 8) + "s";
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 8500);
    }, 180);
    setTimeout(() => clearInterval(timer), duration);
}

/* ---------- The candle made of words ---------- */

const PHRASES = ["I love you", "I love you", "Je t'aime"];
let candleDuration = 0;

function buildCandle() {
    const FLAME_ROWS = [1, 2, 2, 2, 1]; // words per row, top to bottom
    const BODY_ROWS = 9;
    const BODY_WORDS = 3;
    const BASE_WORDS = 4;
    const STEP = 45; // ms between each word appearing

    const bodyTotal = BODY_ROWS * BODY_WORDS + BASE_WORDS;
    const flameStart = bodyTotal * STEP + 300;

    let k = 0;
    function addRow(parent, count, cls, offset) {
        const row = document.createElement("div");
        row.className = "candle-row " + cls;
        for (let i = 0; i < count; i++) {
            const w = document.createElement("span");
            w.className = "candle-word";
            w.textContent = PHRASES[k % PHRASES.length];
            w.style.transitionDelay = (offset + k * STEP) + "ms";
            w.style.animationDelay = (-Math.random() * 1.3) + "s";
            row.appendChild(w);
            k++;
        }
        parent.appendChild(row);
    }

    // Glow
    const glow = document.createElement("div");
    glow.className = "candle-glow";
    glow.style.transitionDelay = flameStart + "ms";
    candle.appendChild(glow);

    // Smoke container
    const smokeBox = document.createElement("div");
    smokeBox.className = "candle-smoke";
    candle.appendChild(smokeBox);

    // Flame
    const flame = document.createElement("div");
    flame.className = "candle-flame";
    k = 0;
    FLAME_ROWS.forEach((count) => addRow(flame, count, "", flameStart));
    const flameCount = k;
    flame.addEventListener("click", blowOut);
    candle.appendChild(flame);

    // Wick
    const wick = document.createElement("div");
    wick.className = "candle-wick";
    wick.style.transitionDelay = (bodyTotal * STEP) + "ms";
    candle.appendChild(wick);

    // Body + base
    const body = document.createElement("div");
    body.className = "candle-body";
    k = 0;
    for (let r = 0; r < BODY_ROWS; r++) {
        addRow(body, BODY_WORDS, "", 0);
    }
    addRow(body, BASE_WORDS, "candle-base", 0);
    candle.appendChild(body);

    candleDuration = flameStart + flameCount * STEP + 1200;
}

buildCandle();

// Show the candle and light it
function showCandle() {
    candleSection.hidden = false;
    candleSection.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => candle.classList.add("show"), 500);

    setTimeout(() => {
        candleText.textContent = "Close your eyes… and make a wish 🌠";
        blowButton.hidden = false;
    }, 500 + candleDuration);
}

// Blow out the candle
let blown = false;
function blowOut() {
    if (blown || !candle.classList.contains("show")) return;
    blown = true;

    blowButton.hidden = true;
    candle.classList.add("out");
    makeSmoke();
    candleText.textContent = "Your wish is safe with the stars ✨";

    // Then the surprise photo appears
    setTimeout(() => {
        finalPhoto.hidden = false;
        setTimeout(() => {
            finalPhoto.classList.add("show");
            const r = finalPhoto.getBoundingClientRect();
            burst(r.left + r.width / 2, r.top + r.height / 2,
                  ["❤️", "✨", "💜", "⭐"], 30);
            rain(5000);
            finalPhoto.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 60);
    }, 2200);
}

function makeSmoke() {
    const smokeBox = candle.querySelector(".candle-smoke");
    for (let i = 0; i < 5; i++) {
        const puff = document.createElement("span");
        puff.className = "smoke";
        puff.style.setProperty("--sx", rand(-30, 30) + "px");
        puff.style.animationDelay = i * 0.25 + "s";
        smokeBox.appendChild(puff);
    }
}

blowButton.addEventListener("click", blowOut);

/* ---------- Letter, then photos, then candle ---------- */

function revealLetter() {
    const lines = letter.querySelectorAll("p");
    const photos = document.querySelectorAll(".photo-gallery .polaroid");
    letter.classList.add("armed");

    // Letter lines, one by one
    lines.forEach((line, i) => {
        setTimeout(() => line.classList.add("show"), 600 + i * 1800);
    });

    // Photos, one by one
    const photosStart = 600 + lines.length * 1800;
    photos.forEach((photo, i) => {
        setTimeout(() => photo.classList.add("show"), photosStart + i * 1200);
    });

    // Candle appears after the last photo
    setTimeout(showCandle, photosStart + photos.length * 1200 + 1500);
}

/* ---------- Screen flow ---------- */

// Welcome -> password
openButton.addEventListener("click", function () {
    welcomeScreen.hidden = true;
    passwordScreen.hidden = false;
    birthdayInput.focus();
});

// Password -> letter
passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Accepts 23/10/2026, 23-10-2026, 23102026...
    const entered = birthdayInput.value.replace(/\D/g, "");

    if (entered === SECRET_BIRTHDAY) {
        passwordScreen.hidden = true;
        letterScreen.hidden = false;
        window.scrollTo(0, 0);

        burst(window.innerWidth / 2, window.innerHeight / 2,
              ["❤️", "✨", "💜", "⭐"], 30);
        rain();
        revealLetter();
    } else {
        passwordMessage.textContent = "Not quite, my love. Try again ✨";
        birthdayInput.value = "";
        birthdayInput.focus();
    }
});