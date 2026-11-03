/* =========================================================
 * 3학년 영어 · 6~8단원 프로젝트 · 데이터
 *  - What's in my bag?  : Do you have a ___? / Yes, I do. / No, I don't.
 *  - Can you ~?         : Can you ___? / Yes, I can. / No, I can't.
 *  - 8단원 기분·나이      : How are you today? / I'm happy.
 *                         How old are you? / I'm ten years old.
 * ========================================================= */

/* ===== 이름 (쉬운 영어 이름, 성별) ===== */
const NAMES = {
  boy:  ["Tom", "Sam", "Ben", "Max", "Jack", "Leo", "Dan", "Tim", "Nick", "Ted", "Bob", "Joe"],
  girl: ["Amy", "Lily", "Mia", "Emma", "Kate", "Anna", "Jane", "Lucy", "Sue", "Ella", "Ruby", "Zoe"],
};
const GENDER = {
  boy:  { en: "boy",  ko: "남자", emoji: "👦" },
  girl: { en: "girl", ko: "여자", emoji: "👧" },
};

/* ===== 오늘의 기분 (8단원) ===== */
const MOODS = [
  { key: "happy",  en: "happy",  ko: "행복해요, 기뻐요", emoji: "😄", color: "#ffb703" },
  { key: "sad",    en: "sad",    ko: "슬퍼요",           emoji: "😢", color: "#4f8ef7" },
  { key: "angry",  en: "angry",  ko: "화가 나요",         emoji: "😠", color: "#ef476f" },
  { key: "hungry", en: "hungry", ko: "배가 고파요",       emoji: "🤤", color: "#f77f00" },
  { key: "tired",  en: "tired",  ko: "피곤해요",          emoji: "😪", color: "#8e7dbe" },
];

/* ===== 나이 (8단원) ===== */
const AGES = [
  { n: 8,  en: "eight",  ko: "여덟 살" },
  { n: 9,  en: "nine",   ko: "아홉 살" },
  { n: 10, en: "ten",    ko: "열 살" },
  { n: 11, en: "eleven", ko: "열한 살" },
  { n: 12, en: "twelve", ko: "열두 살" },
];

/* ===== 가방 속 물건 (What's in my bag?) =====
 * art: a / an / "" (가위·슬라임은 a 를 붙이지 않아요)
 */
const ITEMS = [
  { id: "pen",      en: "pen",          ko: "펜",      art: "a" },
  { id: "glue",     en: "glue stick",   ko: "딱풀",    art: "a" },
  { id: "ruler",    en: "ruler",        ko: "자",      art: "a" },
  { id: "eraser",   en: "eraser",       ko: "지우개",  art: "an" },
  { id: "notebook", en: "notebook",     ko: "공책",    art: "a" },
  { id: "crayon",   en: "crayon",       ko: "크레용",  art: "a" },
  { id: "pencil",   en: "pencil",       ko: "연필",    art: "a" },
  { id: "pcase",    en: "pencil case",  ko: "필통",    art: "a" },
  { id: "scissors", en: "scissors",     ko: "가위",    art: "" },
  { id: "book",     en: "book",         ko: "책",      art: "a" },
  { id: "bottle",   en: "water bottle", ko: "물병",    art: "a" },
  { id: "sticker",  en: "sticker",      ko: "스티커",  art: "a" },
  { id: "keyring",  en: "keyring",      ko: "키링",    art: "a" },
  { id: "keycap",   en: "keycap",       ko: "키캡",    art: "a" },
  { id: "slime",    en: "slime",        ko: "슬라임",  art: "" },
  { id: "umbrella", en: "umbrella",     ko: "우산",    art: "an" },
  { id: "lunchbox", en: "lunch box",    ko: "도시락",  art: "a" },
  { id: "bear",     en: "teddy bear",   ko: "곰 인형", art: "a" },
  { id: "apple",    en: "apple",        ko: "사과",    art: "an" },
  { id: "brush",    en: "paintbrush",   ko: "붓",      art: "a" },
];

