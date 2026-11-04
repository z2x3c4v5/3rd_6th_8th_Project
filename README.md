# 👫 Meet My Friends! · 3학년 6~8단원 프로젝트

초등학교 **3학년** 학생들이 **6~8단원 주요 표현을 한 번에** 써 보는 웹 앱입니다.
가상의 친구 **10명**을 만나 묻고 답하면서 친구의 기분·나이·가방 속 물건·할 수 있는 일을 알아내요.

| 단원 | 주요 표현 | 앞서 쓴 웹 앱 |
|------|-----------|---------------|
| 🎒 What's in my bag? | `Do you have a(n) ___?` / `Yes, I do. I have a(n) ___.` / `No, I don't. I don't have a(n) ___.` | `3th_What-s_in_my_bag` |
| 💪 Can you ~? | `Can you ___?` / `Yes, I can.` / `No, I can't.` | `3rd_grade_Can_You_` |
| 😊 8단원 | `How are you today?` / `I'm happy.` (happy · sad · angry · hungry · tired)<br>`How old are you?` / `I'm ten years old.` | – |

## 가상의 친구 10명

**🎲 새 친구 10명** 버튼을 누를 때마다 친구들이 무작위로 새로 만들어집니다. (6학년 `6th_comparison` 의 'AI 친구 만들기' 방식을 3학년에 맞게 쉽게 바꾸었어요.)

- **이름** : 쉬운 영어 이름, 남자 5명 · 여자 5명 (Tom, Sam, Ben… / Amy, Lily, Mia…)
- **오늘의 기분** : happy · sad · angry · hungry · tired 중 하나 (기분마다 2명씩) — 기분에 따라 **얼굴 표정이 바뀌어요**
- **나이** : eight ~ twelve (기분과 나이가 둘 다 같은 친구는 없어요)
- **가방 속 물건 3개** : What's in my bag? 앱의 물건 20개 중에서 (같은 그림 사용)
- **할 수 있는 일 3가지** : 6단원 쉬운 표현 16개에서 (빈칸은 세 낱말까지)
  swim · skate · ski · run · jump · dance · sing · draw · cook · run fast · jump rope · play soccer · play baseball · play badminton · ride a bike · play the piano
- **그림** : Canva 로 만든 친구 10명(남자 5 · 여자 5), 표정 6가지 — `img/sheets/README.md` 참고

만든 친구들과 알아낸 내용은 브라우저에 저장되어 새로고침해도 그대로예요.

## 탭 3개

1. **👫 친구 만나기** — 친구 카드를 누르면 `What's your name?` → `Hi, I'm Tom.`
   - 😊 **기분** · 🎂 **나이** : 질문을 듣고 **❓ 카드**를 누르면 친구가 대답해요. 기분을 알아내면 얼굴 표정이 바뀌어요.
   - 🎒 **가방** : 물건 9개 중 하나를 눌러 `Do you have ~?` 하고 물으면 친구가 `Yes, I do.` / `No, I don't.` 로 대답해요. 3개를 모두 찾아요.
   - 💪 **할 수 있는 일** : 행동 9개 중 하나를 눌러 `Can you ~?` → `Yes, I can.` / `No, I can't.` 3가지를 모두 찾아요.
   - 모두 알아내면 🎉 와 함께 **📢 자기소개**가 열려요.
     > Hi, I'm Tom. I'm ten years old. I'm happy today. I have a pen, a ruler and an apple. I can swim, dance and cook.
   - 친구 목록 카드에는 알아낸 항목(😊🎂🎒💪)이 표시돼요. `👀 정답 모두 보기` 로 선생님이 바로 보여 줄 수도 있어요.
2. **🎤 내 문장 연습** — *친구 만나기* 에서 문장 옆 **☆** 를 눌러 담은 문장만 모아요.
   친구를 다 알아내면 **⭐ 자기소개 문장 모두 담기** → **🎤 내 문장 연습하러 가기** 로 바로 넘어와요.
   문장마다 🔊 듣기 · 🎤 말하기 · 최고 정확도 · 연습 횟수가 나오고, 80% 이상이면 ✅. ✕ 로 뺄 수 있어요.
3. **📖 주요 표현** — 기분 5가지, 나이 5가지, 물건 20개, 행동 28개와 질문·대답 문장을 모아 두었어요.

모든 문장에 🔊 **듣기**와 🎤 **따라 말하기**(정확도 %, 낱말별 초록/빨강 표시)가 있어요.
친구 목소리는 남자/여자에 따라 높이가 조금 달라요. 아래 **말하기 속도** 슬라이더로 빠르기를 바꿀 수 있어요.

## 수업 활용 예

- **짝 활동** : 한 명은 질문하고, 한 명은 친구 카드를 눌러 대답 확인 → 역할 바꾸기
- **모둠 미션** : 모둠마다 친구 2~3명을 맡아 모두 알아낸 뒤, 그 친구가 되어 자기소개 발표
- **마무리** : *내 문장 연습* 에서 담은 자기소개 문장으로 말하기 연습 → 발표

## 사용 방법 · 배포

`index.html` 을 크롬/엣지에서 열면 됩니다. 설치할 것이 없어요.
(음성 인식은 크롬·엣지, 마이크 허용, HTTPS 또는 로컬 파일에서 동작합니다.)

빌드가 필요 없는 **정적 사이트**라 Vercel 에 그대로 올리면 됩니다.
Framework Preset 은 `Other`, Build Command·Output Directory 는 비워 두세요.
`vercel.json` 에 마이크 허용(`Permissions-Policy: microphone=(self)`) 설정이 들어 있어요.
GitHub Pages(Settings → Pages)로 열어도 됩니다.

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 화면 구조 (탭 3개) |
| `style.css`  | 디자인 (밝은 사탕 색, Jua · Fredoka 글꼴) |
| `data.js`    | 이름·기분·나이·물건·행동·문장 데이터 |
| `avatar.js`  | 친구 그림 (Canva 그림 · 없으면 SVG 얼굴) |
| `img/sheets/` | Canva 친구 그림 10장 |
| `pics.js`    | 물건 그림 20개 (What's in my bag? 와 같은 그림) |
| `app.js`     | 친구 만들기, 묻고 답하기, 내 문장 연습, 음성·발음 채점 |
| `vercel.json` | Vercel 배포 설정 |

## 그림

물건 그림은 What's in my bag? 앱과 같습니다: [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (Microsoft, MIT) 와 같은 질감으로 직접 그린 그림(딱풀·지우개·필통·물병·키캡·슬라임). 파일 안에 들어 있어 인터넷 없이도 보입니다.
친구 얼굴은 `avatar.js` 에서 SVG 로 직접 그립니다.
