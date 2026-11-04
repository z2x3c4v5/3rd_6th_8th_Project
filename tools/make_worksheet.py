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

def header(subtitle, first=False, page_break=False, secpr=None):
    title = "Lesson 6~8. Meet My Friends!"
    if first:
        t = (f'<hp:p id="0" paraPrIDRef="29" styleIDRef="0" pageBreak="0" columnBreak="0" merged="0">'
             f'<hp:run charPrIDRef="18">{secpr or secpr_run}</hp:run><hp:run charPrIDRef="18"><hp:t>{esc(title)}</hp:t></hp:run></hp:p>')
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
H = 3650
for i, (lab, sent) in enumerate(items, start=1):
    labp = [P([(32, lab)], 31)] if isinstance(lab, str) else [P([(26, x)], 31) for x in lab]
    rows.append([cell(0, i, W[0], H, 17, labp),
                 cell(1, i, W[1], H, 4, [P([(13, "", fresh(C_WORD))], 31)]),
                 cell(2, i, W[2], H, 9, [P([(34, sent, fresh(C_SENT))], 32)])])
out_p.append(tblP(table(rows, 3, sum(W), 1582 + H * len(items))))
out_p.append(P([(28, "2. 내 AI 친구의 얼굴을 그리고, 내 AI 친구가 되어 자기소개를 영어 칸에 써 봅시다.")], para=23))
out_p.append(P([(28, "   (물건 3개와 할 수 있는 일 3가지는 위의 표에서 순서대로 옮겨 써요.)")], para=23))
W2 = [21177, 33498]          # 오른쪽은 1번 표 문장 칸과 같은 너비 (4선 칸이 꼭 맞아요)
intro = ["Hi, I'm", "I'm            years old.", "I'm            today.", "I have a", "a                    and a",
         "I can", "and"]
HI = 3500
rows2 = [[cell(0, 0, W2[0], 1582, 16, [P([(20, "내 AI 친구 얼굴")], 27)]),
          cell(1, 0, W2[1], 1582, 15, [P([(20, "자기소개 (다 쓰면 소리 내어 읽어 봐요!)")], 27)])]]
for i, t in enumerate(intro, start=1):
    r = []
    if i == 1:
        r.append(cell(0, 1, W2[0], HI * len(intro), 18, [P([(20, "")], 27)], rs=len(intro)))
    r.append(cell(1, i, W2[1], HI, 13 if i == len(intro) else 9, [P([(34, t, fresh(C_SENT))], 32)]))
    rows2.append(r)
out_p.append(tblP(table(rows2, 2, sum(W2), 1582 + HI * len(intro))))

# ================= 2쪽: 친구들의 AI 친구 (가로 방향, 새 구역) =================
# 한글은 가로 용지를 landscape="NARROWLY" 로 적고, 너비·높이는 세로 기준(A4) 그대로 둬요.
M2 = 2268   # 여백 8 mm
secpr2 = re.sub(r'<hp:pagePr landscape="\w+"', '<hp:pagePr landscape="NARROWLY"', secpr_run)
secpr2 = re.sub(r'<hp:margin header="0" footer="0" gutter="0" left="\d+" right="\d+" top="\d+" bottom="\d+"/>',
                f'<hp:margin header="0" footer="0" gutter="0" left="{M2}" right="{M2}" top="{M2}" bottom="{M2}"/>', secpr2)
TW2 = 84186 - 2 * M2        # 가로 쪽 본문 너비

# 영어 4선 칸: 칸 너비에 맞게 늘어나는 작은 표 (줄 3칸 = 선 4개)
BF_L = [19, 20, 21]         # header.xml 에 새로 넣는 테두리: 실선/실선, 실선/점선, 점선/실선 (회색)
def four_lines(w, row_h=1050):
    rows = [[cell(0, i, w, row_h, BF_L[i], [P([(11, "")], 26)])] for i in range(3)]
    t = table(rows, 1, w, row_h * 3).replace('borderFillIDRef="4" noAdjust', 'borderFillIDRef="1" noAdjust')
    t = t.replace('<hp:cellMargin left="510" right="510" top="141" bottom="141"/>', '<hp:cellMargin left="0" right="0" top="0" bottom="0"/>')
    return t.replace('<hp:outMargin left="141" right="141" top="141" bottom="141"/>', '<hp:outMargin left="0" right="0" top="0" bottom="0"/>')

p2 = [header("- 친구들의 AI 친구를 만나 묻고 답해 보기 -", first=True, secpr=secpr2)]
p2.append(P([(28, "1. 친구들을 만나 친구의 AI 친구에게 영어로 질문하고, 알게 된 것을 영어 칸에 적어 봅시다. "
                  "(가지고 있는 물건과 할 수 있는 일은 친구가 Yes 라고 대답한 것을 적어요.)")], para=23))
WQ = [4000, 36000, 4000, TW2 - 44000]
HQ = 5000
rowsq = [[cell(0, 0, WQ[0], HQ, 6, [P([(24, "질문")], 30)]),
          cell(1, 0, WQ[1], HQ, 14, [P([(15, "What's your name?     How old are you?")], 33),
                                      P([(15, "How are you today?")], 33),
                                      P([(15, "Do you have a ____?     Can you ____?")], 33)]),
          cell(2, 0, WQ[2], HQ, 14, [P([(24, "대답")], 30)]),
          cell(3, 0, WQ[3], HQ, 7, [P([(35, "Hi, I'm ____.     I'm ____ years old.")], 33),
                                     P([(35, "I'm happy / sad / angry / hungry / tired.")], 33),
                                     P([(35, "Yes, I do. / No, I don't.     Yes, I can. / No, I can't.")], 33)])]]