/* ===== 할 수 있는 일 (Can you ~?) ===== */
const ACTIONS = [
  { id: "swim",       en: "swim",              ko: "수영하다",          can: "수영할", emoji: "🏊" },
  { id: "run",        en: "run fast",          ko: "빨리 달리다",       can: "빨리 달릴", emoji: "💨" },
  { id: "jump",       en: "jump rope",         ko: "줄넘기하다",        can: "줄넘기를 할", emoji: "🪢" },
  { id: "dance",      en: "dance",             ko: "춤추다",            can: "춤출", emoji: "💃" },
  { id: "skate",      en: "skate",             ko: "스케이트를 타다",   can: "스케이트를 탈", emoji: "⛸️" },
  { id: "ski",        en: "ski",               ko: "스키를 타다",       can: "스키를 탈", emoji: "⛷️" },
  { id: "soccer",     en: "play soccer",       ko: "축구하다",          can: "축구를 할", emoji: "⚽" },
  { id: "baseball",   en: "play baseball",     ko: "야구하다",          can: "야구를 할", emoji: "⚾" },
  { id: "badminton",  en: "play badminton",    ko: "배드민턴을 치다",   can: "배드민턴을 칠", emoji: "🏸" },
  { id: "climb",      en: "climb trees",       ko: "나무에 오르다",     can: "나무에 오를", emoji: "🌳" },
  { id: "bike",       en: "ride a bike",       ko: "자전거를 타다",     can: "자전거를 탈", emoji: "🚲" },
  { id: "horse",      en: "ride a horse",      ko: "말을 타다",         can: "말을 탈", emoji: "🐴" },
  { id: "cartwheel",  en: "do a cartwheel",    ko: "옆돌기를 하다",     can: "옆돌기를 할", emoji: "🤸" },
  { id: "sing",       en: "sing",              ko: "노래하다",          can: "노래할", emoji: "🎤" },
  { id: "draw",       en: "draw",              ko: "그림을 그리다",     can: "그림을 그릴", emoji: "🎨" },
  { id: "whistle",    en: "whistle",           ko: "휘파람을 불다",     can: "휘파람을 불", emoji: "😗" },
  { id: "cookies",    en: "make cookies",      ko: "쿠키를 만들다",     can: "쿠키를 만들", emoji: "🍪" },
  { id: "photos",     en: "take photos",       ko: "사진을 찍다",       can: "사진을 찍을", emoji: "📸" },
  { id: "drums",      en: "play drums",        ko: "드럼을 치다",       can: "드럼을 칠", emoji: "🥁" },
  { id: "piano",      en: "play the piano",    ko: "피아노를 치다",     can: "피아노를 칠", emoji: "🎹" },
  { id: "plane",      en: "make a paper plane", ko: "종이비행기를 만들다", can: "종이비행기를 만들", emoji: "✈️" },
  { id: "cook",       en: "cook",              ko: "요리하다",          can: "요리할", emoji: "🍳" },
  { id: "ramen",      en: "cook ramen",        ko: "라면을 끓이다",     can: "라면을 끓일", emoji: "🍜" },
  { id: "chopsticks", en: "use chopsticks",    ko: "젓가락을 쓰다",     can: "젓가락을 쓸", emoji: "🥢" },
  { id: "dishes",     en: "wash dishes",       ko: "설거지하다",        can: "설거지할", emoji: "🧽" },
  { id: "english",    en: "speak English",     ko: "영어로 말하다",     can: "영어로 말할", emoji: "🗣️" },
  { id: "shoes",      en: "tie your shoes",    ko: "신발 끈을 묶다",    can: "신발 끈을 묶을", emoji: "👟" },
  { id: "count",      en: "count to one hundred", ko: "100까지 세다",  can: "100까지 셀", emoji: "💯" },
];

/* ===== 문장 만들기 ===== */
const withArt = it => (it.art ? it.art + " " : "") + it.en;
// "Can you tie your shoes?" → 대답할 때는 "I can tie my shoes."
const mine = en => en.replace(/\byour\b/g, "my");
// 여러 개를 이어 말하기: "a pen, a ruler and an apple"
const listAnd = arr => arr.length < 2 ? arr.join("") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];

const SAY = {
  hi:        f => `Hi, I'm ${f.name}.`,
  nameQ:     () => "What's your name?",
  moodQ:     () => "How are you today?",
  moodA:     f => `I'm ${f.mood.en}.`,
  ageQ:      () => "How old are you?",
  ageA:      f => `I'm ${f.age.en} years old.`,
  haveQ:     it => `Do you have ${withArt(it)}?`,
  haveYes:   it => `Yes, I do. I have ${withArt(it)}.`,
  haveNo:    it => `No, I don't. I don't have ${withArt(it)}.`,
  canQ:      a => `Can you ${a.en}?`,
  canYes:    () => "Yes, I can.",
  canNo:     () => "No, I can't.",
  // 소개하기 (모든 표현을 한 번에)
  intro: f => [
    `Hi, I'm ${f.name}.`,
    `I'm ${f.age.en} years old.`,
    `I'm ${f.mood.en} today.`,
    `I have ${listAnd(f.items.map(withArt))}.`,
    `I can ${listAnd(f.actions.map(a => mine(a.en)))}.`,
  ],
};

/* 우리말 뜻 — 받침이 있으면 을/이, 없으면 를/가 */
const josa = (w, withB, noB) => {
  const c = w.charCodeAt(w.length - 1);
  return w + (c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 ? withB : noB);
};
const KO = {
  hi:      f => `안녕, 나는 ${f.name}(이)야.`,
  nameQ:   "네 이름은 뭐니?",
  moodQ:   "오늘 기분이 어때?",
  moodA:   f => `나는 ${f.mood.ko}.`,
  ageQ:    "너는 몇 살이니?",
  ageA:    f => `나는 ${f.age.ko}이야.`,
  haveQ:   it => `너는 ${josa(it.ko, "을", "를")} 가지고 있니?`,
  haveYes: it => `응, 있어. 나는 ${josa(it.ko, "을", "를")} 가지고 있어.`,
  haveNo:  it => `아니, 없어. 나는 ${josa(it.ko, "이", "가")} 없어.`,
  canQ:    a => `너는 ${a.can} 수 있니?`,
  canYes:  "응, 할 수 있어.",
  canNo:   "아니, 못 해.",
};
