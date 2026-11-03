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

/* ---------- 친구 10명 만들기 ---------- */
const COUNT = 10, CHOICES = 9;
function makeFriends() {
  const genders = shuffle(Array(COUNT / 2).fill("boy").concat(Array(COUNT / 2).fill("girl")));
  const names = { boy: shuffle(NAMES.boy), girl: shuffle(NAMES.girl) };
  const moods = shuffle(MOODS.flatMap(m => [m.key, m.key]));       // 기분마다 2명씩
  const used = new Set();
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
      look: makeLook(gender),
      seen: { hi: false, mood: false, age: false, asked: [], askedCan: [] },
    };
  });
}
let friends = store.get("friends-v1", null);
if (!Array.isArray(friends) || friends.length !== COUNT) { friends = makeFriends(); }
const save = () => store.set("friends-v1", friends);
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
function pickVoice() {
  const vs = speechSynthesis.getVoices().filter(v => /^en[-_]US/i.test(v.lang));
  voice = vs.find(v => /Google|Samantha|Aria|Jenny|Zira/i.test(v.name)) || vs[0] || null;
}
if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
// lines: [{ text, who: "me" | friend 객체 }] 를 차례로 말해요
function speak(lines) {
  if (!("speechSynthesis" in window)) return;
  if (typeof lines === "string") lines = [{ text: lines }];
  speechSynthesis.cancel();
  lines.forEach(({ text, who }) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = who && who.gender ? (who.gender === "girl" ? 1.45 : 1.2) : 1;
    speechSynthesis.speak(u);
  });
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
function listen(line, text) {
  if (!SR) return;
  if (rec) { try { rec.abort(); } catch (e) {} }
  speechSynthesis.cancel();
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
  };
  rec.onerror = ev => {
    res.innerHTML = `<span class="heard">${{ "not-allowed": "마이크 사용을 허용해 주세요.", "no-speech": "소리가 안 들렸어요. 다시 눌러서 말해 보세요.", "audio-capture": "마이크를 찾을 수 없어요." }[ev.error] || "다시 한 번 눌러 보세요."}</span>`;
  };
  rec.onend = () => { mic.classList.remove("on"); rec = null; };
  try { rec.start(); } catch (e) { mic.classList.remove("on"); }
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/* 한 문장 줄: 낱말 + 🔊 + 🎤 + 결과 */
function line(text, ko, who, cls = "") {
  const words = text.split(" ").map(w => `<span class="w">${esc(w)}</span>`).join(" ");
  return `<div class="line ${cls}" data-text="${esc(text)}" data-who="${who && who.gender ? who.id : ""}">
    <div class="sen">${words}</div>${ko ? `<div class="ko">${esc(ko)}</div>` : ""}
    <div class="ctl"><button class="rbtn say" type="button" aria-label="듣기">🔊</button><button class="rbtn mic" type="button" aria-label="따라 말하기" ${SR ? "" : "disabled"}>🎤</button></div><div class="res"></div>
  </div>`;
}
function wireLines(root) {
  root.querySelectorAll(".line").forEach(el => {
    const text = el.dataset.text, who = el.dataset.who !== "" ? friends[+el.dataset.who] : null;
    el.querySelector(".say").addEventListener("click", () => speak([{ text, who }]));
    el.querySelector(".mic").addEventListener("click", () => listen(el, text));
  });
}

