/* =========================================================
 * 친구 얼굴 그리기 (SVG)
 *  - 생김새(look)는 친구마다 무작위
 *  - 기분(mood)에 따라 표정이 바뀌어요. mood 가 없으면 기본 표정
 * ========================================================= */
const LOOKS = {
  skin:  [["#ffe3cc", "#f3c6a5"], ["#f8d2b0", "#e8b28a"], ["#eebd92", "#d79c6e"], ["#d9a273", "#bf8456"], ["#b77c50", "#9a6239"]],
  hair:  ["#2b1d16", "#3d2a1e", "#5a3a22", "#7a4b26", "#a8692f", "#f0c14b", "#1d1d26"],
  shirt: ["#ff6b6b", "#4dabf7", "#51cf66", "#fcc419", "#9775fa", "#ff922b", "#20c997", "#f06595"],
  bg:    ["#fff3bf", "#d0ebff", "#d3f9d8", "#ffe3e3", "#e5dbff", "#fff0f6", "#c5f6fa", "#ffe8cc"],
  boy:   ["short", "spiky", "curly", "side"],
  girl:  ["long", "pigtails", "bob", "ponytail"],
};
const rnd = n => Math.floor(Math.random() * n);
const pickOne = a => a[rnd(a.length)];

function makeLook(gender) {
  return {
    skin: rnd(LOOKS.skin.length), hair: rnd(LOOKS.hair.length), shirt: rnd(LOOKS.shirt.length), bg: rnd(LOOKS.bg.length),
    style: pickOne(LOOKS[gender]),
    glasses: Math.random() < 0.2,
    bow: gender === "girl" && Math.random() < 0.5,
  };
}

/* 머리카락: [뒤쪽(얼굴보다 먼저), 앞쪽(얼굴 위)] */
function hairParts(style, c) {
  const back = d => `<path d="${d}" fill="${c}"/>`;
  const curls = Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI * (1.05 + i * 0.1125), x = 60 + 31 * Math.cos(a), y = 54 + 29 * Math.sin(a);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${c}"/>`;
  }).join("");
  const bangs = `<path d="M29 55C27 27 93 27 91 55C86 44 78 40 70 41C66 46 56 47 48 42C40 43 33 47 29 55Z" fill="${c}"/>`;
  switch (style) {
    case "short":  return ["", `<path d="M29 56C25 24 95 24 91 56C88 44 80 38 60 38C40 38 32 44 29 56Z" fill="${c}"/>`];
    case "spiky":  return ["", `<path d="M29 56L30 36L38 39L41 26L50 33L58 20L66 32L76 24L80 37L89 34L91 56C86 42 76 39 60 39C44 39 34 42 29 56Z" fill="${c}"/>`];
    case "curly":  return ["", curls];
    case "side":   return ["", `<path d="M29 57C26 25 94 25 91 55C86 42 70 34 50 44C42 47 34 50 29 57Z" fill="${c}"/>`];
    case "long":   return [back("M26 56C24 20 96 20 94 56L97 104C88 108 78 104 74 101L46 101C42 104 32 108 23 104Z"), bangs];
    case "bob":    return [back("M25 58C23 21 97 21 95 58L96 84C90 88 82 86 80 82L40 82C38 86 30 88 24 84Z"), bangs];
    case "pigtails": return [
      `<ellipse cx="22" cy="70" rx="10" ry="16" fill="${c}"/><ellipse cx="98" cy="70" rx="10" ry="16" fill="${c}"/>
       <circle cx="27" cy="55" r="4" fill="#ff6b9d"/><circle cx="93" cy="55" r="4" fill="#ff6b9d"/>`, bangs];
    case "ponytail": return [
      `<path d="M84 34C104 30 108 58 98 78C96 64 92 52 84 46Z" fill="${c}"/>`, bangs + `<circle cx="86" cy="38" r="4" fill="#ffd43b"/>`];
  }
  return ["", ""];
}