p2.append(tblP(table(rowsq, 4, sum(WQ), HQ)))
p2.append(P([(8, "")], para=22))
C0 = 9650
WM = [C0] + [(TW2 - C0) // 5] * 5
WM[-1] += TW2 - sum(WM)
heads = [("반 친구 이름", ""), ("AI 친구 이름", "What's your name?"), ("나이", "How old are you?"),
         ("기분", "How are you today?"), ("가지고 있는 물건", "Do you have a ____?"), ("할 수 있는 일", "Can you ____?")]
HB = 3200
bfh = [16] + [14] * 4 + [15]
rowsm = [[cell(c, 0, WM[c], HB, bfh[c], [P([(24, k)], 27)] + ([P([(26, e)], 27)] if e else [])) for c, (k, e) in enumerate(heads)]]
NR, HR = 6, 5000
for r in range(1, NR + 1):
    last = r == NR
    rowsm.append([cell(0, r, WM[0], HR, 18 if last else 17, [P([(12, "")], 27)])] +
                 [cell(c, r, WM[c], HR, (13 if last else 9) if c == len(WM) - 1 else (12 if last else 4),
                       [P([(11, "", four_lines(WM[c] - 1020))], 27)]) for c in range(1, len(WM))])
p2.append(tblP(table(rowsm, len(WM), sum(WM), HB + HR * NR)))
xml1 = head + "".join(p2) + "</hs:sec>"
files["Contents/section1.xml"] = xml1.encode("utf-8")

xml = head + "".join(out_p) + "</hs:sec>"
files["Contents/section0.xml"] = xml.encode("utf-8")
files["Preview/PrvText.txt"] = "Lesson 6~8. Meet My Friends!\r\n- 웹 앱에서 내가 선택한 AI 친구를 소개해 보기 -\r\n- 친구들의 AI 친구를 만나 묻고 답해 보기 -\r\n".encode("utf-8")
hpf = files["Contents/content.hpf"].decode("utf-8").replace("<opf:title>Lesson 5</opf:title>", "<opf:title>Meet My Friends</opf:title>")
hpf = hpf.replace('<opf:item id="section0" href="Contents/section0.xml" media-type="application/xml"/>',
                  '<opf:item id="section0" href="Contents/section0.xml" media-type="application/xml"/>'
                  '<opf:item id="section1" href="Contents/section1.xml" media-type="application/xml"/>')
hpf = hpf.replace('<opf:itemref idref="section0" linear="yes"/>', '<opf:itemref idref="section0" linear="yes"/><opf:itemref idref="section1" linear="yes"/>')
hdr = files["Contents/header.xml"].decode("utf-8").replace('secCnt="1"', 'secCnt="2"')
def bfill(i, top, bottom):
    b = lambda side, t: f'<hh:{side}Border type="{t}" width="0.12 mm" color="#BFBFBF"/>'
    return (f'<hh:borderFill id="{i}" threeD="0" shadow="0" centerLine="NONE" breakCellSeparateLine="0">'
            '<hh:slash type="NONE" Crooked="0" isCounter="0"/><hh:backSlash type="NONE" Crooked="0" isCounter="0"/>'
            '<hh:leftBorder type="NONE" width="0.1 mm" color="#000000"/><hh:rightBorder type="NONE" width="0.1 mm" color="#000000"/>'
            + b("top", top) + b("bottom", bottom) + '<hh:diagonal type="SOLID" width="0.1 mm" color="#000000"/></hh:borderFill>')
hdr = hdr.replace('<hh:borderFills itemCnt="18">', '<hh:borderFills itemCnt="21">')
hdr = hdr.replace('</hh:borderFills>', bfill(19, "SOLID", "SOLID") + bfill(20, "SOLID", "DASH") + bfill(21, "DASH", "SOLID") + '</hh:borderFills>')
files["Contents/header.xml"] = hdr.encode("utf-8")
rdf = files["META-INF/container.rdf"].decode("utf-8").replace('<rdf:Description rdf:about=""><rdf:type',
      '<rdf:Description rdf:about=""><ns0:hasPart xmlns:ns0="http://www.hancom.co.kr/hwpml/2016/meta/pkg#" rdf:resource="Contents/section1.xml"/></rdf:Description>'
      '<rdf:Description rdf:about="Contents/section1.xml"><rdf:type rdf:resource="http://www.hancom.co.kr/hwpml/2016/meta/pkg#SectionFile"/></rdf:Description>'
      '<rdf:Description rdf:about=""><rdf:type')
files["META-INF/container.rdf"] = rdf.encode("utf-8")
files["Contents/content.hpf"] = hpf.encode("utf-8")
if len(sys.argv) > 3:
    files["Preview/PrvImage.png"] = open(sys.argv[3], "rb").read()

with zipfile.ZipFile(out, "w") as o:
    names = [i.filename for i in z.infolist()]
    names.insert(names.index("Contents/section0.xml") + 1, "Contents/section1.xml")
    for n in names:   # mimetype 은 맨 앞, 압축 없이
        o.writestr(n, files[n], compress_type=zipfile.ZIP_STORED if n == "mimetype" else zipfile.ZIP_DEFLATED)
print("ok", out, len(xml))
