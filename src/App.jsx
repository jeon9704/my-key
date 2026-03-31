import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   CATEGORY DATA - 옵션값은 모두 고유하게
───────────────────────────────────────── */
const CATEGORIES = [
  {
    id: "personality",
    title: "성격 & 라이프스타일",
    icon: "✨",
    desc: "나는 어떤 사람인가요?",
    subs: [
      { label: "⏰ 에너지 타입",
        options: ["아침형 인간","밤형 인간","에너지 그때그때"] },
      { label: "👥 사람 스타일",
        options: ["소수정예파","넓고얕게파","혼자가 편해요","새친구 환영"] },
      { label: "🏠 생활 방식",
        options: ["계획이 최고","즉흥이 최고","집이 최고","밖에 나가야 살아"] },
      { label: "💭 생각 스타일",
        options: ["현실주의자","꿈꾸는 이상가","감성 촉촉형","이성 냉철형"] },
    ],
  },
  {
    id: "hobby",
    title: "취미생활",
    icon: "🎯",
    desc: "뭐 하는 걸 좋아하세요?",
    subs: [
      { label: "🎬 영화·드라마 보기",
        options: ["영화관에서","집에서 OTT로","핸드폰으로 영상","독립영화관","영상 잘 안봐요"] },
      { label: "🎵 음악 듣기",
        options: ["이어폰 혼자듣기","스피커 크게","라이브 공연","플리 만들기","음악 잘 안들어요"] },
      { label: "📚 책·콘텐츠",
        options: ["소설 읽기","자기계발서","웹툰·만화","팟캐스트","책 잘 안읽어요"] },
      { label: "🍽️ 먹고 마시기",
        options: ["카페 탐방","맛집 투어","집밥 요리","술 한잔","음식에 관심없어요"] },
      { label: "🏃 몸 움직이기",
        options: ["헬스장","러닝","요가·필라테스","등산","구기종목","운동 안해요"] },
      { label: "✈️ 여행·외출",
        options: ["해외여행","국내여행","당일치기","전시·팝업","여행 잘 안가요"] },
      { label: "🎮 게임",
        options: ["콘솔게임","PC게임","모바일게임","보드게임","게임 안해요"] },
      { label: "🎨 만들기·창작",
        options: ["악기 연주","사진 찍기","그림 그리기","글쓰기·블로그","창작 안해요"] },
    ],
  },
  {
    id: "style",
    title: "옷 스타일",
    icon: "👗",
    desc: "평소에 어떻게 입으세요?",
    subs: [
      { label: "내 스타일",
        options: ["캐주얼·편함","미니멀·심플","스트릿·힙","빈티지·레트로","오피스·단정","스포티·활동적","페미닌·사랑스러움","아메카지·워크웨어"] },
    ],
  },
];

/* ─────────────────────────────────────────
   ACCENT THEMES
───────────────────────────────────────── */
const ACCENTS = [
  { color:"#5B5EA6", light:"#EEEEF8", chip:"#5B5EA622", chipBorder:"#5B5EA644" },
  { color:"#D4533F", light:"#FAEEE9", chip:"#D4533F20", chipBorder:"#D4533F44" },
  { color:"#4A7C59", light:"#EAF2EE", chip:"#4A7C5920", chipBorder:"#4A7C5944" },
  { color:"#B8882A", light:"#F7F0E2", chip:"#B8882A20", chipBorder:"#B8882A44" },
  { color:"#3A7DB5", light:"#E8F2FA", chip:"#3A7DB520", chipBorder:"#3A7DB544" },
];

