import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   HIERARCHICAL KEYWORD DATA
───────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "personality",
    icon: "🧠",
    label: "성격",
    color: "#7C6FF7",
    light: "#EEF0FF",
    subs: [
      { id: "energy",    label: "에너지 타입", options: ["아침형 인간","밤형 인간","주말에 폭발하는 타입","매일 비슷한 타입"] },
      { id: "social",    label: "사람관계",    options: ["만나면 에너지 충전","혼자 있어야 충전","둘 다 괜찮아","소수와 깊게"] },
      { id: "lifestyle", label: "생활방식",    options: ["철저하게 계획","완전 즉흥","어느 정도만 계획","상황 따라"] },
      { id: "home",      label: "홈라이프",    options: ["집이 제일 좋아","나가야 살아","카페파","동네 산책파"] },
      { id: "value",     label: "가치관",      options: ["현실주의","이상주의","실용주의","감성주의"] },
    ],
  },
  {
    id: "hobby",
    icon: "🎨",
    label: "취미",
    color: "#F97066",
    light: "#FFF1F0",
    subs: [
      { id: "movie",   label: "영화·드라마 보기", options: ["영화관 가서","집에서 OTT로","핸드폰으로 이동 중","아예 안 봐"] },
      { id: "music",   label: "음악 듣기",         options: ["이어폰으로 혼자","스피커로 크게","라이브 공연으로","별로 안 들어"] },
      { id: "food",    label: "음식·카페",          options: ["집밥 해먹기","맛집 탐방","카페 투어","배달 마니아"] },
      { id: "travel",  label: "여행",               options: ["해외여행","국내 여행","당일치기","캠핑·글램핑"] },
      { id: "exercise",label: "운동",               options: ["헬스장","러닝·사이클","구기종목","요가·필라테스","안 해"] },
      { id: "read",    label: "독서",               options: ["소설·문학","에세이·비소설","웹툰·웹소설","거의 안 읽어"] },
      { id: "game",    label: "게임",               options: ["콘솔 게임","PC 게임","모바일 게임","안 해"] },
      { id: "create",  label: "창작 활동",          options: ["그림·디자인","사진·영상","글쓰기","악기 연주","없어"] },
    ],
  },
  {
    id: "style",
    icon: "👗",
    label: "옷스타일",
    color: "#12B76A",
    light: "#EDFDF5",
    subs: [
      { id: "daily",   label: "평소 스타일",  options: ["캐주얼·편한 게 최고","미니멀·베이직","스트릿·힙한 느낌","빈티지·레트로","포멀·클래식","스포티·애슬레저","걸리시·로맨틱"] },
      { id: "color",   label: "즐겨 입는 색", options: ["블랙 위주","화이트·아이보리","뉴트럴 톤","컬러풀·과감하게","패턴·프린트"] },
      { id: "shoes",   label: "신발 취향",    options: ["스니커즈파","로퍼·슬립온","부츠파","샌들·슬리퍼","힐·드레시"] },
      { id: "shop",    label: "쇼핑 스타일",  options: ["온라인 쇼핑","오프라인 구경하면서","빈티지·중고","브랜드 위주","잘 안 사"] },
    ],
  },
];

/* ─────────────────────────────────────────
   ACCENT THEMES (라이트 모드)
───────────────────────────────────────── */
const ACCENT_THEMES = [
  { accent:"#7C6FF7", light:"#EEF0FF", pill:"#F3F4FF", border:"#C5C3F7" },
  { accent:"#F97066", light:"#FFF1F0", pill:"#FFF5F4", border:"#F9B8B4" },
  { accent:"#12B76A", light:"#EDFDF5", pill:"#F3FDF8", border:"#86E8B8" },
  { accent:"#F79009", light:"#FFF8EC", pill:"#FFFBF0", border:"#FBC85A" },
  { accent:"#0BA5EC", light:"#EFF8FF", pill:"#F4FBFF", border:"#7DD3F8" },
];

/* ─────────────────────────────────────────
   MATCHING DATA
───────────────────────────────────────── */
const OTHER_PERSON = {
  name: "서연",
  selections: {
    "밤형 인간": true, "혼자 있어야 충전": true, "완전 즉흥": true,
    "집에서 OTT로": true, "카페 투어": true, "국내 여행": true,
    "사진·영상": true, "미니멀·베이직": true, "스니커즈파": true,
    "에세이·비소설": true, "이어폰으로 혼자": true,
  },
  bio: "영화 보고 카페 가는 걸 제일 좋아해요. 새로운 사람 만나는 게 설레면서도 약간 긴장돼요. 일본 여행을 제일 좋아하고 사진 찍는 게 취미예요.",
};

