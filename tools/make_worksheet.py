"""워크시트 만들기: 원래 워크시트(Lesson 7 Survey)의 글꼴·표 테두리·4선 칸을 그대로 써서
Meet My Friends 워크시트(2쪽)를 만들어요.
사용: python3 tools/make_worksheet.py tools/base_survey.hwpx worksheet/worksheet_MeetMyFriends.hwpx [미리보기.png]
"""
import re, sys, zipfile, itertools

src, out = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(src)
files = {n: z.read(n) for n in z.namelist()}
sec = files["Contents/section0.xml"].decode("utf-8")

head = sec[:sec.index("<hp:p ")]
first_p = re.search(r"<hp:p [^>]*>.*?</hp:p>", sec, re.S).group(0)
secpr_run = re.search(r'<hp:run charPrIDRef="18">(<hp:secPr.*?</hp:ctrl>)</hp:run>', first_p, re.S).group(1)
containers = re.findall(r"<hp:container.*?</hp:container>", sec, re.S)
C_WORD, C_SENT, C_SMALL = containers[0], containers[1], containers[14]

ids = itertools.count(1500000000)
inst = itertools.count(60000000)
def fresh(c):  # 복사한 4선 칸마다 새 번호
    c = re.sub(r'(<hp:container id=")\d+', lambda m: m.group(1) + str(next(ids)), c, count=1)
    return re.sub(r'instid="\d+"', lambda m: f'instid="{next(inst)}"', c)

def esc(t): return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def P(runs, para=22, page_break=False):
    """runs: [(charPr, text)] 또는 (charPr, text, raw앞부분)"""
    body = ""
    for r in runs:
        cp, txt = r[0], r[1]
        raw = r[2] if len(r) > 2 else ""
        body += f'<hp:run charPrIDRef="{cp}">{raw}' + (f"<hp:t>{esc(txt)}</hp:t>" if txt else "<hp:t/>") + "</hp:run>"
    return (f'<hp:p id="0" paraPrIDRef="{para}" styleIDRef="0" pageBreak="{1 if page_break else 0}" '
            f'columnBreak="0" merged="0">{body}</hp:p>')

def cell(col, row, w, h, bf, paras, cs=1, rs=1):
    return (f'<hp:tc name="" header="0" hasMargin="0" protect="0" editable="0" dirty="0" borderFillIDRef="{bf}">'
            f'<hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="CENTER" linkListIDRef="0" '
            f'linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">{"".join(paras)}</hp:subList>'
            f'<hp:cellAddr colAddr="{col}" rowAddr="{row}"/><hp:cellSpan colSpan="{cs}" rowSpan="{rs}"/>'
            f'<hp:cellSz width="{w}" height="{h}"/><hp:cellMargin left="510" right="510" top="141" bottom="141"/></hp:tc>')

def table(rows, ncols, width, height):
    return (f'<hp:tbl id="{next(ids)}" zOrder="{next(ids) % 1000}" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" '
            f'textFlow="BOTH_SIDES" lock="0" dropcapstyle="None" pageBreak="CELL" repeatHeader="1" rowCnt="{len(rows)}" '
            f'colCnt="{ncols}" cellSpacing="0" borderFillIDRef="4" noAdjust="1">'
            f'<hp:sz width="{width}" widthRelTo="ABSOLUTE" height="{height}" heightRelTo="ABSOLUTE" protect="0"/>'
            f'<hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" '
            f'vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/>'
            f'<hp:outMargin left="141" right="141" top="141" bottom="141"/><hp:inMargin left="510" right="510" top="141" bottom="141"/>'
            + "".join(f"<hp:tr>{''.join(r)}</hp:tr>" for r in rows) + "</hp:tbl>")

def tblP(tbl): return P([(17, "", tbl)], para=22)

def header(subtitle, first=False, page_break=False):
    title = "Lesson 6~8. Meet My Friends!"
    if first:
        t = (f'<hp:p id="0" paraPrIDRef="29" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0">'
             f'<hp:run charPrIDRef="18">{secpr_run}</hp:run><hp:run charPrIDRef="18"><hp:t>{esc(title)}</hp:t></hp:run></hp:p>')
    else:
        t = P([(18, title)], para=29, page_break=page_break)
    return (t + P([(33, subtitle)], para=29) + P([(7, "")], para=20)
            + P([(23, "3학년 1반  (    )번  이름 (              )")], para=21) + P([(8, "")], para=22))

out_p = []
# ================= 1쪽: 내가 선택한 AI 친구 =================
out_p.append(header("- 웹 앱에서 내가 선택한 AI 친구를 소개해 보기 -", first=True))
out_p.append(P([(22, "1. 웹 앱에서 선택한 내 AI 친구의 기록을 보고 적어 봅시다.  내 AI 친구는 ( 남자 / 여자 ) 친구예요.")]))
W = [4700, 16477, 33498]
rows = [[cell(0, 0, W[0], 1582, 16, [P([(20, "")], 27)]),
         cell(1, 0, W[1], 1582, 14, [P([(20, "단어")], 27)]),
         cell(2, 0, W[2], 1582, 15, [P([(20, "문장으로 적어 보기")], 27)])]]
items = [("이름", "Hi, I'm"), ("나이", "I'm            years old."), ("기분", "I'm"),
         ("물건 1", "I have a"), ("물건 2", "I have a"), ("물건 3", "I have a"),
         (["할 수 있는", "일 1"], "I can"), (["할 수 있는", "일 2"], "I can"), (["할 수 있는", "일 3"], "I can")]