/* 표정 */
function faceParts(mood) {
  const ink = "#3b2a22";
  const dotEyes = `<circle cx="49" cy="58" r="3.4" fill="${ink}"/><circle cx="71" cy="58" r="3.4" fill="${ink}"/>
    <circle cx="50.2" cy="56.8" r="1" fill="#fff"/><circle cx="72.2" cy="56.8" r="1" fill="#fff"/>`;
  const cheeks = o => `<ellipse cx="41" cy="67" rx="5" ry="3" fill="#ff8fa3" opacity="${o}"/><ellipse cx="79" cy="67" rx="5" ry="3" fill="#ff8fa3" opacity="${o}"/>`;
  const st = `fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"`;
  switch (mood) {
    case "happy": return cheeks(.7) + `
      <path d="M44 60Q49 53 54 60M66 60Q71 53 76 60" ${st}/>
      <path d="M49 68Q60 84 71 68Z" fill="#c2255c" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M54 75Q60 72 66 75Q60 81 54 75Z" fill="#ff8787"/>
      <text x="96" y="30" font-size="14" text-anchor="middle">✨</text>`;
    case "sad": return cheeks(.25) + dotEyes + `
      <path d="M42 51L54 47M66 47L78 51" ${st}/>
      <path d="M52 76Q60 69 68 76" ${st}/>
      <path d="M45 63C42 69 43 73 46 73C49 73 50 69 45 63Z" fill="#74c0fc" stroke="#339af0" stroke-width=".8"/>
      <text x="96" y="30" font-size="14" text-anchor="middle">💧</text>`;
    case "angry": return `<circle cx="60" cy="56" r="30" fill="#ff6b6b" opacity=".18"/>` + cheeks(.5) + dotEyes + `
      <path d="M42 47L55 53M65 53L78 47" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M51 76Q60 69 69 76" ${st}/>
      <text x="92" y="32" font-size="18" text-anchor="middle">💢</text>`;
    case "hungry": return cheeks(.45) + `
      <circle cx="49" cy="57" r="3.4" fill="${ink}"/><circle cx="71" cy="57" r="3.4" fill="${ink}"/>
      <circle cx="50" cy="55.5" r="1.2" fill="#fff"/><circle cx="72" cy="55.5" r="1.2" fill="#fff"/>
      <ellipse cx="60" cy="73" rx="6" ry="6.5" fill="#862e2e" stroke="${ink}" stroke-width="1.6"/>
      <ellipse cx="60" cy="76.5" rx="4" ry="2.5" fill="#ff8787"/>
      <path d="M66 77C67 83 66 86 64 86C62 86 62 82 66 77Z" fill="#a5d8ff" stroke="#74c0fc" stroke-width=".7"/>
      <circle cx="90" cy="38" r="2.5" fill="#fff" stroke="#ced4da"/><circle cx="96" cy="30" r="3.5" fill="#fff" stroke="#ced4da"/>
      <circle cx="104" cy="17" r="11" fill="#fff" stroke="#ced4da"/><text x="104" y="22" font-size="13" text-anchor="middle">🍔</text>`;
    case "tired": return cheeks(.3) + `
      <path d="M44 59Q49 62 54 59M66 59Q71 62 76 59" ${st}/>
      <path d="M44 57.5H54M66 57.5H76" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>
      <path d="M45 64Q49 66 53 64M67 64Q71 66 75 64" fill="none" stroke="#9c8fd0" stroke-width="1.4" stroke-linecap="round"/>
      <ellipse cx="60" cy="74" rx="4.5" ry="5.5" fill="#862e2e" stroke="${ink}" stroke-width="1.6"/>
      <text x="90" y="34" font-size="13" font-weight="700" fill="#7950f2" font-family="Fredoka, sans-serif">Z</text>
      <text x="100" y="24" font-size="10" font-weight="700" fill="#9775fa" font-family="Fredoka, sans-serif">z</text>`;
  }
  return cheeks(.45) + dotEyes + `<path d="M53 70Q60 76 67 70" ${st}/>`;
}

/* ===== Canva 로 만든 친구 그림 =====
 * img/sheets/kid1.jpg ~ kid20.jpg (kid1~5·11~15 남자, kid6~10·16~20 여자)
 * 한 장에 표정 6개 (3칸 × 2줄): 위 = 기본 · happy · sad / 아래 = angry · hungry · tired
 * 파일이 있으면 그 그림을, 없으면 아래 SVG 얼굴을 써요.
 */
const KIDS = { boy: [1, 2, 3, 4, 5, 11, 12, 13, 14, 15], girl: [6, 7, 8, 9, 10, 16, 17, 18, 19, 20] };
const MOOD_CELL = { neutral: [0, 0], happy: [1, 0], sad: [2, 0], angry: [0, 1], hungry: [1, 1], tired: [2, 1] };
const ZOOM = 1.08;       // 칸 테두리가 보이지 않게 살짝 확대
let KID_EXT = null;      // "jpg" | "png" — 그림 파일을 찾으면 정해져요
(function probe(exts) {
  if (!exts.length) return;
  const im = new Image();
  im.onload = () => { KID_EXT = exts[0]; window.dispatchEvent(new Event("kidpics")); };
  im.onerror = () => probe(exts.slice(1));
  im.src = `img/sheets/kid1.${exts[0]}`;
})(["jpg", "png", "webp"]);

function kidImg(kid, mood) {
  const [c, r] = MOOD_CELL[mood || "neutral"], pct = v => `${(-((v + 0.5) * ZOOM - 0.5) * 100).toFixed(2)}%`;
  return `<span class="kid"><img src="img/sheets/kid${kid}.${KID_EXT}" alt="" draggable="false"
    style="width:${300 * ZOOM}%;left:${pct(c)};top:${pct(r)}"></span>`;
}

function avatarSVG(f, mood = null) {
  if (KID_EXT && f.look.kid) return kidImg(f.look.kid, mood);
  const L = f.look, [skin, shade] = LOOKS.skin[L.skin], hair = LOOKS.hair[L.hair], shirt = LOOKS.shirt[L.shirt];
  const [hb, hf] = hairParts(L.style, hair);
  const glasses = L.glasses ? `<g fill="none" stroke="#343a40" stroke-width="2"><circle cx="49" cy="58" r="8"/><circle cx="71" cy="58" r="8"/><path d="M57 58H63M41 57L32 55M79 57L88 55"/></g>` : "";
  const bow = L.bow ? `<g transform="translate(40 30) rotate(-18)"><path d="M0 0L-11 -7V7Z M0 0L11 -7V7Z" fill="#ff6b9d"/><circle r="3.5" fill="#f06595"/></g>` : "";
  const collar = f.gender === "girl"
    ? `<path d="M50 92Q60 102 70 92" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/>`
    : `<path d="M50 91L60 100L70 91" fill="none" stroke="#fff" stroke-width="3" opacity=".8" stroke-linejoin="round"/>`;
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="60" cy="60" r="60" fill="${LOOKS.bg[L.bg]}"/>
    ${hb}
    <path d="M22 120C22 98 38 88 60 88C82 88 98 98 98 120Z" fill="${shirt}"/>${collar}
    <rect x="53" y="78" width="14" height="12" rx="5" fill="${shade}"/>
    <circle cx="30" cy="59" r="6.5" fill="${shade}"/><circle cx="90" cy="59" r="6.5" fill="${shade}"/>
    <circle cx="60" cy="56" r="30" fill="${skin}"/>
    ${hf}${bow}
    ${faceParts(mood)}
    ${glasses}
  </svg>`;
}