const TOGETHER_SUGGESTIONS = {
  "카페 투어":       { emoji:"☕", activity:"카페 투어",         reason:"카페 취향이 맞아요" },
  "집에서 OTT로":    { emoji:"🎬", activity:"OTT 영화 함께 보기", reason:"집에서 보는 걸 좋아해요" },
  "영화관 가서":     { emoji:"🍿", activity:"영화관 데이트",       reason:"영화관을 좋아해요" },
  "국내 여행":       { emoji:"🗺️", activity:"국내 당일치기 여행", reason:"여행 취향이 맞아요" },
  "당일치기":        { emoji:"🚗", activity:"즉흥 당일치기",       reason:"즉흥 여행 좋아해요" },
  "사진·영상":       { emoji:"📸", activity:"사진 찍으러 나가기",  reason:"사진 취향이 겹쳐요" },
  "완전 즉흥":       { emoji:"🎲", activity:"즉흥으로 어딘가 가기",reason:"즉흥파끼리 잘 맞아요" },
  "밤형 인간":       { emoji:"🌙", activity:"새벽 카페 탐방",      reason:"밤형 감성이 통해요" },
  "헬스장":          { emoji:"💪", activity:"같이 운동하기",        reason:"운동 루틴이 비슷해요" },
  "러닝·사이클":     { emoji:"🏃", activity:"같이 러닝하기",        reason:"러닝 메이트가 될 수 있어요" },
  "맛집 탐방":       { emoji:"🍽️", activity:"주말 맛집 탐방",     reason:"먹는 걸 좋아해요" },
  "에세이·비소설":   { emoji:"📚", activity:"책 추천 교환하기",     reason:"독서 취향이 비슷해요" },
};
const FALLBACK_TOGETHER = [
  { emoji:"☕", activity:"카페에서 천천히 대화하기", reason:"첫 만남엔 역시 카페" },
  { emoji:"🚶", activity:"동네 산책하며 얘기하기",  reason:"걸으면 말이 잘 나와요" },
  { emoji:"🍜", activity:"맛있는 거 먹으러 가기",  reason:"밥 먹으면 친해져요" },
  { emoji:"🎬", activity:"영화 보고 감상 나누기",   reason:"공통 화제가 생겨요" },
];

const CONV_STARTERS = {
  "밤형 인간":    { emoji:"🌙", q:"밤에 혼자 있을 때 주로 뭐 해요? 생산적인 편이에요?" },
  "아침형 인간":  { emoji:"☀️", q:"아침에 몇 시에 일어나요? 아침 루틴이 있어요?" },
  "카페 투어":    { emoji:"☕", q:"요즘 제일 자주 가는 카페 있어요? 어떤 분위기를 좋아해요?" },
  "맛집 탐방":    { emoji:"🍽️", q:"최근에 발견한 진짜 맛있는 집 있어요? 어떻게 찾았어요?" },
  "완전 즉흥":    { emoji:"🎲", q:"즉흥으로 한 일 중에 제일 잘 됐던 거 있어요?" },
  "집에서 OTT로": { emoji:"🎬", q:"요즘 뭐 보고 있어요? 최근에 제일 재밌게 본 거 뭐예요?" },
  "영화관 가서":  { emoji:"🍿", q:"영화관에서 팝콘 꼭 먹어요? 혼자 보러 가는 편이에요?" },
  "국내 여행":    { emoji:"🗺️", q:"국내에서 제일 좋았던 여행지 어디예요? 또 가고 싶어요?" },
  "사진·영상":    { emoji:"📸", q:"사진 찍을 때 어떤 피사체를 좋아해요? 폰이에요 카메라예요?" },
  "악기 연주":    { emoji:"🎵", q:"어떤 악기 해요? 독학이에요 레슨이에요?" },
  "그림·디자인":  { emoji:"🎨", q:"어떤 스타일로 작업해요? 디지털이에요 아날로그예요?" },
  "해외여행":     { emoji:"✈️", q:"해외 여행 중 제일 기억에 남는 곳 어디예요? 이유가 뭐예요?" },
  "소설·문학":    { emoji:"📖", q:"지금 읽고 있는 책 있어요? 최근에 감동받은 작품 있어요?" },
  "에세이·비소설":{ emoji:"📚", q:"에세이 중에 인생 책 있어요? 어떤 내용이었어요?" },
  "헬스장":       { emoji:"💪", q:"운동 루틴이 어떻게 돼요? 하루에 얼마나 해요?" },
  "요가·필라테스":{ emoji:"🧘", q:"요가 시작한 계기가 뭐예요? 몸이에요 마음이에요?" },
  "이어폰으로 혼자":{ emoji:"🎧", q:"요즘 제일 많이 듣는 아티스트 있어요? 플리 공유해줄 수 있어요?" },
  "라이브 공연으로":{ emoji:"🎸", q:"최근에 본 공연 중에 제일 좋았던 거 있어요?" },
};
const FALLBACK_CARDS = [
  { emoji:"🌟", q:"지금 이 순간 가장 빠져있는 게 뭐예요?" },
  { emoji:"🗺️", q:"올해 꼭 해보고 싶은 게 있어요? 아직 못 한 거요." },
  { emoji:"🌙", q:"밤에 혼자 있을 때 주로 뭐 해요?" },
  { emoji:"☕", q:"제일 자주 가는 카페 어디예요? 이유가 뭐예요?" },
  { emoji:"✨", q:"요즘 가장 행복한 순간이 언제예요?" },
];