H = 3806
for i, (lab, sent) in enumerate(items, start=1):
    labp = [P([(32, lab)], 31)] if isinstance(lab, str) else [P([(26, x)], 31) for x in lab]
    rows.append([cell(0, i, W[0], H, 17, labp),
                 cell(1, i, W[1], H, 4, [P([(13, "", fresh(C_WORD))], 31)]),
                 cell(2, i, W[2], H, 9, [P([(34, sent, fresh(C_SENT))], 32)])])
out_p.append(tblP(table(rows, 3, sum(W), 1582 + H * len(items))))
out_p.append(P([(8, "")], para=22))
out_p.append(P([(28, "2. 내 AI 친구의 얼굴을 그리고, 내 AI 친구가 되어 자기소개를 완성해 봅시다.")], para=23))
W2 = [15500, 39175]
intro = ["Hi, I'm ________________.", "I'm __________ years old.", "I'm __________ today.",
         "I have a __________,", "     a __________ and a __________.", "I can __________, __________", "     and __________."]
rows2 = [[cell(0, 0, W2[0], 1582, 16, [P([(20, "내 AI 친구 얼굴")], 27)]),
          cell(1, 0, W2[1], 1582, 15, [P([(20, "자기소개 (다 쓰면 소리 내어 읽어 봐요!)")], 27)])],
         [cell(0, 1, W2[0], 17000, 17, [P([(20, "")], 27)]),
          cell(1, 1, W2[1], 17000, 9, [P([(37, t)], 33) for t in intro])]]
out_p.append(tblP(table(rows2, 2, sum(W2), 1582 + 17000)))

# ================= 2쪽: 친구들의 AI 친구 =================
out_p.append(header("- 친구들의 AI 친구를 만나 묻고 답해 보기 -", page_break=True))
out_p.append(P([(28, "1. 친구들을 만나 친구의 AI 친구에게 영어로 질문하고, 알게 된 것을 적어 봅시다.")], para=23))
out_p.append(P([(28, "   (가지고 있는 물건과 할 수 있는 일은 친구가 Yes 라고 대답한 것을 적어요.)")], para=23))
WQ = [3925, 50865]
rowsq = [[cell(0, 0, WQ[0], 3000, 6, [P([(24, "질문")], 30)]),
          cell(1, 0, WQ[1], 3000, 7, [P([(15, "What's your name?    How old are you?    How are you today?")], 33),
                                       P([(15, "Do you have a ________?    Can you ________?")], 33)])],
         [cell(0, 1, WQ[0], 3000, 10, [P([(24, "대답")], 30)]),
          cell(1, 1, WQ[1], 3000, 9, [P([(35, "Hi, I'm ____.    I'm ____ years old.    I'm happy / sad / angry / hungry / tired.")], 33),
                                       P([(35, "Yes, I do. / No, I don't.        Yes, I can. / No, I can't.")], 33)])]]
out_p.append(tblP(table(rowsq, 2, sum(WQ), 6000)))
out_p.append(P([(8, "")], para=22))
WM = [2600, 7400, 7900, 6800, 7600, 11245, 11245]
heads = [("번호", ""), ("반 친구 이름", ""), ("AI 친구 이름", "What's your name?"), ("나이", "How old are you?"),
         ("기분", "How are you today?"), ("가지고 있는 물건", "Do you have a ___?"), ("할 수 있는 일", "Can you ___?")]
HB = 3400
bfh = [16] + [14] * 5 + [15]
rowsm = [[cell(c, 0, WM[c], HB, bfh[c], [P([(24, k)], 27)] + ([P([(26, e)], 27)] if e else []))
          for c, (k, e) in enumerate(heads)]]
NR, HR = 9, 4200
for r in range(1, NR + 1):
    rowsm.append([cell(0, r, WM[0], HR, 17, [P([(32, str(r))], 31)])] +
                 [cell(c, r, WM[c], HR, 9 if c == len(WM) - 1 else 4, [P([(13, "")], 31)]) for c in range(1, len(WM))])
out_p.append(tblP(table(rowsm, len(WM), sum(WM), HB + HR * NR)))

xml = head + "".join(out_p) + "</hs:sec>"
files["Contents/section0.xml"] = xml.encode("utf-8")
files["Preview/PrvText.txt"] = "Lesson 6~8. Meet My Friends!\r\n- 웹 앱에서 내가 선택한 AI 친구를 소개해 보기 -\r\n- 친구들의 AI 친구를 만나 묻고 답해 보기 -\r\n".encode("utf-8")
hpf = files["Contents/content.hpf"].decode("utf-8").replace("<opf:title>Lesson 5</opf:title>", "<opf:title>Meet My Friends</opf:title>")
files["Contents/content.hpf"] = hpf.encode("utf-8")
if len(sys.argv) > 3:
    files["Preview/PrvImage.png"] = open(sys.argv[3], "rb").read()

with zipfile.ZipFile(out, "w") as o:
    for info in z.infolist():   # mimetype 은 맨 앞, 압축 없이
        n = info.filename
        o.writestr(n, files[n], compress_type=zipfile.ZIP_STORED if n == "mimetype" else zipfile.ZIP_DEFLATED)
print("ok", out, len(xml))