/* ─────────────────────────────────────────
   CONVERSATION CARDS
───────────────────────────────────────── */
const CONV_MAP = {
  "영화관에서":       { emoji:"🎬", q:"영화관 가면 팝콘이에요 나초예요?" },
  "집에서 OTT로":     { emoji:"📺", q:"요즘 뭐 보고 있어요? OTT는 뭐 쓰세요?" },
  "핸드폰으로 영상":  { emoji:"📱", q:"핸드폰으로 뭐 자주 봐요? 유튜브예요 드라마예요?" },
  "독립영화관":       { emoji:"🎞️", q:"독립영화관에서 본 것 중에 제일 기억에 남는 영화 있어요?" },
  "이어폰 혼자듣기":  { emoji:"🎧", q:"요즘 제일 자주 듣는 음악 뭐예요?" },
  "스피커 크게":      { emoji:"🔊", q:"집에서 음악 크게 틀어놓고 주로 뭐 해요?" },
  "라이브 공연":      { emoji:"🎵", q:"최근에 라이브 공연 가봤어요? 어떤 공연이었어요?" },
  "플리 만들기":      { emoji:"🎼", q:"플리 잘 만드는 편이에요? 어떤 분위기예요?" },
  "소설 읽기":        { emoji:"📖", q:"최근에 읽은 소설 중에 제일 좋았던 거 뭐예요?" },
  "카페 탐방":        { emoji:"☕", q:"제일 자주 가는 카페 어디예요? 시그니처 메뉴 있어요?" },
  "맛집 투어":        { emoji:"🍽️", q:"최근에 갔던 맛집 중에 제일 기억에 남는 곳 어디예요?" },
  "집밥 요리":        { emoji:"🍳", q:"요리할 때 제일 자신 있는 메뉴 뭐예요?" },
  "등산":             { emoji:"🏔️", q:"등산 갈 때 꼭 챙기는 게 있어요? 정상 인증샷 남겨요?" },
  "러닝":             { emoji:"🏃", q:"주로 어디서 뛰어요? 러닝 코스 있어요?" },
  "해외여행":         { emoji:"✈️", q:"해외여행 중에 제일 기억에 남는 나라 어디예요?" },
  "당일치기":         { emoji:"🚗", q:"당일치기로 어디 가는 걸 제일 좋아해요?" },
  "전시·팝업":        { emoji:"🖼️", q:"최근에 가본 전시나 팝업 있어요? 어땠어요?" },
  "사진 찍기":        { emoji:"📸", q:"사진 찍을 때 주로 뭘 찍어요? 폰이에요 카메라예요?" },
  "그림 그리기":      { emoji:"🎨", q:"어떤 스타일로 그려요? 디지털이에요 아날로그예요?" },
  "악기 연주":        { emoji:"🎹", q:"어떤 악기 해요? 독학이에요 레슨이에요?" },
  "밤형 인간":        { emoji:"🌙", q:"밤에 주로 뭐 해요? 혼자 있는 시간 즐기는 편이에요?" },
  "아침형 인간":      { emoji:"☀️", q:"아침에 일어나면 제일 먼저 뭐 해요?" },
  "집이 최고":        { emoji:"🏠", q:"집에서 제일 좋아하는 루틴이 뭐예요?" },
  "콘솔게임":         { emoji:"🎮", q:"요즘 어떤 게임 해요? 최애 타이틀 있어요?" },
  "웹툰·만화":        { emoji:"📱", q:"지금 보는 웹툰 있어요? 어떤 장르 제일 좋아해요?" },
  "헬스장":           { emoji:"💪", q:"헬스장 얼마나 자주 가요? 루틴이 있어요?" },
  "요가·필라테스":    { emoji:"🧘", q:"요가 시작한 계기가 뭐예요? 몸이에요 마음이에요?" },
  "보드게임":         { emoji:"♟️", q:"보드게임 중에 제일 좋아하는 거 뭐예요?" },
  "글쓰기·블로그":    { emoji:"✍️", q:"블로그나 글 써요? 어떤 주제로 써요?" },
  "국내여행":         { emoji:"🗺️", q:"국내에서 제일 좋았던 여행지 어디예요?" },
  "소수정예파":       { emoji:"🤝", q:"친한 친구 몇 명이에요? 오래된 친구들이에요?" },
  "즉흥이 최고":      { emoji:"🎲", q:"즉흥으로 간 여행이나 약속 중에 제일 잘 됐던 거 있어요?" },
  "술 한잔":          { emoji:"🍻", q:"술자리에서 제일 좋아하는 분위기가 어떤 거예요?" },
};
const FALLBACK_CARDS = [
  { emoji:"🌟", q:"지금 이 순간 가장 빠져있는 게 뭐예요?" },
  { emoji:"☕", q:"제일 자주 가는 카페 어디예요? 이유가 뭐예요?" },
  { emoji:"🌙", q:"밤에 혼자 있을 때 주로 뭐 해요?" },
  { emoji:"🎯", q:"요즘 제일 관심 있는 게 뭐예요?" },
];

const TOGETHER_MAP = {
  "영화관에서":    { emoji:"🎬", activity:"영화관 같이 가기",    reason:"영화관 취향이 맞아요" },
  "집에서 OTT로":  { emoji:"📺", activity:"OTT 같이 정주행",    reason:"같이 볼 콘텐츠 많아요" },
  "카페 탐방":     { emoji:"☕", activity:"카페 투어",           reason:"카페 취향이 통해요" },
  "맛집 투어":     { emoji:"🍽️", activity:"맛집 탐방",         reason:"먹는 걸 둘 다 좋아해요" },
  "라이브 공연":   { emoji:"🎵", activity:"라이브 공연 보기",   reason:"음악 취향이 비슷해요" },
  "해외여행":      { emoji:"✈️", activity:"해외여행 같이 계획", reason:"여행을 둘 다 좋아해요" },
  "당일치기":      { emoji:"🚗", activity:"즉흥 당일치기",      reason:"가벼운 여행 좋아해요" },
  "전시·팝업":     { emoji:"🖼️", activity:"전시·팝업 투어",   reason:"문화생활 취향이 맞아요" },
  "등산":          { emoji:"🏔️", activity:"주말 등산",         reason:"자연을 둘 다 좋아해요" },
  "사진 찍기":     { emoji:"📸", activity:"사진 찍으러 나들이", reason:"사진 취향이 맞아요" },
  "술 한잔":       { emoji:"🍻", activity:"분위기 좋은 바 방문", reason:"술자리 분위기 잘 맞아요" },
  "러닝":          { emoji:"🏃", activity:"같이 러닝하기",      reason:"운동 루틴이 비슷해요" },
  "보드게임":      { emoji:"♟️", activity:"보드게임 카페",     reason:"보드게임을 둘 다 좋아해요" },
};
const FALLBACK_TOGETHER = [
  { emoji:"☕", activity:"카페에서 천천히 대화하기", reason:"첫 만남엔 역시 카페" },
  { emoji:"🚶", activity:"동네 산책하며 얘기하기",  reason:"걸으면 말이 잘 나와요" },
  { emoji:"🍜", activity:"맛있는 거 먹으러 가기",  reason:"밥 먹으면 친해져요" },
  { emoji:"🎬", activity:"영화 보고 감상 나누기",   reason:"공통 화제가 생겨요" },
];