function buildTogether(matched) {
  const r = [];
  for (const k of matched) { if (TOGETHER_SUGGESTIONS[k]) r.push(TOGETHER_SUGGESTIONS[k]); if (r.length >= 4) break; }
  let i = 0; while (r.length < 4) r.push(FALLBACK_TOGETHER[i++ % 4]);
  return r;
}
function buildCards(matched) {
  const sh = [...matched].sort(() => Math.random() - 0.5);
  const r = [];
  for (const k of sh) { if (CONV_STARTERS[k]) r.push(CONV_STARTERS[k]); if (r.length >= 5) break; }
  let i = 0; while (r.length < 5) r.push(FALLBACK_CARDS[i++ % 5]);
  return r;
}
function getChemistry(p) {
  if (p >= 70) return "거의 같은 사람을 만난 것 같은 느낌 ✨";
  if (p >= 50) return "취향의 교집합이 넓은 두 사람 💫";
  if (p >= 30) return "서로 다른 매력으로 끌리는 두 사람 🌊";
  return "다른 세계에서 온 두 사람의 첫 만남 🌏";
}

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
function MatchRing({ percent, accent }) {
  const r = 52, circ = 2 * Math.PI * r, dash = (percent / 100) * circ;
  return (
    <div style={{ position:"relative", width:136, height:136 }}>
      <svg width="136" height="136" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="68" cy="68" r={r} fill="none" stroke="#E8E4DC" strokeWidth="9"/>
        <circle cx="68" cy="68" r={r} fill="none" stroke={accent} strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:"stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)", filter:`drop-shadow(0 0 6px ${accent}66)` }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:"30px", fontWeight:800, color:accent, letterSpacing:"-1px" }}>{percent}%</span>
        <span style={{ fontSize:"11px", color:"#9E9690", fontWeight:600 }}>매칭</span>
      </div>
    </div>
  );
}