function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
}
function cheer() {
  const box = document.createElement("div"); box.className = "confetti";
  box.innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="left:${rnd(100)}%;animation-delay:${(i % 7) * 0.08}s;background:${LOOKS.shirt[i % LOOKS.shirt.length]}"></i>`).join("");
  document.body.appendChild(box); setTimeout(() => box.remove(), 2200);
}

/* ---------- 탭 ---------- */
const TABS = ["meet", "quiz", "words"];
function showTab(id) {
  TABS.forEach(t => { $(t).hidden = t !== id; $("t-" + t).setAttribute("aria-selected", t === id); });
  store.set("tab", id);
  if (id === "meet") renderGrid();
  if (id === "quiz") renderQuiz();
  if (id === "words") renderWords();
}
TABS.forEach(t => $("t-" + t).addEventListener("click", () => { speechSynthesis.cancel(); showTab(t); }));

/* =========================================================
 * 1. 친구 만나기
 * ========================================================= */
let current = null;
function renderGrid() {
  $("grid-view").hidden = current !== null; $("profile").hidden = current === null;
  if (current !== null) return renderProfile();
  $("met").textContent = `🏅 다 알아본 친구 ${friends.filter(isDone).length} / ${COUNT}`;
  $("grid").innerHTML = friends.map(f => {
    const p = progress(f), F = full(f);
    return `<button class="card${isDone(f) ? " done" : ""}" data-id="${f.id}" type="button">
      <span class="ava">${avatarSVG(f, f.seen.mood ? f.mood : null)}</span>
      <span class="nm">${f.name}</span>
      <span class="gd ${f.gender}">${GENDER[f.gender].emoji} ${GENDER[f.gender].en}</span>
      <span class="dots">${["😊", "🎂", "🎒", "💪"].map((e, i) => `<i class="${p[i] ? "on" : ""}" title="${["기분", "나이", "가방", "할 수 있는 일"][i]}">${e}</i>`).join("")}</span>
      ${isDone(f) ? `<span class="badge">✓</span>` : ""}
    </button>`;
  }).join("");
  $("grid").querySelectorAll(".card").forEach(c => c.addEventListener("click", () => openFriend(+c.dataset.id)));
}
function openFriend(id) {
  current = id; renderGrid(); window.scrollTo({ top: 0, behavior: "smooth" });
  const f = friends[id];
  speak([{ text: SAY.nameQ(), who: null }, { text: SAY.hi(f), who: f }]);
  if (!f.seen.hi) { f.seen.hi = true; save(); }
}
$("back").addEventListener("click", () => { current = null; speechSynthesis.cancel(); renderGrid(); });
$("prev").addEventListener("click", () => openFriend((current + COUNT - 1) % COUNT));
$("next").addEventListener("click", () => openFriend((current + 1) % COUNT));
$("shuffle").addEventListener("click", () => {
  if (!confirm("새 친구 10명을 만들까요? 지금 친구들은 사라져요.")) return;
  friends = makeFriends(); save(); quiz = null; renderGrid(); toast("🎲 새 친구 10명이 왔어요!");
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
        <div class="tag"><b>${f.name}</b><span class="gd ${f.gender}">${GENDER[f.gender].emoji} ${GENDER[f.gender].en} · ${GENDER[f.gender].ko}</span></div>
        <div class="chat">${line(SAY.nameQ(), KO.nameQ, null, "q")}${line(SAY.hi(f), KO.hi(f), f, "a")}</div>
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
      ${isDone(f) ? SAY.intro(F).map(t => line(t, "", f, "a")).join("") + `<p class="tip">이제 ${f.name}(이)가 되어 자기소개를 해 볼까요? 🎤</p>`
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
  $("show-all").addEventListener("click", () => {
    if (!confirm(`${f.name}의 정답을 모두 볼까요?`)) return;
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
 * 2. 누구일까요? (힌트 듣고 친구 맞히기)
 * ========================================================= */
let quiz = null, score = store.get("score", 0), lastPick = -1;
function hintsFor(f) {
  const F = full(f);
  return [
    { t: `I have ${withArt(F.items[0])}.`, ic: "🎒" },
    { t: `I can ${mine(F.actions[0].en)}.`, ic: "💪" },
    { t: `I'm ${F.mood.en} today.`, ic: "😊" },
    { t: `I'm ${F.age.en} years old.`, ic: "🎂" },
    { t: `I have ${withArt(F.items[1])} and ${withArt(F.items[2])}.`, ic: "🎒" },
    { t: `I can ${mine(F.actions[1].en)} and ${mine(F.actions[2].en)}.`, ic: "💪" },
  ];
}
// 친구 만나기에서 알아낸 것만 보여 줘요
function known(g) {
  const bits = [];
  if (g.seen.mood) bits.push(`<i title="${g.mood}">${moodByKey[g.mood].emoji}</i>`);
  if (g.seen.age) bits.push(`<i class="age">${g.age}</i>`);
  foundItems(g).forEach(id => bits.push(`<i class="pic" title="${itemById[id].en}">${ITEM_PICS[id]}</i>`));
  foundActs(g).forEach(id => bits.push(`<i title="${actById[id].en}">${actById[id].emoji}</i>`));
  return `<span class="known">${bits.join("") || "<em>아직 몰라요</em>"}</span>`;
}
function newQuiz() {
  let pickId; do { pickId = rnd(COUNT); } while (pickId === lastPick);
  lastPick = pickId; quiz = { id: pickId, shown: 1, wrong: [], solved: false };
  renderQuiz(); speakHint(0);
}
function speakHint(i) { const f = friends[quiz.id]; speak([{ text: hintsFor(f)[i].t, who: f }]); }
function renderQuiz() {
  $("score").textContent = `⭐ ${score}`;
  if (!quiz) {
    $("qz").innerHTML = `<div class="qz-start"><div class="mystery">?</div><p>친구 한 명이 몰래 자기 이야기를 해요.<br>잘 듣고 누구인지 찾아보세요!</p>
      <button class="btn big" id="qz-go" type="button">▶ 시작하기</button></div>`;
    $("qz-go").addEventListener("click", newQuiz); return;
  }
  const f = friends[quiz.id], H = hintsFor(f), stars = Math.max(1, H.length + 1 - quiz.shown);
  $("qz").innerHTML = `
    <div class="qz-top">
      <div class="mystery ${quiz.solved ? "solved" : ""}">${quiz.solved ? avatarSVG(f, f.mood) : "?"}</div>
      <div class="hints">
        <h3>${quiz.solved ? `정답! <b>${f.name}</b> 🎉` : "Who am I? 나는 누구일까요?"} <span class="stars">${"⭐".repeat(stars)}</span></h3>
        ${H.slice(0, quiz.shown).map((h, i) => `<div class="hint"><span class="hic">${h.ic}</span>${line(h.t, "", f, "a")}</div>`).join("")}
        <div class="qz-btns">
          ${quiz.solved ? `<button class="btn big" id="qz-next" type="button">▶ 다음 문제</button>`
            : quiz.shown < H.length ? `<button class="btn" id="qz-more" type="button">💡 힌트 더 듣기 (${quiz.shown}/${H.length})</button>` : `<span class="tip">힌트를 모두 들었어요!</span>`}
        </div>
      </div>
    </div>
    <p class="tip">${quiz.solved ? "" : friends.some(g => g.seen.mood || g.seen.asked.length)
      ? "이 친구는 누구일까요? 카드 아래에 <b>내가 알아낸 정보</b>가 있어요. 잘 보고 골라요!"
      : "💡 <b>친구 만나기</b>에서 친구들에게 먼저 물어보고 오면 훨씬 쉽게 맞힐 수 있어요!"}</p>
    <div class="grid small">${friends.map(g => `<button class="card mini${quiz.wrong.includes(g.id) ? " wrong" : ""}${quiz.solved && g.id === f.id ? " right" : ""}" data-id="${g.id}" type="button" ${quiz.solved || quiz.wrong.includes(g.id) ? "disabled" : ""}>
      <span class="ava">${avatarSVG(g)}</span><span class="nm">${g.name}</span>${known(g)}</button>`).join("")}</div>`;
  wireLines($("qz"));
  const more = $("qz-more"); if (more) more.addEventListener("click", () => { quiz.shown++; renderQuiz(); speakHint(quiz.shown - 1); });
  const nx = $("qz-next"); if (nx) nx.addEventListener("click", newQuiz);
  $("qz").querySelectorAll(".card.mini").forEach(c => c.addEventListener("click", () => {
    const g = friends[+c.dataset.id];
    if (g.id === f.id) {
      quiz.solved = true; score += stars; store.set("score", score); cheer();
      speak([{ text: `Yes! I'm ${f.name}.`, who: f }]); renderQuiz();
    } else {
      quiz.wrong.push(g.id); speak([{ text: `No. I'm ${g.name}.`, who: g }]); toast(`🙅 ${g.name}이(가) 아니에요. 힌트를 다시 들어 봐요!`); renderQuiz();
    }
  }));
}