function buildTogether(matched) {
  const r = [];
  for (const k of matched) { if (TOGETHER_MAP[k]) r.push(TOGETHER_MAP[k]); if (r.length >= 4) break; }
  let i = 0; while (r.length < 4) r.push(FALLBACK_TOGETHER[i++ % 4]);
  return r;
}
function buildCards(matched) {
  const sh = [...matched].sort(() => Math.random() - 0.5);
  const r = [];
  for (const k of sh) { if (CONV_MAP[k]) r.push(CONV_MAP[k]); if (r.length >= 5) break; }
  let i = 0; while (r.length < 4) r.push(FALLBACK_CARDS[i++ % 4]);
  return r;
}
function getChemistry(p) {
  if (p >= 70) return "거의 같은 사람을 만난 것 같은 느낌";
  if (p >= 50) return "취향의 교집합이 넓은 두 사람";
  if (p >= 30) return "서로 다른 매력으로 끌리는 두 사람";
  return "다른 세계에서 온 두 사람의 첫 만남";
}

/* ─────────────────────────────────────────
   URL SHARE HELPERS
───────────────────────────────────────── */
function encodeProfile(name, keywords, bio) {
  const data = JSON.stringify({ n: name, k: keywords, b: bio });
  return btoa(unescape(encodeURIComponent(data)));
}
function decodeProfile(str) {
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(str))));
    return { name: data.n || "", keywords: data.k || [], bio: data.b || "" };
  } catch { return null; }
}
function getShareUrl(name, keywords, bio) {
  const base = window.location.origin + window.location.pathname;
  return `${base}?p=${encodeProfile(name, keywords, bio)}`;
}
function getQRUrl(url) {
  return `https://api.qr-server.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=1C1917&bgcolor=F5F2EC&margin=2`;
}

/* ─────────────────────────────────────────
   SMALL UI COMPONENTS
───────────────────────────────────────── */
function OptionTag({ word, selected, matched, onClick, accent }) {
  if (matched) return (
    <span style={{display:"inline-flex",alignItems:"center",padding:"7px 14px",borderRadius:999,fontSize:"13px",fontWeight:700,border:"1.5px solid",userSelect:"none",background:accent.color,borderColor:accent.color,color:"#fff",boxShadow:`0 2px 12px ${accent.color}44`}}>
      ✦ {word}
    </span>
  );
  if (selected) return (
    <span onClick={onClick} style={{display:"inline-flex",alignItems:"center",padding:"7px 14px",borderRadius:999,fontSize:"13px",fontWeight:600,border:"1.5px solid",userSelect:"none",cursor:"pointer",transition:"all 0.18s",background:accent.chip,borderColor:accent.chipBorder,color:accent.color}}>
      {word}
    </span>
  );
  return (
    <span onClick={onClick} style={{display:"inline-flex",alignItems:"center",padding:"7px 14px",borderRadius:999,fontSize:"13px",fontWeight:500,border:"1.5px solid",userSelect:"none",cursor:"pointer",transition:"all 0.18s",background:"#F5F2EC",borderColor:"#DDD9D2",color:"#7C7570"}}>
      {word}
    </span>
  );
}

function MatchRing({ percent, color }) {
  const r = 48, circ = 2 * Math.PI * r, dash = (percent / 100) * circ;
  return (
    <div style={{position:"relative",width:124,height:124}}>
      <svg width="124" height="124" style={{transform:"rotate(-90deg)"}}>
        <circle cx="62" cy="62" r={r} fill="none" stroke="#E8E4DC" strokeWidth="8"/>
        <circle cx="62" cy="62" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{transition:"stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",filter:`drop-shadow(0 0 6px ${color}66)`}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:"26px",fontWeight:800,color,letterSpacing:"-1px"}}>{percent}%</span>
        <span style={{fontSize:"11px",color:"#A8A29E"}}>매칭</span>
      </div>
    </div>
  );
}

function FlipCard({ emoji, question, index, accent }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(f => !f)}
      style={{width:"100%",height:154,cursor:"pointer",perspective:"900px",animation:`cardIn 0.5s ease ${index * 0.08}s both`}}>
      <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",
        transition:"transform 0.6s cubic-bezier(0.4,0,0.2,1)",transform:flipped?"rotateY(180deg)":"rotateY(0)"}}>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",borderRadius:20,
          background:"#1C1917",border:"1.5px solid #2C2825",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,
          boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <div style={{position:"absolute",inset:0,borderRadius:20,overflow:"hidden",opacity:0.06}}>
            {[0,1,2,3,4,5].map(i=>(
              <div key={i} style={{position:"absolute",width:110,height:110,borderRadius:"50%",
                border:`1.5px solid ${accent.color}`,top:`${i*18-5}%`,left:`${i%2===0?-10:55}%`}}/>
            ))}
          </div>
          <div style={{fontSize:24}}>🃏</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:700,letterSpacing:"2px"}}>TAP TO REVEAL</div>
          <div style={{position:"absolute",top:12,left:16,fontSize:9,color:accent.color,fontWeight:800,letterSpacing:"2px",opacity:0.6}}>MY KEY</div>
        </div>
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",transform:"rotateY(180deg)",
          borderRadius:20,background:"#1C1917",border:`1.5px solid ${accent.color}44`,
          display:"flex",flexDirection:"column",alignItems:"flex-start",justifyContent:"space-between",
          padding:"18px 20px",boxShadow:"0 4px 20px rgba(0,0,0,0.12)"}}>
          <div style={{fontSize:26}}>{emoji}</div>
          <div style={{fontSize:"14px",fontWeight:600,color:"rgba(255,255,255,0.88)",lineHeight:1.65}}>{question}</div>
          <div style={{fontSize:10,color:accent.color,fontWeight:800,letterSpacing:"1.5px",opacity:0.8}}>✦ CONVERSATION CARD</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SHARE MODAL
