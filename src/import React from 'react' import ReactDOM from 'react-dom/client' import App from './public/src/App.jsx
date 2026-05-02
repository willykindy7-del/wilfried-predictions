import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@400;500;600;700&family=Tajawal:wght@400;700;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    corps { arrière-plan : #060D1A; police : 'Rajdhani', 'Tajawal', sans-serif; couleur : #F0F4FF; débordement horizontal : masqué; }
    ::-webkit-scrollbar { largeur: 3px; }
    ::-webkit-scrollbar-track { background: #0D1F3C; }
    ::-webkit-scrollbar-thumb { background: #1E90FF; border-radius: 2px; }
    @keyframes shimmer-gold {
      0% { background-position: -300% centre; }
      100% { background-position: 300% centre; }
    }
    @keyframes glow-pulse {
      0%,100% { text-shadow: 0 0 12px rgba(30,144,255,0.6), 0 0 30px rgba(30,144,255,0.3); }
      50% { text-shadow: 0 0 24px rgba(30,144,255,0.9), 0 0 50px rgba(30,144,255,0.5); }
    }
    @keyframes rotate-ball { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes bordure-dorée-pulse {
      0%,100% { box-shadow: 0 0 10px rgba(255,215,0,0.15), inset 0 0 10px rgba(255,215,0,0.03); }
      50% { box-shadow: 0 0 22px rgba(255,215,0,0.3), inset 0 0 15px rgba(255,215,0,0.07); }
    }
    .shimmer-gold {
      arrière-plan : gradient linéaire (90°, #7a5c00 0 %, #c9a000 15 %, #FFD700 30 %, #FFF5A0 45 %, #FFD700 60 %, #c9a000 75 %, #7a5c00 100 %) ;
      taille de fond : 300 % auto ;
      -webkit-background-clip : texte ;
      background-clip : texte ;
      -webkit-text-fill-color: transparent;
      animation : shimmer-gold 3s linéaire infinie ;
    }
    .glow-blue { animation: glow-pulse 2.5s ease-in-out infinite; }
    .glass-card { background: rgba(13,31,60,0.82); border: 1px solid rgba(30,58,95,0.9); border-radius: 16px; backdrop-filter: blur(14px); }
    .gold-card { background: rgba(13,31,60,0.82); border: 1px solid rgba(255,215,0,0.25); border-radius: 16px; backdrop-filter: blur(14px); animation: gold-border-pulse 3s ease-in-out infinite; }
    .input-wilfried { width: 100%; background: rgba(10,22,40,0.9); border: 1px solid #1E3A5F; border-radius: 10px; padding: 11px 14px; color: #F0F4FF; font-family: 'Rajdhani', sans-serif; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.25s, box-shadow 0.25s; }
    .input-wilfried::placeholder { color: rgba(240,244,255,0.28); }
    .input-wilfried:focus { border-color: #1E90FF; box-shadow: 0 0 0 3px rgba(30,144,255,0.12), 0 0 18px rgba(30,144,255,0.08); }
    .btn-primary { width: 100%; padding: 17px; background: linear-gradient(130deg, #c9a000 0%, #FFD700 40%, #1E90FF 100%); border: none; border-radius: 14px; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-weight: 900; font-size: 1.1rem; color: #060D1A; letter-spacing: 0.06em; box-shadow: 0 8px 28px rgba(30,144,255,0.28), 0 0 0 1px rgba(255,215,0,0.18); transition: transform 0.15s, box-shadow 0.15s; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(30,144,255,0.4); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { background: rgba(30,58,95,0.8); color: rgba(240,244,255,0.3); box-shadow: none; cursor: not-allowed; }
    .nav-btn { flex: 1; background: none; border: none; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 7px 4px; transition: color 0.2s; }
    .section-label { font-size: 0.72rem; color: #FFD700; font-family: 'Rajdhani', sans-serif; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 13px; }
    .field-label { display: block; font-size: 0.72rem; color: #1E90FF; font-family: 'Rajdhani', sans-serif; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
    .tag-pill { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; border: 1px solid; font-family: 'Rajdhani', sans-serif; font-weight: 800; font-size: 0.82rem; }
    .spin { animation: rotate-ball 0.8s linear infinite; display: inline-block; }
  `}</style>
);

const QUOTES = [
  { texte : "Le risque vient de ne pas savoir ce que vous faites.", auteur : "Warren Buffett" },
  { texte : "Ce qui compte c'est combien vous gagnez quand vous avez raison.", auteur : "George Soros" },
  { text: "L'argent se fait en attendant, pas en tradant.", author: "Jesse Livermore" },
  { texte : "La discipline est la frontière entre les gagnants et les perdants.", auteur : "Peter Lynch" },
  { texte : "Analyser. Décider. Gagné.", auteur : "WILFRIED™" },
  { texte : "N'investissez jamais dans une entreprise que vous ne pouvez pas comprendre.", auteur : "Warren Buffett" },
];

const callClaude = async (userPrompt, systemPrompt, maxTokens = 1000) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    méthode : « POST »,
    en-têtes : { "Content-Type": "application/json" },
    corps : JSON.stringify({
      modèle : "claude-sonnet-4-20250514",
      max_tokens : maxTokens,
      système : invite système,
      messages: [{ role: "utilisateur", content: userPrompt }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  retourner data.content?.[0]?.text || "";
};

const safeJSON = (texte) => {
  essayer {
    const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    renvoie JSON.parse(propre);
  } attraper {
    const m = text.match(/\{[\s\S]*\}/);
    si (m) retourner JSON.parse(m[0]);
    lancer une nouvelle erreur("Échec de l'analyse");
  }
};

const Header = () => {
  const lettres = "WILFRIED™".split("");
  retour (
    <div style={{ textAlign: "center", padding: "30px 16px 14px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "340px", height: "140px", background: "radial-gradient(ellipse, rgba(30,144,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1px", marginBottom: "6px" }}>
        {lettres.map((l, i) => (
          <motion.span key={i} className="shimmer-gold glow-blue"
            initial={{ opacité: 0, y: -28, échelle: 0.7 }}
            animate={{ opacité: 1, y: 0, échelle: 1 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 220, damping: 14 }}
            style={{ fontFamily: '"Cinzel Decorative", serif', fontSize: "clamp(1.6rem, 6.5vw, 2.8rem)", fontWeight: 900, letterSpacing: "0.04em", lineHeight: 1.1 }}
          >{l === " " ? "\u00A0" : l}</motion.span>
        ))}
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
        style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.78rem", color: "#1E90FF", letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700, marginBottom: "10px" }}>
        Prédictions • Intelligence Artificielle
      </motion.div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: 180 }} transition={{ delay: 1, duration: 0.9, ease: "easeOut" }}
          style={{ height: "2px", background: "linear-gradient(90deg, transparent, #FFD700, #1E90FF, transparent)", borderRadius: "1px" }} />
      </div>
    </div>
  );
};

const ACInput = ({ label, icon, value, onChange, suggestions, onSelect, loading, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  utiliserEffect(() => { setOpen(suggestions.length > 0 && value.length >= 2); }, [suggestions, value]);
  utiliserEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  retour (
    <div ref={ref} style={{ position: "relative" }}>
      <label className="field-label">{icon} {label}</label>
      <div style={{ position: "relative" }}>
        <input className="input-wilfried" value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => suggestions.length > 0 && setOpen(true)} placeholder={placeholder} />
        {loading && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}><span className="spin" style={{ color: "#1E90FF", fontSize: "1rem" }}>â—Œ</span></div>}
      </div>
      <AnimatePresence>
        {ouvrir && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 999, background: "#0D1F3C", border: "1px solid #1E90FF", borderRadius: 10, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.6)", maxHeight: 210, overflowY: "auto" }}>
            {suggestions.map((s, i) => (
              <div key={i} onMouseDown={() => { onSelect(s); setOpen(false); }}
                style={{ padding: "10px 14px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? "1px solid rgba(30,58,95,0.6)" : "none", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.92rem", transition: "background 0.15s", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(30,144,255,0.13)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                {s.flag && <span>{s.flag}</span>}
                <span style={{ color: "#F0F4FF" }}>{s.name}</span>
                {s.detail && <span style={{ color: "#1E90FF", fontSize: "0.75rem", marginLeft: "auto" }}>{s.detail}</span>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FormSelector = ({étiquette, formulaire, onChange }) => {
  const opts = ["V", "N", "D"];
  const couleurs = { V: "#00C853", N: "#FFA000", D: "#FF1744" };
  retour (
    <div>
      <label className="field-label" style={{ marginBottom: 9 }}>{label}</label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {form.map((val, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: "0.6rem", color: "rgba(240,244,255,0.35)", fontFamily: "Rajdhani" }}>J{i + 1}</span>
            {opts.map((opt) => (
              <button key={opt} onClick={() => { const f = [...form]; f[i] = f[i] === opt ? null : opt; onChange(f); }}
                style={{ width: 34, height: 21, borderRadius: 5, border: "none", cursor: "pointer", fontSize: "0.68rem", fontWeight: 900, fontFamily: "Rajdhani, sans-serif", background: val === opt ? colors[opt] : "rgba(30,58,95,0.5)", color: val === opt ? "#fff" : "rgba(240,244,255,0.35)", transform: val === opt ? "scale(1.12)" : "scale(1)", transition: "all 0.18s", boxShadow: val === opt ? `0 0 8px ${colors[opt]}60` : "none" }}>
                {opter}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfidenceMeter = ({ valeur }) => {
  const R = 50; const circ = 2 * Math.PI * R; const offset = circ - (valeur / 100) * circ;
  const couleur = valeur >= 90 ? "#00C853" : valeur >= 75 ? "#FFA000" : "#FF1744";
  retour (
    <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto" }}>
      <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(30,58,95,0.5)" strokeWidth="8" />
        <motion.circle cx="65" cy="65" r={R} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }} style={{ filter: `drop-shadow(0 0 7px ${color})` }} />
      </svg>
      <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9, type: "spring", stiffness: 220 }}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
        <div style={{ fontSize: "1.65rem", fontWeight: 900, color, fontFamily: "Rajdhani", lineHeight: 1 }}>{value}%</div>
        <div style={{ fontSize: "0.58rem", color: "rgba(240,244,255,0.5)", letterSpacing: "0.12em", fontFamily: "Rajdhani" }}>PRÉCISION</div>
      </motion.div>
    </div>
  );
};

const BottomNav = ({ active, onChange }) => {
  const tabs = [{ id : "home", icône : "ðŸ ", label : "Accueil" }, { id : "history", icône : "ðŸ"‹", label : "Historique" }, { id : "programme", icône : "ðŸ"…", label : "Programme" }];
  retour (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 500, zIndex: 500, background: "rgba(6,13,26,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(30,58,95,0.8)", display: "flex" }}>
      {tabs.map((t) => (
        <button key={t.id} className="nav-btn" onClick={() => onChange(t.id)}>
          <motion.span animate={{ scale: active === t.id ? 1.25 : 1 }} style={{ fontSize: "1.25rem" }}>{t.icon}</motion.span>
          <span style={{ fontSize: "0.62rem", fontFamily: "Rajdhani", fontWeight: 700, letterSpacing: "0.05em", color: active === t.id ? "#1E90FF" : "rgba(240,244,255,0.35)" }}>{t.label}</span>
          {active === t.id && <motion.div layoutId="nav-bar" style={{ height: 2, width: 22, background: "#1E90FF", borderRadius: 1, boxShadow: "0 0 8px #1E90FF" }} />}
        </button>
      ))}
    </div>
  );
};

const HistoryItem = ({ item, onUpdate }) => {
  const sc = item.status === "won" ? "#00C853" : item.status === "lost" ? "#FF1744" : "#FFA000";
  const sl = item.status === "gagné" ? "âœ… Gagné" : item.status === "perdu" ? "â Œ Perdu" : "â ³ En attente";
  retour (
    <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: 14, marginBottom: 10, borderColor: `${sc}35` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontFamily: "Rajdhani", fontWeight: 800, fontSize: "0.98rem", color: "#F0F4FF" }}>{item.homeTeam} <span style={{ color: "#FFD700" }}>vs</span> {item.awayTeam}</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(240,244,255,0.4)", fontFamily: "Rajdhani" }}>{item.competition} · {new Date(item.date).toLocaleDateString("fr-FR")}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "Cinzel Decorative, serif", fontWeight: 900, fontSize: "1.1rem", color: "#FFD700" }}>{item.scoreExact}</div>
          <div style={{ fontSize: "0.72rem", color: sc, fontWeight: 700, fontFamily: "Rajdhani" }}>{sl}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.78rem", fontFamily: "Rajdhani", color: "rgba(240,244,255,0.5)" }}>Confiance : <b style={{ color: item.confiance >= 90 ? "#00C853" : "#FFA000" }}>{item.confiance}%</b></span>
        {item.status === "en attente" && (
          <div style={{ display: "flex", gap: 6 }}>
            {[{ s: "gagné", l: "âœ… Gagné", c: "#00C853" }, { s: "perdu", l: "â Œ Perdu", c: "#FF1744" }].map(({ s, l, c }) => (
              <button key={s} onClick={() => onUpdate(item.id, s)} style={{ background: `${c}18`, border: `1px solid ${c}`, color: c, borderRadius: 6, padding: "3px 9px", cursor: "pointer", fontSize: "0.72rem", fontFamily: "Rajdhani", fontWeight: 700 }}>{l}</button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MotivationBanner = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 8000); return () => clearInterval(t); }, []);
  retour (
    <div className="gold-card" style={{ padding: 16, margin: "14px 0", borderLeft: "3px solid #FFD700" }}>
      <div style={{ fontSize: "0.68rem", color: "#FFD700", fontFamily: "Rajdhani", fontWeight: 700, letterSpacing: "0.12em", marginBottom: 5 }}>ðŸ'¡ CITATION DU MOMENT</div>
      <AnimatePresence mode="attendre">
        <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45 }}>
          <div style={{ fontFamily: "Tajawal, Rajdhani, sans-serif", fontStyle: "italic", fontSize: "0.92rem", color: "#F0F4FF", lineHeight: 1.45, marginBottom: 5 }}>Â« {QUOTES[idx].text} Â»</div>
          <div style={{ fontSize: "0.78rem", color: "#1E90FF", fontFamily: "Rajdhani", fontWeight: 700 }}>— {QUOTES[idx].author}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [compétition, setCompetition] = useState("");
  const [odds, setOdds] = useState({ home: "", draw: "", away: "" });
  const [homeForm, setHomeForm] = useState(Array(5).fill(null));
  const [awayForm, setAwayForm] = useState(Array(5).fill(null));
  const [homeStats, setHomeStats] = useState({ marked: "", conceded: "" });
  const [awayStats, setAwayStats] = useState({ marked: "", conceded: "" });
  const [sugg, setSugg] = useState({ home: [], away: [], comp: [] });
  const [acLoad, setAcLoad] = useState({ home: false, away: false, comp: false });
  const minuteurs = useRef({});
  const [pred, setPred] = useState(null);
  const [chargement, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [history, setHistory] = useState([]);
  const [histFilter, setHistFilter] = useState("all");
  const [picks, setPicks] = useState(null);
  const [picksLoad, setPicksLoad] = useState(false);

  const handleAC = (type, val) => {
    si (type === "home") setHomeTeam(val);
    sinon si (type === "absent") setAwayTeam(val);
    sinon setCompetition(val);
    si (timers.current[type]) effacerTimeout(timers.current[type]);
    si (val.length < 2) { setSugg((s) => ({ ...s, [type]: [] })); return; }
    timers.current[type] = setTimeout(async () => {
      setAcLoad((l) => ({ ...l, [type]: true }));
      essayer {
        const sys = "Répond UNIQUEMENT avec un tableau JSON valide, sans markdown ni backticks.";
        const prompt = type === "comp"
          ? `Liste 6 compétitions de football professionnel contenant "${val}". JSON : [{"name":"...","detail":"Confédération"}]`
          : `Liste 6 clubs de football ou sélections contenant "${val}". JSON : [{"name":"...","flag":"ðŸ ³ï¸ ","detail":"Pays/Ligue"}]`;
        const txt = await callClaude(prompt, sys, 400);
        const arr = safeJSON(txt);
        setSugg((s) => ({ ...s, [type]: Array.isArray(arr) ? arr.slice(0, 6) : [] }));
      } catch { setSugg((s) => ({ ...s, [type]: [] })); }
      finally { setAcLoad((l) => ({ ...l, [type]: false })); }
    }, 620);
  };

  const impl = (o) => { const n = parseFloat(o); return n > 0 ? `${(1 / n * 100).toFixed(0)}%` : "â€”"; };

  const generate = async () => {
    if (!homeTeam || !awayTeam) { setError("Veuillez saisir les deux équipes."); retour; }
    setLoading(true); setErreur(""); setPred(null);
    const formStr = (f) => f.map((x) => x || "?").join("-");
    essayer {
      const sys = `Tu es WILFRIED™, analyste football IA d'élite ultra-précis. Tu réponds UNIQUEMENT en JSON valide sans markdown ni backticks. Tes prédictions sont détaillées, confiantes et structurées. Tu réponds en français.`;
      const prompt = `Analyser ce match :
ðŸ Domicile : ${homeTeam} 