function FlipCard({ emoji, question, index, accent }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(f => !f)}
      style={{ width:"100%", height:160, cursor:"pointer", perspective:"900px", animation:`cardIn 0.45s ease ${index * 0.07}s both` }}>
      <div style={{ position:"relative", width:"100%", height:"100%", transformStyle:"preserve-3d",
        transition:"transform 0.55s cubic-bezier(0.4,0,0.2,1)", transform:flipped?"rotateY(180deg)":"rotateY(0)" }}>
        {/* Back */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", borderRadius:20,
          background:"#F5F3EE", border:"1.5px solid #E8E4DC",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10,
          boxShadow:"0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:28 }}>🃏</div>
          <div style={{ fontSize:11, color:"#C5BFB5", fontWeight:700, letterSpacing:"2px" }}>탭해서 열기</div>
          <div style={{ position:"absolute", top:14, left:18, fontSize:9, color:accent, fontWeight:800, letterSpacing:"2px", opacity:0.6 }}>MY KEY</div>
          {/* dots pattern */}
          <div style={{ position:"absolute", inset:0, borderRadius:20, overflow:"hidden", opacity:0.4 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ position:"absolute", width:80, height:80, borderRadius:"50%",
                border:`1.5px solid ${accent}`, opacity:0.25,
                top:`${i*18-5}%`, left:`${i%2===0?-5:60}%` }}/>
            ))}
          </div>
        </div>
        {/* Front */}
        <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", transform:"rotateY(180deg)",
          borderRadius:20, background:"white", border:`1.5px solid ${accent}33`,
          display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"space-between",
          padding:"22px 22px", boxShadow:`0 8px 28px ${accent}18` }}>
          <div style={{ fontSize:30 }}>{emoji}</div>
          <div style={{ fontSize:"14px", fontWeight:600, color:"#2D2926", lineHeight:1.65 }}>{question}</div>
          <div style={{ fontSize:10, color:accent, fontWeight:800, letterSpacing:"1.5px", opacity:0.8 }}>✦ 대화 카드</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function MyKey() {
  const [step, setStep]               = useState("landing");
  const [name, setName]               = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});  // { optionLabel: true }
  const [bio, setBio]                 = useState("");
  const [accentIdx, setAccentIdx]     = useState(0);
  const [animIn, setAnimIn]           = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);  // category id
  const [expandedSub, setExpandedSub] = useState(null);  // sub id
  const [cards, setCards]             = useState([]);
  const [together, setTogether]       = useState([]);
  const recogRef = useRef(null);

  const AT = ACCENT_THEMES[accentIdx];
  const allSelected = Object.keys(selectedOptions);
  const otherSelected = Object.keys(OTHER_PERSON.selections);
  const matched = allSelected.filter(k => OTHER_PERSON.selections[k]);
  const matchPct = allSelected.length > 0
    ? Math.round((matched.length / Math.max(allSelected.length, otherSelected.length)) * 100)
    : 0;

  useEffect(() => {
    setAnimIn(false);
    const t = setTimeout(() => setAnimIn(true), 60);
    return () => clearTimeout(t);
  }, [step]);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Chrome 브라우저를 이용해주세요."); return; }
    const r = new SR();
    r.lang = "ko-KR"; r.continuous = false; r.interimResults = true;
    r.onstart  = () => setIsListening(true);
    r.onresult = e => setBio(Array.from(e.results).map(x => x[0].transcript).join(""));
    r.onend    = () => setIsListening(false);
    r.onerror  = () => setIsListening(false);
    recogRef.current = r; r.start();
  };
  const stopVoice = () => { recogRef.current?.stop(); setIsListening(false); };

  const toggleOpt = opt => {
    setSelectedOptions(prev =>
      prev[opt] ? Object.fromEntries(Object.entries(prev).filter(([k]) => k !== opt))
               : Object.keys(prev).length < 30 ? { ...prev, [opt]: true } : prev
    );
  };

  const goCompare = () => {
    setTogether(buildTogether(matched));
    setCards(buildCards(matched));
    setStep("compare");
  };

  const fade = {
    opacity: animIn ? 1 : 0,
    transform: animIn ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.42s ease, transform 0.42s ease",
  };

  // Count selected per category
  const countForCat = catId => {
    const cat = CATEGORIES.find(c => c.id === catId);
    if (!cat) return 0;
    return cat.subs.flatMap(s => s.options).filter(o => selectedOptions[o]).length;
  };

  const CSS = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#F8F6F1;}
    textarea,input{font-family:'Pretendard','Apple SD Gothic Neo',sans-serif;}
    textarea{resize:none;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:#DDD8CE;border-radius:4px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
    @keyframes cardIn{from{opacity:0;transform:translateY(20px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
    @keyframes rippleLight{0%,100%{box-shadow:0 0 0 0 rgba(124,111,247,0.3);}50%{box-shadow:0 0 0 8px rgba(124,111,247,0);}}
    @keyframes popIn{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:scale(1);}}
  `;

  const NavHeader = ({ onBack, sub }) => (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"#ADA89E", fontSize:22, cursor:"pointer" }}>←</button>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:9, color:"#C5BFB5", letterSpacing:"3px", fontWeight:800 }}>MY KEY</div>
        <div style={{ fontSize:13, color:"#6E6860", fontWeight:600 }}>{sub}</div>
      </div>
      <div style={{ width:32 }}/>
    </div>
  );

  /* ── LANDING ── */
  if (step === "landing") return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ ...fade, textAlign:"center", maxWidth:400, width:"100%" }}>

        {/* Logo */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"10px 22px", borderRadius:999, background:"white", border:"1.5px solid #E8E4DC", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", marginBottom:28 }}>
          <span style={{ fontSize:16 }}>✦</span>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", lineHeight:1.1 }}>
            <span style={{ fontSize:"10px", fontWeight:800, color:AT.accent, letterSpacing:"3px" }}>MY KEY</span>
            <span style={{ fontSize:"19px", fontWeight:900, color:"#2D2926", letterSpacing:"-0.5px" }}>마이키</span>
          </div>
        </div>

        <h1 style={{ fontSize:"clamp(24px,6vw,38px)", fontWeight:900, color:"#1A1713", lineHeight:1.25, letterSpacing:"-1.5px", marginBottom:14 }}>
          내 취향을<br/>
          <span style={{ color:AT.accent }}>카드 하나</span>로 공유하세요
        </h1>
        <p style={{ color:"#8C877E", fontSize:14, lineHeight:1.8, marginBottom:32 }}>
          성격·취미·스타일을 선택하면<br/>공통 키워드와 대화 주제가 자동으로 나와요
        </p>

        {/* Preview chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:36 }}>
          {[
            { label:"🧠 밤형 인간",      color:CATEGORIES[0].color },
            { label:"🎨 카페 투어",      color:CATEGORIES[1].color },
            { label:"👗 미니멀·베이직",  color:CATEGORIES[2].color },
            { label:"🎨 집에서 OTT로",   color:CATEGORIES[1].color },
            { label:"🧠 완전 즉흥",      color:CATEGORIES[0].color },
          ].map((item, i) => (
            <span key={i} style={{ padding:"7px 14px", borderRadius:999, background:"white", border:`1.5px solid ${item.color}44`, color:item.color, fontSize:12, fontWeight:600, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>{item.label}</span>
          ))}
        </div>

        <input placeholder="나의 이름 또는 닉네임" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && setStep("build")}
          style={{ width:"100%", padding:"16px 20px", borderRadius:16, background:"white", border:"1.5px solid #E0DDD6", color:"#1A1713", fontSize:16, outline:"none", marginBottom:12, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}/>

        <button onClick={() => name.trim() && setStep("build")}
          style={{ width:"100%", padding:"16px", borderRadius:16, background:name.trim() ? AT.accent : "#E8E4DC", border:"none", color:name.trim() ? "white" : "#BDB8AE", fontSize:16, fontWeight:800, cursor:name.trim() ? "pointer" : "default", transition:"all 0.3s", letterSpacing:"-0.3px", boxShadow:name.trim() ? `0 6px 24px ${AT.accent}44` : "none" }}>
          나의 MY KEY 만들기 →
        </button>
      </div>
    </div>
  );

  /* ── BUILD ── */
  if (step === "build") return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", padding:"28px 20px 48px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ ...fade, maxWidth:480, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22 }}>
          <button onClick={() => setStep("landing")} style={{ background:"none", border:"none", color:"#ADA89E", fontSize:22, cursor:"pointer" }}>←</button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:9, fontWeight:800, color:"#C5BFB5", letterSpacing:"3px" }}>MY KEY</div>
            <div style={{ fontSize:14, fontWeight:700, color:"#1A1713" }}>{name}님의 마이키</div>
          </div>
          <div style={{ fontSize:12, color:allSelected.length >= 30 ? AT.accent : "#BDB8AE", fontWeight:700 }}>{allSelected.length}/30</div>
        </div>

        {/* Accent theme picker */}
        <div style={{ display:"flex", gap:8, marginBottom:24, justifyContent:"center" }}>
          {ACCENT_THEMES.map((t, i) => (
            <button key={i} onClick={() => setAccentIdx(i)} style={{ width:24, height:24, borderRadius:"50%", background:t.accent, border:i===accentIdx ? "3px solid #1A1713" : "3px solid transparent", cursor:"pointer", transition:"all 0.2s", boxShadow:i===accentIdx ? `0 0 0 2px white, 0 0 0 4px ${t.accent}` : "none" }}/>
          ))}
        </div>

        {/* Category cards */}
        {CATEGORIES.map(cat => (
          <div key={cat.id} style={{ marginBottom:12 }}>
            {/* Category header */}
            <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              style={{ width:"100%", padding:"16px 20px", borderRadius:expandedCat === cat.id ? "18px 18px 0 0" : 18, background:"white", border:`1.5px solid ${expandedCat === cat.id ? cat.color+"55" : "#E8E4DC"}`, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", transition:"all 0.2s", boxShadow:expandedCat===cat.id ? `0 4px 20px ${cat.color}18` : "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:12, background:cat.light, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{cat.icon}</div>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#1A1713" }}>{cat.label}</div>
                  {countForCat(cat.id) > 0 && (
                    <div style={{ fontSize:11, color:cat.color, fontWeight:700, marginTop:1 }}>{countForCat(cat.id)}개 선택됨</div>
                  )}
                </div>
              </div>
              <div style={{ fontSize:13, color:expandedCat===cat.id ? cat.color : "#C5BFB5", transition:"transform 0.2s", transform:expandedCat===cat.id ? "rotate(180deg)" : "rotate(0)" }}>▼</div>
            </button>

            {/* Subcategory list */}
            {expandedCat === cat.id && (
              <div style={{ background:"white", border:`1.5px solid ${cat.color}33`, borderTop:"none", borderRadius:"0 0 18px 18px", padding:"4px 0 8px", animation:"slideDown 0.2s ease" }}>
                {cat.subs.map(sub => (
                  <div key={sub.id}>
                    {/* Sub header */}
                    <button onClick={() => setExpandedSub(expandedSub === sub.id ? null : sub.id)}
                      style={{ width:"100%", padding:"12px 20px", background:"none", border:"none", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:expandedSub===sub.id ? cat.color : "#4A4540" }}>{sub.label}</span>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {sub.options.filter(o => selectedOptions[o]).length > 0 && (
                          <span style={{ fontSize:11, color:cat.color, fontWeight:700, background:cat.light, padding:"2px 8px", borderRadius:999 }}>
                            {sub.options.filter(o => selectedOptions[o]).length}개
                          </span>
                        )}
                        <span style={{ fontSize:12, color:"#C5BFB5", transform:expandedSub===sub.id?"rotate(180deg)":"rotate(0)", display:"inline-block", transition:"transform 0.2s" }}>▼</span>
                      </div>
                    </button>

                    {/* Options */}
                    {expandedSub === sub.id && (
                      <div style={{ padding:"4px 16px 12px", display:"flex", flexWrap:"wrap", gap:8, animation:"slideDown 0.15s ease" }}>
                        {sub.options.map(opt => {
                          const sel = !!selectedOptions[opt];
                          return (
                            <span key={opt} onClick={() => toggleOpt(opt)} style={{
                              padding:"8px 16px", borderRadius:999, fontSize:13, fontWeight:sel ? 700 : 500,
                              cursor:"pointer", transition:"all 0.18s", userSelect:"none",
                              background: sel ? cat.color : "#F5F3EE",
                              color: sel ? "white" : "#6E6860",
                              border: `1.5px solid ${sel ? cat.color : "#E0DDD6"}`,
                              boxShadow: sel ? `0 3px 12px ${cat.color}44` : "none",
                            }}>{opt}</span>
                          );
                        })}
                      </div>
                    )}
                    {/* Divider between subs */}
                    <div style={{ height:1, background:"#F0EDE7", margin:"0 20px" }}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Selected chips preview */}
        {allSelected.length > 0 && (
          <div style={{ background:"white", border:"1.5px solid #E8E4DC", borderRadius:18, padding:"16px", marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:11, color:"#ADA89E", fontWeight:700, letterSpacing:"1px", marginBottom:10 }}>선택된 키워드 ({allSelected.length}개)</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {allSelected.map(opt => {
                const cat = CATEGORIES.find(c => c.subs.some(s => s.options.includes(opt)));
                return (
                  <span key={opt} onClick={() => toggleOpt(opt)} style={{ padding:"5px 12px", borderRadius:999, background:cat?.light||"#F5F3EE", border:`1px solid ${cat?.color||"#E0DDD6"}55`, color:cat?.color||"#6E6860", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                    {opt} ×
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"8px 0 16px" }}>
          <div style={{ flex:1, height:1, background:"#E8E4DC" }}/>
          <span style={{ fontSize:11, color:"#C5BFB5", fontWeight:600, letterSpacing:"1px" }}>자기소개</span>
          <div style={{ flex:1, height:1, background:"#E8E4DC" }}/>
        </div>

        {/* Bio */}
        <div style={{ marginBottom:24, position:"relative" }}>
          <textarea value={bio} onChange={e => setBio(e.target.value)}
            placeholder={"키워드로 못 담은 나를 표현해보세요\n\n예) \"주말엔 카페 돌아다니는 걸 제일 좋아해요. 혼자 있는 시간이 충전이 되는 타입이에요.\""}
            maxLength={150} rows={4}
            style={{ width:"100%", padding:"16px 54px 16px 18px", borderRadius:18, background:"white", border:`1.5px solid ${isListening ? AT.accent : "#E0DDD6"}`, color:"#1A1713", fontSize:14, outline:"none", lineHeight:1.7, transition:"border-color 0.3s", boxShadow:isListening ? `0 0 16px ${AT.accent}22` : "0 2px 8px rgba(0,0,0,0.04)" }}/>
          <button onClick={isListening ? stopVoice : startVoice}
            style={{ position:"absolute", right:13, top:13, width:36, height:36, borderRadius:"50%", border:"none", background:isListening ? AT.accent : "#F0EDE7", color:isListening ? "white" : "#8C877E", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.25s", animation:isListening ? "rippleLight 1.4s infinite" : "none" }}>
            {isListening ? "⏹" : "🎙️"}
          </button>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6, padding:"0 2px" }}>
            <div style={{ fontSize:11, color:isListening ? AT.accent : "#C5BFB5", fontWeight:600 }}>
              {isListening ? "🔴 듣고 있어요..." : "🎙️ 마이크로 말하기"}
            </div>
            <div style={{ fontSize:11, color:"#C5BFB5" }}>{bio.length}/150</div>
          </div>
        </div>

        {allSelected.length >= 3
          ? <button onClick={() => setStep("card")} style={{ width:"100%", padding:"16px", borderRadius:18, background:AT.accent, border:"none", color:"white", fontSize:16, fontWeight:800, cursor:"pointer", boxShadow:`0 8px 28px ${AT.accent}55`, letterSpacing:"-0.3px", fontFamily:"'Pretendard',sans-serif" }}>
              나의 MY KEY 카드 완성 ✦
            </button>
          : <div style={{ width:"100%", padding:"14px", borderRadius:18, background:"#F0EDE7", border:"1px solid #E0DDD6", color:"#BDB8AE", fontSize:13, textAlign:"center" }}>
              키워드를 3개 이상 선택해주세요 ({allSelected.length}/3)
            </div>
        }
      </div>
    </div>
  );

  /* ── CARD ── */
  if (step === "card") return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 20px 48px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ ...fade, width:"100%", maxWidth:400 }}>
        <NavHeader onBack={() => setStep("build")} sub="나의 마이키 카드"/>

        {/* The Card */}
        <div style={{ borderRadius:28, overflow:"hidden", background:"white", border:`1.5px solid ${AT.border}`, boxShadow:`0 20px 60px ${AT.accent}18, 0 4px 20px rgba(0,0,0,0.06)`, marginBottom:20, animation:"popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          {/* Top accent bar */}
          <div style={{ height:6, background:`linear-gradient(90deg, ${AT.accent}, ${AT.accent}88)` }}/>
          <div style={{ padding:"28px 26px 26px" }}>
            {/* Brand */}
            <div style={{ fontSize:9, fontWeight:800, color:AT.accent, letterSpacing:"3px", opacity:0.8, marginBottom:18 }}>MY KEY · 마이키</div>

            {/* Name */}
            <div style={{ fontSize:"30px", fontWeight:900, color:"#1A1713", letterSpacing:"-1px", marginBottom:4 }}>{name}</div>
            <div style={{ height:3, width:36, background:AT.accent, borderRadius:2, marginBottom:bio ? 14 : 18 }}/>

            {/* Bio */}
            {bio && <p style={{ fontSize:13, color:"#8C877E", lineHeight:1.65, marginBottom:18, fontStyle:"italic" }}>"{bio.slice(0, 80)}{bio.length > 80 ? "…" : ""}"</p>}

            {/* Keywords grouped by category */}
            {CATEGORIES.map(cat => {
              const catSelected = allSelected.filter(opt =>
                cat.subs.some(s => s.options.includes(opt))
              );
              if (catSelected.length === 0) return null;
              return (
                <div key={cat.id} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, color:cat.color, fontWeight:700, letterSpacing:"0.5px", marginBottom:7 }}>{cat.icon} {cat.label}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {catSelected.map((opt, i) => (
                      <span key={opt} style={{ padding:"6px 13px", borderRadius:999, background:cat.light, border:`1.5px solid ${cat.color}44`, color:cat.color, fontSize:12, fontWeight:600, animation:`fadeUp 0.3s ease ${i*0.04}s both` }}>{opt}</span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Footer */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8 }}>
              <div style={{ fontSize:10, color:"#C5BFB5", letterSpacing:"0.3px" }}>mykey.kr/{name.toLowerCase().replace(/\s/g, "")}</div>
              <div style={{ width:40, height:40, background:"#F5F3EE", borderRadius:8, display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:2, padding:5 }}>
                {Array.from({length:25}).map((_, i) => (
                  <div key={i} style={{ borderRadius:1.5, background:[0,1,2,5,6,7,9,10,14,15,17,18,19,22,24].includes(i) ? "#BDB8AE" : "transparent" }}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <button style={{ flex:1, padding:"14px", borderRadius:14, background:"white", border:"1.5px solid #E0DDD6", color:"#4A4540", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>📱 QR 공유</button>
          <button style={{ flex:1, padding:"14px", borderRadius:14, background:"white", border:"1.5px solid #E0DDD6", color:"#4A4540", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>🔗 링크 복사</button>
        </div>
        <button onClick={goCompare} style={{ width:"100%", padding:"15px", borderRadius:14, background:AT.light, border:`1.5px solid ${AT.border}`, color:AT.accent, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
          ✦ 상대방과 매칭 보기
        </button>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}`}</style>
    </div>
  );

  /* ── COMPARE ── */
  if (step === "compare") return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 20px 48px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ ...fade, width:"100%", maxWidth:400 }}>
        <NavHeader onBack={() => setStep("card")} sub="키워드 매칭 결과"/>

        {/* Profiles */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:24, marginBottom:22 }}>
          {[{ label:name, acc:AT.accent }, { label:OTHER_PERSON.name, acc:"#F97066" }].map((p, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ width:60, height:60, borderRadius:"50%", background:`${p.acc}18`, border:`2.5px solid ${p.acc}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 8px" }}>👤</div>
              <div style={{ fontSize:13, color:"#1A1713", fontWeight:700 }}>{p.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
          <MatchRing percent={matchPct} accent={AT.accent}/>
        </div>

        <div style={{ textAlign:"center", marginBottom:20 }}>
          <span style={{ fontSize:13, color:AT.accent, fontWeight:700, padding:"6px 18px", borderRadius:999, background:AT.light, border:`1px solid ${AT.border}` }}>
            {getChemistry(matchPct)}
          </span>
        </div>

        {/* Matched keywords */}
        {matched.length > 0 && (
          <div style={{ background:"white", border:`1.5px solid ${AT.border}`, borderRadius:20, padding:"16px 18px", marginBottom:14, boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize:11, color:AT.accent, fontWeight:700, letterSpacing:"1px", marginBottom:10 }}>✦ 공통 키워드</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {matched.map(kw => {
                const cat = CATEGORIES.find(c => c.subs.some(s => s.options.includes(kw)));
                return (
                  <span key={kw} style={{ padding:"6px 14px", borderRadius:999, background:cat?.color||AT.accent, color:"white", fontSize:12, fontWeight:700, boxShadow:`0 3px 10px ${cat?.color||AT.accent}44` }}>
                    ✦ {kw}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Bios */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[{ label:name, txt:bio||"소개가 없어요" }, { label:OTHER_PERSON.name, txt:OTHER_PERSON.bio }].map((p, i) => (
            <div key={i} style={{ background:"white", border:"1.5px solid #E8E4DC", borderRadius:14, padding:14, boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize:11, color:"#ADA89E", fontWeight:700, marginBottom:6 }}>{p.label}</div>
              <div style={{ fontSize:12, color:"#6E6860", lineHeight:1.65 }}>{p.txt.slice(0, 55)}{p.txt.length > 55 ? "…" : ""}</div>
            </div>
          ))}
        </div>

        {/* Together */}
        <div style={{ marginBottom:18 }}>
          <div style={{ fontSize:11, color:"#ADA89E", fontWeight:700, letterSpacing:"1px", marginBottom:10 }}>🎯 함께 해보면 좋을 것들</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {together.map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", borderRadius:16, background:"white", border:"1.5px solid #E8E4DC", boxShadow:"0 2px 8px rgba(0,0,0,0.04)", animation:`fadeUp 0.4s ease ${i * 0.07}s both` }}>
                <span style={{ fontSize:22, flexShrink:0 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize:13, color:"#1A1713", fontWeight:700, marginBottom:2 }}>{item.activity}</div>
                  <div style={{ fontSize:11, color:"#ADA89E" }}>{item.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setStep("cards")} style={{ width:"100%", padding:"16px", borderRadius:18, background:AT.accent, border:"none", color:"white", fontSize:15, fontWeight:900, cursor:"pointer", fontFamily:"inherit", letterSpacing:"-0.5px", boxShadow:`0 10px 32px ${AT.accent}44`, marginBottom:10 }}>
          🃏 대화 카드 뽑기
        </button>
        <button onClick={() => setStep("card")} style={{ width:"100%", padding:"12px", borderRadius:14, background:"transparent", border:"1.5px solid #E0DDD6", color:"#ADA89E", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          내 카드로 돌아가기
        </button>
      </div>
    </div>
  );

  /* ── CARDS ── */
  if (step === "cards") return (
    <div style={{ minHeight:"100vh", background:"#F8F6F1", display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 20px 60px", fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif" }}>
      <style>{CSS}</style>
      <div style={{ ...fade, width:"100%", maxWidth:400 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <button onClick={() => setStep("compare")} style={{ background:"none", border:"none", color:"#ADA89E", fontSize:22, cursor:"pointer" }}>←</button>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:9, color:"#C5BFB5", letterSpacing:"3px", fontWeight:800 }}>MY KEY</div>
            <div style={{ fontSize:13, color:"#6E6860", fontWeight:600 }}>대화 카드</div>
          </div>
          <button onClick={() => setCards(buildCards(matched))} style={{ background:AT.light, border:`1px solid ${AT.border}`, color:AT.accent, fontSize:11, fontWeight:700, padding:"6px 12px", borderRadius:999, cursor:"pointer", fontFamily:"inherit" }}>
            🔀 섞기
          </button>
        </div>

        {matched.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", margin:"14px 0 6px" }}>
            {matched.map(kw => (
              <span key={kw} style={{ fontSize:11, padding:"4px 11px", borderRadius:999, background:AT.light, border:`1px solid ${AT.border}`, color:AT.accent, fontWeight:700 }}>✦ {kw}</span>
            ))}
          </div>
        )}

        <div style={{ textAlign:"center", marginBottom:20, marginTop:12 }}>
          <p style={{ fontSize:13, color:"#ADA89E", lineHeight:1.8 }}>
            공통 관심사에서 뽑은 대화 카드예요<br/>
            <span style={{ color:AT.accent, fontWeight:700 }}>탭해서</span> 열어보세요 ✦
          </p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
          {cards.map((card, i) => (
            <FlipCard key={`${i}-${card.q}`} index={i} emoji={card.emoji} question={card.q} accent={AT.accent}/>
          ))}
        </div>

        <div style={{ marginTop:28, textAlign:"center", padding:"22px", borderRadius:20, background:"white", border:"1.5px solid #E8E4DC", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize:22, marginBottom:8 }}>✨</div>
          <div style={{ fontSize:13, color:"#8C877E", lineHeight:1.8 }}>
            카드를 다 열었으면<br/>이제 진짜 대화할 차례예요
          </div>
        </div>
      </div>
    </div>
  );
}