───────────────────────────────────────── */
function ShareModal({ name, keywords, bio, accent, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = getShareUrl(name, keywords, bio);

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,padding:"0 16px 24px"}}>
      <div style={{width:"100%",maxWidth:400,background:"white",borderRadius:28,padding:"28px 24px",boxShadow:"0 -4px 40px rgba(0,0,0,0.15)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:"#1C1917",letterSpacing:"-0.5px"}}>내 마이키 공유하기</div>
            <div style={{fontSize:12,color:"#A8A29E",marginTop:2}}>QR 코드를 보여주거나 링크를 보내세요</div>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:999,background:"#F0EDE8",border:"none",color:"#78716C",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        {/* QR Code */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
          <div style={{padding:16,background:"#F5F2EC",borderRadius:20,border:"1.5px solid #E8E4DC"}}>
            <img
              src={getQRUrl(url)}
              width="180" height="180"
              alt="QR Code"
              style={{display:"block",borderRadius:8}}
            />
          </div>
        </div>

        {/* Name badge */}
        <div style={{textAlign:"center",marginBottom:18}}>
          <span style={{fontSize:13,fontWeight:700,color:accent.color,padding:"4px 16px",borderRadius:999,background:accent.light,border:`1px solid ${accent.chipBorder}`}}>
            ✦ {name}님의 MY KEY
          </span>
        </div>

        {/* URL display */}
        <div style={{background:"#F5F2EC",borderRadius:14,padding:"12px 16px",marginBottom:14,border:"1px solid #E8E4DC",wordBreak:"break-all"}}>
          <div style={{fontSize:11,color:"#A8A29E",marginBottom:4,fontWeight:600}}>공유 링크</div>
          <div style={{fontSize:12,color:"#4A4540",lineHeight:1.5}}>{url.length > 60 ? url.slice(0, 60) + "..." : url}</div>
        </div>

        {/* Copy button */}
        <button onClick={copyLink} style={{width:"100%",padding:"14px",borderRadius:14,background:copied?"#4A7C59":accent.color,border:"none",color:"white",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"background 0.3s",boxShadow:`0 4px 16px ${accent.color}44`}}>
          {copied ? "✅ 복사됐어요!" : "🔗 링크 복사하기"}
        </button>

        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"#B8B4AE",lineHeight:1.7}}>
          링크를 받은 상대방이 열면<br/>자신의 키워드를 선택하고 매칭 결과를 볼 수 있어요
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   KEYWORD BUILD SECTION (재사용)
───────────────────────────────────────── */
function KeywordBuilder({ selected, setSelected, bio, setBio, isListening, startVoice, stopVoice, accent, accentIdx, setAccentIdx }) {
  const [openSubs, setOpenSubs] = useState(() => {
    const init = {};
    CATEGORIES.forEach(cat => { init[`${cat.id}/0`] = true; });
    return init;
  });

  const toggle = kw => setSelected(s =>
    s.includes(kw) ? s.filter(k => k !== kw) : s.length < 30 ? [...s, kw] : s
  );
  const toggleSub = key => setOpenSubs(o => ({ ...o, [key]: !o[key] }));

  return (
    <>
      {/* Accent picker */}
      <div style={{display:"flex",gap:8,marginBottom:22,alignItems:"center"}}>
        <span style={{fontSize:11,color:"#A8A29E",fontWeight:600}}>테마</span>
        {ACCENTS.map((a, i) => (
          <button key={i} onClick={() => setAccentIdx(i)} style={{width:22,height:22,borderRadius:"50%",background:a.color,border:i===accentIdx?"3px solid #1C1917":"3px solid transparent",cursor:"pointer",transition:"all 0.2s",boxShadow:i===accentIdx?`0 0 0 1px white, 0 0 0 3px ${a.color}`:"none"}}/>
        ))}
        <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:selected.length>=30?accent.color:"#A8A29E",padding:"3px 10px",borderRadius:999,background:"white",border:"1.5px solid #DDD9D2"}}>
          {selected.length}/30
        </span>
      </div>

      {/* Categories */}
      {CATEGORIES.map(cat => (
        <div key={cat.id} style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:34,height:34,borderRadius:10,background:accent.light,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>
              {cat.icon}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:"#1C1917",letterSpacing:"-0.3px"}}>{cat.title}</div>
              <div style={{fontSize:11,color:"#A8A29E"}}>{cat.desc}</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {cat.subs.map((sub, si) => {
              const key = `${cat.id}/${si}`;
              const isOpen = openSubs[key];
              const subSelected = sub.options.filter(o => selected.includes(o));
              return (
                <div key={si} style={{background:"white",borderRadius:14,overflow:"hidden",border:`1.5px solid ${isOpen?"#DDD9D2":"#EAE7E0"}`,boxShadow:isOpen?"0 2px 10px rgba(0,0,0,0.06)":"0 1px 3px rgba(0,0,0,0.04)",transition:"all 0.2s"}}>
                  <button onClick={() => toggleSub(key)} style={{width:"100%",padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,fontWeight:700,color:"#1C1917"}}>{sub.label}</span>
                      {subSelected.length > 0 && (
                        <span style={{fontSize:11,fontWeight:700,color:"white",background:accent.color,padding:"1px 7px",borderRadius:999}}>
                          {subSelected.length}
                        </span>
                      )}
                    </div>
                    <span style={{color:"#A8A29E",fontSize:12,transition:"transform 0.2s",transform:isOpen?"rotate(180deg)":"rotate(0)"}}>▾</span>
                  </button>
                  {isOpen && (
                    <div style={{padding:"0 14px 14px",animation:"subOpen 0.2s ease both"}}>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {sub.options.map(opt => (
                          <OptionTag key={opt} word={opt} selected={selected.includes(opt)} onClick={() => toggle(opt)} accent={accent}/>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Divider */}
      <div style={{display:"flex",alignItems:"center",gap:12,margin:"8px 0 16px"}}>
        <div style={{flex:1,height:1,background:"#DDD9D2"}}/>
        <span style={{fontSize:11,color:"#A8A29E",fontWeight:600,letterSpacing:"1px"}}>자기소개</span>
        <div style={{flex:1,height:1,background:"#DDD9D2"}}/>
      </div>

      {/* Bio */}
      <div style={{marginBottom:24,position:"relative"}}>
        <textarea value={bio} onChange={e => setBio(e.target.value)}
          placeholder={"키워드로 못 담은 나를 표현해보세요\n\n예) \"주말엔 카메라 들고 서울 골목 탐방해요.\""}
          maxLength={150} rows={4}
          style={{width:"100%",padding:"14px 52px 14px 16px",borderRadius:16,background:"white",border:`1.5px solid ${isListening?accent.color:"#DDD9D2"}`,color:"#1C1917",fontSize:14,outline:"none",lineHeight:1.7,transition:"border-color 0.3s",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}/>
        <button onClick={isListening ? stopVoice : startVoice}
          style={{position:"absolute",right:12,top:12,width:34,height:34,borderRadius:"50%",border:`1.5px solid ${isListening?accent.color:"#DDD9D2"}`,background:isListening?accent.color:"white",color:isListening?"white":accent.color,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.25s"}}>
          {isListening ? "⏹" : "🎙️"}
        </button>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:5,padding:"0 2px"}}>
          <div style={{fontSize:11,color:isListening?accent.color:"#B8B4AE",fontWeight:600}}>
            {isListening ? "🔴 듣고 있어요..." : "🎙️ 마이크로 말하기"}
          </div>
          <div style={{fontSize:11,color:"#B8B4AE"}}>{bio.length}/150</div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function MyKey() {
  // Check URL for shared profile
  const urlParams = new URLSearchParams(window.location.search);
  const sharedParam = urlParams.get("p");
  const sharedProfile = sharedParam ? decodeProfile(sharedParam) : null;

  const [step, setStep]           = useState(sharedProfile ? "view_shared" : "landing");
  const [name, setName]           = useState("");
  const [selected, setSelected]   = useState([]);
  const [bio, setBio]             = useState("");
  const [accentIdx, setAccentIdx] = useState(0);
  const [animIn, setAnimIn]       = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [cards, setCards]         = useState([]);
  const [together, setTogether]   = useState([]);

  // For "view_shared" mode — my own keywords to match against
  const [mySelected, setMySelected] = useState([]);
  const [myBio, setMyBio]           = useState("");
  const [myName, setMyName]         = useState("");
  const [myListening, setMyListening] = useState(false);
  const recogRef  = useRef(null);
  const recogRef2 = useRef(null);

  const accent = ACCENTS[accentIdx];

  const matched = (() => {
    if (step === "compare" || step === "cards") {
      // In normal flow, compare against shared profile if available — but here no shared profile scenario
      return [];
    }
    return [];
  })();

  // Matched for compare screen
  const [compareMatched, setCompareMatched] = useState([]);
  const [matchPct, setMatchPct] = useState(0);

  useEffect(() => {
    setAnimIn(false);
    const t = setTimeout(() => setAnimIn(true), 60);
    return () => clearTimeout(t);
  }, [step]);

  const startVoice = (setBioFn, listeningFn, ref) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Chrome 브라우저를 이용해주세요."); return; }
    const r = new SR();
    r.lang = "ko-KR"; r.continuous = false; r.interimResults = true;
    r.onstart  = () => listeningFn(true);
    r.onresult = e => setBioFn(Array.from(e.results).map(x => x[0].transcript).join(""));
    r.onend    = () => listeningFn(false);
    r.onerror  = () => listeningFn(false);
    ref.current = r; r.start();
  };
  const stopVoice = (listeningFn, ref) => { ref.current?.stop(); listeningFn(false); };

  const toggle = kw => setSelected(s =>
    s.includes(kw) ? s.filter(k => k !== kw) : s.length < 30 ? [...s, kw] : s
  );

  const goCompare = (myKws, otherKws) => {
    const m = myKws.filter(k => otherKws.includes(k));
    const pct = myKws.length > 0
      ? Math.round((m.length / Math.max(myKws.length, otherKws.length)) * 100)
      : 0;
    setCompareMatched(m);
    setMatchPct(pct);
    setTogether(buildTogether(m));
    setCards(buildCards(m));
    setStep("compare");
  };

  const fade = {
    opacity: animIn ? 1 : 0,
    transform: animIn ? "translateY(0)" : "translateY(14px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  };

  const CSS = `
    @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#F5F2EC;}
    textarea,input{font-family:'Pretendard','Apple SD Gothic Neo',sans-serif;}
    textarea{resize:none;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:#D5D0C8;border-radius:4px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
    @keyframes cardIn{from{opacity:0;transform:translateY(20px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);}}
    @keyframes popIn{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:scale(1);}}
    @keyframes subOpen{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
  `;

  const NavHeader = ({ onBack, sub }) => (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
      <button onClick={onBack} style={{width:36,height:36,borderRadius:999,background:"#ECEAE4",border:"none",color:"#4A4540",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:9,fontWeight:800,color:accent.color,letterSpacing:"3px",opacity:0.8}}>MY KEY</div>
        <div style={{fontSize:13,color:"#6B6560",fontWeight:600}}>{sub}</div>
      </div>
      <div style={{width:36}}/>
    </div>
  );

  /* ── LANDING ── */
  if (step === "landing") return (
    <div style={{minHeight:"100vh",background:"#F5F2EC",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{...fade,textAlign:"center",maxWidth:380,width:"100%"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 20px",borderRadius:999,background:"white",border:`1.5px solid ${accent.color}33`,boxShadow:`0 2px 16px ${accent.color}22`,marginBottom:28}}>
          <span style={{fontSize:16}}>✦</span>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",lineHeight:1.1}}>
            <span style={{fontSize:"10px",fontWeight:800,color:accent.color,letterSpacing:"3px",opacity:0.8}}>MY KEY</span>
            <span style={{fontSize:"18px",fontWeight:900,color:"#1C1917",letterSpacing:"-0.5px"}}>마이키</span>
          </div>
        </div>
        <h1 style={{fontSize:"clamp(24px,6vw,38px)",fontWeight:900,color:"#1C1917",lineHeight:1.25,letterSpacing:"-1.5px",marginBottom:12}}>
          내 관심사 키워드를<br/>
          <span style={{color:accent.color}}>카드 하나</span>로 공유하세요
        </h1>
        <p style={{color:"#78716C",fontSize:14,lineHeight:1.8,marginBottom:28}}>
          키워드 선택 후 QR코드·링크 공유<br/>상대방이 열면 바로 매칭 결과 확인
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:28}}>
          {ACCENTS.map((a, i) => (
            <button key={i} onClick={() => setAccentIdx(i)} style={{width:24,height:24,borderRadius:"50%",background:a.color,border:i===accentIdx?"3px solid #1C1917":"3px solid transparent",cursor:"pointer",transition:"all 0.2s",boxShadow:i===accentIdx?`0 0 0 2px white, 0 0 0 4px ${a.color}`:"none"}}/>
          ))}
        </div>
        <input placeholder="나의 이름 또는 닉네임" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && setStep("build")}
          style={{width:"100%",padding:"15px 18px",borderRadius:14,background:"white",border:"1.5px solid #DDD9D2",color:"#1C1917",fontSize:15,outline:"none",marginBottom:10,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}/>
        <button onClick={() => name.trim() && setStep("build")}
          style={{width:"100%",padding:"15px",borderRadius:14,background:name.trim()?accent.color:"#DDD9D2",border:"none",color:"white",fontSize:15,fontWeight:800,cursor:name.trim()?"pointer":"default",transition:"all 0.3s",letterSpacing:"-0.3px",boxShadow:name.trim()?`0 4px 20px ${accent.color}55`:"none"}}>
          나의 MY KEY 만들기 →
        </button>
      </div>
    </div>
  );

  /* ── BUILD ── */
  if (step === "build") return (
    <div style={{minHeight:"100vh",background:"#F5F2EC",padding:"28px 20px 48px",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{...fade,maxWidth:480,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22}}>
          <button onClick={() => setStep("landing")} style={{width:36,height:36,borderRadius:999,background:"white",border:"1.5px solid #DDD9D2",color:"#4A4540",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:9,fontWeight:800,color:accent.color,letterSpacing:"3px"}}>MY KEY</div>
            <div style={{fontSize:14,fontWeight:700,color:"#1C1917"}}>{name}님의 마이키</div>
          </div>
          <div style={{width:36}}/>
        </div>

        <KeywordBuilder
          selected={selected} setSelected={setSelected}
          bio={bio} setBio={setBio}
          isListening={isListening}
          startVoice={() => startVoice(setBio, setIsListening, recogRef)}
          stopVoice={() => stopVoice(setIsListening, recogRef)}
          accent={accent} accentIdx={accentIdx} setAccentIdx={setAccentIdx}
        />

        {selected.length >= 3
          ? <button onClick={() => setStep("card")} style={{width:"100%",padding:"16px",borderRadius:16,background:accent.color,border:"none",color:"white",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 24px ${accent.color}55`,letterSpacing:"-0.3px",fontFamily:"'Pretendard',sans-serif"}}>
              나의 MY KEY 카드 완성 ✦
            </button>
          : <div style={{width:"100%",padding:"14px",borderRadius:16,background:"#ECEAE4",border:"1px solid #DDD9D2",color:"#A8A29E",fontSize:13,textAlign:"center"}}>
              키워드를 3개 이상 선택해주세요 ({selected.length}/3)
            </div>
        }
      </div>
    </div>
  );

  /* ── CARD ── */
  if (step === "card") return (
    <div style={{minHeight:"100vh",background:"#F5F2EC",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 48px",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
      <style>{CSS}</style>
      {showShare && <ShareModal name={name} keywords={selected} bio={bio} accent={accent} onClose={() => setShowShare(false)}/>}
      <div style={{...fade,width:"100%",maxWidth:390}}>
        <NavHeader onBack={() => setStep("build")} sub="나의 마이키 카드"/>

        {/* Card */}
        <div style={{borderRadius:28,background:"white",border:"1px solid #E8E4DC",boxShadow:"0 12px 48px rgba(0,0,0,0.12)",marginBottom:20,overflow:"hidden",position:"relative",animation:"popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both"}}>
          <div style={{height:5,background:`linear-gradient(90deg,${accent.color},${accent.color}88)`}}/>
          <div style={{padding:"26px 24px 24px"}}>
            <div style={{fontSize:9,fontWeight:800,color:accent.color,letterSpacing:"3px",marginBottom:16,opacity:0.8}}>MY KEY · 마이키</div>
            <div style={{fontSize:"30px",fontWeight:900,color:"#1C1917",letterSpacing:"-1.5px",marginBottom:6}}>{name}</div>
            <div style={{height:2,width:34,background:accent.color,borderRadius:2,marginBottom:14}}/>
            {bio && <p style={{fontSize:12,color:"#78716C",lineHeight:1.65,marginBottom:14,fontStyle:"italic"}}>"{bio.slice(0, 80)}{bio.length > 80 ? "…" : ""}"</p>}
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
              {selected.map((kw, i) => (
                <span key={kw} style={{padding:"6px 13px",borderRadius:999,background:accent.chip,border:`1.5px solid ${accent.chipBorder}`,color:accent.color,fontSize:12,fontWeight:600,animation:`fadeUp 0.3s ease ${i * 0.04}s both`}}>{kw}</span>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:"1px solid #F0EDE8"}}>
              <div style={{fontSize:10,color:"#C8C4BC"}}>mykey.kr/{name.toLowerCase().replace(/\s/g,"")}</div>
              <div style={{fontSize:11,color:accent.color,fontWeight:700}}>✦ MY KEY</div>
            </div>
          </div>
        </div>

        {/* Share button — primary action */}
        <button onClick={() => setShowShare(true)}
          style={{width:"100%",padding:"16px",borderRadius:16,background:accent.color,border:"none",color:"white",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 24px ${accent.color}55`,letterSpacing:"-0.3px",fontFamily:"inherit",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          📱 QR코드 · 링크 공유하기
        </button>

        <div style={{textAlign:"center",fontSize:12,color:"#A8A29E",lineHeight:1.7,padding:"14px",background:"white",borderRadius:14,border:"1px solid #E8E4DC"}}>
          상대방이 링크를 열면 자신의 키워드를 선택하고<br/>
          <span style={{color:accent.color,fontWeight:700}}>매칭 결과를 바로 확인</span>할 수 있어요
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}`}</style>
    </div>
  );

  /* ── VIEW SHARED (링크 받은 사람이 보는 화면) ── */
  if (step === "view_shared" && sharedProfile) return (
    <div style={{minHeight:"100vh",background:"#F5F2EC",padding:"28px 20px 48px",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{...fade,maxWidth:480,margin:"0 auto"}}>

        {/* Shared person's card */}
        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,color:"#A8A29E",fontWeight:600,textAlign:"center",marginBottom:12,letterSpacing:"0.5px"}}>
            ✦ 공유된 마이키 카드
          </div>
          <div style={{borderRadius:24,background:"white",border:"1px solid #E8E4DC",boxShadow:"0 8px 32px rgba(0,0,0,0.1)",overflow:"hidden"}}>
            <div style={{height:4,background:`linear-gradient(90deg,${accent.color},${accent.color}88)`}}/>
            <div style={{padding:"22px 22px 20px"}}>
              <div style={{fontSize:9,fontWeight:800,color:accent.color,letterSpacing:"3px",marginBottom:12,opacity:0.8}}>MY KEY · 마이키</div>
              <div style={{fontSize:"26px",fontWeight:900,color:"#1C1917",letterSpacing:"-1px",marginBottom:4}}>{sharedProfile.name}</div>
              <div style={{height:2,width:28,background:accent.color,borderRadius:2,marginBottom:12}}/>
              {sharedProfile.bio && <p style={{fontSize:12,color:"#78716C",lineHeight:1.65,marginBottom:12,fontStyle:"italic"}}>"{sharedProfile.bio}"</p>}
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {sharedProfile.keywords.map(kw => (
                  <span key={kw} style={{padding:"5px 12px",borderRadius:999,background:accent.chip,border:`1.5px solid ${accent.chipBorder}`,color:accent.color,fontSize:11,fontWeight:600}}>{kw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{display:"flex",alignItems:"center",gap:12,margin:"0 0 20px"}}>
          <div style={{flex:1,height:1,background:"#DDD9D2"}}/>
          <span style={{fontSize:12,color:"#78716C",fontWeight:700,padding:"6px 14px",borderRadius:999,background:"white",border:"1px solid #DDD9D2"}}>나의 키워드를 선택해주세요</span>
          <div style={{flex:1,height:1,background:"#DDD9D2"}}/>
        </div>

        {/* My name */}
        <input placeholder="내 이름 또는 닉네임" value={myName} onChange={e => setMyName(e.target.value)}
          style={{width:"100%",padding:"13px 16px",borderRadius:13,background:"white",border:"1.5px solid #DDD9D2",color:"#1C1917",fontSize:14,outline:"none",marginBottom:16,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}/>

        {/* My keywords */}
        <KeywordBuilder
          selected={mySelected} setSelected={setMySelected}
          bio={myBio} setBio={setMyBio}
          isListening={myListening}
          startVoice={() => startVoice(setMyBio, setMyListening, recogRef2)}
          stopVoice={() => stopVoice(setMyListening, recogRef2)}
          accent={accent} accentIdx={accentIdx} setAccentIdx={setAccentIdx}
        />

        {mySelected.length >= 3
          ? <button
              onClick={() => goCompare(mySelected, sharedProfile.keywords)}
              style={{width:"100%",padding:"16px",borderRadius:16,background:accent.color,border:"none",color:"white",fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:`0 6px 24px ${accent.color}55`,letterSpacing:"-0.3px",fontFamily:"'Pretendard',sans-serif"}}>
              ✦ {sharedProfile.name}님과 매칭 보기
            </button>
          : <div style={{width:"100%",padding:"14px",borderRadius:16,background:"#ECEAE4",border:"1px solid #DDD9D2",color:"#A8A29E",fontSize:13,textAlign:"center"}}>
              키워드를 3개 이상 선택해주세요 ({mySelected.length}/3)
            </div>
        }
      </div>
    </div>
  );

  /* ── COMPARE ── */
  if (step === "compare") {
    const senderName  = sharedProfile ? sharedProfile.name : name;
    const receiverName = sharedProfile ? (myName || "나") : "상대방";
    return (
      <div style={{minHeight:"100vh",background:"#F5F2EC",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 48px",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
        <style>{CSS}</style>
        <div style={{...fade,width:"100%",maxWidth:390}}>
          <NavHeader onBack={() => setStep(sharedProfile ? "view_shared" : "card")} sub="키워드 매칭 결과"/>

          <div style={{background:"white",borderRadius:24,border:"1px solid #E8E4DC",padding:"22px 20px",marginBottom:14,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:24,marginBottom:18}}>
              {[{label:senderName,color:accent.color},{label:receiverName,color:"#D4533F"}].map((p,i) => (
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{width:54,height:54,borderRadius:"50%",background:`${p.color}18`,border:`2px solid ${p.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 7px"}}>👤</div>
                  <div style={{fontSize:12,color:"#1C1917",fontWeight:700}}>{p.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
              <MatchRing percent={matchPct} color={accent.color}/>
            </div>
            <div style={{textAlign:"center"}}>
              <span style={{fontSize:12,color:accent.color,fontWeight:700,padding:"4px 14px",borderRadius:999,background:accent.light,border:`1px solid ${accent.chipBorder}`}}>
                ✦ {getChemistry(matchPct)}
              </span>
            </div>
          </div>

          {compareMatched.length > 0 && (
            <div style={{background:accent.light,border:`1.5px solid ${accent.chipBorder}`,borderRadius:18,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontSize:11,color:accent.color,fontWeight:800,letterSpacing:"1px",marginBottom:9}}>✦ 공통 키워드</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {compareMatched.map(kw => (
                  <span key={kw} style={{padding:"5px 13px",borderRadius:999,background:accent.color,color:"white",fontSize:12,fontWeight:700}}>✦ {kw}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:"#A8A29E",fontWeight:700,letterSpacing:"1px",marginBottom:9}}>🎯 함께 해보면 좋을 것들</div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {together.map((item, i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:13,padding:"11px 14px",borderRadius:14,background:"white",border:"1px solid #E8E4DC",animation:`fadeUp 0.4s ease ${i * 0.08}s both`}}>
                  <span style={{fontSize:20,flexShrink:0}}>{item.emoji}</span>
                  <div>
                    <div style={{fontSize:13,color:"#1C1917",fontWeight:600,marginBottom:1}}>{item.activity}</div>
                    <div style={{fontSize:11,color:"#A8A29E"}}>{item.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setStep("cards")} style={{width:"100%",padding:"15px",borderRadius:16,background:accent.color,border:"none",color:"white",fontSize:15,fontWeight:900,cursor:"pointer",fontFamily:"inherit",letterSpacing:"-0.5px",boxShadow:`0 6px 24px ${accent.color}44`,marginBottom:9}}>
            🃏 대화 카드 뽑기
          </button>
          <button onClick={() => setStep(sharedProfile ? "view_shared" : "card")} style={{width:"100%",padding:"11px",borderRadius:13,background:"white",border:"1.5px solid #DDD9D2",color:"#78716C",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* ── CARDS ── */
  if (step === "cards") return (
    <div style={{minHeight:"100vh",background:"#F5F2EC",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 60px",fontFamily:"'Pretendard','Apple SD Gothic Neo',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{...fade,width:"100%",maxWidth:390}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <button onClick={() => setStep("compare")} style={{width:36,height:36,borderRadius:999,background:"white",border:"1.5px solid #DDD9D2",color:"#4A4540",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:9,fontWeight:800,color:accent.color,letterSpacing:"3px"}}>MY KEY</div>
            <div style={{fontSize:13,color:"#6B6560",fontWeight:600}}>대화 카드</div>
          </div>
          <button onClick={() => setCards(buildCards(compareMatched))} style={{padding:"6px 12px",borderRadius:999,background:"white",border:`1.5px solid ${accent.chipBorder}`,color:accent.color,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            🔀 섞기
          </button>
        </div>

        {compareMatched.length > 0 && (
          <div style={{display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",margin:"12px 0 6px"}}>
            {compareMatched.map(kw => (
              <span key={kw} style={{fontSize:10,padding:"3px 10px",borderRadius:999,background:accent.light,border:`1px solid ${accent.chipBorder}`,color:accent.color,fontWeight:700}}>✦ {kw}</span>
            ))}
          </div>
        )}

        <div style={{textAlign:"center",marginBottom:18,marginTop:10}}>
          <p style={{fontSize:13,color:"#A8A29E",lineHeight:1.8}}>
            공통 관심사에서 뽑은 대화 카드예요<br/>
            <span style={{color:accent.color,fontWeight:600}}>탭해서</span> 열어보세요 ✦
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {cards.map((card, i) => (
            <FlipCard key={`${i}-${card.q}`} index={i} emoji={card.emoji} question={card.q} accent={accent}/>
          ))}
        </div>

        <div style={{marginTop:24,textAlign:"center",padding:"18px",borderRadius:18,background:"white",border:"1px solid #E8E4DC"}}>
          <div style={{fontSize:20,marginBottom:7}}>✨</div>
          <div style={{fontSize:12,color:"#A8A29E",lineHeight:1.8}}>카드를 다 열었으면<br/>이제 진짜 대화할 차례예요</div>
        </div>
      </div>
    </div>
  );

  return null;
}