/* =========================================================
 * 3. 주요 표현
 * ========================================================= */
function renderWords() {
  if ($("wd").dataset.ready) return;
  const sample = ITEMS.find(i => i.id === "pencil"), sampleAct = ACTIONS.find(a => a.id === "swim");
  const group = (title, cls, html) => `<article class="box ${cls}"><h3>${title}</h3>${html}</article>`;
  $("wd").innerHTML =
    group("😊 오늘의 기분 (8단원)", "b-mood", line(SAY.moodQ(), KO.moodQ, null, "q") +
      `<div class="moods">${MOODS.map(m => `<div class="mood"><span class="em">${m.emoji}</span>${line(`I'm ${m.en}.`, m.ko, null, "a")}</div>`).join("")}</div>`) +
    group("🎂 나이 (8단원)", "b-age", line(SAY.ageQ(), KO.ageQ, null, "q") +
      AGES.map(a => line(`I'm ${a.en} years old.`, `나는 ${a.ko}이야.`, null, "a")).join("")) +
    group("🎒 가방 속 물건 — What's in my bag?", "b-bag", line(SAY.haveQ(sample), KO.haveQ(sample), null, "q") +
      line(SAY.haveYes(sample), KO.haveYes(sample), null, "a yes") + line(SAY.haveNo(sample), KO.haveNo(sample), null, "a no") +
      `<div class="mini-items">${ITEMS.map(i => `<button class="ch" data-say="${esc(withArt(i))}" type="button"><span class="pic">${ITEM_PICS[i.id]}</span><span>${i.en}</span><small>${i.ko}</small></button>`).join("")}</div>`) +
    group("💪 할 수 있는 일 — Can you ~?", "b-can", line(SAY.canQ(sampleAct), KO.canQ(sampleAct), null, "q") +
      line(SAY.canYes(), KO.canYes, null, "a yes") + line(SAY.canNo(), KO.canNo, null, "a no") +
      `<div class="mini-items">${ACTIONS.map(a => `<button class="ch" data-say="${esc(SAY.canQ(a))}" type="button"><span class="em">${a.emoji}</span><span>${a.en}</span><small>${a.ko}</small></button>`).join("")}</div>`);
  wireLines($("wd"));
  $("wd").querySelectorAll("[data-say]").forEach(b => b.addEventListener("click", () => speak(b.dataset.say)));
  $("wd").dataset.ready = "1";
}

/* ---------- 시작 ---------- */
const firstTab = store.get("tab", "meet");
showTab(TABS.includes(firstTab) ? firstTab : "meet");
