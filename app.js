/* =========================================================
 * Meet My Friends · 3학년 6~8단원 프로젝트
 * ========================================================= */
const $ = id => document.getElementById(id);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};
const itemById = Object.fromEntries(ITEMS.map(x => [x.id, x]));
const actById = Object.fromEntries(ACTIONS.map(x => [x.id, x]));
const moodByKey = Object.fromEntries(MOODS.map(x => [x.key, x]));
const ageByN = Object.fromEntries(AGES.map(x => [x.n, x]));
document.body.insertAdjacentHTML("afterbegin",
  `<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><defs>${ITEM_DEFS}</defs></svg>`);

/* ---------- 친구 20명 만들기 ---------- */
const COUNT = 20, CHOICES = 9;   // 친구 20명 (남자 10 · 여자 10)
function makeFriends() {
  const genders = shuffle(Array(COUNT / 2).fill("boy").concat(Array(COUNT / 2).fill("girl")));
  const names = { boy: shuffle(NAMES.boy), girl: shuffle(NAMES.girl) };
  const moods = shuffle(MOODS.flatMap(m => Array(COUNT / MOODS.length).fill(m.key)));   // 기분마다 같은 수만큼 (4명씩)
  const used = new Set();
  const kids = { boy: shuffle(KIDS.boy), girl: shuffle(KIDS.girl) };   // Canva 그림 20명을 한 명씩 (겹치지 않아요)
  return genders.map((gender, i) => {
    const mood = moods[i % moods.length];
    let age; do { age = AGES[rnd(AGES.length)].n; } while (used.has(mood + age)); // 기분+나이가 같은 친구는 없어요
    used.add(mood + age);
    const items = shuffle(ITEMS.map(x => x.id)).slice(0, 3);
    const actions = shuffle(ACTIONS.map(x => x.id)).slice(0, 3);
    return {
      id: i, name: names[gender].pop(), gender, mood, age, items, actions,
      bagChoices: shuffle(items.concat(shuffle(ITEMS.map(x => x.id).filter(x => !items.includes(x))).slice(0, CHOICES - 3))),
      canChoices: shuffle(actions.concat(shuffle(ACTIONS.map(x => x.id).filter(x => !actions.includes(x))).slice(0, CHOICES - 3))),
      look: { ...makeLook(gender), kid: kids[gender].pop() },
      seen: { hi: false, mood: false, age: false, asked: [], askedCan: [] },
    };
  });
}
// 저장된 기록이 망가졌거나 예전 형식이면 새로 만들어요
const okFriend = f => !!f && typeof f.name === "string" && GENDER[f.gender] && moodByKey[f.mood] && ageByN[f.age] &&
  Array.isArray(f.items) && f.items.length === 3 && f.items.every(i => itemById[i]) &&
  Array.isArray(f.actions) && f.actions.length === 3 && f.actions.every(a => actById[a]) && f.look && typeof f.look === "object";
let friends = store.get("friends-v2", null);
if (!Array.isArray(friends) || friends.length !== COUNT || !friends.every(f => okFriend(f) && f.seen && Array.isArray(f.seen.asked)
    && Array.isArray(f.seen.askedCan) && Array.isArray(f.bagChoices) && Array.isArray(f.canChoices))) { friends = makeFriends(); }
friends.forEach((f, i) => { f.id = i; });
const save = () => store.set("friends-v2", friends);

/* ---------- 💚 내 AI 친구 (이 기기에 계속 남아요) ---------- */
let myFriend = store.get("my-friend-v1", null);
if (!okFriend(myFriend)) myFriend = null;
let choosing = false;   // 🔄 새로운 친구 선택하기를 누른 뒤에는 묻지 않고 바로 바꿔요
const sigOf = f => [f.name, f.gender, f.mood, f.age, f.items.join(), f.actions.join(), f.look.kid].join("|");
const isMine = f => !!myFriend && sigOf(myFriend) === sigOf(f);
function chooseFriend(f) {
  // 브라우저 확인 창(confirm)은 태블릿 앱 속 브라우저에서 저절로 닫혀 선택이 취소될 수 있어서 쓰지 않아요
  choosing = false;
  const { name, gender, mood, age, items, actions, look } = f;
  myFriend = { name, gender, mood, age, items: items.slice(), actions: actions.slice(), look: { ...look }, at: Date.now() };
  store.set("my-friend-v1", myFriend);
  // 고른 친구는 모든 정보가 보여요
  f.seen.hi = f.seen.mood = f.seen.age = true;
  f.items.forEach(i => f.seen.asked.includes(i) || f.seen.asked.push(i));
  f.actions.forEach(a => f.seen.askedCan.includes(a) || f.seen.askedCan.push(a));
  save(); return true;
}
save();

// 화면에 쓰기 편하게 풀어 둔 친구
const full = f => ({ ...f, mood: moodByKey[f.mood], age: ageByN[f.age], items: f.items.map(i => itemById[i]), actions: f.actions.map(a => actById[a]) });
const foundItems = f => f.items.filter(i => f.seen.asked.includes(i));
const foundActs = f => f.actions.filter(a => f.seen.askedCan.includes(a));
const progress = f => [f.seen.mood, f.seen.age, foundItems(f).length === 3, foundActs(f).length === 3];
const isDone = f => progress(f).every(Boolean);

