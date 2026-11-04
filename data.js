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

/* ===== 할 수 있는 일 (6단원 Can you ~?) =====
 * 6단원 교과서 표현 중심, 쉬운 것만 · 빈칸은 세 낱말까지
 */
const ACTIONS = [
  { id: "swim",      en: "swim",           ko: "수영하다",        can: "수영할",         emoji: "🏊" },
  { id: "skate",     en: "skate",          ko: "스케이트를 타다", can: "스케이트를 탈",  emoji: "⛸️" },
  { id: "ski",       en: "ski",            ko: "스키를 타다",     can: "스키를 탈",      emoji: "⛷️" },
  { id: "run",       en: "run",            ko: "달리다",          can: "달릴",           emoji: "🏃" },
  { id: "jump",      en: "jump",           ko: "뛰다",            can: "뛸",             emoji: "🦘" },
  { id: "dance",     en: "dance",          ko: "춤추다",          can: "춤출",           emoji: "💃" },
  { id: "sing",      en: "sing",           ko: "노래하다",        can: "노래할",         emoji: "🎤" },
  { id: "draw",      en: "draw",           ko: "그림을 그리다",   can: "그림을 그릴",    emoji: "🎨" },
  { id: "cook",      en: "cook",           ko: "요리하다",        can: "요리할",         emoji: "🍳" },
  { id: "runfast",   en: "run fast",       ko: "빨리 달리다",     can: "빨리 달릴",      emoji: "💨" },
  { id: "jumprope",  en: "jump rope",      ko: "줄넘기하다",      can: "줄넘기를 할",    emoji: "🪢" },
  { id: "soccer",    en: "play soccer",    ko: "축구하다",        can: "축구를 할",      emoji: "⚽" },
  { id: "baseball",  en: "play baseball",  ko: "야구하다",        can: "야구를 할",      emoji: "⚾" },
  { id: "badminton", en: "play badminton", ko: "배드민턴을 치다", can: "배드민턴을 칠",  emoji: "🏸" },
  { id: "bike",      en: "ride a bike",    ko: "자전거를 타다",   can: "자전거를 탈",    emoji: "🚲" },
  { id: "piano",     en: "play the piano", ko: "피아노를 치다",   can: "피아노를 칠",    emoji: "🎹" },
];

/* ===== 문장 만들기 ===== */
const withArt = it => (it.art ? it.art + " " : "") + it.en;
const mine = en => en;
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

/* ===== 낱말 뜻 사전 (문장 속 낱말을 누르면 뜻과 소리) ===== */
const NAME_KO = {
  Tom: "톰", Sam: "샘", Ben: "벤", Max: "맥스", Jack: "잭", Leo: "레오", Dan: "댄", Tim: "팀", Nick: "닉", Ted: "테드", Bob: "밥", Joe: "조",
  Amy: "에이미", Lily: "릴리", Mia: "미아", Emma: "에마", Kate: "케이트", Anna: "애나", Jane: "제인", Lucy: "루시", Sue: "수", Ella: "엘라", Ruby: "루비", Zoe: "조이",
};
const WORD_KO = {
  // 묻고 답하기
  "hi": "안녕 (만났을 때 하는 인사)",
  "i": "나, 나는",
  "i'm": "나는 ~이야 (I am 을 줄인 말)",
  "my": "나의",
  "you": "너, 너는",
  "your": "너의",
  "what's": "무엇이니? (What is 를 줄인 말)",
  "name": "이름",
  "how": "어떻게, 얼마나 (How old? 몇 살?)",
  "are": "~이니, ~이다 (you 와 함께 써요)",
  "old": "나이가 ~인 (How old ~? 몇 살이니?)",
  "years": "해, 년 (years old : ~살)",
  "today": "오늘",
  "do": "~하니? (Do you ~? 너는 ~하니?)",
  "don't": "~하지 않아 (do not 을 줄인 말)",
  "have": "가지고 있다",
  "can": "~할 수 있다 (Can you ~? 너는 ~할 수 있니?)",
  "can't": "~할 수 없다, 못 하다 (cannot 을 줄인 말)",
  "yes": "응, 네",
  "no": "아니, 아니요",
  "a": "하나의 (물건 앞에 붙여요)",
  "an": "하나의 (a, e, i, o, u 소리 앞에 붙여요)",
  "the": "그 (악기 이름 앞에 붙여요: the piano)",
  "and": "그리고, ~와",
  "excellent": "아주 잘했어요!",
  // 기분
  "happy": "행복한, 기쁜", "sad": "슬픈", "angry": "화가 난", "hungry": "배고픈", "tired": "피곤한",
  // 나이
  "eight": "8, 여덟", "nine": "9, 아홉", "ten": "10, 열", "eleven": "11, 열하나", "twelve": "12, 열둘",
  // 물건
  "pen": "펜", "glue": "풀", "stick": "막대 (glue stick : 딱풀)", "ruler": "자", "eraser": "지우개", "notebook": "공책",
  "crayon": "크레용", "pencil": "연필", "case": "통, 상자 (pencil case : 필통)", "scissors": "가위", "book": "책",
  "water": "물", "bottle": "병 (water bottle : 물병)", "sticker": "스티커", "keyring": "키링, 열쇠고리", "keycap": "키캡 (키보드 단추)",
  "slime": "슬라임", "umbrella": "우산", "lunch": "점심", "box": "상자 (lunch box : 도시락)", "teddy": "테디 (teddy bear : 곰 인형)",
  "bear": "곰", "apple": "사과", "paintbrush": "붓",
  // 할 수 있는 일
  "swim": "수영하다", "skate": "스케이트를 타다", "ski": "스키를 타다", "run": "달리다", "jump": "뛰다, 점프하다",
  "dance": "춤추다", "sing": "노래하다", "draw": "그림을 그리다", "cook": "요리하다", "fast": "빨리",
  "rope": "줄 (jump rope : 줄넘기하다)", "play": "(운동을) 하다, (악기를) 치다", "soccer": "축구", "baseball": "야구",
  "badminton": "배드민턴", "ride": "타다", "bike": "자전거", "piano": "피아노",
};
const wordKey = w => String(w).toLowerCase().replace(/[’‘]/g, "'").replace(/^[^a-z']+|[^a-z']+$/g, "");
function meaningOf(word) {
  const clean = String(word).replace(/[’‘]/g, "'").replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
  const k = wordKey(word);
  const name = Object.keys(NAME_KO).find(n => n.toLowerCase() === k);
  if (name) {
    const g = NAMES.boy.includes(name) ? "남자" : "여자";
    return { word: name, ko: `${NAME_KO[name]} (${g} 친구 이름)` };
  }
  return { word: clean, ko: WORD_KO[k] || "" };
}