/* ---------- 소리 ---------- */
let voice = null, rate = store.get("rate", 0.8);
$("rate").value = rate;
$("rate").addEventListener("input", e => { rate = +e.target.value; store.set("rate", rate); });
// 목소리: 여자 친구는 여자 목소리, 남자 친구는 남자 목소리 (높이를 억지로 바꾸지 않아 자연스러워요)
const VOICE = { female: null, male: null, any: null };
const FEMALE = /Samantha|Zira|Aria|Jenny|Ava|Allison|Susan|Michelle|Emma|Joanna|Salli|Kendra|Kimberly|Google US English|female/i;
const MALE = /David|Mark|Guy|Alex|Fred|Aaron|Tom\b|Eric|Christopher|Roger|Steffan|Matthew|Joey|Justin|Davis|Andrew|Brian|Male/i;
function pickVoice() {
  if (!window.speechSynthesis) return;
  let vs = [];
  try { vs = speechSynthesis.getVoices() || []; } catch (e) { return; }
  const us = vs.filter(v => /^en[-_]US/i.test(v.lang)), en = vs.filter(v => /^en/i.test(v.lang));
  const find = (list, re) => list.find(v => re.test(v.name) && !(re === FEMALE && MALE.test(v.name)));
  VOICE.female = find(us, FEMALE) || find(en, FEMALE) || null;
  VOICE.male = find(us, MALE) || find(en, MALE) || null;
  VOICE.any = VOICE.female || us[0] || en[0] || null;
}
if (window.speechSynthesis) { pickVoice(); try { speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {} }
// lines: [{ text, who }] 를 차례로 말해요
let speakTimer = null;
function speak(lines) {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  if (typeof lines === "string") lines = [{ text: lines }];
  if (!VOICE.any) pickVoice();          // 처음에 목소리 목록이 늦게 오는 기기
  try { speechSynthesis.cancel(); } catch (e) {}
  clearTimeout(speakTimer);
  // 크롬은 cancel 바로 뒤에 말하면 첫 소리가 끊기거나 이상하게 나올 때가 있어서 아주 잠깐 기다려요
  speakTimer = setTimeout(() => {
    try {
      lines.forEach(({ text, who }) => {
        const u = new SpeechSynthesisUtterance(text);
        const g = who && who.gender;
        const v = g === "boy" ? (VOICE.male || VOICE.any) : g === "girl" ? (VOICE.female || VOICE.any) : VOICE.any;
        u.lang = (v && v.lang) || "en-US"; if (v) u.voice = v;
        u.rate = rate; u.pitch = 1; u.volume = 1;
        speechSynthesis.speak(u);
      });
    } catch (e) { /* 소리가 안 나도 화면은 계속 써요 */ }
  }, 120);
}

/* ---------- 따라 말하기 (정확도) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
$("sr-warn").hidden = !!SR;
const NUM = { 8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve", 100: "one hundred" };
const norm = s => s.toLowerCase().replace(/[’‘]/g, "'")
  .replace(/\b(8|9|10|11|12|100)\b/g, m => NUM[m])
  .replace(/\bi am\b/g, "i'm").replace(/\bdo not\b/g, "don't").replace(/\b(can not|cannot)\b/g, "can't").replace(/\bwhat is\b/g, "what's")
  .replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
function align(t, h) {
  const n = t.length, m = h.length;
  const d = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (t[i - 1] === h[j - 1] ? 0 : 1));
  const hit = Array(n).fill(false); let i = n, j = m;
  while (i > 0 && j > 0) {
    if (t[i - 1] === h[j - 1] && d[i][j] === d[i - 1][j - 1]) { hit[i - 1] = true; i--; j--; }
    else if (d[i][j] === d[i - 1][j - 1] + 1) { i--; j--; } else if (d[i][j] === d[i - 1][j] + 1) i--; else j--;
  }
  return { acc: Math.max(0, Math.round(100 * (1 - d[n][m] / Math.max(n, m, 1)))), hit };
}
const grade = a => a >= 80 ? "good" : a >= 50 ? "mid" : "low";
let rec = null;
function listen(line, text, onScore) {
  if (!SR) return;
  if (rec) { try { rec.abort(); } catch (e) {} }
  hush();
  const mic = line.querySelector(".mic"), res = line.querySelector(".res");
  rec = new SR(); rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5;
  mic.classList.add("on");
  res.innerHTML = `<span class="heard">듣고 있어요. 말해 보세요…</span>`;
  rec.onresult = ev => {
    const target = norm(text); let top = { acc: -1, hit: [], said: "" };
    for (const alt of ev.results[0]) { const r = align(target, norm(alt.transcript)); if (r.acc > top.acc) top = { ...r, said: alt.transcript }; }
    const g = grade(top.acc);
    line.querySelectorAll(".sen .w").forEach((el, i) => el.className = "w " + (top.hit[i] ? "hit" : "miss"));
    res.innerHTML = `<b class="pct ${g}">${top.acc}%</b><span class="heard">들린 말: <i>${esc(top.said)}</i> · ${g === "good" ? "Excellent! ⭐" : g === "mid" ? "Good try! 빨간 낱말을 다시 들어 봐요." : "다시 한 번! 🔊 듣고 천천히 말해요."}</span>`;
    if (g === "good") speak("Excellent!");
    if (onScore) onScore(top.acc);
  };
  rec.onerror = ev => {
    res.innerHTML = `<span class="heard">${{ "not-allowed": "마이크 사용을 허용해 주세요.", "no-speech": "소리가 안 들렸어요. 다시 눌러서 말해 보세요.", "audio-capture": "마이크를 찾을 수 없어요." }[ev.error] || "다시 한 번 눌러 보세요."}</span>`;
  };
  rec.onend = () => { mic.classList.remove("on"); rec = null; };
  try { rec.start(); } catch (e) { mic.classList.remove("on"); }
}
// 앱 안의 확인 창 (브라우저 confirm 대신) — 눌러야만 닫혀요
function askBox(msg, yes = "네", no = "아니요") {
  return new Promise(resolve => {
    const box = document.createElement("div");
    box.className = "ask-modal";
    box.innerHTML = `<div class="ask-card" role="dialog" aria-modal="true"><p>${msg}</p>
      <div class="ask-btns"><button class="btn ghost" data-v="0" type="button">${no}</button><button class="btn big" data-v="1" type="button">${yes}</button></div></div>`;
    document.body.appendChild(box);
    const done = v => { box.remove(); resolve(v); };
    box.querySelectorAll("button").forEach(b => b.addEventListener("click", () => done(b.dataset.v === "1")));
    box.addEventListener("click", e => { if (e.target === box) done(false); });
    box.querySelector('[data-v="1"]').focus();
  });
}
const hush = () => { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/* 한 문장 줄: 낱말 + 🔊 + 🎤 + 결과 */
function line(text, ko, who, cls = "") {
  const words = text.split(" ").map(w => `<span class="w">${esc(w)}</span>`).join(" ");
  return `<div class="line ${cls}" data-text="${esc(text)}" data-who="${who && who.gender ? (who.id ?? who.gender) : ""}">
    <div class="sen">${words}</div>${ko ? `<div class="ko">${esc(ko)}</div>` : ""}
    <div class="ctl"><button class="rbtn say" type="button" aria-label="듣기">🔊</button><button class="rbtn mic" type="button" aria-label="따라 말하기" ${SR ? "" : "disabled"}>🎤</button><button class="rbtn star${inPractice(text) ? " on" : ""}" type="button" aria-label="내 문장에 담기" title="내 문장 연습에 담기">${inPractice(text) ? "⭐" : "☆"}</button></div><div class="res"></div>
  </div>`;
}
function wireLines(root, onScore) {
  root.querySelectorAll(".line").forEach(el => {
    const w = el.dataset.who, text = el.dataset.text;
    const who = w === "" ? null : GENDER[w] ? { gender: w } : friends[+w] || null;
    el.querySelector(".say").addEventListener("click", () => speak([{ text, who }]));
    el.querySelector(".mic").addEventListener("click", () => listen(el, text, acc => { recordScore(text, acc); if (onScore) onScore(el, acc); }));
    const st = el.querySelector(".star");
    st.addEventListener("click", () => {
      const on = togglePractice(text, el.querySelector(".ko") ? el.querySelector(".ko").textContent : "", who);
      root.querySelectorAll(".line").forEach(o => { if (o.dataset.text === text) { const b = o.querySelector(".star"); b.classList.toggle("on", on); b.textContent = on ? "⭐" : "☆"; } });
      toast(on ? "⭐ 내 문장 연습에 담았어요!" : "내 문장 연습에서 뺐어요.");
    });
  });
}

/* ---------- 내 문장 (⭐ 로 담은 문장) ---------- */
let practice = store.get("practice-v1", []);
if (!Array.isArray(practice)) practice = [];
practice = practice.filter(p => p && typeof p.text === "string" && p.text);
const savePractice = () => { store.set("practice-v1", practice); updatePracticeTab(); };
const inPractice = text => practice.some(p => p.text === text);
function togglePractice(text, ko, who) {
  const i = practice.findIndex(p => p.text === text);
  if (i >= 0) { practice.splice(i, 1); savePractice(); return false; }
  practice.push({ text, ko, gender: who ? who.gender : "", name: who ? who.name : "", best: null, tries: 0 });
  savePractice(); return true;
}
function addPractice(list) {   // [{ text, ko, who }]
  let n = 0;
  list.forEach(({ text, ko, who }) => { if (!inPractice(text)) { practice.push({ text, ko, gender: who ? who.gender : "", name: who ? who.name : "", best: null, tries: 0 }); n++; } });
  savePractice(); return n;
}
function recordScore(text, acc) {
  const p = practice.find(x => x.text === text); if (!p) return;
  p.tries++; p.best = Math.max(p.best ?? 0, acc); savePractice();
}
function updatePracticeTab() { $("t-quiz").textContent = `🎤 내 문장 연습${practice.length ? ` (${practice.length})` : ""}`; }

function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
}
function cheer() {
  const box = document.createElement("div"); box.className = "confetti";
  box.innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="left:${rnd(100)}%;animation-delay:${(i % 7) * 0.08}s;background:${LOOKS.shirt[i % LOOKS.shirt.length]}"></i>`).join("");
  document.body.appendChild(box); setTimeout(() => box.remove(), 2200);
}

/* ---------- 탭 ---------- */
const TABS = ["meet", "my", "quiz", "words"];  // my = 💚 내 AI 친구, quiz = 내 문장 연습, words = 친구한테 묻기
function showTab(id) {
  closeWordBub();
  TABS.forEach(t => { $(t).hidden = t !== id; $("t-" + t).setAttribute("aria-selected", t === id); });
  store.set("tab", id);
  if (id === "meet") renderGrid();
  if (id === "my") renderMine();
  if (id === "quiz") renderQuiz();
  if (id === "words") renderWords();
}
TABS.forEach(t => $("t-" + t).addEventListener("click", () => { hush(); showTab(t); }));

/* =========================================================
 * 1. 친구 만나기
 * ========================================================= */
let current = null;
function renderGrid() {
  $("grid-view").hidden = current !== null; $("profile").hidden = current === null;
  if (current !== null) return renderProfile();
  $("met").textContent = `🏅 다 알아본 친구 ${friends.filter(isDone).length} / ${COUNT}`;
  renderMyBar();
  $("grid").innerHTML = friends.map(f => {
    const p = progress(f), F = full(f);
    return `<div class="card${isDone(f) ? " done" : ""}" data-id="${f.id}" role="button" tabindex="0" aria-label="${f.name} 만나기">
      <span class="ava">${avatarSVG(f, f.seen.mood ? f.mood : null)}</span>
      <button class="nm say-name" type="button" aria-label="${f.name} 이름 듣기">🔊 ${f.name}</button>
      <span class="gd ${f.gender}">${GENDER[f.gender].emoji} ${GENDER[f.gender].en}</span>
      <span class="dots">${["😊", "🎂", "🎒", "💪"].map((e, i) => `<i class="${p[i] ? "on" : ""}" title="${["기분", "나이", "가방", "할 수 있는 일"][i]}">${e}</i>`).join("")}</span>
      ${isMine(f) ? `<span class="badge mine">💚</span>` : isDone(f) ? `<span class="badge">✓</span>` : ""}
    </div>`;
  }).join("");
  $("grid").querySelectorAll(".card").forEach(c => {
    const f = friends[+c.dataset.id];
    c.addEventListener("click", e => {
      const nb = e.target.closest(".say-name");
      if (nb) { sayName(f, nb); return; }      // 이름을 누르면 이름만 들려줘요
      openFriend(f.id);
    });
    c.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target === c) { e.preventDefault(); openFriend(f.id); } });
  });
}
function sayName(f, el) {
  speak([{ text: f.name + ".", who: f }]);
  if (el) { el.classList.remove("speaking"); void el.offsetWidth; el.classList.add("speaking"); }
}
function openFriend(id) {
  current = id; renderGrid(); window.scrollTo({ top: 0, behavior: "smooth" });
  const f = friends[id];
  speak([{ text: SAY.nameQ(), who: null }, { text: SAY.hi(f), who: f }]);
  if (!f.seen.hi) { f.seen.hi = true; save(); }
}
// 1쪽 맨 위: 내 AI 친구 + 🔄 새로운 친구 선택하기
function renderMyBar() {
  const bar = $("mybar");
  if (choosing || !myFriend) {
    bar.innerHTML = `<div class="mybar pick">👆 <span><b>마음에 드는 친구 카드</b>를 누르고, <b>💚 내 AI 친구로 선택하기</b> 버튼을 눌러요!</span>
      ${choosing && myFriend ? `<button class="btn ghost" id="cancel-choose" type="button">취소</button>` : ""}</div>`;
    const c = $("cancel-choose"); if (c) c.addEventListener("click", () => { choosing = false; renderGrid(); });
    return;
  }
  bar.innerHTML = `<div class="mybar">
    <span class="mb-ava">${avatarSVG(myFriend, myFriend.mood)}</span>
    <span class="mb-t">💚 내 AI 친구 <b>${esc(myFriend.name)}</b></span>
    <span class="mb-btns"><button class="btn" id="go-my" type="button">💚 내 AI 친구 보기</button>
    <button class="btn ghost" id="new-choose" type="button">🔄 새로운 친구 선택하기</button></span></div>`;
  $("go-my").addEventListener("click", () => showTab("my"));
  $("new-choose").addEventListener("click", startChoosing);
}
function startChoosing() {
  choosing = true; current = null; showTab("meet"); window.scrollTo({ top: 0, behavior: "smooth" });
  toast("👆 새로 고를 친구 카드를 눌러 보세요!");
}

// 2쪽: 💚 내 AI 친구
function renderMine() {
  const box = $("mybox");
  if (!myFriend) {
    box.innerHTML = `<div class="qz-start"><div class="mystery">💚</div>
      <p>아직 <b>내 AI 친구</b>가 없어요.<br><b>친구 만나기</b>에서 친구 카드를 누르고<br><b>💚 내 AI 친구로 선택하기</b>를 눌러요!</p>
      <button class="btn big" id="my-go" type="button">👫 친구 만나러 가기</button></div>`;
    $("my-go").addEventListener("click", () => { choosing = true; showTab("meet"); });
    return;
  }
  const F = full(myFriend);
  const rowsHTML = [
    ["이름", `${esc(F.name)} <small>${GENDER[F.gender].emoji} ${GENDER[F.gender].en}</small>`, SAY.hi(F)],
    ["나이", `${F.age.en} <small>(${F.age.n})</small>`, SAY.ageA(F)],
    ["기분", `${F.mood.en} ${F.mood.emoji}`, SAY.moodA(F)],
    ...F.items.map((it, i) => [`물건 ${i + 1}`, `<span class="mi">${ITEM_PICS[it.id]}</span>${it.en}`, `I have ${withArt(it)}.`]),
    ...F.actions.map((a, i) => [`할 수 있는 일 ${i + 1}`, `${a.emoji} ${a.en}`, `I can ${a.en}.`]),
  ].map(([k, w, t]) => `<tr><th>${k}</th><td class="w">${w}</td><td class="s">${esc(t)}</td></tr>`).join("");
  box.innerHTML = `<article class="mine-card">
    <div class="mine-l"><div class="mine-ava">${avatarSVG(myFriend, myFriend.mood)}</div>
      <div class="mine-tag">💚 내 AI 친구</div>
      <button class="btn" id="mine-say" type="button">🔊 자기소개 듣기</button>
      <button class="btn ghost" id="mine-practice" type="button">🎤 자기소개 연습하기</button>
      <button class="btn ghost" id="mine-new" type="button">🔄 새로운 친구 선택하기</button></div>
    <div class="mine-r"><h3>💚 ${esc(F.name)}의 기록 <small>워크시트 1쪽에 적어요 · 이 기기에 저장돼요</small></h3>
      <table class="mine-t"><thead><tr><th></th><th>단어</th><th>문장</th></tr></thead><tbody>${rowsHTML}</tbody></table>
      <h3 class="mine-h2">📢 자기소개</h3>
      <div class="mine-intro">${SAY.intro(F).map(t => line(t, "", myFriend, "a nbl")).join("")}</div></div>
  </article>`;
  box.querySelectorAll(".nbl .sen").forEach(el => el.classList.add("nb"));
  wireLines(box);
  $("mine-say").addEventListener("click", () => speak(SAY.intro(F).map(text => ({ text, who: myFriend }))));
  $("mine-practice").addEventListener("click", () => {
    const n = addPractice(SAY.intro(F).map(text => ({ text, ko: "", who: myFriend })));
    showTab("quiz"); window.scrollTo({ top: 0 });
    toast(n ? `⭐ 자기소개 ${n}문장을 담았어요!` : "자기소개 문장이 이미 담겨 있어요.");
  });
  $("mine-new").addEventListener("click", startChoosing);
}
$("back").addEventListener("click", () => { current = null; hush(); renderGrid(); });
$("prev").addEventListener("click", () => openFriend((current + COUNT - 1) % COUNT));
$("next").addEventListener("click", () => openFriend((current + 1) % COUNT));
$("shuffle").addEventListener("click", async () => {
  if (!(await askBox("새 친구 20명을 만들까요?<br>지금 친구들은 사라져요. (💚 내 AI 친구는 그대로 남아요)", "새 친구 만들기"))) return;
  friends = makeFriends(); save(); renderGrid(); toast("🎲 새 친구 20명이 왔어요!");
});

let lastBag = null, lastCan = null;   // 가장 최근에 물어본 것 (화면에 대화로 보여 줘요)
function renderProfile() {
  const f = friends[current], F = full(f);
  $("pos").textContent = `${current + 1} / ${COUNT}`;
  const p = progress(f);
  const slot = (ok, inner) => `<span class="slot${ok ? " ok" : ""}">${ok ? inner : "?"}</span>`;
  const fi = foundItems(f), fa = foundActs(f);

  const bagQA = lastBag && lastBag.f === f.id ? (() => {
    const it = itemById[lastBag.id], yes = f.items.includes(it.id);
    return `<div class="chat">${line(SAY.haveQ(it), KO.haveQ(it), null, "q")}${line(yes ? SAY.haveYes(it) : SAY.haveNo(it), yes ? KO.haveYes(it) : KO.haveNo(it), f, "a " + (yes ? "yes" : "no"))}</div>`;
  })() : `<p class="tip">아래 물건을 눌러 <b>Do you have ~?</b> 하고 물어보세요.</p>`;
  const canQA = lastCan && lastCan.f === f.id ? (() => {
    const a = actById[lastCan.id], yes = f.actions.includes(a.id);
    return `<div class="chat">${line(SAY.canQ(a), KO.canQ(a), null, "q")}${line(yes ? SAY.canYes() : SAY.canNo(), yes ? KO.canYes : KO.canNo, f, "a " + (yes ? "yes" : "no"))}</div>`;
  })() : `<p class="tip">아래 그림을 눌러 <b>Can you ~?</b> 하고 물어보세요.</p>`;

  $("pf").innerHTML = `
    <div class="hero">
      <div class="big-ava ${f.seen.mood ? "m-" + f.mood : ""}">${avatarSVG(f, f.seen.mood ? f.mood : null)}</div>
      <div class="who">
        <div class="tag"><button class="say-name big-name" id="pf-name" type="button" aria-label="${f.name} 이름 듣기">🔊 ${f.name}</button><span class="gd ${f.gender}">${GENDER[f.gender].emoji} ${GENDER[f.gender].en} · ${GENDER[f.gender].ko}</span></div>
        <div class="chat">${line(SAY.nameQ(), KO.nameQ, null, "q")}${line(SAY.hi(f), KO.hi(f), f, "a")}</div>
        <div class="choose">${isMine(f) ? `<span class="chosen">💚 내 AI 친구예요!</span> <button class="btn" id="see-my" type="button">💚 내 AI 친구 보기</button>`
          : `<button class="btn big pick-me" id="pick-me" type="button">💚 ${myFriend ? "이 친구로 바꾸기" : "내 AI 친구로 선택하기"}</button>`}</div>
      </div>
    </div>

    <div class="boxes">
      <article class="box b-mood${p[0] ? " done" : ""}">
        <h3>😊 오늘의 기분 <small>How are you?</small></h3>
        <div class="chat">${line(SAY.moodQ(), KO.moodQ, null, "q")}
          ${f.seen.mood ? line(SAY.moodA(F), KO.moodA(F), f, "a") + `<div class="big-emoji">${F.mood.emoji}</div>`
                        : `<button class="reveal" data-k="mood" type="button">❓ 눌러서 ${f.name}의 대답 듣기</button>`}</div>
      </article>

      <article class="box b-age${p[1] ? " done" : ""}">
        <h3>🎂 나이 <small>How old are you?</small></h3>
        <div class="chat">${line(SAY.ageQ(), KO.ageQ, null, "q")}
          ${f.seen.age ? line(SAY.ageA(F), KO.ageA(F), f, "a") + `<div class="cake">🎂 <b>${F.age.n}</b> <span>${F.age.en}</span></div>`
                       : `<button class="reveal" data-k="age" type="button">❓ 눌러서 ${f.name}의 대답 듣기</button>`}</div>
      </article>

      <article class="box b-bag${p[2] ? " done" : ""}">
        <h3>🎒 가방 속 물건 <small>Do you have ~?</small> <span class="cnt">${fi.length} / 3</span></h3>
        <div class="slots">${f.items.map(id => slot(fi.includes(id), `${ITEM_PICS[id]}<em>${itemById[id].en}</em>`)).join("")}</div>
        ${bagQA}
        <div class="choices">${f.bagChoices.map(id => {
          const asked = f.seen.asked.includes(id), yes = f.items.includes(id);
          return `<button class="ch${asked ? (yes ? " yes" : " no") : ""}" data-id="${id}" type="button"><span class="pic">${ITEM_PICS[id]}</span><span>${itemById[id].en}</span></button>`;
        }).join("")}</div>
      </article>

      <article class="box b-can${p[3] ? " done" : ""}">
        <h3>💪 할 수 있는 일 <small>Can you ~?</small> <span class="cnt">${fa.length} / 3</span></h3>
        <div class="slots">${f.actions.map(id => slot(fa.includes(id), `<span class="em">${actById[id].emoji}</span><em>${actById[id].en}</em>`)).join("")}</div>
        ${canQA}
        <div class="choices">${f.canChoices.map(id => {
          const asked = f.seen.askedCan.includes(id), yes = f.actions.includes(id);
          return `<button class="ch${asked ? (yes ? " yes" : " no") : ""}" data-id="${id}" type="button"><span class="em">${actById[id].emoji}</span><span>${actById[id].en}</span></button>`;
        }).join("")}</div>
      </article>
    </div>

    <article class="box intro${isDone(f) ? "" : " locked"}">
      <h3>📢 ${f.name}의 자기소개 ${isDone(f) ? `<button class="btn" id="intro-all" type="button">▶ 모두 듣기</button>` : ""}</h3>
      ${isDone(f) ? SAY.intro(F).map(t => line(t, "", f, "a")).join("") + `<p class="tip">이제 ${f.name}(이)가 되어 자기소개를 해 볼까요? 🎤 아래 버튼을 누르면 자기소개 문장이 모두 담기고 연습하러 가요.</p>
        <div class="intro-go"><button class="btn big" id="go-practice" type="button">🎤 자기소개 문장 담고 연습하러 가기 →</button></div>`
                  : `<p class="tip">🔒 기분 · 나이 · 가방 물건 3개 · 할 수 있는 일 3개를 모두 알아내면 자기소개가 열려요!</p>`}
    </article>
    <div class="pf-foot"><button class="btn ghost" id="show-all" type="button">👀 정답 모두 보기</button></div>`;

  wireLines($("pf"));
  $("pf").querySelectorAll(".reveal").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.k; f.seen[k] = true; save(); renderProfile();
    speak(k === "mood" ? [{ text: SAY.moodQ() }, { text: SAY.moodA(F), who: f }] : [{ text: SAY.ageQ() }, { text: SAY.ageA(F), who: f }]);
    afterFind(f);
  }));
  $("pf").querySelectorAll(".b-bag .ch").forEach(b => b.addEventListener("click", () => {
    const it = itemById[b.dataset.id], yes = f.items.includes(it.id);
    if (!f.seen.asked.includes(it.id)) f.seen.asked.push(it.id);
    lastBag = { f: f.id, id: it.id }; save(); renderProfile();
    speak([{ text: SAY.haveQ(it) }, { text: yes ? SAY.haveYes(it) : SAY.haveNo(it), who: f }]);
    afterFind(f);
  }));
  $("pf").querySelectorAll(".b-can .ch").forEach(b => b.addEventListener("click", () => {
    const a = actById[b.dataset.id], yes = f.actions.includes(a.id);
    if (!f.seen.askedCan.includes(a.id)) f.seen.askedCan.push(a.id);
    lastCan = { f: f.id, id: a.id }; save(); renderProfile();
    speak([{ text: SAY.canQ(a) }, { text: yes ? SAY.canYes() : SAY.canNo(), who: f }]);
    afterFind(f);
  }));
  const ia = $("intro-all"); if (ia) ia.addEventListener("click", () => speak(SAY.intro(F).map(text => ({ text, who: f }))));
  $("pf-name").addEventListener("click", e => sayName(f, e.currentTarget));
  const pm = $("pick-me"); if (pm) pm.addEventListener("click", () => {
    if (!chooseFriend(f)) return;
    current = null; cheer(); showTab("my"); window.scrollTo({ top: 0 });
    toast(`💚 ${f.name}(이)가 내 AI 친구가 되었어요!`);
    speak([{ text: SAY.hi(f), who: f }]);
  });
  const sm = $("see-my"); if (sm) sm.addEventListener("click", () => { current = null; showTab("my"); window.scrollTo({ top: 0 }); });
  const gp = $("go-practice"); if (gp) gp.addEventListener("click", () => {
    const n = addPractice(SAY.intro(F).map(text => ({ text, ko: "", who: f })));
    window.scrollTo({ top: 0 }); showTab("quiz");
    toast(n ? `⭐ ${f.name}의 자기소개 ${n}문장을 담았어요!` : "자기소개 문장이 이미 담겨 있어요.");
  });
  $("show-all").addEventListener("click", async () => {
    if (!(await askBox(`${f.name}의 정답을 모두 볼까요?`, "모두 보기"))) return;
    f.seen.mood = f.seen.age = true;
    f.items.forEach(i => f.seen.asked.includes(i) || f.seen.asked.push(i));
    f.actions.forEach(a => f.seen.askedCan.includes(a) || f.seen.askedCan.push(a));
    save(); renderProfile();
  });
}
let doneShown = new Set(friends.filter(isDone).map(f => f.id));
function afterFind(f) {
  if (isDone(f) && !doneShown.has(f.id)) {
    doneShown.add(f.id); cheer(); toast(`🎉 ${f.name}에 대해 모두 알아냈어요! 자기소개를 들어 봐요.`);
  }
}

/* =========================================================
 * 2. 내 문장 연습 — ⭐ 로 담은 문장을 듣고 말하기
 * ========================================================= */
function renderQuiz() {
  updatePracticeTab();
  const scored = practice.filter(p => p.best != null);
  const avg = scored.length ? Math.round(scored.reduce((a, p) => a + p.best, 0) / scored.length) : null;
  $("score").textContent = `📝 ${practice.length}문장 · 🎯 평균 ${avg == null ? "-" : avg + "%"} · ✅ ${practice.filter(p => (p.best ?? 0) >= 80).length}`;
  if (!practice.length) {
    $("qz").innerHTML = `<div class="qz-start"><div class="mystery">☆</div>
      <p>아직 담은 문장이 없어요.<br><b>친구 만나기</b>에서 문장 옆 <b>☆</b> 를 누르면 여기에 담겨요.<br>친구를 다 알아내면 <b>⭐ 자기소개 문장 모두 담기</b>도 할 수 있어요!</p>
      <button class="btn big" id="pr-go" type="button">👫 친구 만나러 가기</button></div>`;
    $("pr-go").addEventListener("click", () => showTab("meet")); return;
  }
  $("qz").innerHTML = `<div class="pr-tools">
      <button class="btn" id="pr-all" type="button">▶ 모두 차례로 듣기</button>
      <button class="btn ghost" id="pr-clear" type="button">🗑️ 모두 지우기</button></div>
    <div class="pr-list">${practice.map((p, i) => {
      const g = p.best == null ? "" : grade(p.best);
      return `<div class="pr-item" data-i="${i}">
        <span class="pr-no">${i + 1}</span>
        <div class="line a pr-line" data-text="${esc(p.text)}">
          <div class="sen nb">${p.text.split(" ").map(w => `<span class="w">${esc(w)}</span>`).join(" ")}</div>
          ${p.ko || p.name ? `<div class="ko">${esc(p.ko)}${p.name ? ` <span class="who-tag">${p.gender === "girl" ? "👧" : "👦"} ${esc(p.name)}</span>` : ""}</div>` : ""}
          <div class="ctl"><button class="rbtn say" type="button" aria-label="듣기">🔊</button><button class="rbtn mic" type="button" aria-label="따라 말하기" ${SR ? "" : "disabled"}>🎤</button><button class="rbtn del" type="button" aria-label="빼기">✕</button></div>
          <div class="res"></div>
        </div>
        <div class="pr-best ${g}">${p.best == null ? "<small>아직</small>" : `<b>${p.best}%</b>`}<small>최고 · ${p.tries}번</small></div>
      </div>`;
    }).join("")}</div>`;
  $("qz").querySelectorAll(".pr-item").forEach(item => {
    const p = practice[+item.dataset.i], el = item.querySelector(".line"), who = p.gender ? { gender: p.gender } : null;
    el.querySelector(".say").addEventListener("click", () => speak([{ text: p.text, who }]));
    el.querySelector(".mic").addEventListener("click", () => listen(el, p.text, acc => {
      recordScore(p.text, acc);
      const box = item.querySelector(".pr-best"); box.className = "pr-best " + grade(p.best);
      box.innerHTML = `<b>${p.best}%</b><small>최고 · ${p.tries}번</small>`;
      const sc = practice.filter(x => x.best != null);
      $("score").textContent = `📝 ${practice.length}문장 · 🎯 평균 ${Math.round(sc.reduce((a, x) => a + x.best, 0) / sc.length)}% · ✅ ${practice.filter(x => (x.best ?? 0) >= 80).length}`;
    }));
    el.querySelector(".del").addEventListener("click", () => { practice.splice(practice.indexOf(p), 1); savePractice(); renderQuiz(); });
  });
  $("pr-all").addEventListener("click", () => speak(practice.map(p => ({ text: p.text, who: p.gender ? { gender: p.gender } : null }))));
  $("pr-clear").addEventListener("click", async () => { if (await askBox("담은 문장을 모두 지울까요?", "모두 지우기")) { practice = []; savePractice(); renderQuiz(); } });
}

/* =========================================================
 * 3. 친구한테 묻기 — 친구를 만나면 하는 질문을 듣고 말하기
 * ========================================================= */
const ask = { item: "pencil", act: "swim" };
const QUESTIONS = [
  { k: "name", ic: "👋", title: "이름 묻기",          q: () => SAY.nameQ(), ko: () => KO.nameQ },
  { k: "age",  ic: "🎂", title: "나이 묻기",          q: () => SAY.ageQ(),  ko: () => KO.ageQ },
  { k: "mood", ic: "😊", title: "기분 묻기",          q: () => SAY.moodQ(), ko: () => KO.moodQ },
  { k: "have", ic: "🎒", title: "가지고 있는지 묻기", q: () => SAY.haveQ(itemById[ask.item]), ko: () => KO.haveQ(itemById[ask.item]) },
  { k: "can",  ic: "💪", title: "할 수 있는지 묻기",  q: () => SAY.canQ(actById[ask.act]),   ko: () => KO.canQ(actById[ask.act]) },
];
function renderWords() {
  $("wd").innerHTML = `<div class="ask-qs">${QUESTIONS.map((Q, i) => `
      <article class="box ask-q q-${Q.k}" data-k="${Q.k}">
        <h3><span class="qn">${i + 1}</span> ${Q.ic} ${Q.title}</h3>
        ${line(Q.q(), Q.ko(), null, "q")}
        ${Q.k === "have" ? `<p class="tip">빈칸에 넣을 물건을 골라요 👇</p><div class="pick">${ITEMS.map(it => `<button class="ch${it.id === ask.item ? " sel" : ""}" data-item="${it.id}" type="button"><span class="pic">${ITEM_PICS[it.id]}</span><span>${it.en}</span></button>`).join("")}</div>` : ""}
        ${Q.k === "can" ? `<p class="tip">빈칸에 넣을 행동을 골라요 👇</p><div class="pick">${ACTIONS.map(a => `<button class="ch${a.id === ask.act ? " sel" : ""}" data-act="${a.id}" type="button"><span class="em">${a.emoji}</span><span>${a.en}</span></button>`).join("")}</div>` : ""}
      </article>`).join("")}</div>`;
  wireLines($("wd"));
  $("wd").querySelectorAll("[data-item]").forEach(b => b.addEventListener("click", () => { ask.item = b.dataset.item; renderAsk(); speak(SAY.haveQ(itemById[ask.item])); }));
  $("wd").querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => { ask.act = b.dataset.act; renderAsk(); speak(SAY.canQ(actById[ask.act])); }));
}
// 다시 그려도 스크롤 위치는 그대로
function renderAsk() { const y = window.scrollY; renderWords(); window.scrollTo(0, y); }

/* ---------- 낱말을 누르면 소리 + 뜻 ---------- */
let wordBub = null;
function closeWordBub() { if (wordBub) { wordBub.remove(); wordBub = null; } document.querySelectorAll(".w.picked").forEach(e => e.classList.remove("picked")); }
function showWord(el) {
  const m = meaningOf(el.textContent);
  if (!m.word) return;
  closeWordBub();
  el.classList.add("picked");
  const line = el.closest(".line"), w = line && line.dataset.who;
  const who = w && GENDER[w] ? { gender: w } : w ? friends[+w] : null;
  speak([{ text: m.word, who: NAME_KO[m.word] ? who : null }]);
  wordBub = document.createElement("div");
  wordBub.className = "wbub"; wordBub.setAttribute("role", "status");
  wordBub.innerHTML = `<button class="wb-say" type="button" aria-label="다시 듣기">🔊</button><b>${esc(m.word)}</b>` +
    (m.ko ? `<span>${esc(m.ko)}</span>` : "");
  document.body.appendChild(wordBub);
  wordBub.querySelector(".wb-say").addEventListener("click", e => { e.stopPropagation(); speak([{ text: m.word }]); });
  // 낱말 바로 위(자리가 없으면 아래)에, 화면 밖으로 나가지 않게
  const r = el.getBoundingClientRect(), b = wordBub.getBoundingClientRect();
  let left = r.left + r.width / 2 - b.width / 2;
  left = Math.max(8, Math.min(left, document.documentElement.clientWidth - b.width - 8));
  let top = r.top - b.height - 10, below = false;
  if (top < 8) { top = r.bottom + 10; below = true; }
  wordBub.classList.toggle("below", below);
  wordBub.style.left = (left + window.scrollX) + "px";
  wordBub.style.top = (top + window.scrollY) + "px";
  wordBub.style.setProperty("--ax", (r.left + r.width / 2 - left) + "px");
}
document.addEventListener("click", e => {
  const w = e.target.closest(".sen .w");
  if (w) { e.stopPropagation(); showWord(w); return; }
  if (wordBub && !e.target.closest(".wbub")) closeWordBub();
}, true);
window.addEventListener("resize", closeWordBub);

/* ---------- 시작 ---------- */
// Canva 그림을 찾으면 지금 화면을 다시 그려요
window.addEventListener("kidpics", () => { const t = TABS.find(t => !$(t).hidden); if (t === "meet") renderGrid(); if (t === "my") renderMine(); });
updatePracticeTab();
const firstTab = store.get("tab", "meet");
showTab(TABS.includes(firstTab) ? firstTab : "meet");
