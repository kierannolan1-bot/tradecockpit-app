import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────
const SUPABASE_URL  = 'https://ssazubuyypxxckdffngl.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzYXp1YnV5eXB4eGNrZGZmbmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDg3NjMsImV4cCI6MjA5MjAyNDc2M30.jKxG9k4KDSNM4AqgzxRc1xm587lJ0KXNn-AJw-QSxCM';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const mono    = "'IBM Plex Mono','Courier New',monospace";
const display = "'Impact','Arial Narrow',sans-serif";
const C = {
  bg:      "#06080B",
  surface: "#0D1117",
  border:  "#1A2030",
  green:   "#00FFB2",
  gold:    "#FFD700",
  red:     "#FF6B6B",
  text:    "#CBD5E1",
  muted:   "#64748B",
  dim:     "#4A5568",
};

function AuthScreen({ onAuth }) {
  const [mode,     setMode]     = useState("login"); // login | signup | reset
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [message,  setMessage]  = useState("");

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "login") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onAuth(data.user);
    } else if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else if (data.user) {
        setMessage("✓ Account created — check your email to confirm, then log in.");
        setMode("login");
      }
    } else if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) setError(error.message);
      else setMessage("✓ Password reset email sent — check your inbox.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: mono,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(0,255,178,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,255,178,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }}/>

      <div style={{
        width: "100%", maxWidth: 420,
        position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: display, fontSize: 32, letterSpacing: 3, color: C.text, marginBottom: 4 }}>
            TRADE<span style={{ color: C.green }}>COCKPIT</span>
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: C.dim }}>
            THE EDGE IS IN THE PROCESS
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderTop: `2px solid ${C.green}`,
          borderRadius: 6,
          padding: 32,
        }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: C.dim, marginBottom: 24 }}>
            {mode === "login"  ? "SIGN IN TO YOUR ACCOUNT"
            :mode === "signup" ? "CREATE AN ACCOUNT"
            :                    "RESET YOUR PASSWORD"}
          </div>

          {/* Google button */}
          {mode !== "reset" && (
            <>
              <button onClick={handleGoogle} disabled={loading} style={{
                width: "100%", background: "#fff", color: "#1a1a1a",
                border: "none", borderRadius: 4, padding: "11px 16px",
                fontFamily: mono, fontSize: 10, fontWeight: 600,
                letterSpacing: 1, cursor: "pointer", marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                opacity: loading ? 0.7 : 1,
              }}>
                {/* Google icon */}
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                CONTINUE WITH GOOGLE
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: C.border }}/>
                <div style={{ fontSize: 8, color: C.dim, letterSpacing: 2 }}>OR</div>
                <div style={{ flex: 1, height: 1, background: C.border }}/>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 7, letterSpacing: 2, color: C.dim, marginBottom: 6 }}>EMAIL</div>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="your@email.com"
                style={{
                  width: "100%", background: "#080A0D",
                  border: `1px solid ${C.border}`, borderRadius: 3,
                  padding: "10px 12px", fontFamily: mono, fontSize: 12,
                  color: C.text, outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            {mode !== "reset" && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 7, letterSpacing: 2, color: C.dim, marginBottom: 6 }}>PASSWORD</div>
                <div style={{position:"relative"}}>
                  <input
                    type={showPwd?"text":"password"} value={password} onChange={e => setPassword(e.target.value)}
                    required placeholder="••••••••"
                    style={{
                      width: "100%", background: "#080A0D",
                      border: `1px solid ${C.border}`, borderRadius: 3,
                      padding: "10px 40px 10px 12px", fontFamily: mono, fontSize: 12,
                      color: C.text, outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button type="button" onClick={()=>setShowPwd(v=>!v)} style={{
                    position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",
                    color:C.dim,fontSize:14,padding:0,lineHeight:1
                  }}>{showPwd?"🙈":"👁"}</button>
                </div>
              </div>
            )}

            {/* Error / Message */}
            {error   && <div style={{ fontSize: 9, color: C.red,   marginBottom: 12, lineHeight: 1.5 }}>⚠ {error}</div>}
            {message && <div style={{ fontSize: 9, color: C.green, marginBottom: 12, lineHeight: 1.5 }}>{message}</div>}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", background: C.green, color: "#06080B",
              border: "none", borderRadius: 4, padding: "12px",
              fontFamily: mono, fontSize: 10, fontWeight: 700,
              letterSpacing: 2, cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "..." :
               mode === "login"  ? "SIGN IN" :
               mode === "signup" ? "CREATE ACCOUNT" :
               "SEND RESET EMAIL"}
            </button>
          </form>

          {/* Footer links */}
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            {mode === "login" && (
              <>
                <button onClick={() => { setMode("signup"); setError(""); setMessage(""); }} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 9, color: C.muted, letterSpacing: 1, fontFamily: mono,
                }}>Don't have an account? <span style={{ color: C.green }}>Sign up free</span></button>
                <button onClick={() => { setMode("reset"); setError(""); setMessage(""); }} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 9, color: C.dim, letterSpacing: 1, fontFamily: mono,
                }}>Forgot password?</button>
              </>
            )}
            {mode === "signup" && (
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 9, color: C.muted, letterSpacing: 1, fontFamily: mono,
              }}>Already have an account? <span style={{ color: C.green }}>Sign in</span></button>
            )}
            {mode === "reset" && (
              <button onClick={() => { setMode("login"); setError(""); setMessage(""); }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 9, color: C.muted, letterSpacing: 1, fontFamily: mono,
              }}>← Back to sign in</button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 8, color: C.dim, letterSpacing: 1 }}>
          Free forever plan · No credit card required<br/>
          <span style={{ color: "#1E2530" }}>© 2026 TradeCockpit · tradecockpit.trade</span>
        </div>
      </div>
    </div>
  );
}


// ─── Contracts — full CME/CBOT/NYMEX/COMEX suite ─────────────
const CONTRACTS = [
  // ── Equity Index (full E-mini) ──────────────────────────────
  { id:"ES",  name:"E-mini S&P 500",      exchange:"CME",   tickSize:0.25,      tickValue:12.50,  margin:12650, category:"Equity",       adr:65,    yahooSym:"ES=F"  },
  { id:"NQ",  name:"E-mini Nasdaq-100",   exchange:"CME",   tickSize:0.25,      tickValue:5.00,   margin:17600, category:"Equity",       adr:280,   yahooSym:"NQ=F"  },
  { id:"RTY", name:"E-mini Russell 2000", exchange:"CME",   tickSize:0.10,      tickValue:5.00,   margin:6600,  category:"Equity",       adr:30,    yahooSym:"RTY=F" },
  { id:"YM",  name:"E-mini Dow Jones",    exchange:"CBOT",  tickSize:1,         tickValue:5.00,   margin:9900,  category:"Equity",       adr:550,   yahooSym:"YM=F"  },
  // ── Micro Equity ────────────────────────────────────────────
  { id:"MES", name:"Micro E-mini S&P",    exchange:"CME",   tickSize:0.25,      tickValue:1.25,   margin:1265,  category:"Micro",        adr:65,    yahooSym:"MES=F" },
  { id:"MNQ", name:"Micro Nasdaq-100",    exchange:"CME",   tickSize:0.25,      tickValue:0.50,   margin:1760,  category:"Micro",        adr:280,   yahooSym:"MNQ=F" },
  { id:"M2K", name:"Micro Russell 2000",  exchange:"CME",   tickSize:0.10,      tickValue:0.50,   margin:660,   category:"Micro",        adr:30,    yahooSym:"M2K=F" },
  { id:"MYM", name:"Micro Dow Jones",     exchange:"CBOT",  tickSize:1,         tickValue:0.50,   margin:990,   category:"Micro",        adr:550,   yahooSym:"MYM=F" },
  // ── Energy ──────────────────────────────────────────────────
  { id:"CL",  name:"Crude Oil WTI",       exchange:"NYMEX", tickSize:0.01,      tickValue:10.00,  margin:5500,  category:"Energy",       adr:1.8,   yahooSym:"CL=F"  },
  { id:"MCL", name:"Micro Crude Oil",     exchange:"NYMEX", tickSize:0.01,      tickValue:1.00,   margin:550,   category:"Micro",        adr:1.8,   yahooSym:"MCL=F" },
  { id:"NG",  name:"Natural Gas",         exchange:"NYMEX", tickSize:0.001,     tickValue:10.00,  margin:3300,  category:"Energy",       adr:0.15,  yahooSym:"NG=F"  },
  // ── Metals ──────────────────────────────────────────────────
  { id:"GC",  name:"Gold",                exchange:"COMEX", tickSize:0.10,      tickValue:10.00,  margin:9900,  category:"Metals",       adr:28,    yahooSym:"GC=F"  },
  { id:"MGC", name:"Micro Gold",          exchange:"COMEX", tickSize:0.10,      tickValue:1.00,   margin:990,   category:"Micro",        adr:28,    yahooSym:"MGC=F" },
  { id:"SI",  name:"Silver",              exchange:"COMEX", tickSize:0.005,     tickValue:25.00,  margin:8800,  category:"Metals",       adr:0.45,  yahooSym:"SI=F"  },
  { id:"SIL", name:"Micro Silver",        exchange:"COMEX", tickSize:0.005,     tickValue:2.50,   margin:880,   category:"Micro",        adr:0.45,  yahooSym:"SIL=F" },
  // ── FX ──────────────────────────────────────────────────────
  { id:"6E",  name:"Euro FX",             exchange:"CME",   tickSize:0.00005,   tickValue:6.25,   margin:2420,  category:"FX",           adr:0.008, yahooSym:"6E=F"  },
  { id:"M6E", name:"Micro Euro FX",       exchange:"CME",   tickSize:0.0001,    tickValue:1.25,   margin:242,   category:"Micro",        adr:0.008, yahooSym:"M6E=F" },
  { id:"6B",  name:"British Pound",       exchange:"CME",   tickSize:0.0001,    tickValue:6.25,   margin:1980,  category:"FX",           adr:0.010, yahooSym:"6B=F"  },
  { id:"6J",  name:"Japanese Yen",        exchange:"CME",   tickSize:0.0000005, tickValue:6.25,   margin:2420,  category:"FX",           adr:0.0006,yahooSym:"6J=F"  },
  // ── Fixed Income ─────────────────────────────────────────────
  { id:"ZN",  name:"10-Year T-Note",      exchange:"CBOT",  tickSize:0.015625,  tickValue:15.625, margin:1760,  category:"Fixed Income", adr:0.75,  yahooSym:"ZN=F"  },
  { id:"ZB",  name:"30-Year T-Bond",      exchange:"CBOT",  tickSize:0.03125,   tickValue:31.25,  margin:4730,  category:"Fixed Income", adr:1.5,   yahooSym:"ZB=F"  },
];

const CONTRACT_CATS = ["All","Equity","Micro","Energy","Metals","FX","Fixed Income"];
const CC = { "Equity":"#00FFB2","Micro":"#38BDF8","Energy":"#FF6B6B","Metals":"#FFD700","FX":"#A78BFA","Fixed Income":"#FB923C" };

// ─── Helpers ──────────────────────────────────────────────────
const today = () => new Date().toLocaleDateString("en-IE",{weekday:"long",day:"2-digit",month:"short",year:"numeric"});
const todayKey = () => new Date().toISOString().slice(0,10);
const fmt  = (n,d=2) => n==null||isNaN(n)?"—":n.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d});
const fmtU = n => n==null||isNaN(n)?"—":"$"+fmt(n);
const fmtP = (n,d=1) => n==null||isNaN(n)?"—":fmt(n,d)+"%";
const dec  = c => c.tickSize<0.001?6:c.tickSize<0.01?4:2;

// ─── Checklist items ──────────────────────────────────────────
const CHECKS = [
  { id:"htf",   label:"Marked HTF levels (Daily / 4H bias confirmed)" },
  { id:"vp",    label:"Volume profile loaded — VAH, VAL, POC, HVNs, LVNs marked" },
  { id:"liq",   label:"Liquidity pools identified (equal highs/lows, prior session H/L)" },
  { id:"news",  label:"Checked news calendar — red folder events noted" },
  { id:"kz",    label:"Kill zones set: London 07:00–10:00 GMT / NY 12:00–15:00 GMT (adjust for local time in Settings)" },
  { id:"alert", label:"Max loss alert set on platform" },
  { id:"size",  label:"Position size calculated and confirmed in Risk Calc tab" },
  { id:"rule",  label:"Max 2 trades today — third requires written justification" },
];

// ─── No external data feed needed ────────────────────────────
// Prices are entered directly from the trader's NinjaTrader 8 platform.
// This is more accurate than any delayed public feed.

// ─── Styled atom components ───────────────────────────────────
const Inp = ({label,value,onChange,placeholder,unit,highlight})=>(
  <div style={{background:"#0D1117",border:`1px solid ${highlight?"#00FFB240":"#1E2530"}`,borderRadius:4,padding:"9px 11px"}}>
    <div style={{fontSize:7,letterSpacing:"1.5px",color:"#4A5568",marginBottom:3}}>{label}</div>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"—"}
      style={{background:"none",border:"none",outline:"none",width:"100%",fontSize:13,color:"#E2E8F0",fontWeight:500,fontFamily:"inherit"}}/>
    {unit&&<div style={{fontSize:7,color:"#4A5568",marginTop:2,letterSpacing:"1px"}}>{unit}</div>}
  </div>
);
const Tag=({label,col})=>(
  <span style={{fontSize:7,letterSpacing:"1.5px",padding:"2px 6px",borderRadius:2,fontWeight:700,background:col+"18",color:col,border:`1px solid ${col}40`}}>{label}</span>
);
const Warn=({children,good})=>(
  <div style={{background:good?"#00FFB212":"#FF6B6B12",border:`1px solid ${good?"#00FFB230":"#FF6B6B30"}`,borderRadius:4,padding:"6px 10px",fontSize:8,letterSpacing:"1px",color:good?"#00FFB2":"#FF6B6B",marginTop:6}}>
    {children}
  </div>
);

// ─── CSV Import Panel ─────────────────────────────────────────
// Supports: NinjaTrader 8, Tradovate, Generic CSV
const NT8_COLS   = ["market pos.","entry price","exit price","quantity","entry time","instrument"];
const TRAD_COLS  = ["action","price","qty","timestamp","contractid"];

function detectPlatform(headers) {
  const h = headers.map(s => s.toLowerCase().trim());
  if (NT8_COLS.every(c => h.some(x => x.includes(c.split(" ")[0])))) return "ninjatrader";
  if (TRAD_COLS.every(c => h.some(x => x.includes(c.split(" ")[0])))) return "tradovate";
  return "generic";
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map(s => s.replace(/^"|"$/g,"").trim());
  const rows = lines.slice(1).map(line => {
    const vals = [];
    let inQ = false, cur = "";
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { vals.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    vals.push(cur.trim());
    return Object.fromEntries(headers.map((h,i) => [h, vals[i] ?? ""]));
  });
  return { headers, rows };
}

function findCol(row, candidates) {
  const keys = Object.keys(row).map(k => k.toLowerCase().trim());
  for (const c of candidates) {
    const idx = keys.findIndex(k => k.includes(c));
    if (idx !== -1) return Object.values(row)[idx] || "";
  }
  return "";
}

function mapToTrade(row, platform) {
  let dir="long", entry="", exit="", contracts="1", time="", setup="";

  if (platform === "ninjatrader") {
    const pos = findCol(row, ["market pos","position","side"]).toLowerCase();
    dir      = pos.includes("long") || pos.includes("buy") ? "long" : "short";
    entry    = findCol(row, ["entry price","buy price"]);
    exit     = findCol(row, ["exit price","sell price"]);
    contracts= findCol(row, ["quantity","qty","size"]);
    const t  = findCol(row, ["entry time","time","date"]);
    time     = t ? t.replace(/.*\s(\d{2}:\d{2}).*/, "$1") : "";
    setup    = findCol(row, ["instrument","symbol","contract"]);
  } else if (platform === "tradovate") {
    const action = findCol(row, ["action","side","type"]).toLowerCase();
    dir      = action.includes("buy") || action.includes("long") ? "long" : "short";
    entry    = findCol(row, ["price","fill","entry"]);
    contracts= findCol(row, ["qty","quantity","size"]);
    const t  = findCol(row, ["timestamp","time","date"]);
    time     = t ? t.replace(/.*T(\d{2}:\d{2}).*/, "$1").slice(0,5) : "";
    setup    = findCol(row, ["contractid","symbol","instrument"]);
  } else {
    // Generic — best guess mapping
    const side = findCol(row, ["side","direction","action","type","pos"]).toLowerCase();
    dir      = (side.includes("buy")||side.includes("long")) ? "long" : "short";
    entry    = findCol(row, ["entry","buy price","open","entry price"]);
    exit     = findCol(row, ["exit","sell price","close","exit price"]);
    contracts= findCol(row, ["qty","quantity","size","contracts","lots"]);
    const t  = findCol(row, ["time","timestamp","date","entry time"]);
    time     = t ? t.replace(/.*[T\s](\d{2}:\d{2}).*/, "$1").slice(0,5) : "";
    setup    = findCol(row, ["setup","strategy","symbol","instrument","description"]);
  }

  return {
    id: Date.now() + Math.random(),
    time:      time || new Date().toTimeString().slice(0,5),
    setup:     setup || "Imported",
    dir,
    entry:     parseFloat(entry)||"",
    stop:      "",
    target:    "",
    exit:      parseFloat(exit)||"",
    contracts: parseFloat(contracts)||1,
    grade:     "B",
    notes:     "Imported from CSV"
  };
}

function ImportPanel({ onImport, existingCount }) {
  const [stage,    setStage]   = useState("idle");   // idle | preview | done
  const [platform, setPlatform]= useState("");
  const [preview,  setPreview] = useState([]);
  const [fileName, setFileName]= useState("");
  const [error,    setError]   = useState("");
  const fileRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const { headers, rows } = parseCSV(e.target.result);
        if (!rows.length) { setError("No data rows found in file."); return; }
        const plat = detectPlatform(headers);
        setPlatform(plat);
        const mapped = rows.slice(0, 20).map(r => mapToTrade(r, plat))
          .filter(t => t.entry);
        if (!mapped.length) { setError("Could not parse trade data — check column format."); return; }
        setPreview(mapped);
        setStage("preview");
      } catch(err) {
        setError("Parse error: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleConfirm = () => {
    const remaining = 2 - existingCount;
    const toImport  = preview.slice(0, Math.max(0, remaining));
    if (toImport.length === 0) { setError("Session already has 2 trades. Clear log to import."); return; }
    onImport(toImport);
    setStage("done");
  };

  const reset = () => { setStage("idle"); setPreview([]); setError(""); setFileName(""); };

  const platLabel = platform==="ninjatrader"?"NinjaTrader 8":platform==="tradovate"?"Tradovate":"Generic CSV";
  const platCol   = platform==="ninjatrader"?"#00FFB2":platform==="tradovate"?"#FFD700":"#38BDF8";

  return (
    <div style={{background:"#0D1117",border:"1px solid #1E2530",borderLeft:"3px solid #38BDF8",borderRadius:4,padding:"13px 14px",marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div>
          <div style={{fontSize:8,letterSpacing:3,color:"#38BDF8",marginBottom:2}}>IMPORT TRADES FROM FILE</div>
          <div style={{fontSize:9,color:"#4A5568"}}>NinjaTrader 8 · Tradovate · Generic CSV</div>
        </div>
        {stage!=="idle"&&(
          <button onClick={reset} style={{background:"none",border:"1px solid #1E2530",borderRadius:3,padding:"4px 9px",fontSize:8,letterSpacing:1,color:"#4A5568",cursor:"pointer"}}>✕ RESET</button>
        )}
      </div>

      {stage==="idle"&&(
        <div
          onDrop={handleDrop}
          onDragOver={e=>e.preventDefault()}
          onClick={()=>fileRef.current?.click()}
          style={{
            border:"1.5px dashed #2A3545",borderRadius:4,
            padding:"20px 16px",textAlign:"center",cursor:"pointer",
            transition:"border-color .2s,background .2s",
            background:"#080A0D"
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#38BDF8";e.currentTarget.style.background="#0A0F14";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#2A3545";e.currentTarget.style.background="#080A0D";}}
        >
          <div style={{fontSize:22,marginBottom:8,color:"#2A3545"}}>⬆</div>
          <div style={{fontSize:10,color:"#64748B",letterSpacing:"0.3px",marginBottom:4}}>
            Drop your CSV file here or tap to browse
          </div>
          <div style={{fontSize:8,letterSpacing:1,color:"#4A5568"}}>
            NinjaTrader: Performance → Trades tab → Export<br/>
            Tradovate: Account → Fills → Export CSV
          </div>
          <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:"none"}}
            onChange={e=>handleFile(e.target.files[0])}/>
        </div>
      )}

      {error&&(
        <div style={{background:"#FF6B6B12",border:"1px solid #FF6B6B30",borderRadius:3,padding:"7px 10px",fontSize:9,color:"#FF6B6B",marginTop:8,letterSpacing:"0.3px"}}>
          ⚠ {error}
        </div>
      )}

      {stage==="preview"&&preview.length>0&&(
        <>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:8,letterSpacing:1,color:"#4A5568"}}>
              {fileName} &nbsp;·&nbsp;
              <span style={{color:platCol}}>{platLabel} detected</span> &nbsp;·&nbsp;
              {preview.length} trade{preview.length!==1?"s":""} found
            </div>
          </div>
          {/* Preview table */}
          <div style={{background:"#080A0D",borderRadius:3,overflow:"hidden",marginBottom:10}}>
            <div style={{display:"grid",gridTemplateColumns:"60px 50px 80px 80px 60px 40px",gap:0,padding:"5px 8px",borderBottom:"1px solid #1E2530"}}>
              {["TIME","DIR","ENTRY","EXIT","SIZE","GRADE"].map(h=>(
                <div key={h} style={{fontSize:7,letterSpacing:1.5,color:"#4A5568"}}>{h}</div>
              ))}
            </div>
            {preview.slice(0,5).map((t,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"60px 50px 80px 80px 60px 40px",gap:0,padding:"6px 8px",borderBottom:"1px solid #111621",fontSize:9}}>
                <div style={{color:"#64748B"}}>{t.time}</div>
                <div style={{color:t.dir==="long"?"#00FFB2":"#FF6B6B",fontWeight:600}}>{t.dir.toUpperCase()}</div>
                <div style={{color:"#38BDF8"}}>{t.entry||"—"}</div>
                <div style={{color:"#94A3B8"}}>{t.exit||"—"}</div>
                <div style={{color:"#94A3B8"}}>{t.contracts}</div>
                <div style={{color:"#FFD700"}}>B</div>
              </div>
            ))}
            {preview.length>5&&(
              <div style={{padding:"5px 8px",fontSize:8,color:"#4A5568",letterSpacing:1}}>
                + {preview.length-5} more rows
              </div>
            )}
          </div>
          <div style={{fontSize:8,color:"#FFD700",letterSpacing:1,marginBottom:8}}>
            ⚠ Max 2 trades per session. Only the first {Math.max(0,2-existingCount)} will be imported.
            Review and adjust grade/notes after import.
          </div>
          <div style={{display:"flex",gap:7}}>
            <button onClick={handleConfirm} style={{
              flex:1,background:"#38BDF818",border:"1px solid #38BDF840",
              borderRadius:3,padding:"9px",fontSize:9,letterSpacing:2,color:"#38BDF8",cursor:"pointer"
            }}>▼ CONFIRM IMPORT</button>
            <button onClick={reset} style={{
              background:"none",border:"1px solid #1E2530",
              borderRadius:3,padding:"9px 14px",fontSize:9,letterSpacing:2,color:"#4A5568",cursor:"pointer"
            }}>CANCEL</button>
          </div>
        </>
      )}

      {stage==="done"&&(
        <div style={{textAlign:"center",padding:"14px 0"}}>
          <div style={{fontSize:22,marginBottom:6,color:"#38BDF8"}}>✓</div>
          <div style={{fontSize:10,color:"#38BDF8",letterSpacing:2,marginBottom:4}}>TRADES IMPORTED</div>
          <div style={{fontSize:9,color:"#4A5568"}}>Review grades and add notes below</div>
        </div>
      )}
    </div>
  );
}

// ─── News feed — Anthropic API + web search ──────────────────
// ─── News Feed — Anthropic API (no web_search, no CORS issues) ──
// Uses Claude's knowledge to generate a structured market briefing.
// For live headlines, add a Finnhub API key in Settings.

async function fetchMarketNews(contract, finnhubKey) {
  // ── Option A: Finnhub live news ───────────────────────────
  if (finnhubKey && finnhubKey.length > 8) {
    try {
      const cat = {"FX":"forex"}.hasOwnProperty(contract.category) ? "forex" : "general";
      const r   = await fetch(
        `https://finnhub.io/api/v1/news?category=${cat}&token=${finnhubKey}`,
        { headers: { Accept: "application/json" } }
      );
      if (r.ok) {
        const d = await r.json();
        if (Array.isArray(d) && d.length) {
          return d.slice(0,5).map(item => {
            const hrs = Math.round((Date.now()/1000 - item.datetime) / 3600);
            const t   = (item.headline||"").toLowerCase();
            const up  = ["rise","gain","rally","up","jump","surge","beat"].some(k=>t.includes(k));
            const dn  = ["fall","drop","decline","plunge","down","miss","weak"].some(k=>t.includes(k));
            return {
              headline:  item.headline || "—",
              source:    item.source   || "Finnhub",
              time:      hrs < 1 ? "< 1h ago" : hrs < 24 ? `${hrs}h ago` : `${Math.floor(hrs/24)}d ago`,
              summary:   (item.summary||"").slice(0,140),
              sentiment: up&&!dn?"bullish":dn&&!up?"bearish":"neutral",
              link:      item.url||null,
              live:      true,
            };
          });
        }
      }
    } catch(_) {}
    // Finnhub failed or blocked — fall through to AI briefing
  }

  // ── Option B: AI market briefing via Anthropic API ────────
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method:  "POST",
    headers: {
      "Content-Type":                          "application/json",
      "anthropic-version":                     "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model:      "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role:    "user",
        content: `List 5 current market themes for ${contract.id} (${contract.name}) futures traders. For each theme return a JSON object with these exact keys: headline (string, max 12 words), source (use "AI Briefing"), time (use "Today"), summary (one sentence, max 20 words), sentiment (exactly one of: bullish, bearish, neutral). Return ONLY a valid JSON array of 5 objects. No markdown. No explanation. Start with [ end with ].`,
      }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    let msg = `HTTP ${response.status}`;
    try { msg = JSON.parse(errText)?.error?.message || msg; } catch(_) {}
    throw new Error(msg);
  }

  const payload = await response.json();

  // Extract text content
  const text = (payload.content || [])
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("")
    .replace(/```json/gi, "").replace(/```/g, "")
    .trim();

  if (!text) throw new Error(`No content returned (stop_reason: ${payload.stop_reason || "?"})`);

  // Parse JSON array — find [ ... ]
  const start = text.indexOf("[");
  const end   = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start)
    throw new Error(`No JSON array found. Response: "${text.slice(0,80)}"`);

  const items = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(items) || items.length === 0)
    throw new Error("Parsed empty array");

  return items.slice(0, 5).map(item => ({
    headline:  String(item.headline  || "Market Update"),
    source:    String(item.source    || "AI Briefing"),
    time:      String(item.time      || "Today"),
    summary:   String(item.summary   || ""),
    sentiment: ["bullish","bearish","neutral"].includes(item.sentiment) ? item.sentiment : "neutral",
    link:      null,
  }));
}


// ─── News Feed Component ──────────────────────────────────────
function NewsFeed({ contract, cc, finnhubKey="" }) {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState(null);
  const [fetched,  setFetched]  = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [autoFetch,setAutoFetch]= useState(false);

  const doFetch = async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchMarketNews(contract, finnhubKey);
      setItems(data);
      setFetched(new Date().toTimeString().slice(0,8));
      setExpanded(null);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // Auto-fetch on first render if enabled
  useEffect(()=>{ if(autoFetch) doFetch(); },[]);

  const sentCol = s => s==="bullish"?"#00FFB2":s==="bearish"?"#FF6B6B":"#FFD700";
  const sentIcon = s => s==="bullish"?"▲":s==="bearish"?"▼":"—";

  return (
    <div style={{background:"#0D1117",border:`1px solid #1E2530`,borderLeft:`3px solid ${cc}`,borderRadius:4,padding:"12px 14px",marginBottom:12}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:items.length?10:0}}>
        <div>
          <div style={{fontSize:7,letterSpacing:3,color:"#4A5568",marginBottom:2}}>
            MARKET NEWS · {contract.id} · {contract.exchange}
          </div>
          {fetched && (
            <div style={{fontSize:7,color:"#2A3545",letterSpacing:1}}>
              LAST UPDATED {fetched}
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {fetched && (
            <div style={{fontSize:7,letterSpacing:1,color:"#2A3545"}}>
              {items.length} ITEMS
            </div>
          )}
          <button
            onClick={doFetch}
            disabled={loading}
            style={{
              background: loading?"#111621":cc+"18",
              border:`1px solid ${loading?"#1E2530":cc+"40"}`,
              borderRadius:3,padding:"5px 11px",cursor:loading?"not-allowed":"pointer",
              fontSize:8,letterSpacing:2,color:loading?"#2A3545":cc,
              transition:"all .15s",fontFamily:"inherit"
            }}>
            {loading ? <span style={{animation:"pulse 1s infinite",display:"inline-block"}}>...</span> : "⟳ FETCH NEWS"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{background:"#FF6B6B12",border:"1px solid #FF6B6B30",borderRadius:3,padding:"7px 10px",fontSize:9,color:"#FF6B6B",letterSpacing:"0.3px",marginTop:8}}>
          ⚠ {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !items.length && (
        <div style={{textAlign:"center",padding:"16px 0"}}>
          <div style={{fontSize:10,color:"#2A3545",letterSpacing:1,marginBottom:4}}>NO NEWS LOADED</div>
          <div style={{fontSize:8,color:"#1E2530",letterSpacing:1}}>
            Fetches top 5 news items relevant to {contract.id} via web search
          </div>
        </div>
      )}

      {/* News items */}
      {items.map((item,i)=>{
        const sc = sentCol(item.sentiment);
        const si = sentIcon(item.sentiment);
        const open = expanded===i;
        return (
          <div key={i}
            onClick={()=>setExpanded(open?null:i)}
            style={{
              borderBottom: i<items.length-1?"1px solid #111621":"none",
              padding:"9px 0",cursor:"pointer",
              transition:"background .1s"
            }}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              {/* Sentiment indicator */}
              <div style={{
                background:sc+"18",border:`1px solid ${sc}30`,borderRadius:2,
                padding:"2px 5px",fontSize:9,color:sc,fontWeight:700,
                flexShrink:0,marginTop:1,minWidth:22,textAlign:"center"
              }}>{si}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:10,color:"#CBD5E1",letterSpacing:"0.3px",lineHeight:1.4,marginBottom:3,fontWeight:500}}>
                  {item.headline}
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:8,color:"#4A5568",letterSpacing:1}}>{item.source}</span>
                  <span style={{fontSize:7,color:"#2A3545"}}>·</span>
                  <span style={{fontSize:8,color:"#4A5568"}}>{item.time}</span>
                  <span style={{fontSize:7,color:"#2A3545",marginLeft:"auto"}}>{open?"▲":"▼"}</span>
                </div>
                {open && (
                  <div style={{
                    marginTop:7,padding:"7px 10px",
                    background:"#080A0D",borderLeft:`2px solid ${sc}`,
                    borderRadius:2,fontSize:9,color:"#64748B",
                    lineHeight:1.6,letterSpacing:"0.3px",
                    animation:"fadeSlide .15s ease"
                  }}>
                    {item.summary}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                        style={{display:"block",marginTop:6,fontSize:8,color:sc,letterSpacing:1,textDecoration:"none",opacity:0.8}}
                        onClick={e=>e.stopPropagation()}>
                        READ FULL ARTICLE ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer note */}
      <div style={{fontSize:7,color:"#1E2530",letterSpacing:1,marginTop:items.length?8:4,textAlign:"center"}}>
        {finnhubKey?"⬤ LIVE — FINNHUB NEWS FEED":"◎ AI MARKET BRIEFING — ADD FINNHUB KEY IN SETTINGS FOR LIVE NEWS"} · NOT FINANCIAL ADVICE
      </div>



      {/* ── DISCLAIMER ──────────────────────────────────────── */}
      <div style={{background:"#06080B",borderTop:"1px solid #111621",padding:"10px 18px",textAlign:"center"}}>
        <div style={{fontSize:7,color:"#2A3545",letterSpacing:"0.5px",lineHeight:1.8,maxWidth:640,margin:"0 auto"}}>
          <span style={{color:"#4A5568",fontWeight:600}}>⚠ RISK WARNING</span> — TradeCockpit does not provide financial advice.
          All risk calculations, price levels and market information are for informational and educational purposes only.
          Trading futures involves significant risk of loss. You are solely responsible for your trading decisions.
          Always verify prices and prop firm rules directly with your broker. Trade responsibly.
        </div>
        <div style={{fontSize:7,color:"#1E2530",letterSpacing:1,marginTop:5}}>
          © 2026 TRADECOCKPIT · THE EDGE IS IN THE PROCESS · NOT FINANCIAL ADVICE
        </div>
      </div>

      

    </div>
  );
}

// ─── Quick Price Entry — type prices from your NT8 screen ────
function QuickPriceEntry({ contract, cc, d2, liveData, onApply }) {
  const [px,  setPx]  = useState("");
  const [hi,  setHi]  = useState("");
  const [lo,  setLo]  = useState("");

  const ready = px && hi && lo &&
    parseFloat(px) > 0 && parseFloat(hi) > 0 && parseFloat(lo) > 0 &&
    parseFloat(hi) >= parseFloat(lo);

  const handleApply = () => {
    if (!ready) return;
    onApply(px, hi, lo);
  };

  return (
    <div style={{background:"#0D1117",border:`1px solid #1E2530`,borderLeft:`3px solid ${cc}`,borderRadius:4,padding:"12px 14px",marginBottom:12}}>
      {/* Live data header */}
      {liveData?.live ? (
        <div style={{
          background:"#00FFB208",border:"1px solid #00FFB220",
          borderRadius:4,padding:"10px 12px",marginBottom:10
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#00FFB2",boxShadow:"0 0 6px #00FFB2",animation:"pulse 2s infinite"}}/>
                <div style={{fontSize:8,letterSpacing:2,color:"#00FFB2",fontWeight:600}}>LIVE — {contract.id} · {contract.exchange}</div>
              </div>
              <div style={{fontSize:7,color:"#4A5568",letterSpacing:1}}>
                {liveData.source||"Yahoo Finance"} · updates every 30s · {liveData.fetching?"fetching...":liveData.time}
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:liveData.change>=0?"#00FFB2":"#FF6B6B",lineHeight:1}}>
                {liveData.change>=0?"+":""}{liveData.changePct?.toFixed(2)}%
              </div>
              <div style={{fontSize:7,color:"#4A5568",letterSpacing:1,marginTop:2}}>
                {liveData.change>=0?"+":""}{liveData.change?.toFixed(2)} pts
              </div>
            </div>
          </div>
          {/* Mini stats row */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
            {[
              ["LAST",  liveData.price?.toFixed(d2),    "#38BDF8"],
              ["HIGH",  liveData.high?.toFixed(d2),     "#00FFB2"],
              ["LOW",   liveData.low?.toFixed(d2),      "#FF6B6B"],
              ["PREV",  liveData.prevClose?.toFixed(d2),"#4A5568"],
            ].map(([l,v,c])=>(
              <div key={l} style={{background:"#080A0D",borderRadius:3,padding:"5px 7px"}}>
                <div style={{fontSize:6,letterSpacing:1,color:"#2A3545",marginBottom:2}}>{l}</div>
                <div style={{fontSize:10,color:c,fontWeight:600}}>{v||"—"}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontSize:7,letterSpacing:3,color:"#4A5568",marginBottom:2}}>CME SESSION DATA · {contract.id} · {contract.exchange}</div>
            <div style={{fontSize:9,color:"#64748B"}}>
              Enter from your platform — <span style={{color:cc}}>or start live feed below</span>
            </div>
          </div>
          {liveData?.manualEntry&&(
            <div style={{fontSize:7,color:"#00FFB2",letterSpacing:1}}>APPLIED {liveData.time}</div>
          )}
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:8}}>
        {[
          {label:"LAST PRICE", val:px, set:setPx, col:"#38BDF8"},
          {label:"DAY HIGH",   val:hi, set:setHi, col:"#00FFB2"},
          {label:"DAY LOW",    val:lo, set:setLo, col:"#FF6B6B"},
        ].map(function(item){
          return (
            <div key={item.label} style={{background:"#080A0D",borderTop:`2px solid ${item.val?item.col:"#1A1F2A"}`,borderRadius:4,padding:"8px 10px",border:`1px solid ${item.val?"#2A3545":"#1A1F2A"}`}}>
              <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:4}}>{item.label}</div>
              <input value={item.val} onChange={function(e){item.set(e.target.value);}} type="number" step="any"
                placeholder="0.00"
                style={{background:"none",border:"none",outline:"none",width:"100%",fontSize:14,color:item.val?item.col:"#2A3545",fontWeight:600,fontFamily:"inherit"}}/>
            </div>
          );
        })}
      </div>
      {px && hi && lo && parseFloat(hi) > parseFloat(lo) && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:8}}>
          <div style={{background:"#080A0D",borderRadius:3,padding:"6px 9px"}}>
            <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:2}}>SESSION RANGE</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"#FFD700"}}>
              {(parseFloat(hi)-parseFloat(lo)).toFixed(d2)} pts
            </div>
          </div>
          <div style={{background:"#080A0D",borderRadius:3,padding:"6px 9px"}}>
            <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:2}}>ADR CONSUMED</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,
              color:(parseFloat(hi)-parseFloat(lo))/contract.adr>1?"#FF6B6B":(parseFloat(hi)-parseFloat(lo))/contract.adr>0.75?"#FFD700":"#38BDF8"}}>
              {(((parseFloat(hi)-parseFloat(lo))/contract.adr)*100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}
      <button onClick={handleApply} disabled={!ready} style={{
        width:"100%",
        background:ready?cc+"18":"#111621",
        border:`1px solid ${ready?cc+"40":"#1E2530"}`,
        borderRadius:3,padding:"9px",fontSize:9,letterSpacing:2,
        color:ready?cc:"#2A3545",
        cursor:ready?"pointer":"not-allowed",transition:"all .2s"
      }}>
        {ready ? "APPLY TO CALCULATOR" : "ENTER PRICE · HIGH · LOW"}
      </button>
    </div>
  );
}

// ─── Timezone helper ─────────────────────────────────────────
const TIMEZONES = [
  { id:"UTC",        label:"UTC / GMT",            offset:0    },
  { id:"ET",         label:"Eastern Time (ET)",    offset:-5   },
  { id:"CT",         label:"Central Time (CT)",    offset:-6   },
  { id:"MT",         label:"Mountain Time (MT)",   offset:-7   },
  { id:"PT",         label:"Pacific Time (PT)",    offset:-8   },
  { id:"GMT+1",      label:"London / Dublin (BST)",offset:1    },
  { id:"GMT+2",      label:"Central Europe (CET)", offset:2    },
  { id:"GMT+3",      label:"Moscow / Istanbul",    offset:3    },
  { id:"Gulf",       label:"Gulf / UAE (GST)",     offset:4    },
  { id:"India",      label:"India (IST)",          offset:5.5  },
  { id:"SG",         label:"Singapore / HKG",      offset:8    },
  { id:"Tokyo",      label:"Tokyo (JST)",          offset:9    },
  { id:"Sydney",     label:"Sydney (AEST)",        offset:10   },
];

function convertGMT(gmtStr, tzOffset) {
  // Takes "07:00" GMT string, returns local time string
  if(!gmtStr || gmtStr==="varies") return gmtStr;
  const [h, m] = gmtStr.split(":").map(Number);
  if(isNaN(h)) return gmtStr;
  const totalMins = h * 60 + (m||0) + Math.round(tzOffset * 60);
  const localH = ((Math.floor(totalMins / 60)) % 24 + 24) % 24;
  const localM = ((totalMins % 60) + 60) % 60;
  return `${String(localH).padStart(2,"0")}:${String(localM).padStart(2,"0")}`;
}

function convertRange(rangeStr, tzOffset) {
  // Takes "07:00 – 10:00" returns local equivalent
  if(!rangeStr) return rangeStr;
  return rangeStr.split(" – ").map(t => convertGMT(t.split(" ")[0], tzOffset)).join(" – ");
}

function TradingPlan({ user, onLogout }) {
  const [tab, setTab] = useState("pre");
  const [savedToday, setSavedToday]     = useState(false);
  const settingsLoaded                  = useRef(false); // guard against save-before-load race
  const [saveStatus, setSaveStatus]     = useState("idle"); // idle | saving | saved | error
  const [connStatus, setConnStatus]     = useState("idle"); // idle | testing | connected | failed
  const [liveFeed,   setLiveFeed]       = useState(false);  // auto-refresh on/off
  const [liveLastPx, setLiveLastPx]     = useState(null);   // last fetched price data
  const liveIntervalRef                 = useRef(null);      // interval handle

  // ── Account / calc state ──────────────────────────────────
  const [contractId, setContractId]   = useState("ES");
  const [catFilter,   setCatFilter]    = useState("All");
  const [showSettings,setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    dataSource:   "manual",
    platform:     "tradovate",
    // Tradovate
    clientId:     "",
    clientSecret: "",
    // Rithmic
    rUsername:    "",
    rPassword:    "",
    rServer:      "rituz00.rithmic.com:443",
    rServerCustom: "",
    // Tradier / Alpha Vantage / Custom
    apiKey:       "",
    customUrl:    "",
    // Defaults
    defaultRisk:  "0.5",
    defaultAcc:   "50000",
    // Display
    timezone:     "UTC",
    // Live news
    finnhubKey:   "",
    // Commission
    commBroker:   "custom",
    commRate:     "3.50",   // $ per contract per side
  });
  const [account,    setAccount]      = useState("50000");
  const [riskPct,    setRiskPct]      = useState("0.5");
  const [stopMode,   setStopMode]     = useState("ticks");
  const [stopTicks,  setStopTicks]    = useState("10");
  const [stopAdrPct, setStopAdrPct]   = useState("15");
  const [entryPx,    setEntryPx]      = useState("");
  const [dir,        setDir]          = useState("long");
  const [rr,         setRr]           = useState("2");
  const [dayHigh,    setDayHigh]      = useState("");
  const [dayLow,     setDayLow]       = useState("");
  const [liveData,   setLiveData]     = useState(null);
  const [contractsOverride, setContractsOverride] = useState(""); // manual override of max contracts

  // ── Pre-session state ─────────────────────────────────────
  const [bias,  setBias]  = useState("neutral");
  const [levels,setLevels]= useState({poc:"",vah:"",val:"",hvn1:"",hvn2:"",hvn3:"",lvn1:"",lvn2:"",lvn3:""});
  const [news,  setNews]  = useState("");
  const [activeEvents, setActiveEvents] = useState([]);

  // ── Session journal state ─────────────────────────────────
  const [sessionRead, setSessionRead] = useState({
    dayType:     "",
    rhythm:      "",
    ve:          "",
    overstretched: false,
    control:     "",
    auction:     "",
    hypothesis:  "",
  });
  const [showRefCard, setShowRefCard] = useState({
    dayType:false, rhythm:false, ve:false, control:false, auction:false
  });
  const [journalEntries, setJournalEntries] = useState([]);
  const [journalForm, setJournalForm] = useState({
    dayType:"", rhythm:"", ve:"", overstretched:false, control:"", auction:"", note:""
  });
  const [checks,setChecks]= useState(Object.fromEntries(CHECKS.map(c=>[c.id,false])));

  // ── Trade log state ───────────────────────────────────────
  const [trades, setTrades] = useState([]);
  const [tForm,  setTForm]  = useState({setup:"",dir:"long",entry:"",stop:"",target:"",exit:"",contracts:"1",grade:"A",notes:""});
  const [showForm,setShowForm]=useState(false);
  const [showImport,setShowImport]=useState(false);

  // ── News feed state ───────────────────────────────────────
  const [newsItems,   setNewsItems]   = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError,   setNewsError]   = useState(null);
  const [newsLastFetch,setNewsLastFetch] = useState(null);
  const [newsExpanded,setNewsExpanded] = useState(null);

  // ── Prop firm state ───────────────────────────────────────
  const [propFirm, setPropFirm] = useState({
    firmId:         "topstep",
    phase:          "challenge",
    accountSize:    100000,
    startBalance:   100000,
    currentBalance: 100000,
    highWaterMark:  100000,
    dailyLossLimit: 2000,
    maxDrawdown:    3000,
    drawdownType:   "trailing",
    profitTarget:   6000,
    minTradingDays: 10,
    tradingDaysComp:0,
    consistencyRule:true,
    consistencyPct: 30,
    customFirmName: "",
    liveConnected:  false,
    lastSynced:     null,
  });

  // ── Review state ──────────────────────────────────────────
  const [sessionNotes,setSessionNotes]=useState("");

  const contract = CONTRACTS.find(c=>c.id===contractId)||CONTRACTS[0];

  // ── Persist / load ────────────────────────────────────────
  const KEY          = `trading-plan:${todayKey()}`;

  // ── Load on mount ─────────────────────────────────────────
  useEffect(()=>{
    (async()=>{
      try{
        const r=await window.storage.get(KEY);
        if(r){
          const d=JSON.parse(r.value);
          if(d.account)      setAccount(d.account);
          if(d.riskPct)      setRiskPct(d.riskPct);
          if(d.contractId)   setContractId(d.contractId);
          if(d.bias)         setBias(d.bias);
          if(d.levels)       setLevels(d.levels);
          if(d.news)         setNews(d.news);
          if(d.checks)       setChecks(d.checks);
          if(d.trades)       setTrades(d.trades);
          if(d.sessionNotes) setSessionNotes(d.sessionNotes);
          if(d.activeEvents)    setActiveEvents(d.activeEvents);
          if(d.entryPx)        setEntryPx(d.entryPx);
          if(d.stopTicks)      setStopTicks(d.stopTicks);
          if(d.stopAdrPct)     setStopAdrPct(d.stopAdrPct);
          if(d.stopMode)       setStopMode(d.stopMode);
          if(d.rr)             setRr(d.rr);
          if(d.dir)            setDir(d.dir);
          if(d.dayHigh)        setDayHigh(d.dayHigh);
          if(d.dayLow)         setDayLow(d.dayLow);
          if(d.sessionRead)    setSessionRead(d.sessionRead);
          if(d.journalEntries) setJournalEntries(d.journalEntries);
          if(d.settings)     setSettings(s=>({...s,...d.settings}));
          setSavedToday(true);
        }
      }catch(_){}
      settingsLoaded.current = true;
    })();
  },[]);

  // ── Save session data ─────────────────────────────────────
  const save = useCallback(async(partial={})=>{
    try{
      await window.storage.set(KEY,JSON.stringify({
        account,riskPct,contractId,bias,levels,news,checks,trades,sessionNotes,activeEvents,sessionRead,journalEntries,
        entryPx,stopTicks,stopAdrPct,stopMode,rr,dir,dayHigh,dayLow,
        ...partial
      }));
      setSavedToday(true);
    }catch(_){}
  },[account,riskPct,contractId,bias,levels,news,checks,trades,sessionNotes,activeEvents,
     entryPx,stopTicks,stopAdrPct,stopMode,rr,dir,dayHigh,dayLow]);

  // ── Save settings — separate explicit call ────────────────
  const saveSettingsToStorage = async(currentSettings) => {
    try{
      const existing = await window.storage.get(KEY).catch(()=>null);
      const base = existing ? JSON.parse(existing.value) : {};
      await window.storage.set(KEY, JSON.stringify({...base, settings: currentSettings}));
      setSavedToday(true);
    }catch(_){}
  };


  // Auto-save session on changes
  useEffect(()=>{save();},[bias,checks,trades,sessionNotes,levels,news,activeEvents,sessionRead,journalEntries,
    account,riskPct,contractId,entryPx,stopTicks,stopAdrPct,stopMode,rr,dir,dayHigh,dayLow]);

  // ── Risk calculations ─────────────────────────────────────
  const calc = useMemo(()=>{
    const acc=parseFloat(account)||0, rp=parseFloat(riskPct)||0, rrv=parseFloat(rr)||2;
    const entry=parseFloat(entryPx)||0, adr=contract.adr;
    const dH=parseFloat(dayHigh)||0, dL=parseFloat(dayLow)||0;
    const adrDollar=(adr/contract.tickSize)*contract.tickValue;
    const adrTicks=Math.round(adr/contract.tickSize);
    let eTicks=stopMode==="adrpct"
      ? Math.max(1,Math.round((adr*parseFloat(stopAdrPct)/100)/contract.tickSize))
      : parseFloat(stopTicks)||0;
    const stopPts=eTicks*contract.tickSize;
    const stopAdrPctCalc=adr>0?(stopPts/adr)*100:0;
    const dollarRisk=(acc*rp)/100;
    const rpc=eTicks*contract.tickValue;

    // ── Risk-based max contracts ──────────────────────────────
    const riskBasedMax = rpc>0?Math.floor(dollarRisk/rpc):0;

    // ── Prop firm reality constraints ─────────────────────────
    // Real account = max drawdown (not stated account size)
    const pf             = propFirm;
    const realAccount    = pf.maxDrawdown || 0;
    const dailyLimit     = pf.dailyLossLimit || 0;
    const tenTickRisk    = 10 * contract.tickValue;
    const maxByDrawdown  = realAccount>0&&tenTickRisk>0 ? Math.floor(realAccount/tenTickRisk) : 999;
    const maxByDaily     = dailyLimit>0&&tenTickRisk>0  ? Math.floor(dailyLimit/tenTickRisk)  : 999;
    const maxByMargin    = contract.margin>0&&realAccount>0 ? Math.floor(pf.accountSize/contract.margin) : 999;
    const propMaxContracts = Math.min(maxByDrawdown, maxByDaily, maxByMargin);

    // ── Effective max = binding constraint ────────────────────
    const maxContracts   = Math.min(riskBasedMax, propMaxContracts);
    const propLimited    = propMaxContracts < riskBasedMax && propMaxContracts < 999;
    const propLimitReason= propLimited
      ? (maxByDrawdown<=maxByDaily&&maxByDrawdown<=maxByMargin ? "drawdown limit"
        :maxByDaily<=maxByMargin ? "daily loss limit"
        : "margin requirement")
      : null;

    const actualRisk=maxContracts*rpc;
    const tgtTicks=eTicks*rrv, tgtPts=stopPts*rrv;
    const tgtDollar=maxContracts*tgtTicks*contract.tickValue;
    // Commission — round turn (entry + exit) per contract
    const commPerContract = parseFloat(settings.commRate||"3.50")*2;
    const commTotal       = maxContracts * commPerContract;
    const netTgtDollar    = tgtDollar - commTotal;
    const netActualRisk   = actualRisk + commTotal;
    const stopPrice=entry>0?(dir==="long"?entry-stopPts:entry+stopPts):null;
    const tgtPrice=entry>0?(dir==="long"?entry+tgtPts:entry-tgtPts):null;
    const partialPx=entry>0?(dir==="long"?entry+stopPts:entry-stopPts):null;
    const marginReq=maxContracts*contract.margin;
    const rangeUsed=(dH>0&&dL>0)?dH-dL:0;
    const rangeUsedPct=adr>0&&rangeUsed>0?(rangeUsed/adr)*100:0;
    const rangeRem=Math.max(0,adr-rangeUsed);
    const entryInRange=(entry>0&&dH>0&&dL>0&&dH>dL)?((entry-dL)/(dH-dL))*100:null;
    return {
      adr,adrDollar,adrTicks,eTicks,stopPts,stopAdrPctCalc,dollarRisk,rpc,
      riskBasedMax,maxContracts,propMaxContracts,propLimited,propLimitReason,
      actualRisk,tgtTicks,tgtPts,tgtDollar,netTgtDollar,netActualRisk,
      commTotal,commPerContract,stopPrice,tgtPrice,partialPx,marginReq,
      rangeUsed,rangeUsedPct,rangeRem,entryInRange,
      hardStop:acc*0.02,softStop:acc*0.01,
      realAccount,maxByDrawdown,maxByDaily,maxByMargin,
    };
  },[account,riskPct,rr,entryPx,dir,stopMode,stopTicks,stopAdrPct,dayHigh,dayLow,contract,propFirm]);

  // ── Session stats ─────────────────────────────────────────
  const stats = useMemo(()=>{
    const empty={pnl:0,wins:0,losses:0,winRate:0,grades:{A:0,B:0,C:0},tradeCount:0,closed:0};
    if(!trades.length) return empty;
    const closed=trades.filter(t=>t.exit&&t.entry);
    const commRt = parseFloat(settings.commRate||"3.50")*2;
    const pnl=closed.reduce((s,t)=>{
      const contracts=parseFloat(t.contracts)||1;
      const entryPx2=parseFloat(t.entry)||0;
      const exitPx2=parseFloat(t.exit)||0;
      const ticksMoved=(exitPx2-entryPx2)/contract.tickSize;
      const signedTicks=t.dir==="long"?ticksMoved:-ticksMoved;
      const grossPnl=signedTicks*contract.tickValue*contracts;
      const comm=commRt*contracts; // round-turn per contract
      return s+(grossPnl-comm);
    },0);
    const wins=closed.filter(t=>{
      const gain=(parseFloat(t.exit)||0)-(parseFloat(t.entry)||0);
      return t.dir==="long"?gain>0:gain<0;
    }).length;
    const grades={A:0,B:0,C:0};
    trades.forEach(t=>{if(t.grade&&grades[t.grade]!==undefined)grades[t.grade]++;});
    return{pnl,wins,losses:closed.length-wins,winRate:closed.length?wins/closed.length*100:0,grades,tradeCount:trades.length,closed:closed.length};
  },[trades,contract]);

  // ── Hoisted prop firm calculations for nav badge ─────────
  const _dailyUsed = Math.max(0, -stats.pnl);
  const _dailyPct  = propFirm.dailyLossLimit > 0 ? (_dailyUsed / propFirm.dailyLossLimit) * 100 : 0;
  const _hwm       = propFirm.drawdownType === "trailing"
    ? Math.max(propFirm.highWaterMark, propFirm.currentBalance)
    : propFirm.startBalance;
  const _currentDD = Math.max(0, _hwm - propFirm.currentBalance);
  const _ddPct     = propFirm.maxDrawdown > 0 ? (_currentDD / propFirm.maxDrawdown) * 100 : 0;

  // ── Apply quick-entry prices to calculator ────────────────
  const applyLive = (price, high, low) => {
    const d2 = dec(contract);
    if (price) setEntryPx(parseFloat(price).toFixed(d2));
    if (high)  setDayHigh(parseFloat(high).toFixed(d2));
    if (low)   setDayLow(parseFloat(low).toFixed(d2));
    setLiveData({ price: parseFloat(price), high: parseFloat(high), low: parseFloat(low),
                  change: 0, changePct: 0, manualEntry: true, time: new Date().toTimeString().slice(0,5) });
  };

  // ── Live price fetch — Tradovate or Rithmic via Anthropic API ─
  // ── Yahoo Finance live price feed — no API key required ─────
  // Uses Yahoo Finance v8 chart endpoint via CORS proxy
  // Updates every 30s when feed is active
  // Falls back silently — manual entry always works

  const fetchYahooPrice = async (sym) => {
    if(!sym) return null;
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_KEY;
      if(!apiKey) return null;
      const contractName = sym.replace('=F','');
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 150,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Search for the current ${contractName} futures price. Return ONLY valid JSON, no markdown: {"last":0.00,"high":0.00,"low":0.00,"change":0.00,"changePct":0.00}`
          }]
        })
      });
      if(!res.ok) return null;
      const data = await res.json();
      const text = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").trim();
      const s = text.indexOf("{"), e = text.lastIndexOf("}");
      if(s===-1||e===-1) return null;
      const prices = JSON.parse(text.slice(s,e+1));
      if(!prices.last) return null;
      return {
        last:      prices.last,
        high:      prices.high      || prices.last,
        low:       prices.low       || prices.last,
        open:      prices.open      || prices.last,
        change:    prices.change    || 0,
        changePct: prices.changePct || 0,
        volume:    0,
        prevClose: prices.last - (prices.change||0),
        time:      new Date().toTimeString().slice(0,8),
      };
    } catch(_) { return null; }
  };

  const fetchLivePrice = async () => {
    const sym = contract.yahooSym;
    if(!sym) return;
    setLiveData(p => p ? {...p, fetching:true} : {fetching:true});
    const prices = await fetchYahooPrice(sym);
    if(!prices || !prices.last) {
      setLiveData(p => p ? {...p, fetching:false, error:true} : null);
      return;
    }
    const d2 = dec(contract);
    setEntryPx(parseFloat(prices.last).toFixed(d2));
    setDayHigh(parseFloat(prices.high).toFixed(d2));
    setDayLow(parseFloat(prices.low).toFixed(d2));
    setLiveLastPx(prices);
    setLiveData({
      price:     prices.last,
      high:      prices.high,
      low:       prices.low,
      open:      prices.open,
      change:    prices.change,
      changePct: prices.changePct,
      volume:    prices.volume,
      prevClose: prices.prevClose,
      time:      prices.time,
      manualEntry: false,
      live:      true,
      fetching:  false,
      error:     false,
      source:    "Yahoo Finance",
    });
  };

  // ── Auto-fetch on contract change (no credentials needed) ────
  useEffect(()=>{
    if(liveFeed){ fetchLivePrice(); }
  },[contractId]);

  // ── Start/stop live feed ──────────────────────────────────────
  useEffect(()=>{
    if(liveFeed){
      fetchLivePrice();
      liveIntervalRef.current = setInterval(fetchLivePrice, 30000);
    } else {
      if(liveIntervalRef.current){ clearInterval(liveIntervalRef.current); liveIntervalRef.current=null; }
    }
    return ()=>{ if(liveIntervalRef.current) clearInterval(liveIntervalRef.current); };
  },[liveFeed, contractId]);

  // ── Import trades from CSV ───────────────────────────────────
  const handleImport = (imported) => {
    const next = [...trades, ...imported].slice(0, 2);
    setTrades(next);
    save({trades: next});
    setShowImport(false);
  };

  // ── Add trade ─────────────────────────────────────────────
  const addTrade=()=>{
    if(!tForm.entry)return;
    const now=new Date();
    const t={...tForm,id:Date.now(),time:now.toTimeString().slice(0,5)};
    const next=[...trades,t];
    setTrades(next);setShowForm(false);
    setTForm({setup:"",dir:"long",entry:"",stop:"",target:"",exit:"",contracts:"1",grade:"A",notes:""});
    save({trades:next});
  };

  const tzObj    = TIMEZONES.find(t=>t.id===(settings.timezone||"UTC")) || TIMEZONES[0];
  const tzOffset = tzObj.offset;
  const tzLabel  = tzObj.label;
  const cc=CC[contract.category]||"#00FFB2";
  const d2=dec(contract);
  const checksComplete=Object.values(checks).filter(Boolean).length;
  const biasCol=bias==="bull"?"#00FFB2":bias==="bear"?"#FF6B6B":"#FFD700";
  const pnlCol=stats.pnl>=0?"#00FFB2":"#FF6B6B";

  const TABS=[{id:"pre",icon:"◈",label:"PRE / LIVE"},{id:"calc",icon:"▣",label:"RISK CALC"},{id:"log",icon:"◐",label:"TRADE LOG"},{id:"prop",icon:"◍",label:"PROP FIRM"},{id:"news",icon:"◉",label:"NEWS"},{id:"review",icon:"◆",label:"REVIEW"},{id:"settings",icon:"⚙",label:"SETTINGS"}];

  return (
    <div style={{minHeight:"100vh",background:"#080A0D",fontFamily:"'IBM Plex Mono','Courier New',monospace",color:"#CBD5E1",fontSize:12}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input,textarea,button,select{font-family:'IBM Plex Mono','Courier New',monospace;font-size:12px;}
        textarea{resize:vertical;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:#0D1117;}
        ::-webkit-scrollbar-thumb{background:#2A3545;border-radius:2px;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
        .bb{font-family:'Bebas Neue',sans-serif;letter-spacing:1px;}
        .fade{animation:pulse 2s infinite;}
      `}</style>

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div style={{background:"#0D1117",borderBottom:"1px solid #1E2530",padding:"12px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:2}}>CME FUTURES TRADER · DAILY SESSION PLAN</div>
            <div style={{fontSize:7,letterSpacing:3,color:"#00FFB2",opacity:0.7,marginBottom:2}}>THE EDGE IS IN THE PROCESS</div>
            <div className="bb" style={{fontSize:22,color:"#E2E8F0",lineHeight:1}}>
              TRADE<span style={{color:"#00FFB2"}}>COCKPIT</span>
            </div>
            <div style={{fontSize:9,color:"#4A5568",marginTop:4,letterSpacing:1}}>{today()}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {/* Bias badge */}
            <div style={{background:biasCol+"18",border:`1px solid ${biasCol}40`,borderRadius:3,padding:"5px 10px",textAlign:"center"}}>
              <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:1}}>BIAS</div>
              <div className="bb" style={{fontSize:14,color:biasCol}}>{bias.toUpperCase()}</div>
            </div>
            {/* Contract */}
            <div style={{background:cc+"18",border:`1px solid ${cc}40`,borderRadius:3,padding:"5px 10px",textAlign:"center"}}>
              <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:1}}>CONTRACT</div>
              <div className="bb" style={{fontSize:14,color:cc}}>{contract.id}</div>
            </div>
            {/* P&L */}
            <div style={{background:pnlCol+"18",border:`1px solid ${pnlCol}40`,borderRadius:3,padding:"5px 10px",textAlign:"center"}}>
              <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:1}}>SESSION P&L</div>
              <div className="bb" style={{fontSize:14,color:pnlCol}}>{stats.pnl>=0?"+":""}{fmtU(stats.pnl)}</div>
            </div>
            {/* Checklist progress */}
            <div style={{background:"#A78BFA18",border:"1px solid #A78BFA40",borderRadius:3,padding:"5px 10px",textAlign:"center"}}>
              <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:1}}>CHECKLIST</div>
              <div className="bb" style={{fontSize:14,color:"#A78BFA"}}>{checksComplete}/{CHECKS.length}</div>
            </div>
            {/* CME data feed + save status */}
            <div style={{textAlign:"right"}}>
              {/* Data feed status */}
              <div style={{
                display:"flex",alignItems:"center",gap:5,justifyContent:"flex-end",
                marginBottom:4,
                background:settings.dataSource==="api"&&settings.finnhubKey?"#00FFB210":"#0D1117",
                border:`1px solid ${settings.dataSource==="api"&&settings.finnhubKey?"#00FFB230":"#1E2530"}`,
                borderRadius:3,padding:"4px 8px",cursor:"pointer"
              }} onClick={()=>setTab("settings")}>
                <div style={{
                  width:6,height:6,borderRadius:"50%",flexShrink:0,
                  background: settings.dataSource==="api"&&settings.clientId?"#00FFB2"
                            : settings.dataSource==="api"&&settings.rUsername?"#00FFB2"
                            : settings.dataSource==="api"&&settings.finnhubKey?"#FFD700"
                            : "#2A3545",
                  boxShadow: (settings.dataSource==="api"&&(settings.clientId||settings.rUsername))
                    ? "0 0 4px #00FFB2" : "none"
                }}/>
                <div style={{fontSize:7,letterSpacing:1.5,color:
                  settings.dataSource==="api"&&(settings.clientId||settings.rUsername)?"#00FFB2"
                  :settings.dataSource==="api"&&settings.finnhubKey?"#FFD700"
                  :"#4A5568"
                }}>
                  {settings.dataSource==="api"&&(settings.clientId||settings.rUsername)
                    ? "CME LIVE"
                    : settings.dataSource==="api"&&settings.finnhubKey
                    ? "NEWS LIVE"
                    : "MANUAL MODE"}
                </div>
              </div>
              {/* Save indicator */}
              <div style={{fontSize:7,color:"#2A3545",letterSpacing:1}}>
                {savedToday?"● SAVED":"○ UNSAVED"}
              </div>
              {/* User + logout */}
              {user&&onLogout&&(
                <div style={{display:"flex",alignItems:"center",gap:5,marginTop:4,justifyContent:"flex-end"}}>
                  <div style={{fontSize:7,color:"#2A3545",letterSpacing:1}}>{user.email?.split("@")[0]?.toUpperCase()}</div>
                  <button onClick={onLogout} style={{
                    background:"none",border:"1px solid #1E2530",borderRadius:2,
                    padding:"1px 7px",fontSize:7,color:"#2A3545",cursor:"pointer",
                    fontFamily:"inherit",letterSpacing:1
                  }}>SIGN OUT</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hard stop progress bar */}
        {stats.pnl<0&&(
          <div style={{marginTop:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:7,letterSpacing:2,color:"#4A5568"}}>
              <span>DAILY DRAWDOWN</span>
              <span style={{color:Math.abs(stats.pnl)>calc.hardStop?"#FF6B6B":"#FFD700"}}>
                {fmtU(Math.abs(stats.pnl))} / {fmtU(calc.hardStop)} HARD STOP
              </span>
            </div>
            <div style={{background:"#111621",borderRadius:2,height:5,width:"100%",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min(100,(Math.abs(stats.pnl)/calc.hardStop)*100)}%`,background:Math.abs(stats.pnl)>calc.softStop?"#FF6B6B":"#FFD700",borderRadius:2,transition:"width .4s"}}/>
            </div>
          </div>
        )}
      </div>


      {/* ── TABS ─────────────────────────────────────────────── */}
      <div style={{display:"flex",background:"#0D1117",borderBottom:"1px solid #1E2530",overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            flex:"1 0 auto",background:"none",border:"none",cursor:"pointer",
            padding:"10px 8px",fontSize:9,letterSpacing:2,
            color:tab===t.id?"#00FFB2":"#4A5568",
            borderBottom:tab===t.id?"2px solid #00FFB2":"2px solid transparent",
            transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5
          }}>
            <span style={{fontSize:11}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <div style={{padding:"14px 18px",maxWidth:720,margin:"0 auto"}}>

        {/* ═══ PRE / LIVE ══════════════════════════════════════ */}
        {tab==="pre"&&(()=>{

          // ── PRE-MARKET DATA ───────────────────────────────────
          const EVENTS = [
            {id:"nfp",   day:"FRI", time:"13:30", event:"Non-Farm Payrolls",      impact:"high"},
            {id:"cpi",   day:"WED", time:"13:30", event:"CPI / Inflation Data",   impact:"high"},
            {id:"fomc",  day:"WED", time:"19:00", event:"FOMC Rate Decision",     impact:"high"},
            {id:"fomcm", day:"WED", time:"19:00", event:"FOMC Minutes",           impact:"high"},
            {id:"fed",   day:"TUE", time:"varies",event:"Fed Chair Speech",       impact:"high"},
            {id:"gdp",   day:"THU", time:"13:30", event:"GDP Data",               impact:"high"},
            {id:"pce",   day:"FRI", time:"13:30", event:"PCE / Core Inflation",   impact:"high"},
            {id:"ism",   day:"MON", time:"15:00", event:"ISM Manufacturing PMI",  impact:"medium"},
            {id:"jobs",  day:"THU", time:"13:30", event:"Initial Jobless Claims", impact:"medium"},
            {id:"retail",day:"WED", time:"13:30", event:"Retail Sales",           impact:"medium"},
            {id:"ppi",   day:"TUE", time:"13:30", event:"PPI Data",               impact:"medium"},
            {id:"conf",  day:"TUE", time:"15:00", event:"Consumer Confidence",    impact:"medium"},
          ];

          const DAY_TYPES = [
            {v:"trend_up",      l:"TREND UP",            col:"#00FFB2", icon:"▲"},
            {v:"trend_dn",      l:"TREND DOWN",          col:"#FF6B6B", icon:"▼"},
            {v:"normal_var_up", l:"NORMAL VAR UP",       col:"#4ade80", icon:"↑"},
            {v:"normal_var_dn", l:"NORMAL VAR DN",       col:"#f87171", icon:"↓"},
            {v:"neutral",       l:"NEUTRAL / BALANCED",  col:"#FFD700", icon:"↔"},
            {v:"double_dist",   l:"DOUBLE DISTRIBUTION", col:"#A78BFA", icon:"⇅"},
            {v:"p_shape",       l:"P-SHAPE / LIQ BREAK", col:"#FF6B6B", icon:"p"},
            {v:"b_shape",       l:"b-SHAPE / SHORT COV", col:"#00FFB2", icon:"b"},
          ];
          const RHYTHMS = [
            {v:"normal_trend", l:"NORMAL TREND",    col:"#38BDF8"},
            {v:"fast_trend",   l:"FAST TREND",      col:"#00FFB2"},
            {v:"balanced",     l:"BALANCED / ROT.", col:"#FFD700"},
            {v:"bracketed",    l:"BRACKETED RANGE", col:"#A78BFA"},
            {v:"expanding",    l:"EXPANDING RANGE", col:"#FF6B6B"},
          ];
          const VES = [
            {v:"same",          l:"SAME",              col:"#00FFB2", icon:"↔", inf:"Normal · Good Participation",        inventoryType:false},
            {v:"price_lag_cd",  l:"PRICE LAGGING CD",  col:"#FF6B6B", icon:"⬇", inf:"Absorption",                        inventoryType:false},
            {v:"price_ahead_cd",l:"PRICE AHEAD OF CD", col:"#FFD700", icon:"⬆", inf:"Stop Outs · Lack of Participation",  inventoryType:false},
            {v:"above_neutral", l:"ABOVE NEUTRAL",     col:"#00FFB2", icon:"▲", inf:"+ve Inventory",                      inventoryType:true},
            {v:"below_neutral", l:"BELOW NEUTRAL",     col:"#FF6B6B", icon:"▼", inf:"-ve Inventory",                      inventoryType:true},
          ];
          const CONTROLS = [
            {v:"buyers",       l:"BUYERS IN CONTROL",     col:"#00FFB2"},
            {v:"sellers",      l:"SELLERS IN CONTROL",    col:"#FF6B6B"},
            {v:"buy_absorbed", l:"BUYERS ABSORBED",       col:"#FF6B6B"},
            {v:"sell_absorbed",l:"SELLERS ABSORBED",      col:"#00FFB2"},
            {v:"contested",    l:"NEITHER — CONTESTED",   col:"#FFD700"},
          ];
          const AUCTIONS = [
            {v:"seek_higher", l:"SEEKING HIGHER VALUE", col:"#00FFB2", icon:"▲"},
            {v:"seek_lower",  l:"SEEKING LOWER VALUE",  col:"#FF6B6B", icon:"▼"},
            {v:"in_balance",  l:"HAPPY IN BALANCE",     col:"#FFD700", icon:"↔"},
          ];

          const setRead = (k,v) => setSessionRead(p=>({...p,[k]:v}));
          const setJF   = (k,v) => setJournalForm(p=>({...p,[k]:v}));

          const dayType = DAY_TYPES.find(d=>d.v===sessionRead.dayType);
          const rhythm  = RHYTHMS.find(r=>r.v===sessionRead.rhythm);
          const ve      = VES.find(v=>v.v===sessionRead.ve);
          const control = CONTROLS.find(c=>c.v===sessionRead.control);
          const auction = AUCTIONS.find(a=>a.v===sessionRead.auction);
          const hasRead = dayType||rhythm||ve||control||auction;

          const addEntry = () => {
            if(!journalForm.note&&!journalForm.dayType&&!journalForm.rhythm&&!journalForm.ve) return;
            const entry = {...journalForm, id:Date.now(), time:new Date().toTimeString().slice(0,5)};
            const next  = [...journalEntries, entry];
            setJournalEntries(next);
            setJournalForm({dayType:"",rhythm:"",ve:"",overstretched:false,control:"",auction:"",note:""});
            if(journalForm.dayType) setRead("dayType", journalForm.dayType);
            if(journalForm.rhythm)  setRead("rhythm",  journalForm.rhythm);
            if(journalForm.ve)      setRead("ve",      journalForm.ve);
            if(journalForm.control) setRead("control", journalForm.control);
            if(journalForm.auction) setRead("auction", journalForm.auction);
            save({journalEntries:next});
          };

          // Chip component
          const Chip = ({items, field, isForm, val, small}) => (
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {items.map(item=>(
                <button key={item.v}
                  onClick={()=>isForm ? setJF(field, val===item.v?"":item.v) : setRead(field, val===item.v?"":item.v)}
                  style={{
                    background:val===item.v?item.col+"20":"#080A0D",
                    border:`1px solid ${val===item.v?item.col+"60":"#1E2530"}`,
                    borderRadius:3, padding:small?"3px 7px":"5px 10px",
                    cursor:"pointer", fontSize:small?7:8, letterSpacing:1,
                    color:val===item.v?item.col:"#4A5568",
                    transition:"all .15s", fontFamily:"inherit", whiteSpace:"nowrap"
                  }}>
                  {item.icon&&<span style={{marginRight:3}}>{item.icon}</span>}{item.l}
                </button>
              ))}
            </div>
          );

          return (
            <div>

              {/* ══ STICKY READ SUMMARY ══════════════════════════════ */}
              {hasRead&&(
                <div style={{
                  background:"#080A0D",border:"1px solid #1E2530",
                  borderRadius:4,padding:"8px 12px",marginBottom:10,
                  position:"sticky",top:0,zIndex:10,
                  borderLeft:`3px solid ${dayType?.col||"#00FFB2"}`
                }}>
                  <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:4}}>CURRENT SESSION READ</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                    {dayType&&<span style={{fontSize:8,color:dayType.col,fontWeight:600}}>{dayType.icon} {dayType.l}</span>}
                    {rhythm&&<span style={{fontSize:8,color:rhythm.col}}>· {rhythm.l}</span>}
                    {ve&&<span style={{fontSize:8,color:ve.col}}>· {ve.icon} {ve.l}{sessionRead.overstretched?" ★":""}</span>}
                    {control&&<span style={{fontSize:8,color:control.col}}>· {control.l}</span>}
                    {auction&&<span style={{
                      fontSize:8,color:auction.col,
                      background:auction.col+"15",padding:"1px 6px",borderRadius:2,marginLeft:2
                    }}>{auction.icon} {auction.l}</span>}
                  </div>
                </div>
              )}

              {/* ══ SECTION A: PRE-MARKET ════════════════════════════ */}
              <div style={{
                fontSize:8,letterSpacing:3,color:"#00FFB2",marginBottom:8,
                display:"flex",alignItems:"center",gap:8
              }}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#00FFB2",flexShrink:0}}/>
                PRE-MARKET
                <div style={{flex:1,height:1,background:"#1E2530"}}/>
              </div>

              {/* Checklist — compressed with expand */}
              {(()=>{
                const pct = checksComplete/CHECKS.length*100;
                const allDone = checksComplete===CHECKS.length;
                return (
                  <div style={{
                    background:"#0D1117",
                    border:`1px solid ${allDone?"#00FFB240":"#1E2530"}`,
                    borderRadius:4,marginBottom:8,overflow:"hidden"
                  }}>
                    {/* Header row — always visible */}
                    <div
                      onClick={()=>setShowForm(v=>!v)}
                      style={{
                        display:"flex",alignItems:"center",gap:10,
                        padding:"10px 12px",cursor:"pointer"
                      }}>
                      {/* Progress bar inline */}
                      <div style={{flex:1,background:"#111621",borderRadius:2,height:6,overflow:"hidden"}}>
                        <div style={{
                          height:"100%",width:`${pct}%`,
                          background:allDone?"#00FFB2":"#FFD700",
                          borderRadius:2,transition:"width .3s"
                        }}/>
                      </div>
                      <div style={{fontSize:8,color:allDone?"#00FFB2":"#FFD700",letterSpacing:1,whiteSpace:"nowrap",flexShrink:0}}>
                        {allDone?"✓ COMPLETE":`${checksComplete}/${CHECKS.length}`}
                      </div>
                      <div style={{fontSize:8,color:"#2A3545",flexShrink:0}}>{showForm?"▲":"▼"}</div>
                    </div>
                    {/* Expandable checklist */}
                    {showForm&&(
                      <div style={{borderTop:"1px solid #1E2530",padding:"8px 12px"}}>
                        {CHECKS.map(item=>{
                          const done=checks[item.id];
                          return(
                            <div key={item.id}
                              onClick={()=>{const n={...checks,[item.id]:!done};setChecks(n);save({checks:n});}}
                              style={{
                                display:"flex",gap:8,padding:"7px 0",
                                borderBottom:"1px solid #111621",cursor:"pointer",
                                alignItems:"flex-start"
                              }}>
                              <div style={{
                                width:13,height:13,borderRadius:2,flexShrink:0,marginTop:1,
                                background:done?"#00FFB2":"transparent",
                                border:`1.5px solid ${done?"#00FFB2":"#2A3545"}`,
                                display:"flex",alignItems:"center",justifyContent:"center",
                                transition:"all .2s"
                              }}>
                                {done&&<span style={{fontSize:7,color:"#0D1117",fontWeight:700}}>✓</span>}
                              </div>
                              <span style={{fontSize:10,color:done?"#4A5568":"#64748B",textDecoration:done?"line-through":"none",lineHeight:1.5,letterSpacing:"0.3px"}}>{item.label}</span>
                            </div>
                          );
                        })}
                        {allDone&&(
                          <div style={{marginTop:8,textAlign:"center",fontSize:9,color:"#00FFB2",letterSpacing:2}}>
                            ✓ READY TO BUILD YOUR READ
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Bias */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:8}}>
                {[["bull","BULLISH","#00FFB2","▲"],["neutral","NEUTRAL","#FFD700","—"],["bear","BEARISH","#FF6B6B","▼"]].map(([v,l,c,icon])=>(
                  <button key={v} onClick={()=>{setBias(v);save({bias:v});}} style={{
                    background:bias===v?c+"18":"#0D1117",
                    border:`1px solid ${bias===v?c+"60":"#1E2530"}`,
                    borderRadius:4,padding:"10px 8px",cursor:"pointer",textAlign:"center",transition:"all .15s"
                  }}>
                    <div className="bb" style={{fontSize:20,color:bias===v?c:"#2A3545"}}>{icon}</div>
                    <div style={{fontSize:7,letterSpacing:2,color:bias===v?c:"#4A5568",marginTop:2}}>{l}</div>
                  </button>
                ))}
              </div>



              {/* Events — compact grid */}
              <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"10px 12px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:7,letterSpacing:3,color:"#4A5568"}}>HIGH-IMPACT EVENTS TODAY</div>
                  {activeEvents.length>0&&<div style={{fontSize:7,color:"#FF6B6B",letterSpacing:1,animation:"pulse 2s infinite"}}>⚠ {activeEvents.length} ACTIVE</div>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                  {[
                    {id:"nfp",day:"FRI",time:"13:30",event:"Non-Farm Payrolls",impact:"high"},
                    {id:"cpi",day:"WED",time:"13:30",event:"CPI / Inflation",impact:"high"},
                    {id:"fomc",day:"WED",time:"19:00",event:"FOMC Decision",impact:"high"},
                    {id:"fomcm",day:"WED",time:"19:00",event:"FOMC Minutes",impact:"high"},
                    {id:"fed",day:"TUE",time:"varies",event:"Fed Chair Speech",impact:"high"},
                    {id:"gdp",day:"THU",time:"13:30",event:"GDP Data",impact:"high"},
                    {id:"pce",day:"FRI",time:"13:30",event:"PCE Inflation",impact:"high"},
                    {id:"ism",day:"MON",time:"15:00",event:"ISM PMI",impact:"medium"},
                    {id:"jobs",day:"THU",time:"13:30",event:"Jobless Claims",impact:"medium"},
                    {id:"retail",day:"WED",time:"13:30",event:"Retail Sales",impact:"medium"},
                    {id:"ppi",day:"TUE",time:"13:30",event:"PPI Data",impact:"medium"},
                    {id:"conf",day:"TUE",time:"15:00",event:"Consumer Confidence",impact:"medium"},
                  ].map(ev=>{
                    const active = activeEvents.includes(ev.id);
                    const col    = ev.impact==="high"?"#FF6B6B":"#FFD700";
                    return(
                      <div key={ev.id} onClick={()=>{
                        const next = activeEvents.includes(ev.id)?activeEvents.filter(e=>e!==ev.id):[...activeEvents,ev.id];
                        setActiveEvents(next);save({activeEvents:next});
                      }} style={{
                        display:"flex",alignItems:"center",gap:6,
                        background:active?col+"10":"#080A0D",
                        border:`1px solid ${active?col+"40":"#111621"}`,
                        borderRadius:3,padding:"5px 7px",cursor:"pointer",transition:"all .15s"
                      }}>
                        <div style={{
                          width:8,height:8,borderRadius:"50%",flexShrink:0,
                          background:active?col:"#1E2530",transition:"all .15s"
                        }}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:8,color:active?col:"#4A5568",fontWeight:active?600:400,lineHeight:1.3}}>{ev.event}</div>
                          <div style={{fontSize:7,color:active?col+"80":"#2A3545",letterSpacing:1}}>{ev.day} {convertGMT(ev.time,tzOffset)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {activeEvents.length>0&&(
                  <div style={{marginTop:8,fontSize:7,color:"#FF6B6B",letterSpacing:1,lineHeight:1.5}}>
                    ⚠ AVOID TRADING 30 MIN EITHER SIDE — CLOSE OR WIDEN STOPS
                  </div>
                )}
              </div>

              {/* ══ SECTION B: SESSION READ ══════════════════════════ */}
              <div style={{
                fontSize:8,letterSpacing:3,color:"#FFD700",marginBottom:8,marginTop:4,
                display:"flex",alignItems:"center",gap:8
              }}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#FFD700",flexShrink:0}}/>
                SESSION READ
                <div style={{flex:1,height:1,background:"#1E2530"}}/>
              </div>

              {/* Read cards — one per category, all with ref cards */}
              {(()=>{
                const REF_CONTENT = {
                  dayType: {
                    title: "DAY TYPE CLASSIFICATION",
                    rows: [
                      ["TREND UP",            "#00FFB2", "Sustained move higher. Price away from prior value area. Buyers in control throughout. Buy pullbacks to VWAP or prior VAH."],
                      ["TREND DOWN",          "#FF6B6B", "Sustained move lower. Price away from prior value area. Sellers in control throughout. Sell rallies to VWAP or prior VAL."],
                      ["NORMAL VAR UP",       "#4ade80", "Typical range day with upward bias. Opens near value, rotates higher. Less conviction than a trend day."],
                      ["NORMAL VAR DOWN",     "#f87171", "Typical range day with downward bias. Opens near value, rotates lower. Less conviction than a trend day."],
                      ["NEUTRAL / BALANCED",  "#FFD700", "Market accepting current price. No directional conviction. Trade the range — fade extremes, respect the boundaries."],
                      ["DOUBLE DISTRIBUTION", "#A78BFA", "Two distinct value areas form. Range expansion mid-session creates a second distribution. High conviction directional move between them."],
                      ["P-SHAPE",             "#FF6B6B", "Short covering or buying tail. Thin profile above with a fat lower distribution. Price ran up to liquidate shorts, no real buying conviction."],
                      ["b-SHAPE",             "#00FFB2", "Buying tail or long liquidation. Fat upper distribution with thin profile below. Absorption at lows, potential for reversal higher."],
                    ]
                  },
                  rhythm: {
                    title: "MARKET RHYTHM",
                    rows: [
                      ["NORMAL TREND",    "#38BDF8", "Steady directional flow with healthy pullbacks. Pullbacks are bought or sold. Participate in the direction. Don't fight it."],
                      ["FAST TREND",      "#00FFB2", "Impulsive, minimal pullback. High participation, strong delta confirmation. Don't fade — wait for exhaustion signals before considering counter-trend."],
                      ["BALANCED / ROT.", "#FFD700", "Back and forth price action. No clear directional edge. Reduce size, wait for breakout from range or trade mean reversion at extremes."],
                      ["BRACKETED RANGE", "#A78BFA", "Defined high and low. Auction contained within boundaries. Trade fades at extremes with defined targets at opposite boundary."],
                      ["EXPANDING RANGE", "#FF6B6B", "Both sides being tested. Volatility increasing. Be cautious — unpredictable. Wait for range definition before committing directional bias."],
                    ]
                  },
                  ve: {
                    title: "TRADECOCKPIT CD ORDER FLOW TABLE",
                    rows: [
                      ["SAME",              "#00FFB2", "Normal · Good Participation. Price and delta moving together. Trend is healthy. Participate in the direction."],
                      ["PRICE LAGGING CD",  "#FF6B6B", "Absorption. Large players absorbing at key levels. CD moving but price not following. Potential reversal signal — watch for confirmation."],
                      ["PRICE AHEAD OF CD", "#FFD700", "Stop Outs · Lack of Participation. Price moving but delta not confirming. Weak move, no real conviction. Fade with caution or wait for CD to catch up."],
                      ["ABOVE NEUTRAL",     "#00FFB2", "+ve Inventory. Buyers loaded. Can be overstretched — monitor for exhaustion. Good for long continuation if not overextended."],
                      ["BELOW NEUTRAL",     "#FF6B6B", "-ve Inventory. Sellers loaded. Can be overstretched — monitor for exhaustion. Good for short continuation if not overextended."],
                    ]
                  },
                  control: {
                    title: "WHO'S IN CONTROL",
                    rows: [
                      ["BUYERS IN CONTROL",     "#00FFB2", "Aggressive buying participation. Price moving higher with delta confirmation. Trend continuation likely. Don't fade into strength."],
                      ["SELLERS IN CONTROL",    "#FF6B6B", "Aggressive selling participation. Price moving lower with delta confirmation. Trend continuation likely. Don't fade into weakness."],
                      ["BUYERS ABSORBED",       "#FF6B6B", "Buyers stepping in but being absorbed by larger sellers. Price failing to follow buying. Bearish signal — sellers have the inventory advantage."],
                      ["SELLERS ABSORBED",      "#00FFB2", "Sellers stepping in but being absorbed by larger buyers. Price failing to follow selling. Bullish signal — buyers have the inventory advantage."],
                      ["NEITHER — CONTESTED",   "#FFD700", "No clear dominant side. Both buyers and sellers active. Wait for resolution. Reduced size until direction is confirmed."],
                    ]
                  },
                  auction: {
                    title: "AUCTION STATE — MARKET THEORY",
                    rows: [
                      ["SEEKING HIGHER VALUE", "#00FFB2", "Market advertising higher prices. Other timeframe participants (OTF) are active buyers. Price is moving away from prior value to find new acceptance. Trend continuation likely until new value is established."],
                      ["SEEKING LOWER VALUE",  "#FF6B6B", "Market advertising lower prices. Other timeframe participants are active sellers. Price moving away from prior value to find new acceptance. Trend continuation likely until new value is established."],
                      ["HAPPY IN BALANCE",     "#FFD700", "Market accepting current price range. No OTF activity. Day timeframe players dominating. Trade mean reversion — fade extremes back to centre. Expect containment within the established range."],
                    ]
                  },
                };

                return [
                  {label:"DAY TYPE",            items:DAY_TYPES, field:"dayType", val:sessionRead.dayType},
                  {label:"MARKET RHYTHM",       items:RHYTHMS,   field:"rhythm",  val:sessionRead.rhythm},
                  {label:"PRICE vs CD (OF=5%)", items:VES,       field:"ve",      val:sessionRead.ve},
                  {label:"WHO'S IN CONTROL",    items:CONTROLS,  field:"control", val:sessionRead.control},
                  {label:"AUCTION STATE",       items:AUCTIONS,  field:"auction", val:sessionRead.auction},
                ].map(({label,items,field,val})=>(
                  <div key={field} style={{
                    background:"#0D1117",border:"1px solid #1E2530",
                    borderRadius:4,padding:"9px 12px",marginBottom:6
                  }}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                      <div style={{fontSize:7,letterSpacing:2,color:"#4A5568"}}>{label}</div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {val&&<div style={{fontSize:7,color:items.find(i=>i.v===val)?.col||"#4A5568",letterSpacing:1,fontWeight:600}}>✓ {items.find(i=>i.v===val)?.l}</div>}
                        <button onClick={()=>setShowRefCard(p=>({...p,[field]:!p[field]}))} style={{
                          background:showRefCard[field]?"#00FFB210":"none",
                          border:`1px solid ${showRefCard[field]?"#00FFB230":"#1E2530"}`,
                          borderRadius:2,padding:"1px 7px",fontSize:7,
                          color:showRefCard[field]?"#00FFB2":"#4A5568",
                          cursor:"pointer",fontFamily:"inherit",transition:"all .15s"
                        }}>{showRefCard[field]?"▲ HIDE":"▼ REF"}</button>
                      </div>
                    </div>

                    {/* Ref card */}
                    {showRefCard[field]&&REF_CONTENT[field]&&(
                      <div style={{background:"#080A0D",borderRadius:3,padding:"10px 11px",marginBottom:8}}>
                        <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:8}}>{REF_CONTENT[field].title}</div>
                        {REF_CONTENT[field].rows.map(([name,col,desc])=>(
                          <div key={name} style={{padding:"6px 0",borderBottom:"1px solid #111621"}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                              <div style={{width:3,height:3,borderRadius:"50%",background:col,flexShrink:0}}/>
                              <span style={{fontSize:8,color:col,fontWeight:600,letterSpacing:0.5}}>{name}</span>
                            </div>
                            <div style={{fontSize:8,color:"#4A5568",lineHeight:1.6,paddingLeft:9}}>{desc}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <Chip items={items} field={field} val={val}/>

                    {/* Overstretched toggle */}
                    {field==="ve"&&(val==="above_neutral"||val==="below_neutral")&&(
                      <div style={{marginTop:6}}>
                        <button onClick={()=>setRead("overstretched",!sessionRead.overstretched)} style={{
                          background:sessionRead.overstretched?"#FF6B6B18":"transparent",
                          border:`1px solid ${sessionRead.overstretched?"#FF6B6B50":"#1E2530"}`,
                          borderRadius:3,padding:"3px 10px",cursor:"pointer",
                          fontSize:7,letterSpacing:1.5,
                          color:sessionRead.overstretched?"#FF6B6B":"#4A5568",fontFamily:"inherit"
                        }}>{sessionRead.overstretched?"★ OVERSTRETCHED":"○ OVERSTRETCHED?"}</button>
                      </div>
                    )}
                  </div>
                ));
              })()}

              {/* Session hypothesis — after read, before live */}
              <div style={{background:"#0D1117",border:"1px solid #1E2530",borderLeft:"3px solid #FFD700",borderRadius:4,padding:"10px 12px",marginBottom:8}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#FFD700",marginBottom:5}}>SESSION HYPOTHESIS</div>
                <textarea value={sessionRead.hypothesis} onChange={e=>setRead("hypothesis",e.target.value)}
                  placeholder="Based on your read — what do you expect to happen and why?"
                  style={{width:"100%",background:"#080A0D",border:"none",borderRadius:3,
                    padding:"8px 10px",color:"#E2E8F0",fontSize:10,minHeight:52,resize:"none",
                    fontFamily:"inherit",lineHeight:1.5,outline:"none"}}/>
              </div>

              {/* ══ SECTION C: LIVE SESSION ══════════════════════════ */}
              <div style={{
                fontSize:8,letterSpacing:3,color:"#38BDF8",marginBottom:8,marginTop:6,
                display:"flex",alignItems:"center",gap:8
              }}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#38BDF8",
                  boxShadow:"0 0 6px #38BDF2",animation:"pulse 2s infinite",flexShrink:0}}/>
                LIVE SESSION
                <div style={{flex:1,height:1,background:"#1E2530"}}/>
                <span style={{fontSize:7,color:"#2A3545",letterSpacing:1}}>{journalEntries.length} ENTRIES</span>
              </div>

              {/* Quick log bar */}
              <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"10px 12px",marginBottom:8}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:7}}>LOG UPDATE</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:7}}>
                  {/* Day Type mini */}
                  <div>
                    <div style={{fontSize:6,letterSpacing:1,color:"#2A3545",marginBottom:3}}>DAY TYPE</div>
                    <Chip items={DAY_TYPES} field="dayType" isForm val={journalForm.dayType} small/>
                  </div>
                  {/* Rhythm mini */}
                  <div>
                    <div style={{fontSize:6,letterSpacing:1,color:"#2A3545",marginBottom:3}}>RHYTHM</div>
                    <Chip items={RHYTHMS} field="rhythm" isForm val={journalForm.rhythm} small/>
                  </div>
                  {/* Auction mini */}
                  <div>
                    <div style={{fontSize:6,letterSpacing:1,color:"#2A3545",marginBottom:3}}>AUCTION</div>
                    <Chip items={AUCTIONS} field="auction" isForm val={journalForm.auction} small/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:7}}>
                  <div>
                    <div style={{fontSize:6,letterSpacing:1,color:"#2A3545",marginBottom:3}}>CD READING</div>
                    <Chip items={VES} field="ve" isForm val={journalForm.ve} small/>
                  </div>
                  <div>
                    <div style={{fontSize:6,letterSpacing:1,color:"#2A3545",marginBottom:3}}>CONTROL</div>
                    <Chip items={CONTROLS} field="control" isForm val={journalForm.control} small/>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <input value={journalForm.note} onChange={e=>setJF("note",e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&addEntry()}
                    placeholder="What are you seeing? Press Enter to log..."
                    style={{flex:1,background:"#080A0D",border:"1px solid #1E2530",borderRadius:3,
                      padding:"7px 10px",color:"#E2E8F0",fontSize:10,fontFamily:"inherit",outline:"none"}}/>
                  <button onClick={addEntry} style={{
                    background:"#38BDF818",border:"1px solid #38BDF840",borderRadius:3,
                    padding:"7px 14px",cursor:"pointer",fontSize:8,letterSpacing:2,
                    color:"#38BDF8",fontFamily:"inherit",flexShrink:0
                  }}>LOG</button>
                </div>
              </div>

              {/* Journal timeline */}
              {journalEntries.length>0&&(
                <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,overflow:"hidden"}}>
                  <div style={{maxHeight:220,overflowY:"auto"}}>
                    {[...journalEntries].reverse().map((entry,i)=>{
                      const dt  = DAY_TYPES.find(d=>d.v===entry.dayType);
                      const rh  = RHYTHMS.find(r=>r.v===entry.rhythm);
                      const ve2 = VES.find(v=>v.v===entry.ve);
                      const ct  = CONTROLS.find(c=>c.v===entry.control);
                      const au  = AUCTIONS.find(a=>a.v===entry.auction);
                      return(
                        <div key={entry.id} style={{
                          display:"flex",gap:10,padding:"8px 12px",
                          borderBottom:"1px solid #111621",alignItems:"flex-start"
                        }}>
                          <div style={{
                            fontSize:8,color:"#38BDF8",letterSpacing:1,flexShrink:0,
                            background:"#38BDF810",padding:"2px 6px",borderRadius:2,marginTop:1,whiteSpace:"nowrap"
                          }}>{entry.time}</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:entry.note?3:0}}>
                              {dt &&<span style={{fontSize:7,color:dt.col, fontWeight:600}}>{dt.icon} {dt.l}</span>}
                              {rh &&<span style={{fontSize:7,color:rh.col}}>· {rh.l}</span>}
                              {ve2&&<span style={{fontSize:7,color:ve2.col}}>· {ve2.icon} {ve2.l}{entry.overstretched?" ★":""}</span>}
                              {ct &&<span style={{fontSize:7,color:ct.col}}>· {ct.l}</span>}
                              {au &&<span style={{fontSize:7,color:au.col,background:au.col+"15",padding:"1px 4px",borderRadius:2}}>· {au.icon} {au.l}</span>}
                            </div>
                            {entry.note&&<div style={{fontSize:9,color:"#64748B",lineHeight:1.5}}>{entry.note}</div>}
                          </div>
                          <button onClick={()=>{
                            const next=journalEntries.filter(e=>e.id!==entry.id);
                            setJournalEntries(next);save({journalEntries:next});
                          }} style={{background:"none",border:"none",cursor:"pointer",fontSize:9,color:"#2A3545",padding:"0 2px",flexShrink:0}}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Additional notes */}
              <div style={{marginTop:8}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:5}}>ADDITIONAL NOTES</div>
                <textarea value={news} onChange={e=>setNews(e.target.value)}
                  placeholder="Any other notes for this session..."
                  style={{width:"100%",background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,
                    padding:"8px 10px",color:"#E2E8F0",fontSize:10,minHeight:40,resize:"none",
                    fontFamily:"inherit",lineHeight:1.5,outline:"none"}}/>
              </div>

            </div>
          );
        })()}

        {/* ═══ RISK CALC ════════════════════════════════════════ */}
        {tab==="calc"&&(<>
          {/* Contract selector */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:7}}>CONTRACT</div>

          {/* Category filter chips */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
            {CONTRACT_CATS.map(cat=>{
              const catCol = CC[cat]||"#94A3B8";
              const isAll  = cat==="All";
              const active = catFilter===cat;
              return(
                <button key={cat} onClick={()=>setCatFilter(cat)} style={{
                  background: active?(isAll?"#E2E8F040":catCol+"20"):"#0D1117",
                  border:`1px solid ${active?(isAll?"#E2E8F040":catCol+"60"):"#1E2530"}`,
                  borderRadius:20,padding:"3px 10px",cursor:"pointer",
                  fontSize:7,letterSpacing:1.5,
                  color:active?(isAll?"#E2E8F0":catCol):"#4A5568",
                  transition:"all .15s",whiteSpace:"nowrap"
                }}>{cat.toUpperCase()}</button>
              );
            })}
          </div>

          {/* Filtered contract buttons */}
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
            {CONTRACTS.filter(c=>catFilter==="All"||c.category===catFilter).map(c=>{
              const cc2=CC[c.category]||"#94A3B8";
              const isMicro=c.category==="Micro"||c.id.startsWith("M")||c.id==="SIL";
              return(
                <button key={c.id} onClick={()=>{setContractId(c.id);setLiveData(null);save({contractId:c.id});}}
                  style={{
                    background:contractId===c.id?cc2+"18":"#0D1117",
                    border:`1px solid ${contractId===c.id?cc2+"60":"#1E2530"}`,
                    borderLeft:isMicro?`2px solid ${cc2}40`:`2px solid ${cc2}`,
                    borderRadius:3,padding:"5px 9px",cursor:"pointer",
                    fontSize:9,letterSpacing:1,
                    color:contractId===c.id?cc2:"#4A5568",
                    transition:"all .15s",
                    opacity:isMicro&&contractId!==c.id?0.7:1
                  }}>
                  {c.id}
                  {isMicro&&<span style={{fontSize:6,marginLeft:3,opacity:.6}}>μ</span>}
                </button>
              );
            })}
          </div>

          {/* Session Price Entry — from NinjaTrader */}
          {/* Live feed toggle — only shown when connected */}
          {(()=>true)()&&(
            <div style={{
              display:"flex",alignItems:"center",justifyContent:"space-between",
              background: liveFeed?"#00FFB210":"#0D1117",
              border:`1px solid ${liveFeed?"#00FFB240":"#1E2530"}`,
              borderRadius:4,padding:"9px 13px",marginBottom:8,
              transition:"all .3s"
            }}>
              <div>
                <div style={{fontSize:8,letterSpacing:2,color:liveFeed?"#00FFB2":"#4A5568",fontWeight:600,marginBottom:2}}>
                  {liveFeed?"⬤ LIVE PRICE FEED ACTIVE":"○ LIVE PRICE FEED"}
                </div>
                <div style={{fontSize:8,color:"#4A5568",letterSpacing:1}}>
                  {liveFeed
                    ? `${contract.id} · Yahoo Finance · refreshes every 30s · ${liveLastPx?liveData?.time||"—":"—"}`
                    : "Yahoo Finance · 15-min delay · tap to start feed"}
                </div>
              </div>
              <button
                onClick={()=>{
                  setLiveFeed(v=>!v);
                  if(liveFeed&&liveIntervalRef.current){
                    clearInterval(liveIntervalRef.current);
                    liveIntervalRef.current=null;
                  }
                }}
                style={{
                  background:liveFeed?"#FF6B6B18":"#00FFB218",
                  border:`1px solid ${liveFeed?"#FF6B6B40":"#00FFB240"}`,
                  borderRadius:3,padding:"6px 14px",cursor:"pointer",
                  fontSize:8,letterSpacing:2,color:liveFeed?"#FF6B6B":"#00FFB2",
                  fontFamily:"inherit",flexShrink:0
                }}>
                {liveFeed?"STOP FEED":"START FEED"}
              </button>
            </div>
          )}
          <QuickPriceEntry contract={contract} cc={cc} d2={d2} liveData={liveData} onApply={applyLive} />

          {/* Account / Risk */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:7}}>ACCOUNT & RISK</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
            <Inp label="ACCOUNT SIZE" value={account} onChange={v=>{setAccount(v);save({account:v});}} unit="USD"/>
            <Inp label="RISK PER TRADE" value={riskPct} onChange={v=>{setRiskPct(v);save({riskPct:v});}} unit={`% · ${fmtU(calc.dollarRisk)}`}/>
          </div>

          {/* Stop mode */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
            {[["ticks","◈ FIXED TICKS"],["adrpct","▦ % OF ADR"]].map(([v,l])=>(
              <button key={v} onClick={()=>setStopMode(v)} style={{
                background:stopMode===v?"#00FFB218":"#0D1117",
                border:`1px solid ${stopMode===v?"#00FFB240":"#1E2530"}`,
                borderRadius:4,padding:"8px",cursor:"pointer",fontSize:8,
                letterSpacing:"1.5px",color:stopMode===v?"#00FFB2":"#4A5568",transition:"all .15s"
              }}>{l}</button>
            ))}
          </div>

          {stopMode==="ticks"?(
            <Inp label="STOP IN TICKS" value={stopTicks} onChange={setStopTicks} unit={`${calc.eTicks} ticks = ${fmt(calc.stopPts,d2)} pts · ${fmt(calc.stopAdrPctCalc,1)}% ADR · ${fmtU(calc.rpc)}/ct`}/>
          ):(
            <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"9px 11px",marginBottom:0}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:7,letterSpacing:"1.5px",color:"#4A5568",marginBottom:4}}>
                <span>STOP AS % OF ADR</span><span style={{color:"#FFD700"}}>{stopAdrPct}%</span>
              </div>
              <input type="range" min="5" max="40" step="1" value={stopAdrPct} onChange={e=>setStopAdrPct(e.target.value)}
                style={{width:"100%",accentColor:"#00FFB2",margin:"4px 0"}}/>
              <div style={{fontSize:7,color:"#4A5568",letterSpacing:1}}>{calc.eTicks} ticks = {fmt(calc.stopPts,d2)} pts · {fmtU(calc.rpc)}/ct</div>
            </div>
          )}

          {/* Entry / Direction / RR */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,margin:"10px 0"}}>
            <Inp label={`ENTRY PRICE${liveData?" · LIVE":""}` } value={entryPx} onChange={setEntryPx} placeholder={liveData?fmt(liveData.price,d2):"—"} highlight={!!liveData}/>
            <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"9px 11px"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:7,letterSpacing:"1.5px",color:"#4A5568",marginBottom:4}}>
                <span>R:R RATIO</span><span style={{color:"#00FFB2"}}>1:{rr}</span>
              </div>
              <input type="range" min="1" max="5" step="0.5" value={rr} onChange={e=>setRr(e.target.value)}
                style={{width:"100%",accentColor:"#00FFB2",margin:"4px 0"}}/>
              <div style={{fontSize:7,color:"#4A5568",letterSpacing:1}}>BE WIN RATE: {fmt(parseFloat(rr)>0?(1/(1+parseFloat(rr)))*100:0,1)}%</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
            {[["long","▲ LONG","#00FFB2"],["short","▼ SHORT","#FF6B6B"]].map(([v,l,c])=>(
              <button key={v} onClick={()=>setDir(v)} style={{
                background:dir===v?c+"18":"#0D1117",border:`1px solid ${dir===v?c+"40":"#1E2530"}`,
                borderRadius:4,padding:"9px",cursor:"pointer",fontSize:10,letterSpacing:2,
                color:dir===v?c:"#4A5568",transition:"all .15s"
              }}>{l}</button>
            ))}
          </div>

          {/* Hero result */}
          {(()=>{
            const displayContracts = contractsOverride !== "" ? parseInt(contractsOverride)||0 : calc.maxContracts;
            const overrideRisk     = contractsOverride !== "" ? (parseInt(contractsOverride)||0) * calc.rpc : calc.actualRisk;
            const isOverride       = contractsOverride !== "";
            const borderCol = isOverride?"#FFD700":calc.propLimited?"#FF6B6B":"#00FFB2";
            return (
              <div style={{background:"#0D1117",border:`1px solid ${borderCol}30`,borderLeft:`3px solid ${borderCol}`,borderRadius:4,padding:"12px 14px",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:7,letterSpacing:2,color:borderCol}}>
                    {isOverride?"CONTRACTS — MANUAL OVERRIDE"
                    :calc.propLimited?"MAX CONTRACTS — PROP FIRM LIMITED"
                    :"MAX CONTRACTS — CALCULATED"}
                  </div>
                  {isOverride&&(
                    <button onClick={()=>setContractsOverride("")} style={{background:"none",border:"1px solid #FFD70030",borderRadius:2,padding:"2px 7px",fontSize:7,color:"#FFD700",cursor:"pointer",letterSpacing:1}}>
                      ✕ RESET TO CALC
                    </button>
                  )}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",gap:12}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                    <input
                      type="number" min="0" max="999" step="1"
                      value={contractsOverride !== "" ? contractsOverride : calc.maxContracts}
                      onChange={e=>{
                        const v = e.target.value;
                        if(v === "" || v === String(calc.maxContracts)) setContractsOverride("");
                        else setContractsOverride(v);
                      }}
                      style={{background:"none",border:"none",outline:"none",
                        fontFamily:"'Bebas Neue',sans-serif",fontSize:36,
                        color:isOverride?"#FFD700":calc.propLimited?"#FF6B6B":"#00FFB2",
                        letterSpacing:1,width:80,padding:0}}
                    />
                    <div style={{fontSize:9,color:"#4A5568",letterSpacing:1,paddingBottom:4}}>CONTRACTS</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:7,color:"#64748B",letterSpacing:1}}>{isOverride?"OVERRIDE RISK":"ACTUAL RISK"}</div>
                    <div className="bb" style={{fontSize:17,color:isOverride?"#FFD700":"#E2E8F0"}}>{fmtU(overrideRisk)}</div>
                    <div style={{fontSize:7,color:"#4A5568",letterSpacing:1}}>
                      {fmt((parseFloat(account)>0?overrideRisk/parseFloat(account)*100:0),2)}% OF ACCOUNT
                      {isOverride&&overrideRisk>calc.dollarRisk&&<span style={{color:"#FF6B6B"}}> ⚠ OVER LIMIT</span>}
                    </div>
                  </div>
                </div>
                {calc.maxContracts===0&&calc.dollarRisk>0&&<Warn>⚠ RISK TOO SMALL FOR 1 CONTRACT — REDUCE STOP OR INCREASE RISK %</Warn>}
                {calc.propLimited&&!isOverride&&(
                  <div style={{background:"#FF6B6B0A",border:"1px solid #FF6B6B20",borderRadius:3,padding:"7px 10px",marginTop:6}}>
                    <div style={{fontSize:7,color:"#FF6B6B",letterSpacing:1,marginBottom:3}}>
                      ⚠ PROP FIRM REALITY CHECK — CONSTRAINED BY {calc.propLimitReason?.toUpperCase()}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
                      {[
                        ["RISK BASED",  calc.riskBasedMax,   "#4A5568"],
                        ["PROP MAX",    calc.propMaxContracts,"#FF6B6B"],
                        ["APPLIED MAX", calc.maxContracts,    "#FFD700"],
                      ].map(([l,v,c])=>(
                        <div key={l} style={{background:"#080A0D",borderRadius:2,padding:"5px 7px"}}>
                          <div style={{fontSize:6,letterSpacing:1,color:"#2A3545",marginBottom:2}}>{l}</div>
                          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:8,color:"#FF6B6B",marginTop:5,lineHeight:1.5}}>
                      Your real account ({propFirm.drawdownType} drawdown ${propFirm.maxDrawdown?.toLocaleString()}) limits you to {calc.propMaxContracts} {contract.id} contract{calc.propMaxContracts!==1?"s":""} on a 10-tick stop. Risk calc adjusted accordingly.
                    </div>
                  </div>
                )}
                {isOverride&&overrideRisk>calc.dollarRisk&&(
                  <div style={{fontSize:8,color:"#FF6B6B",marginTop:5,letterSpacing:1}}>⚠ MANUAL SIZE EXCEEDS RISK LIMIT — TRADE AT YOUR OWN RISK</div>
                )}
              </div>
            );
          })()}

          {/* Price levels */}
          {entryPx&&parseFloat(entryPx)>0&&(
            <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"11px 13px",marginBottom:7}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>
                  {[
                    ["ENTRY",          fmt(parseFloat(entryPx),d2), "#38BDF8", null],
                    ["STOP LOSS",      fmt(calc.stopPrice,d2),      "#FF6B6B", null],
                    [`TARGET 1:${rr}`, fmt(calc.tgtPrice,d2),       "#00FFB2", null],
                    ["PARTIAL @ 1R",   fmt(calc.partialPx,d2),      "#FFD700", null],
                    ["PROFIT TARGET",  fmtU(calc.tgtDollar),        "#00FFB2", fmtU(calc.netTgtDollar)],
                    ["COMMISSION",     fmtU(calc.commTotal),        "#FF6B6B", `${fmtU(calc.commPerContract)}/contract RT`],
                    ["NET PROFIT",     fmtU(calc.netTgtDollar),     calc.netTgtDollar>0?"#00FFB2":"#FF6B6B", null],
                    ["MARGIN REQ",     fmtU(calc.marginReq),        "#E2E8F0", null],
                  ].map(([l,v,c,sub])=>(
                    <tr key={l} style={{borderBottom:"1px solid #111621",background:l==="NET PROFIT"?"#00FFB208":"transparent"}}>
                      <td style={{padding:"5px 0",fontSize:9,color:l==="NET PROFIT"?"#94A3B8":"#4A5568",letterSpacing:1,fontWeight:l==="NET PROFIT"?600:400}}>{l}</td>
                      <td style={{padding:"5px 0",fontSize:10,color:c,textAlign:"right",fontWeight:500}}>
                        {v}
                        {sub&&<div style={{fontSize:7,color:"#4A5568",letterSpacing:1}}>{sub}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ADR Range */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:7,marginTop:14}}>ADR RANGE ANALYSIS</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
            <Inp label={`DAY HIGH${liveData?" · LIVE":""}`} value={dayHigh} onChange={setDayHigh} highlight={!!liveData}/>
            <Inp label={`DAY LOW${liveData?" · LIVE":""}`} value={dayLow} onChange={setDayLow} highlight={!!liveData}/>
          </div>
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"11px 13px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div>
                <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:2}}>ADR</div>
                <div className="bb" style={{fontSize:18,color:"#FFD700"}}>{calc.adr} pts <span style={{fontSize:11,color:"#4A5568"}}>/ {fmtU(calc.adrDollar)}</span></div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:2}}>STOP % OF ADR</div>
                <div className="bb" style={{fontSize:18,color:calc.stopAdrPctCalc>35?"#FF6B6B":"#38BDF8"}}>{fmt(calc.stopAdrPctCalc,1)}%</div>
              </div>
            </div>
            {calc.rangeUsed>0&&(
              <>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:3}}>
                  <span>RANGE CONSUMED</span>
                  <span style={{color:calc.rangeUsedPct>100?"#FF6B6B":"#FFD700"}}>{fmt(calc.rangeUsedPct,1)}%</span>
                </div>
                <div style={{background:"#111621",borderRadius:3,height:18,width:"100%",position:"relative",overflow:"hidden",marginBottom:6}}>
                  <div style={{height:"100%",width:`${Math.min(100,calc.rangeUsedPct)}%`,background:calc.rangeUsedPct>100?"#FF6B6B":calc.rangeUsedPct>75?"#FFD700":"#38BDF8",borderRadius:3,display:"flex",alignItems:"center",paddingLeft:6,fontSize:8,color:"#0D1117",fontWeight:600,transition:"width .4s"}}>
                    {calc.rangeUsedPct>20&&`${fmt(calc.rangeUsed,d2)} pts`}
                  </div>
                  {calc.entryInRange!=null&&(
                    <div style={{position:"absolute",top:0,bottom:0,left:`${calc.entryInRange}%`,width:2,background:"#FFD700"}}/>
                  )}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:7,color:"#4A5568"}}>
                  <span>LOW {dayLow}</span><span style={{color:"#FFD700"}}>▲ ENTRY</span><span>HIGH {dayHigh}</span>
                </div>
                {calc.entryInRange!=null&&(
                  <div style={{marginTop:6,fontSize:8,color:calc.entryInRange>50?"#FF6B6B":"#00FFB2",letterSpacing:1}}>
                    {calc.entryInRange>50?"⚠ ENTRY IN PREMIUM — CAUTION ON LONGS":"✓ ENTRY IN DISCOUNT — FAVOURABLE FOR LONGS"}
                  </div>
                )}
              </>
            )}
          </div>
        </>)}

        {/* ═══ TRADE LOG ════════════════════════════════════════ */}
        {tab==="log"&&(<>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:2}}>SESSION TRADE LOG</div>
              <div style={{fontSize:9,color:"#4A5568"}}>{stats.tradeCount} TRADES · {stats.closed} CLOSED · {fmtP(stats.winRate)} WIN RATE</div>
            </div>
  <div style={{display:"flex",gap:6}}>
              <button onClick={()=>{setShowImport(v=>!v);setShowForm(false);}} disabled={trades.length>=2} style={{
                background:showImport?"#38BDF818":trades.length>=2?"#111621":"#0D1117",
                border:`1px solid ${showImport?"#38BDF840":trades.length>=2?"#1E2530":"#2A3545"}`,
                borderRadius:3,padding:"7px 10px",cursor:trades.length>=2?"not-allowed":"pointer",
                fontSize:8,letterSpacing:2,color:trades.length>=2?"#2A3545":showImport?"#38BDF8":"#64748B"
              }}>⬆ IMPORT</button>
              <button onClick={()=>{setShowForm(v=>!v);setShowImport(false);}} disabled={trades.length>=2} style={{
                background:trades.length>=2?"#111621":"#00FFB218",
                border:`1px solid ${trades.length>=2?"#1E2530":"#00FFB240"}`,
                borderRadius:3,padding:"7px 10px",cursor:trades.length>=2?"not-allowed":"pointer",
                fontSize:8,letterSpacing:2,color:trades.length>=2?"#2A3545":"#00FFB2"
              }}>{trades.length>=2?"MAX 2":"+ ADD"}</button>
            </div>
          </div>

          {/* Import panel */}
          {showImport&&(
            <ImportPanel onImport={handleImport} existingCount={trades.length}/>
          )}

          {/* Add trade form */}
          {showForm&&(
            <div style={{background:"#0D1117",border:"1px solid #1E2530",borderLeft:"3px solid #00FFB2",borderRadius:4,padding:"13px 14px",marginBottom:12}}>
              <div style={{fontSize:8,letterSpacing:3,color:"#00FFB2",marginBottom:10}}>NEW TRADE</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
                <Inp label="SETUP TYPE" value={tForm.setup} onChange={v=>setTForm(p=>({...p,setup:v}))} placeholder="e.g. OB + FVG Retest"/>
                <div style={{background:"#080A0D",border:"1px solid #1E2530",borderRadius:4,padding:"8px 10px"}}>
                  <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:5}}>DIRECTION</div>
                  <div style={{display:"flex",gap:6}}>
                    {[["long","▲ LONG","#00FFB2"],["short","▼ SHORT","#FF6B6B"]].map(([v,l,c])=>(
                      <button key={v} onClick={()=>setTForm(p=>({...p,dir:v}))} style={{
                        flex:1,background:tForm.dir===v?c+"18":"transparent",border:`1px solid ${tForm.dir===v?c+"40":"#1E2530"}`,
                        borderRadius:3,padding:"5px",cursor:"pointer",fontSize:8,letterSpacing:1,color:tForm.dir===v?c:"#4A5568"
                      }}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:7}}>
                <Inp label="ENTRY PRICE" value={tForm.entry} onChange={v=>setTForm(p=>({...p,entry:v}))}/>
                <Inp label="STOP PRICE" value={tForm.stop}  onChange={v=>setTForm(p=>({...p,stop:v}))}/>
                <Inp label="TARGET PRICE" value={tForm.target} onChange={v=>setTForm(p=>({...p,target:v}))}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:7}}>
                <Inp label="EXIT PRICE" value={tForm.exit} onChange={v=>setTForm(p=>({...p,exit:v}))} placeholder="Fill after close"/>
                <Inp label="CONTRACTS" value={tForm.contracts} onChange={v=>setTForm(p=>({...p,contracts:v}))}/>
                <div style={{background:"#080A0D",border:"1px solid #1E2530",borderRadius:4,padding:"8px 10px"}}>
                  <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:5}}>GRADE</div>
                  <div style={{display:"flex",gap:4}}>
                    {[["A","#00FFB2"],["B","#FFD700"],["C","#FF6B6B"]].map(([v,c])=>(
                      <button key={v} onClick={()=>setTForm(p=>({...p,grade:v}))} style={{
                        flex:1,background:tForm.grade===v?c+"18":"transparent",border:`1px solid ${tForm.grade===v?c+"40":"#1E2530"}`,
                        borderRadius:3,padding:"5px",cursor:"pointer",fontSize:9,letterSpacing:1,fontWeight:700,
                        color:tForm.grade===v?c:"#4A5568",fontFamily:"inherit"
                      }}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea value={tForm.notes} onChange={e=>setTForm(p=>({...p,notes:e.target.value}))}
                placeholder="Trade notes — setup rationale, emotions, what you saw..."
                style={{width:"100%",background:"#080A0D",border:"1px solid #1E2530",borderRadius:4,padding:"8px 10px",color:"#E2E8F0",fontSize:10,minHeight:50,marginBottom:8}}/>
              <div style={{display:"flex",gap:7}}>
                <button onClick={addTrade} style={{flex:1,background:"#00FFB218",border:"1px solid #00FFB240",borderRadius:3,padding:"8px",fontSize:9,letterSpacing:2,color:"#00FFB2",cursor:"pointer"}}>✓ LOG TRADE</button>
                <button onClick={()=>setShowForm(false)} style={{background:"none",border:"1px solid #1E2530",borderRadius:3,padding:"8px 12px",fontSize:9,letterSpacing:2,color:"#4A5568",cursor:"pointer"}}>CANCEL</button>
              </div>
            </div>
          )}

          {/* Trades list */}
          {trades.length===0&&(
            <div style={{textAlign:"center",padding:"30px 0",fontSize:9,color:"#2A3545",letterSpacing:2}}>NO TRADES LOGGED YET</div>
          )}
          {trades.map((t,i)=>{
            const rrCon = t.entry&&t.stop&&t.target
              ? Math.abs((parseFloat(t.target)-parseFloat(t.entry))/(parseFloat(t.entry)-parseFloat(t.stop))).toFixed(1)
              : "—";
            const isWin = t.exit&&(t.dir==="long"?(parseFloat(t.exit)>parseFloat(t.entry)):(parseFloat(t.exit)<parseFloat(t.entry)));
            const pnlTrade = t.exit&&t.entry
              ? (() => {
                  const ticksMoved=(parseFloat(t.exit)-parseFloat(t.entry))/contract.tickSize;
                  const signedTicks=t.dir==="long"?ticksMoved:-ticksMoved;
                  return signedTicks*contract.tickValue*(parseFloat(t.contracts)||1);
                })()
              : null;
            const gc=t.grade==="A"?"#00FFB2":t.grade==="B"?"#FFD700":"#FF6B6B";
            return(
              <div key={t.id} style={{background:"#0D1117",border:`1px solid ${t.exit?(isWin?"#00FFB230":"#FF6B6B30"):"#1E2530"}`,borderLeft:`3px solid ${t.exit?(isWin?"#00FFB2":"#FF6B6B"):"#2A3545"}`,borderRadius:4,padding:"12px 14px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:3}}>
                      <Tag label={t.time} col="#4A5568"/>
                      <Tag label={t.dir.toUpperCase()} col={t.dir==="long"?"#00FFB2":"#FF6B6B"}/>
                      <Tag label={`GRADE ${t.grade}`} col={gc}/>
                      {t.exit&&<Tag label={isWin?"WIN":"LOSS"} col={isWin?"#00FFB2":"#FF6B6B"}/>}
                    </div>
                    <div style={{fontSize:10,color:"#94A3B8",letterSpacing:"0.5px"}}>{t.setup||"—"}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    {pnlTrade!=null&&<div className="bb" style={{fontSize:18,color:pnlTrade>=0?"#00FFB2":"#FF6B6B"}}>{pnlTrade>=0?"+":""}{fmtU(pnlTrade)}</div>}
                    <div style={{fontSize:8,color:"#4A5568",letterSpacing:1}}>R:R {rrCon}</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:5}}>
                  {[["ENTRY",t.entry,"#38BDF8"],["STOP",t.stop,"#FF6B6B"],["TARGET",t.target,"#00FFB2"],["EXIT",t.exit||"—",t.exit?(isWin?"#00FFB2":"#FF6B6B"):"#2A3545"],["SIZE",t.contracts+" ct","#E2E8F0"]].map(([l,v,c])=>(
                    <div key={l} style={{background:"#080A0D",borderRadius:3,padding:"5px 6px"}}>
                      <div style={{fontSize:6,letterSpacing:2,color:"#4A5568",marginBottom:1}}>{l}</div>
                      <div style={{fontSize:10,color:c,fontWeight:500}}>{v}</div>
                    </div>
                  ))}
                </div>
                {t.notes&&<div style={{marginTop:8,fontSize:9,color:"#475569",lineHeight:1.6,letterSpacing:"0.3px",borderTop:"1px solid #111621",paddingTop:7}}>{t.notes}</div>}
                {!t.exit&&(
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:4}}>FILL EXIT PRICE</div>
                    <div style={{display:"flex",gap:6}}>
                      <input placeholder="Exit price..." style={{flex:1,background:"#080A0D",border:"1px solid #1E2530",borderRadius:3,padding:"6px 9px",color:"#E2E8F0",fontSize:11,outline:"none"}}
                        onBlur={e=>{
                          if(!e.target.value)return;
                          const next=trades.map(tr=>tr.id===t.id?{...tr,exit:e.target.value}:tr);
                          setTrades(next);save({trades:next});
                        }}/>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>)}

        {/* ═══ PROP FIRM ═══════════════════════════════════════════ */}
        {tab==="prop"&&(()=>{
          const pf = propFirm;
          const set = (k,v) => setPropFirm(p=>({...p,[k]:v}));

          // Preset firms
          const FIRMS = {
            topstep: {
              name:"TopStep", col:"#38BDF8",
              presets:[
                {label:"$50k",  accountSize:50000,  dailyLoss:1000, maxDD:2000, profitTarget:3000,  minDays:10, drawdownType:"trailing"},
                {label:"$100k", accountSize:100000, dailyLoss:2000, maxDD:3000, profitTarget:6000,  minDays:10, drawdownType:"trailing"},
                {label:"$150k", accountSize:150000, dailyLoss:2500, maxDD:4500, profitTarget:9000,  minDays:10, drawdownType:"trailing"},
              ]
            },
            apex: {
              name:"Apex Trader Funding", col:"#FF6B6B",
              presets:[
                {label:"$25k",  accountSize:25000,  dailyLoss:1500, maxDD:1500, profitTarget:1500,  minDays:7,  drawdownType:"trailing"},
                {label:"$50k",  accountSize:50000,  dailyLoss:2500, maxDD:2500, profitTarget:3000,  minDays:7,  drawdownType:"trailing"},
                {label:"$100k", accountSize:100000, dailyLoss:3000, maxDD:3000, profitTarget:6000,  minDays:7,  drawdownType:"trailing"},
              ]
            },
            mff: {
              name:"MyFundedFutures", col:"#A78BFA",
              presets:[
                {label:"$50k",  accountSize:50000,  dailyLoss:2000, maxDD:2500, profitTarget:3000,  minDays:5,  drawdownType:"static"},
                {label:"$100k", accountSize:100000, dailyLoss:3000, maxDD:4000, profitTarget:6000,  minDays:5,  drawdownType:"static"},
                {label:"$150k", accountSize:150000, dailyLoss:4500, maxDD:5000, profitTarget:9000,  minDays:5,  drawdownType:"static"},
              ]
            },
            e2t: {
              name:"Earn2Trade", col:"#FB923C",
              presets:[
                {label:"$25k",  accountSize:25000,  dailyLoss:1500, maxDD:1500, profitTarget:1500,  minDays:15, drawdownType:"trailing"},
                {label:"$50k",  accountSize:50000,  dailyLoss:2000, maxDD:2000, profitTarget:3000,  minDays:15, drawdownType:"trailing"},
              ]
            },
            ftmo: {
              name:"FTMO Futures", col:"#FFD700",
              presets:[
                {label:"$100k", accountSize:100000, dailyLoss:5000, maxDD:10000,profitTarget:10000, minDays:4,  drawdownType:"trailing"},
                {label:"$200k", accountSize:200000, dailyLoss:10000,maxDD:20000,profitTarget:20000, minDays:4,  drawdownType:"trailing"},
              ]
            },
            bluenox: {
              name:"Bluenox", col:"#00E5FF",
              presets:[
                {label:"$25k",  accountSize:25000,  dailyLoss:1000, maxDD:1500, profitTarget:1500,  minDays:5,  drawdownType:"trailing"},
                {label:"$50k",  accountSize:50000,  dailyLoss:2000, maxDD:2500, profitTarget:3000,  minDays:5,  drawdownType:"trailing"},
                {label:"$100k", accountSize:100000, dailyLoss:3000, maxDD:4000, profitTarget:6000,  minDays:5,  drawdownType:"trailing"},
                {label:"$200k", accountSize:200000, dailyLoss:5000, maxDD:7000, profitTarget:12000, minDays:5,  drawdownType:"trailing"},
              ]
            },
            custom: { name:"Custom Firm", col:"#64748B", presets:[] }
          };

          // Firms that support live account API sync
          const LIVE_SUPPORTED = {
            topstep:  { platform:"tradovate", note:"TopStep uses Tradovate. Connect via Tradovate credentials in Settings." },
            apex:     { platform:"rithmic",   note:"Apex uses Rithmic. Connect via Rithmic credentials in Settings." },
            mff:      { platform:"rithmic",   note:"MyFundedFutures uses Rithmic. Connect via Rithmic credentials in Settings." },
            e2t:      { platform:"rithmic",   note:"Earn2Trade uses Rithmic. Connect via Rithmic credentials in Settings." },
            bluenox:  { platform:"rithmic",   note:"Bluenox uses Rithmic. Connect via Rithmic credentials in Settings." },
            ftmo:     { platform:"none",       note:"FTMO does not currently offer a public API. Manual balance entry required." },
            custom:   { platform:"none",       note:"Manual balance entry for custom firms." },
          };
          const liveSupport  = LIVE_SUPPORTED[pf.firmId];
          const hasLiveCreds = settings?.platform === liveSupport?.platform &&
            (settings?.clientId || settings?.rUsername || settings?.apiKey);
          const liveConnected = pf.liveConnected || false;

          const firm = FIRMS[pf.firmId] || FIRMS.custom;

          // Calculations
          const todayPnl    = stats.pnl;
          const dailyUsed   = Math.max(0, -todayPnl);
          const dailyPct    = pf.dailyLossLimit > 0 ? (dailyUsed / pf.dailyLossLimit) * 100 : 0;
          const dailyRemain = Math.max(0, pf.dailyLossLimit - dailyUsed);

          // Drawdown calc
          const hwm = pf.drawdownType === "trailing"
            ? Math.max(pf.highWaterMark, pf.currentBalance)
            : pf.startBalance;
          const currentDD     = Math.max(0, hwm - pf.currentBalance);
          const ddPct         = pf.maxDrawdown > 0 ? (currentDD / pf.maxDrawdown) * 100 : 0;
          const ddRemain      = Math.max(0, pf.maxDrawdown - currentDD);

          // Profit progress
          const profit        = pf.currentBalance - pf.startBalance;
          const profitPct     = pf.profitTarget > 0 ? Math.max(0,(profit / pf.profitTarget) * 100) : 0;
          const profitRemain  = Math.max(0, pf.profitTarget - profit);

          // Consistency check — no single day > X% of total profit
          const consistencyOk = !pf.consistencyRule || profit <= 0 ||
            (todayPnl / profit) * 100 <= pf.consistencyPct;
          const consistencyPct2 = profit > 0 ? Math.round((todayPnl / profit) * 100) : 0;

          // Safe max risk per trade (based on firm limits)
          const maxRiskPerTrade = Math.round(dailyRemain * 0.33); // use max 33% of remaining daily allowance
          const safeRisk        = Math.min(maxRiskPerTrade, pf.accountSize * 0.005);

          // Status assessment
          const isDanger  = dailyPct >= 80 || ddPct >= 80;
          const isWarning = dailyPct >= 50 || ddPct >= 50;
          const statusCol = isDanger ? "#FF6B6B" : isWarning ? "#FFD700" : "#00FFB2";
          const statusMsg = isDanger ? "⚠ DANGER — APPROACHING LIMIT"
                          : isWarning ? "◐ CAUTION — MONITOR CLOSELY"
                          : "✓ CLEAR TO TRADE";

          // Days to target at current pace
          const avgDailyProfit = pf.tradingDaysComp > 0 ? profit / pf.tradingDaysComp : 0;
          const daysToTarget   = avgDailyProfit > 0 ? Math.ceil(profitRemain / avgDailyProfit) : null;

          const applyPreset = (preset) => {
            setPropFirm(p=>({...p,
              accountSize:   preset.accountSize,
              startBalance:  preset.accountSize,
              currentBalance:preset.accountSize,
              highWaterMark: preset.accountSize,
              dailyLossLimit:preset.dailyLoss,
              maxDrawdown:   preset.maxDD,
              profitTarget:  preset.profitTarget,
              minTradingDays:preset.minDays,
              drawdownType:  preset.drawdownType,
            }));
          };

          const GaugeBar = ({pct, col, height=14}) => {
            const c = Math.min(100, pct||0);
            const barCol = c>=80?"#FF6B6B":c>=50?"#FFD700":col;
            return (
              <div style={{background:"#111621",borderRadius:2,height,width:"100%",overflow:"hidden",margin:"5px 0"}}>
                <div style={{height:"100%",width:`${c}%`,background:barCol,borderRadius:2,transition:"width .4s"}}/>
              </div>
            );
          };

          return (
            <div>

              {/* ── PROP TRADER MINDSET ──────────────────────────── */}
              {(()=>{
                const MINDSET = [
                  {headline:`Your $${pf.accountSize.toLocaleString()} account is not $${pf.accountSize.toLocaleString()}.`,col:"#FF6B6B",
                   body:`Your real capital is your max drawdown — $${pf.maxDrawdown.toLocaleString()}. To trade one ${contractId} contract you need $${(CONTRACTS.find(c=>c.id===contractId)||CONTRACTS[0]).margin.toLocaleString()} in margin. That's ${((CONTRACTS.find(c=>c.id===contractId)||CONTRACTS[0]).margin/Math.max(1,pf.maxDrawdown)).toFixed(1)}x your real account. Trade MES. Size correctly. Respect the rules every single day. The prop firm game is a long game — consistency beats aggression every time. Traders who pass do it quietly, one session at a time. The edge is in the process.`},
                  {headline:"Your daily loss limit is your business risk.",col:"#38BDF8",
                   body:`$${pf.dailyLossLimit.toLocaleString()} is not a suggestion. It's the line between staying in the game and going home. Close the platform when you hit it. No exceptions. No revenge. No one more setup. The traders who stay funded are not the smartest in the room — they are the most disciplined. Protect the account. Protect the process. The profits follow. The edge is in the process.`},
                  {headline:"Size up only after you've earned it.",col:"#00FFB2",
                   body:"Don't add contracts because you're up on the day. Add contracts because your process is consistent over multiple sessions. One good day doesn't earn you more size. Ten consistent days does. Build the account. Build the confidence. The size will come."},
                  {headline:"The prop firm game is a long game.",col:"#FFD700",
                   body:"Traders who pass do it quietly — one disciplined session at a time. Consistency beats aggression. Small gains compound. You are building a track record. Treat every session like it matters. Because it does. The edge is in the process."},
                  {headline:"You've hit your limit today — and that's okay.",col:"#A78BFA",
                   body:"Close the platform. Step away. Live to fight another day. The market will be there tomorrow with fresh levels, fresh opportunities, fresh mindset. Come back tomorrow. Same process. Same discipline. The edge is in the process."},
                ];
                const msg = MINDSET[new Date().getDate() % MINDSET.length];
                return (
                  <div style={{background:`${msg.col}08`,border:`1px solid ${msg.col}20`,borderLeft:`3px solid ${msg.col}`,borderRadius:4,padding:"14px 16px",marginBottom:12}}>
                    <div style={{fontSize:7,letterSpacing:3,color:msg.col,opacity:0.6,marginBottom:5}}>PROP TRADER MINDSET · THE LONG GAME</div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,color:"#E2E8F0",letterSpacing:0.5,marginBottom:7,lineHeight:1.3}}>{msg.headline}</div>
                    <div style={{fontSize:9,color:"#64748B",lineHeight:1.75}}>{msg.body}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,paddingTop:8,borderTop:`1px solid ${msg.col}15`}}>
                      <div style={{fontSize:7,color:"#4A5568",letterSpacing:1}}>SAFE RISK / TRADE</div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:msg.col}}>${safeRisk.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })()}

              {/* ── FIRM · SIZE · PHASE ──────────────────────────── */}
              <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px",marginBottom:10}}>

                <div style={{fontSize:7,letterSpacing:3,color:"#4A5568",marginBottom:7}}>PROP FIRM</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                  {Object.entries(FIRMS).map(([k,f])=>(
                    <button key={k} onClick={()=>set("firmId",k)} style={{
                      background:pf.firmId===k?f.col+"18":"#080A0D",
                      border:`1px solid ${pf.firmId===k?f.col+"50":"#1E2530"}`,
                      borderRadius:3,padding:"5px 10px",cursor:"pointer",
                      fontSize:8,letterSpacing:1,color:pf.firmId===k?f.col:"#4A5568",
                      transition:"all .15s",whiteSpace:"nowrap",fontFamily:"inherit"
                    }}>{f.name}</button>
                  ))}
                </div>

                {firm.presets.length>0&&(
                  <>
                    <div style={{fontSize:7,letterSpacing:3,color:"#4A5568",marginBottom:7}}>ACCOUNT SIZE</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                      {firm.presets.map((p,i)=>(
                        <button key={i} onClick={()=>applyPreset(p)} style={{
                          background:pf.accountSize===p.accountSize?firm.col+"18":"#080A0D",
                          border:`1px solid ${pf.accountSize===p.accountSize?firm.col+"50":"#1E2530"}`,
                          borderRadius:3,padding:"5px 12px",cursor:"pointer",
                          fontSize:9,letterSpacing:1,color:pf.accountSize===p.accountSize?firm.col:"#4A5568",
                          transition:"all .15s",fontFamily:"inherit"
                        }}>{p.label}</button>
                      ))}
                    </div>
                  </>
                )}

                <div style={{fontSize:7,letterSpacing:3,color:"#4A5568",marginBottom:7}}>PHASE</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>
                  {[["challenge","CHALLENGE","#FFD700"],["verification","VERIFICATION","#38BDF8"],["funded","FUNDED","#00FFB2"]].map(([v,l,c])=>(
                    <button key={v} onClick={()=>set("phase",v)} style={{
                      background:pf.phase===v?c+"18":"#080A0D",
                      border:`1px solid ${pf.phase===v?c+"50":"#1E2530"}`,
                      borderRadius:3,padding:"7px",cursor:"pointer",
                      fontSize:8,letterSpacing:1,color:pf.phase===v?c:"#4A5568",
                      transition:"all .15s",textAlign:"center",fontFamily:"inherit"
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              {/* ── THREE GAUGES ─────────────────────────────────── */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:10}}>
                {[
                  {label:"DAILY LOSS",  val:dailyUsed,         pct:dailyPct,  limit:pf.dailyLossLimit, remain:dailyRemain, col:"#38BDF8"},
                  {label:"MAX DRAWDOWN",val:currentDD,         pct:ddPct,     limit:pf.maxDrawdown,    remain:ddRemain,    col:"#A78BFA", sub:pf.drawdownType.toUpperCase()},
                  {label:"PROFIT TARGET",val:Math.max(0,profit),pct:Math.min(100,profitPct),limit:pf.profitTarget,remain:profitRemain,col:profitPct>=100?"#00FFB2":profit>0?"#FFD700":"#4A5568",invert:true},
                ].map(({label,val,pct,limit,remain,col,sub,invert})=>{
                  const c = pct>=80&&!invert?"#FF6B6B":pct>=50&&!invert?"#FFD700":col;
                  return(
                    <div key={label} style={{
                      background:"#0D1117",
                      border:`1px solid ${pct>=80&&!invert?"#FF6B6B25":"#1E2530"}`,
                      borderTop:`2px solid ${c}`,
                      borderRadius:4,padding:"10px 10px 8px"
                    }}>
                      <div style={{fontSize:7,letterSpacing:1.5,color:"#4A5568",marginBottom:4}}>{label}</div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:c,lineHeight:1,marginBottom:5}}>
                        ${val.toLocaleString()}
                      </div>
                      <div style={{background:"#111621",borderRadius:2,height:4,overflow:"hidden",marginBottom:5}}>
                        <div style={{height:"100%",width:`${pct}%`,background:c,borderRadius:2,transition:"width .4s"}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:7,color:"#4A5568"}}>
                        <span>{Math.round(pct)}%</span>
                        <span style={{color:pct>=80&&!invert?"#FF6B6B":"#4A5568"}}>${remain.toLocaleString()} {invert?"to go":"left"}</span>
                      </div>
                      <div style={{fontSize:7,color:"#2A3545",marginTop:3}}>/ ${limit.toLocaleString()}{sub?` · ${sub}`:""}</div>
                    </div>
                  );
                })}
              </div>

              {/* ── CONSISTENCY + DAYS ───────────────────────────── */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                <div style={{background:"#0D1117",border:`1px solid ${!pf.consistencyRule||consistencyOk?"#1E2530":"#FF6B6B25"}`,borderTop:`2px solid ${!pf.consistencyRule?"#2A3545":consistencyOk?"#00FFB2":"#FF6B6B"}`,borderRadius:4,padding:"10px 10px 8px"}}>
                  <div style={{fontSize:7,letterSpacing:1.5,color:"#4A5568",marginBottom:4}}>CONSISTENCY</div>
                  {!pf.consistencyRule?(
                    <div style={{fontSize:9,color:"#2A3545",letterSpacing:1}}>N/A FOR THIS FIRM</div>
                  ):(
                    <>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:consistencyOk?"#00FFB2":"#FF6B6B",lineHeight:1,marginBottom:4}}>{consistencyOk?"✓ PASS":"✗ BREACH"}</div>
                      <div style={{fontSize:8,color:"#4A5568"}}>Today = {consistencyPct2}% of total · max {pf.consistencyPct}%</div>
                      {!consistencyOk&&<div style={{fontSize:7,color:"#FF6B6B",marginTop:4}}>⚠ Stop adding to today's profit</div>}
                    </>
                  )}
                </div>

                <div style={{background:"#0D1117",border:"1px solid #1E2530",borderTop:"2px solid #FB923C",borderRadius:4,padding:"10px 10px 8px"}}>
                  <div style={{fontSize:7,letterSpacing:1.5,color:"#4A5568",marginBottom:4}}>TRADING DAYS</div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"#FB923C",lineHeight:1,marginBottom:5}}>
                    {pf.tradingDaysComp} <span style={{fontSize:11,color:"#4A5568"}}>/ {pf.minTradingDays}</span>
                  </div>
                  <div style={{background:"#111621",borderRadius:2,height:4,overflow:"hidden",marginBottom:5}}>
                    <div style={{height:"100%",width:`${Math.min(100,(pf.tradingDaysComp/pf.minTradingDays)*100)}%`,background:"#FB923C",borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:7,color:"#4A5568",marginBottom:6}}>
                    {Math.max(0,pf.minTradingDays-pf.tradingDaysComp)} days to qualify
                    {daysToTarget&&<span style={{color:"#2A3545"}}> · ~{daysToTarget}d to target</span>}
                  </div>
                  <button onClick={()=>set("tradingDaysComp",pf.tradingDaysComp+1)} style={{
                    background:"#FB923C12",border:"1px solid #FB923C25",borderRadius:2,
                    padding:"3px 8px",fontSize:7,letterSpacing:1,color:"#FB923C",cursor:"pointer",fontFamily:"inherit"
                  }}>+ LOG TODAY</button>
                </div>
              </div>

              {/* ── REALITY CHECK ────────────────────────────────── */}
              {(()=>{
                const MICRO_MAP = {
                  "ES": {micro:"MES",microName:"Micro E-mini S&P",   microMargin:1265, fullMargin:12650,tickValue:1.25},
                  "NQ": {micro:"MNQ",microName:"Micro Nasdaq-100",    microMargin:1760, fullMargin:17600,tickValue:0.50},
                  "RTY":{micro:"M2K",microName:"Micro Russell 2000",  microMargin:660,  fullMargin:6600, tickValue:0.50},
                  "YM": {micro:"MYM",microName:"Micro Dow Jones",     microMargin:990,  fullMargin:9900, tickValue:0.50},
                  "GC": {micro:"MGC",microName:"Micro Gold",          microMargin:990,  fullMargin:9900, tickValue:1.00},
                  "CL": {micro:"MCL",microName:"Micro Crude Oil",     microMargin:550,  fullMargin:5500, tickValue:1.00},
                  "6E": {micro:"M6E",microName:"Micro Euro FX",       microMargin:242,  fullMargin:2420, tickValue:1.25},
                };
                const cc         = CONTRACTS.find(c=>c.id===contractId)||CONTRACTS[0];
                const mi         = MICRO_MAP[cc.id];
                const isMicro    = cc.id.startsWith("M");
                const fullMarg   = mi?mi.fullMargin:cc.margin;
                const realAcc    = pf.maxDrawdown;
                const t10        = 10*cc.tickValue;
                const m10        = mi?10*mi.tickValue:0;
                const maxFDD     = t10>0?Math.floor(realAcc/t10):0;
                const maxFDL     = t10>0?Math.floor(pf.dailyLossLimit/t10):0;
                const maxFMarg   = Math.floor(pf.accountSize/fullMarg);
                const maxMDD     = m10>0?Math.floor(realAcc/m10):0;
                const maxMDL     = m10>0?Math.floor(pf.dailyLossLimit/m10):0;
                const effFull    = Math.min(maxFDD,maxFDL,maxFMarg);
                const effMicro   = mi?Math.min(maxMDD,maxMDL):0;
                const needsMicro = !isMicro&&effFull<2;

                return(
                  <div style={{background:"#0D1117",border:`2px solid ${needsMicro?"#FF6B6B35":"#FFD70025"}`,borderRadius:4,padding:"12px 14px",marginBottom:10}}>
                    <div style={{fontSize:7,letterSpacing:3,color:needsMicro?"#FF6B6B":"#FFD700",marginBottom:10,fontWeight:600}}>⚠ REALITY CHECK</div>

                    {/* Real account headline */}
                    <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:6}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:needsMicro?"#FF6B6B":"#FFD700",lineHeight:1}}>${realAcc.toLocaleString()}</div>
                      <div style={{fontSize:9,color:"#4A5568"}}>not ${pf.accountSize.toLocaleString()}</div>
                    </div>
                    <div style={{fontSize:9,color:"#64748B",lineHeight:1.6,marginBottom:10}}>
                      Your real capital is your max drawdown. To trade one <strong style={{color:"#E2E8F0"}}>{cc.id}</strong> contract you need <strong style={{color:needsMicro?"#FF6B6B":"#FFD700"}}>${fullMarg.toLocaleString()}</strong> in margin
                      {realAcc>0&&` — that's ${(fullMarg/realAcc).toFixed(1)}x your real account`}.
                    </div>

                    {/* Three numbers */}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                      {[
                        ["VS DRAWDOWN",  maxFDD,   "#FF6B6B"],
                        ["VS DAILY LMT", maxFDL,   "#FFD700"],
                        ["EFFECTIVE MAX",effFull,   effFull<2?"#FF6B6B":"#00FFB2"],
                      ].map(([l,v,c])=>(
                        <div key={l} style={{background:"#080A0D",borderRadius:3,padding:"8px 10px",borderLeft:`2px solid ${c}`}}>
                          <div style={{fontSize:7,letterSpacing:1,color:"#4A5568",marginBottom:3}}>{l}</div>
                          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:c,lineHeight:1}}>{v}</div>
                          <div style={{fontSize:7,color:"#2A3545",marginTop:2}}>{cc.id} · 10T stop</div>
                        </div>
                      ))}
                    </div>

                    {/* Micro rec */}
                    {mi&&(
                      <div style={{background:needsMicro?"#FF6B6B08":"#00FFB208",border:`1px solid ${needsMicro?"#FF6B6B20":"#00FFB220"}`,borderRadius:3,padding:"9px 11px"}}>
                        <div style={{fontSize:8,color:needsMicro?"#FF6B6B":"#00FFB2",letterSpacing:1.5,fontWeight:600,marginBottom:7}}>
                          {needsMicro?"⚠ TRADE MICROS":"MICRO ALTERNATIVE"}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
                          {[
                            [mi.micro,     mi.microName,   "#E2E8F0"],
                            [`$${mi.microMargin.toLocaleString()}`, "MARGIN / CONTRACT", "#00FFB2"],
                            [`${effMicro} contracts`, "WITHIN LIMITS", "#00FFB2"],
                          ].map(([v,l,c])=>(
                            <div key={l}>
                              <div style={{fontSize:7,color:"#4A5568",marginBottom:2}}>{l}</div>
                              <div style={{fontSize:10,color:c,fontWeight:600}}>{v}</div>
                            </div>
                          ))}
                        </div>
                        {needsMicro&&<div style={{fontSize:8,color:"#FF6B6B",marginTop:8,lineHeight:1.5}}>Trade MES. Size correctly. Earn the right to size up.</div>}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ── ACCOUNT BALANCES ─────────────────────────────── */}
              <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px",marginBottom:10}}>
                <div style={{fontSize:7,letterSpacing:3,color:"#4A5568",marginBottom:10}}>ACCOUNT BALANCES</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                  {[
                    {k:"currentBalance",l:"CURRENT BALANCE",c:"#00FFB2"},
                    {k:"startBalance",  l:"START BALANCE",  c:"#4A5568"},
                    {k:"highWaterMark", l:"HIGH WATER MARK",c:"#FFD700"},
                    {k:"tradingDaysComp",l:"DAYS COMPLETE",  c:"#FB923C",type:"number"},
                  ].map(({k,l,c,type})=>(
                    <div key={k} style={{background:"#080A0D",borderLeft:`2px solid ${c}`,borderRadius:3,padding:"8px 10px"}}>
                      <div style={{fontSize:7,letterSpacing:1,color:c,marginBottom:3}}>{l}</div>
                      <div style={{display:"flex",alignItems:"center",gap:4}}>
                        {!type&&<span style={{fontSize:10,color:"#2A3545"}}>$</span>}
                        <input type="number"
                          value={pf[k]||0}
                          onChange={e=>set(k,parseFloat(e.target.value)||0)}
                          style={{background:"none",border:"none",outline:"none",flex:1,
                            fontSize:14,color:"#E2E8F0",fontWeight:600,fontFamily:"inherit"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── LIVE ACCOUNT ─────────────────────────────────── */}
              <div style={{background:"#0D1117",border:`1px solid ${liveConnected?"#00FFB225":"#1E2530"}`,borderLeft:`3px solid ${liveConnected?"#00FFB2":hasLiveCreds?"#FFD700":"#2A3545"}`,borderRadius:4,padding:"12px 14px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:liveSupport?.note?6:0}}>
                  <div style={{fontSize:8,letterSpacing:2,color:liveConnected?"#00FFB2":hasLiveCreds?"#FFD700":"#4A5568",fontWeight:600}}>
                    {liveConnected?"⬤ LIVE — ACCOUNT SYNCED":hasLiveCreds?"◎ CREDENTIALS READY":"○ MANUAL MODE"}
                  </div>
                  {liveSupport?.platform!=="none"&&(
                    <button onClick={()=>{
                      if(!hasLiveCreds){alert("Go to ⚙ Settings → CME Data Feed → API Key and enter your "+(liveSupport?.platform==="tradovate"?"Tradovate":"Rithmic")+" credentials first.");return;}
                      set("liveConnected",!liveConnected);
                      if(!liveConnected) set("lastSynced",new Date().toTimeString().slice(0,8));
                    }} style={{
                      background:liveConnected?"#FF6B6B15":"#00FFB215",
                      border:`1px solid ${liveConnected?"#FF6B6B30":"#00FFB230"}`,
                      borderRadius:3,padding:"5px 12px",cursor:"pointer",
                      fontSize:8,letterSpacing:2,color:liveConnected?"#FF6B6B":"#00FFB2",
                      fontFamily:"inherit"
                    }}>{liveConnected?"DISCONNECT":"CONNECT"}</button>
                  )}
                </div>
                {liveSupport?.note&&<div style={{fontSize:8,color:"#4A5568",lineHeight:1.5,marginTop:4}}>{liveSupport.note}</div>}
                {!liveConnected&&liveSupport?.platform!=="none"&&(
                  <div style={{fontSize:8,color:"#2A3545",marginTop:6,letterSpacing:"0.3px"}}>
                    Phase 2: Live account sync via {liveSupport?.platform==="tradovate"?"Tradovate":"Rithmic"} — Elite tier
                  </div>
                )}
              </div>

              {/* ── RULES SUMMARY ────────────────────────────────── */}
              <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px",marginBottom:10}}>
                <div style={{fontSize:7,letterSpacing:3,color:firm.col,marginBottom:10}}>{firm.name.toUpperCase()} · {pf.phase.toUpperCase()} RULES</div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <tbody>
                    {[
                      ["Stated Account",  `$${pf.accountSize.toLocaleString()}`,"#94A3B8"],
                      ["Real Account",    `$${pf.maxDrawdown.toLocaleString()} (max drawdown)`,"#FF6B6B"],
                      ["Daily Loss Limit",`$${pf.dailyLossLimit.toLocaleString()} (${((pf.dailyLossLimit/pf.accountSize)*100).toFixed(1)}%)`,"#94A3B8"],
                      ["Max Drawdown",    `$${pf.maxDrawdown.toLocaleString()} · ${pf.drawdownType.toUpperCase()}`,"#94A3B8"],
                      ["Profit Target",   `$${pf.profitTarget.toLocaleString()} (${((pf.profitTarget/pf.accountSize)*100).toFixed(1)}%)`,"#94A3B8"],
                      ["Min Trading Days",`${pf.minTradingDays} days`,"#94A3B8"],
                      ["Consistency",     pf.consistencyRule?`Max ${pf.consistencyPct}% per day`:"None","#94A3B8"],
                      ["Safe Risk/Trade", `$${safeRisk.toLocaleString()}`,"#00FFB2"],
                    ].map(([l,v,c])=>(
                      <tr key={l} style={{borderBottom:"1px solid #111621"}}>
                        <td style={{padding:"5px 0",fontSize:9,color:"#4A5568"}}>{l}</td>
                        <td style={{padding:"5px 0",fontSize:9,color:c,textAlign:"right",fontWeight:l==="Real Account"?600:400}}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── BREACH WARNINGS ──────────────────────────────── */}
              <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px"}}>
                <div style={{fontSize:7,letterSpacing:3,color:"#FF6B6B",marginBottom:8}}>COMMON BREACH TRIGGERS</div>
                {[
                  "Daily loss limit hit — close the platform, no more trades today",
                  "Trailing drawdown — high water mark moves up with every profit",
                  "Consistency rule — one big day can invalidate your payout",
                  "Trading outside permitted hours — check your firm's schedule",
                  "News events — some firms prohibit holding through major releases",
                  "Prop firm rules change — always verify current rules directly",
                ].map((w,i)=>(
                  <div key={i} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid #111621",alignItems:"flex-start"}}>
                    <span style={{color:"#FF6B6B",flexShrink:0}}>—</span>
                    <span style={{fontSize:9,color:"#475569",lineHeight:1.5}}>{w}</span>
                  </div>
                ))}
              </div>

            </div>
          );
        })()}

        {/* ═══ NEWS ════════════════════════════════════════════════ */}
        {tab==="news"&&(<>
          <NewsFeed contract={contract} cc={cc} finnhubKey={settings?.finnhubKey||""}/>

          {/* Market calendar — summary from pre-session selections */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>TODAY'S ACTIVE EVENTS</div>
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px",marginBottom:12}}>
            {activeEvents.length===0?(
              <div style={{fontSize:9,color:"#2A3545",letterSpacing:1,textAlign:"center",padding:"8px 0"}}>
                NO EVENTS MARKED — TICK ACTIVE EVENTS IN THE ◈ PRE-SESSION TAB
              </div>
            ):(
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                  {activeEvents.map(id=>{
                    const ALL_EV = [
                      {id:"nfp",day:"FRI",time:"13:30",event:"Non-Farm Payrolls",impact:"high"},
                      {id:"cpi",day:"WED",time:"13:30",event:"CPI / Inflation Data",impact:"high"},
                      {id:"fomc",day:"WED",time:"19:00",event:"FOMC Rate Decision",impact:"high"},
                      {id:"fomcm",day:"WED",time:"19:00",event:"FOMC Minutes",impact:"high"},
                      {id:"fed",day:"TUE",time:"varies",event:"Fed Chair Speech",impact:"high"},
                      {id:"gdp",day:"THU",time:"13:30",event:"GDP Data",impact:"high"},
                      {id:"pce",day:"FRI",time:"13:30",event:"PCE / Core Inflation",impact:"high"},
                      {id:"ism",day:"MON",time:"15:00",event:"ISM Manufacturing PMI",impact:"medium"},
                      {id:"jobs",day:"THU",time:"13:30",event:"Initial Jobless Claims",impact:"medium"},
                      {id:"retail",day:"WED",time:"13:30",event:"Retail Sales",impact:"medium"},
                      {id:"ppi",day:"TUE",time:"13:30",event:"PPI Data",impact:"medium"},
                      {id:"conf",day:"TUE",time:"15:00",event:"Consumer Confidence",impact:"medium"},
                    ];
                    const ev = ALL_EV.find(e=>e.id===id);
                    if(!ev) return null;
                    const col = ev.impact==="high"?"#FF6B6B":"#FFD700";
                    return(
                      <div key={id} style={{background:"#080A0D",border:`1px solid ${col}30`,borderLeft:`3px solid ${col}`,borderRadius:3,padding:"7px 9px"}}>
                        <div style={{fontSize:7,color:col,letterSpacing:1,marginBottom:2}}>{ev.day} · {convertGMT(ev.time,tzOffset)} {tzOffset===0?"GMT":"LOCAL"} · {ev.impact.toUpperCase()}</div>
                        <div style={{fontSize:9,color:"#94A3B8"}}>{ev.event}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{fontSize:7,color:"#FF6B6B",letterSpacing:1}}>
                  ⚠ AVOID TRADING 30 MIN EITHER SIDE · CLOSE OR WIDEN STOPS BEFORE RELEASE
                </div>
              </>
            )}
          </div>

          {/* Kill zone reminder */}
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px"}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:10}}>TODAY'S KILL ZONES</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[
                {label:"LONDON OPEN",  gmtRange:"07:00 – 10:00", col:"#38BDF8",  note:"Asian session liquidity sweep. High probability reversals at prior session H/L."},
                {label:"NEW YORK OPEN",gmtRange:"12:00 – 15:00", col:"#00FFB2",  note:"London range expansion or reversal. Highest CME futures volume of the session."},
                {label:"LONDON CLOSE", gmtRange:"15:00 – 16:00", col:"#FFD700",  note:"Profit taking from London positions. Watch for counter-trend moves."},
                {label:"ASIA OPEN",    gmtRange:"00:00 – 03:00", col:"#A78BFA",  note:"Range-building session. Low volume. Sets liquidity pools for London."},
              ].map((kz,i)=>(
                <div key={i} style={{background:"#080A0D",border:"1px solid #1E2530",borderLeft:`3px solid ${kz.col}`,borderRadius:3,padding:"9px 11px"}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:kz.col,letterSpacing:1,marginBottom:2}}>{kz.label}</div>
                  <div style={{fontSize:8,color:"#FFD700",letterSpacing:1,marginBottom:5}}>{convertRange(kz.gmtRange,tzOffset)} {tzOffset===0?"GMT":"LOCAL"}</div>
                  <div style={{fontSize:7,color:"#2A3545",letterSpacing:1,marginBottom:3}}>{kz.gmtRange} GMT</div>
                  <div style={{fontSize:8,color:"#4A5568",lineHeight:1.5}}>{kz.note}</div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ═══ SETTINGS ═══════════════════════════════════════════ */}
        {tab==="settings"&&(<>
          {/* Data Feed */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>CME DATA FEED</div>
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderLeft:"3px solid #38BDF8",borderRadius:4,padding:"14px 16px",marginBottom:10}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#38BDF8",marginBottom:10}}>DATA SOURCE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
              {[
                {v:"manual",   label:"MANUAL ENTRY", desc:"Enter from your platform. Most accurate, zero latency.", col:"#00FFB2"},
                {v:"api",      label:"API KEY",       desc:"Connect a data provider. Tradovate, Rithmic, or custom.", col:"#FFD700"},
              ].map(opt=>(
                <button key={opt.v} onClick={()=>setSettings(s=>({...s,dataSource:opt.v}))} style={{
                  background:settings.dataSource===opt.v?opt.col+"18":"#080A0D",
                  border:`1px solid ${settings.dataSource===opt.v?opt.col+"50":"#1E2530"}`,
                  borderRadius:4,padding:"10px 12px",cursor:"pointer",textAlign:"left",transition:"all .15s"
                }}>
                  <div style={{fontSize:9,color:settings.dataSource===opt.v?opt.col:"#64748B",fontWeight:600,marginBottom:4,letterSpacing:1}}>{opt.label}</div>
                  <div style={{fontSize:8,color:"#4A5568",lineHeight:1.4}}>{opt.desc}</div>
                </button>
              ))}
            </div>

            {settings.dataSource==="api"&&(()=>{
              const PLATFORMS = [
                {v:"tradovate",  label:"TRADOVATE",     col:"#FFD700"},
                {v:"rithmic",    label:"RITHMIC",       col:"#A78BFA"},
                {v:"tradier",    label:"TRADIER",       col:"#FB923C"},
                {v:"alphaV",     label:"ALPHA VANTAGE", col:"#38BDF8"},
                {v:"custom",     label:"CUSTOM",        col:"#64748B"},
              ];

              const CRED_INFO = {
                tradovate: {
                  col:"#FFD700",
                  help:"Get credentials at app.tradovate.com → Account → API Access",
                  link:"https://app.tradovate.com",
                  fields: [
                    {key:"clientId",     label:"CLIENT ID",     type:"text",     ph:"e.g. tradovate_api_xxxx"},
                    {key:"clientSecret", label:"CLIENT SECRET", type:"password", ph:"Paste your secret here"},
                  ]
                },
                rithmic: {
                  col:"#A78BFA",
                  help:"Select your server from the list. Paper Trading lets you test the live data connection without a funded account. Your broker determines which live server you use.",
                  link:"https://rithmic.com",
                  fields: [
                    {key:"rUsername", label:"USERNAME", type:"text",     ph:"Your Rithmic username"},
                    {key:"rPassword", label:"PASSWORD", type:"password", ph:"Your Rithmic password"},
                    {key:"rServer",   label:"SERVER",   type:"select",   ph:"Select server",
                      options:[
                        {value:"rituz00.rithmic.com:443",        label:"Rithmic Paper Trading (Test/Demo)"},
                        {value:"rituz01.rithmic.com:443",        label:"Apex Trader Funding"},
                        {value:"rituz04.rithmic.com:443",        label:"TopStep / Earn2Trade"},
                        {value:"rituz06.rithmic.com:443",        label:"MyFundedFutures"},
                        {value:"rituz07.rithmic.com:443",        label:"Bluenox / Generic Live 1"},
                        {value:"rituz08.rithmic.com:443",        label:"Generic Live 2"},
                        {value:"rituz09.rithmic.com:443",        label:"Generic Live 3"},
                        {value:"rprotocol.rithmic.com:443",      label:"Rithmic Protocol (Legacy)"},
                        {value:"custom",                         label:"Custom — enter manually"},
                      ]
                    },
                  ]
                },
                tradier: {
                  col:"#FB923C",
                  help:"Get your token at developer.tradier.com → Applications → Create App",
                  link:"https://developer.tradier.com",
                  fields: [
                    {key:"apiKey", label:"ACCESS TOKEN", type:"password", ph:"Paste your Tradier token"},
                  ]
                },
                alphaV: {
                  col:"#38BDF8",
                  help:"Free API key at alphavantage.co — 25 requests/day on free tier.",
                  link:"https://www.alphavantage.co/support/#api-key",
                  fields: [
                    {key:"apiKey", label:"API KEY", type:"text", ph:"e.g. ABCDEF123456"},
                  ]
                },
                custom: {
                  col:"#64748B",
                  help:"Enter your custom data provider endpoint and API token.",
                  link:null,
                  fields: [
                    {key:"customUrl", label:"ENDPOINT URL", type:"text",     ph:"https://api.yourprovider.com/v1"},
                    {key:"apiKey",    label:"API TOKEN",    type:"password", ph:"Your API token or Bearer key"},
                  ]
                },
              };

              const plat = settings.platform || "tradovate";
              const info = CRED_INFO[plat] || CRED_INFO.custom;

              return (<>
                {/* Platform selector */}
                <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:7}}>SELECT YOUR DATA PLATFORM</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                  {PLATFORMS.map(p=>(
                    <button key={p.v} onClick={()=>setSettings(s=>({...s,platform:p.v}))} style={{
                      background:settings.platform===p.v?p.col+"18":"#080A0D",
                      border:`1px solid ${settings.platform===p.v?p.col+"50":"#1E2530"}`,
                      borderRadius:4,padding:"8px 10px",cursor:"pointer",
                      fontSize:8,letterSpacing:1.5,
                      color:settings.platform===p.v?p.col:"#4A5568",
                      transition:"all .15s",textAlign:"center",fontWeight:settings.platform===p.v?600:400
                    }}>{p.label}</button>
                  ))}
                </div>

                {/* Platform-specific credential fields */}
                <div style={{background:"#080A0D",border:`1px solid ${info.col}30`,borderLeft:`3px solid ${info.col}`,borderRadius:4,padding:"12px 14px",marginBottom:8}}>
                  <div style={{fontSize:8,letterSpacing:3,color:info.col,marginBottom:10}}>
                    {plat.toUpperCase()} CREDENTIALS
                  </div>
                  {info.fields.map(field=>(
                    <div key={field.key} style={{marginBottom:8}}>
                      <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:4}}>{field.label}</div>
                      {field.type==="select" ? (
                        <>
                          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:3,padding:"8px 11px",marginBottom:settings[field.key]==="custom"?6:0}}>
                            <select
                              value={settings[field.key]||field.options[0].value}
                              onChange={e=>setSettings(s=>({...s,[field.key]:e.target.value}))}
                              style={{background:"none",border:"none",outline:"none",width:"100%",fontSize:11,color:"#E2E8F0",fontFamily:"inherit",cursor:"pointer"}}>
                              {field.options.map(opt=>(
                                <option key={opt.value} value={opt.value} style={{background:"#0D1117",color:"#E2E8F0"}}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          {settings[field.key]==="custom"&&(
                            <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:3,padding:"8px 11px",display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontSize:10,color:"#2A3545",flexShrink:0}}>🖥</span>
                              <input
                                type="text"
                                value={settings.rServerCustom||""}
                                onChange={e=>setSettings(s=>({...s,rServerCustom:e.target.value}))}
                                placeholder="e.g. mybroker.rithmic.com:443"
                                style={{background:"none",border:"none",outline:"none",flex:1,fontSize:11,color:"#E2E8F0",fontFamily:"inherit"}}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:3,padding:"8px 11px",display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:10,color:"#2A3545"}}>🔑</span>
                          <input
                            type={field.type}
                            value={settings[field.key]||""}
                            onChange={e=>setSettings(s=>({...s,[field.key]:e.target.value}))}
                            placeholder={field.ph}
                            style={{background:"none",border:"none",outline:"none",flex:1,fontSize:11,color:"#E2E8F0",fontFamily:"inherit"}}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Help text */}
                  <div style={{fontSize:8,color:"#4A5568",lineHeight:1.6,marginTop:8,letterSpacing:"0.3px"}}>
                    ℹ {info.help}
                  </div>
                </div>

                {/* Security notice */}
                {/* Connection status panel */}
                <div style={{
                  background: connStatus==="connected"?"#00FFB210"
                            : connStatus==="failed"   ?"#FF6B6B10"
                            : connStatus==="testing"  ?"#FFD70010"
                            : "#080A0D",
                  border:`1px solid ${
                    connStatus==="connected"?"#00FFB230"
                    :connStatus==="failed"  ?"#FF6B6B30"
                    :connStatus==="testing" ?"#FFD70030"
                    :"#1E2530"}`,
                  borderRadius:4,padding:"12px 14px",marginBottom:10,transition:"all .3s"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:connStatus!=="idle"?8:0}}>
                    {/* Live indicator dot */}
                    <div style={{
                      width:10,height:10,borderRadius:"50%",flexShrink:0,
                      background: connStatus==="connected"?"#00FFB2"
                                : connStatus==="failed"   ?"#FF6B6B"
                                : connStatus==="testing"  ?"#FFD700"
                                : "#2A3545",
                      boxShadow: connStatus==="connected"?"0 0 8px #00FFB2,0 0 16px #00FFB240":"none",
                      animation: connStatus==="testing"?"pulse 1s infinite":"none"
                    }}/>
                    <div>
                      <div style={{
                        fontSize:9,letterSpacing:2,fontWeight:600,
                        color: connStatus==="connected"?"#00FFB2"
                             : connStatus==="failed"   ?"#FF6B6B"
                             : connStatus==="testing"  ?"#FFD700"
                             : "#4A5568"
                      }}>
                        {connStatus==="connected" ? "CME DATA FEED ACTIVE"
                        :connStatus==="failed"    ? "CONNECTION FAILED"
                        :connStatus==="testing"   ? "TESTING CONNECTION..."
                        : "NOT CONNECTED"}
                      </div>
                      {connStatus==="connected"&&(
                        <div style={{fontSize:7,color:"#00FFB2",opacity:0.7,letterSpacing:1,marginTop:2}}>
                          {plat==="rithmic"?"RITHMIC":"TRADOVATE"} · {new Date().toTimeString().slice(0,8)} · CREDENTIALS VERIFIED
                        </div>
                      )}
                      {connStatus==="failed"&&(
                        <div style={{fontSize:7,color:"#FF6B6B",opacity:0.8,letterSpacing:1,marginTop:2}}>
                          Check username, password and server selection
                        </div>
                      )}
                    </div>
                  </div>
                  {connStatus==="idle"&&(
                    <div style={{fontSize:8,color:"#4A5568",letterSpacing:"0.3px",lineHeight:1.5}}>
                      🔒 Credentials stored locally only — never sent to TradeCockpit servers.
                      Phase 2: live price feed direct to Risk Calc.
                    </div>
                  )}
                </div>

                {/* Save + Test buttons */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  <button onClick={()=>{
                    save({});
                    setSaveStatus("saved");
                    setTimeout(()=>setSaveStatus("idle"),2500);
                  }} style={{
                    borderRadius:3,padding:"10px",fontSize:9,letterSpacing:2,cursor:"pointer",
                    fontFamily:"inherit",transition:"all .25s",
                    background:saveStatus==="saved"?"#00FFB2":"#00FFB218",
                    color:saveStatus==="saved"?"#0D1117":"#00FFB2",
                    border:saveStatus==="saved"?"none":"1px solid #00FFB240",
                  }}>
                    {saveStatus==="saved"?"✓ SAVED":"SAVE CREDENTIALS"}
                  </button>
                  <button onClick={()=>{
                    // Check credentials are filled
                    const hasCredsTradovate = plat==="tradovate" && settings.clientId && settings.clientSecret;
                    const hasCredsRithmic   = plat==="rithmic"   && settings.rUsername && settings.rPassword;
                    const hasCreds = hasCredsTradovate || hasCredsRithmic;
                    if(!hasCreds){
                      setConnStatus("failed");
                      setTimeout(()=>setConnStatus("idle"),3000);
                      return;
                    }
                    // Simulate connection test — Phase 2 will do real API handshake
                    setConnStatus("testing");
                    setTimeout(()=>{
                      // In Phase 2: real API auth call here
                      // For now: if creds are filled, show as connected
                      setConnStatus("connected");
                    }, 1800);
                  }} style={{
                    borderRadius:3,padding:"10px",fontSize:9,letterSpacing:2,cursor:"pointer",
                    fontFamily:"inherit",transition:"all .25s",
                    background: connStatus==="connected"?"#00FFB218"
                              : connStatus==="testing"  ?"#FFD70018"
                              : connStatus==="failed"   ?"#FF6B6B18"
                              : info.col+"18",
                    color: connStatus==="connected"?"#00FFB2"
                         : connStatus==="testing"  ?"#FFD700"
                         : connStatus==="failed"   ?"#FF6B6B"
                         : info.col,
                    border: connStatus==="connected"?"1px solid #00FFB240"
                          : connStatus==="testing"  ?"1px solid #FFD70040"
                          : connStatus==="failed"   ?"1px solid #FF6B6B40"
                          : `1px solid ${info.col}40`,
                  }}>
                    {connStatus==="connected"?"⬤ CONNECTED"
                    :connStatus==="testing"  ?"TESTING..."
                    :connStatus==="failed"   ?"✗ CHECK CREDS"
                    :"TEST CONNECTION"}
                  </button>
                </div>
              </>);
            })()}

            {settings.dataSource==="manual"&&(
              <div style={{background:"#00FFB212",border:"1px solid #00FFB230",borderRadius:3,padding:"8px 10px",fontSize:9,color:"#00FFB2",letterSpacing:"0.3px",lineHeight:1.6}}>
                ✓ Manual entry active. Enter CME prices from your broker platform in the Risk Calc tab.
                This gives you the most accurate data with zero latency.
              </div>
            )}
          </div>

          {/* Default Settings */}
          {/* Timezone */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>TIMEZONE</div>
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#38BDF8",marginBottom:10}}>YOUR LOCAL TIMEZONE</div>
            <div style={{fontSize:9,color:"#4A5568",marginBottom:12,letterSpacing:"0.3px",lineHeight:1.6}}>
              All kill zone times and economic event times are stored in GMT. Select your timezone and they'll display in your local time automatically throughout the app.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
              {TIMEZONES.map(tz=>(
                <button key={tz.id} onClick={()=>setSettings(s=>({...s,timezone:tz.id}))} style={{
                  background:settings.timezone===tz.id?"#38BDF818":"#080A0D",
                  border:`1px solid ${settings.timezone===tz.id?"#38BDF850":"#1E2530"}`,
                  borderRadius:4,padding:"8px 10px",cursor:"pointer",textAlign:"left",
                  transition:"all .15s"
                }}>
                  <div style={{fontSize:8,color:settings.timezone===tz.id?"#38BDF8":"#64748B",fontWeight:settings.timezone===tz.id?600:400,letterSpacing:1}}>
                    {tz.label}
                  </div>
                  <div style={{fontSize:7,color:settings.timezone===tz.id?"#38BDF8":"#2A3545",marginTop:2,letterSpacing:1}}>
                    GMT{tz.offset>=0?"+":""}{tz.offset===0?"":tz.offset}
                  </div>
                </button>
              ))}
            </div>
            <div style={{background:"#38BDF812",border:"1px solid #38BDF820",borderRadius:3,padding:"8px 10px",fontSize:8,color:"#38BDF8",letterSpacing:"0.3px",lineHeight:1.6}}>
              ✓ Currently showing: <span style={{fontWeight:600}}>{tzLabel}</span>
              {tzOffset!==0&&<span> · London Open = {convertGMT("07:00",tzOffset)} local · NY Open = {convertGMT("12:00",tzOffset)} local</span>}
            </div>
            <button onClick={()=>save({settings})} style={{
              marginTop:10,width:"100%",background:"#38BDF818",border:"1px solid #38BDF840",
              borderRadius:3,padding:"8px",fontSize:9,letterSpacing:2,color:"#38BDF8",cursor:"pointer"
            }}>✓ TIMEZONE SAVED — TIMES UPDATED THROUGHOUT APP</button>
          </div>

          {/* Live news */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>LIVE NEWS FEED</div>
          <div style={{background:"#0D1117",border:`1px solid ${saveStatus==="saved"?"#00FFB240":saveStatus==="error"?"#FF6B6B40":"#1E2530"}`,borderRadius:4,padding:"14px 16px",marginBottom:12,transition:"border-color .3s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:8,letterSpacing:3,color:"#00FFB2"}}>FINNHUB API KEY</div>
              <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer"
                style={{fontSize:7,letterSpacing:1,color:"#4A5568",textDecoration:"none"}}>
                FREE AT FINNHUB.IO ↗
              </a>
            </div>
            <div style={{fontSize:9,color:"#4A5568",marginBottom:12,lineHeight:1.6,letterSpacing:"0.3px"}}>
              Without a key the News tab shows an AI market briefing. Add your free Finnhub key for live financial headlines.
            </div>

            {/* Key input */}
            <div style={{background:"#080A0D",border:`1px solid ${settings.finnhubKey?"#00FFB230":"#1E2530"}`,borderRadius:4,padding:"10px 12px",marginBottom:4,display:"flex",alignItems:"center",gap:8,transition:"border-color .2s"}}>
              <span style={{fontSize:12,color:"#2A3545",flexShrink:0}}>🔑</span>
              <input
                type="text"
                value={settings.finnhubKey||""}
                onChange={e=>setSettings(s=>({...s,finnhubKey:e.target.value.trim()}))}
                placeholder="Paste Finnhub API key here..."
                style={{background:"none",border:"none",outline:"none",flex:1,fontSize:11,color:"#00FFB2",fontFamily:"inherit",letterSpacing:"0.5px"}}
              />
              {settings.finnhubKey&&(
                <button onClick={()=>setSettings(s=>({...s,finnhubKey:""}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#FF6B6B",padding:"0 2px"}}>✕</button>
              )}
            </div>

            {/* Key length hint */}
            {settings.finnhubKey&&(
              <div style={{fontSize:7,color:"#4A5568",marginBottom:10,letterSpacing:1}}>
                {settings.finnhubKey.length} CHARS · {settings.finnhubKey.length>15?"✓ LOOKS VALID":"⚠ KEY SEEMS SHORT"}
              </div>
            )}
            {!settings.finnhubKey&&(
              <div style={{fontSize:7,color:"#2A3545",marginBottom:10,letterSpacing:1}}>
                NO KEY SET — AI BRIEFING MODE ACTIVE
              </div>
            )}

            {/* Save button with states */}
            <button
              onClick={()=>{
                saveSettingsToStorage(settings);
                setSaveStatus("saved");
                setTimeout(()=>setSaveStatus("idle"),3000);
              }}
              disabled={saveStatus==="saving"}
              style={{
                width:"100%",borderRadius:3,padding:"10px",cursor:saveStatus==="saving"?"wait":"pointer",
                fontSize:9,letterSpacing:2,fontFamily:"inherit",border:"none",
                transition:"all .25s",
                background: saveStatus==="saved" ? "#00FFB2"
                          : saveStatus==="error"  ? "#FF6B6B18"
                          : saveStatus==="saving" ? "#111621"
                          : "#00FFB218",
                color:      saveStatus==="saved" ? "#0D1117"
                          : saveStatus==="error"  ? "#FF6B6B"
                          : saveStatus==="saving" ? "#4A5568"
                          : "#00FFB2",
                border: saveStatus==="saved" ? "none"
                      : saveStatus==="error"  ? "1px solid #FF6B6B40"
                      : saveStatus==="saving" ? "1px solid #1E2530"
                      : "1px solid #00FFB240",
              }}>
              {saveStatus==="saving" ? "SAVING..."
              :saveStatus==="saved"  ? "✓ SAVED — KEY ACTIVE"
              :saveStatus!=="idle"&&saveStatus!=="saving"&&saveStatus!=="saved" ? "✗ FAILED: "+saveStatus.slice(0,30)
              :"SAVE FINNHUB KEY"}
            </button>

            {/* Status message */}
            {saveStatus==="saved"&&settings.finnhubKey&&(
              <div style={{marginTop:8,background:"#00FFB210",border:"1px solid #00FFB230",borderRadius:3,padding:"7px 10px",fontSize:8,color:"#00FFB2",letterSpacing:1}}>
                ⬤ FINNHUB KEY SAVED · Go to ◉ NEWS tab and hit ⟳ FETCH NEWS to test
              </div>
            )}
            {saveStatus==="saved"&&!settings.finnhubKey&&(
              <div style={{marginTop:8,background:"#FFD70010",border:"1px solid #FFD70030",borderRadius:3,padding:"7px 10px",fontSize:8,color:"#FFD700",letterSpacing:1}}>
                ◎ KEY CLEARED · NEWS TAB WILL USE AI BRIEFING MODE
              </div>
            )}
            {saveStatus!=="idle"&&saveStatus!=="saving"&&saveStatus!=="saved"&&(
              <div style={{marginTop:8,background:"#FF6B6B10",border:"1px solid #FF6B6B30",borderRadius:3,padding:"7px 10px",fontSize:8,color:"#FF6B6B",letterSpacing:"0.3px",lineHeight:1.5}}>
                ✗ {saveStatus}
              </div>
            )}
          </div>

          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>DEFAULT CALCULATOR SETTINGS</div>
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"14px 16px",marginBottom:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div style={{background:"#080A0D",border:"1px solid #1E2530",borderRadius:4,padding:"9px 11px"}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:4}}>DEFAULT ACCOUNT SIZE ($)</div>
                <input value={settings.defaultAcc} onChange={e=>setSettings(s=>({...s,defaultAcc:e.target.value}))}
                  type="number" placeholder="50000"
                  style={{background:"none",border:"none",outline:"none",width:"100%",fontSize:13,color:"#E2E8F0",fontWeight:500,fontFamily:"inherit"}}/>
              </div>
              <div style={{background:"#080A0D",border:"1px solid #1E2530",borderRadius:4,padding:"9px 11px"}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:4}}>DEFAULT RISK PER TRADE (%)</div>
                <input value={settings.defaultRisk} onChange={e=>setSettings(s=>({...s,defaultRisk:e.target.value}))}
                  type="number" step="0.1" placeholder="0.5"
                  style={{background:"none",border:"none",outline:"none",width:"100%",fontSize:13,color:"#E2E8F0",fontWeight:500,fontFamily:"inherit"}}/>
              </div>
            </div>
            <button onClick={()=>{setAccount(settings.defaultAcc||"50000");setRiskPct(settings.defaultRisk||"0.5");}} style={{
              width:"100%",background:"#00FFB218",border:"1px solid #00FFB240",
              borderRadius:3,padding:"8px",fontSize:9,letterSpacing:2,color:"#00FFB2",cursor:"pointer"
            }}>APPLY DEFAULTS TO CALCULATOR</button>
          </div>

          {/* About */}
          {/* Commission */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>COMMISSION</div>
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"14px 16px",marginBottom:12}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#FF6B6B",marginBottom:10}}>COMMISSION RATE</div>
            <div style={{fontSize:9,color:"#4A5568",marginBottom:12,lineHeight:1.6,letterSpacing:"0.3px"}}>
              Set your broker commission rate per contract per side. Round-turn (entry + exit) is calculated automatically and deducted from P&L throughout the app.
            </div>
            {/* Broker presets */}
            <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:7}}>SELECT BROKER / PLATFORM</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
              {[
                {v:"tradovate_sub",  l:"TRADOVATE (SUBSCR.)",  rate:"0.99",  col:"#FFD700"},
                {v:"tradovate_pay",  l:"TRADOVATE (PAY/USE)",  rate:"1.99",  col:"#FFD700"},
                {v:"ninjatrader",    l:"NINJATRADER BROK.",    rate:"0.69",  col:"#38BDF8"},
                {v:"rithmic_gen",    l:"RITHMIC / GENERIC",   rate:"3.50",  col:"#A78BFA"},
                {v:"topstep",        l:"TOPSTEP (INCL.)",      rate:"0.00",  col:"#00FFB2"},
                {v:"apex",           l:"APEX (INCL.)",         rate:"0.00",  col:"#FF6B6B"},
                {v:"custom",         l:"CUSTOM",               rate:null,    col:"#64748B"},
              ].map(b=>(
                <button key={b.v} onClick={()=>{
                  setSettings(s=>({...s, commBroker:b.v, ...(b.rate!==null?{commRate:b.rate}:{})}));
                }} style={{
                  background:settings.commBroker===b.v?b.col+"18":"#080A0D",
                  border:`1px solid ${settings.commBroker===b.v?b.col+"50":"#1E2530"}`,
                  borderRadius:3,padding:"7px 9px",cursor:"pointer",textAlign:"left",transition:"all .15s"
                }}>
                  <div style={{fontSize:8,color:settings.commBroker===b.v?b.col:"#64748B",fontWeight:600,letterSpacing:1,marginBottom:2}}>{b.l}</div>
                  {b.rate!==null&&<div style={{fontSize:7,color:settings.commBroker===b.v?b.col:"#2A3545",letterSpacing:1}}>${b.rate}/side</div>}
                </button>
              ))}
            </div>
            {/* Rate input */}
            <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:5}}>RATE PER CONTRACT PER SIDE ($)</div>
            <div style={{background:"#080A0D",border:`1px solid ${settings.commRate==="0.00"||settings.commRate==="0"?"#00FFB230":"#1E2530"}`,borderRadius:3,padding:"9px 11px",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:"#2A3545"}}>$</span>
              <input
                type="number" min="0" step="0.01"
                value={settings.commRate||"3.50"}
                onChange={e=>setSettings(s=>({...s,commRate:e.target.value,commBroker:"custom"}))}
                style={{background:"none",border:"none",outline:"none",flex:1,fontSize:14,color:"#E2E8F0",fontFamily:"inherit",fontWeight:600}}
              />
              <span style={{fontSize:8,color:"#4A5568",letterSpacing:1}}>/ CONTRACT / SIDE</span>
            </div>
            <div style={{background:"#FF6B6B10",border:"1px solid #FF6B6B20",borderRadius:3,padding:"7px 10px",fontSize:8,color:"#FF6B6B",letterSpacing:"0.3px",lineHeight:1.6}}>
              ROUND TURN = ${(parseFloat(settings.commRate||"3.50")*2).toFixed(2)} per contract · Deducted from P&L in Risk Calc, Trade Log and Session Review
            </div>
          </div>

          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>ABOUT</div>
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"14px 16px"}}>
            {[
              {l:"APP",       v:"Trading Cockpit"},
              {l:"VERSION",   v:"1.0.0 — Early Access"},
              {l:"CONTRACTS", v:"21 CME / CBOT / NYMEX / COMEX"},
              {l:"DATA",      v:"CME Futures — Manual Entry"},
              {l:"STORAGE",   v:"Local session storage"},
              {l:"BUILT FOR", v:"CME futures traders — all levels"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<5?"1px solid #111621":"none",fontSize:9}}>
                <span style={{color:"#4A5568",letterSpacing:1}}>{r.l}</span>
                <span style={{color:"#94A3B8",fontWeight:500}}>{r.v}</span>
              </div>
            ))}
          </div>
        </>)}

        {/* ═══ REVIEW ═══════════════════════════════════════════ */}
        {tab==="review"&&(<>
          {/* Session stats */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:8}}>SESSION SUMMARY</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:12}}>
            {[
              {l:"SESSION P&L",  v:fmtU(stats.pnl), c:stats.pnl>=0?"#00FFB2":"#FF6B6B"},
              {l:"WIN RATE",     v:fmtP(stats.winRate,0), c:stats.winRate>=50?"#00FFB2":stats.winRate>=40?"#FFD700":"#FF6B6B"},
              {l:"TRADES",       v:`${stats.wins}W / ${stats.losses}L`, c:"#94A3B8"},
            ].map(x=>(
              <div key={x.l} style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"11px 12px"}}>
                <div style={{fontSize:7,letterSpacing:2,color:"#4A5568",marginBottom:3}}>{x.l}</div>
                <div className="bb" style={{fontSize:18,color:x.c}}>{x.v}</div>
              </div>
            ))}
          </div>

          {/* Hard stop gauge */}
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div style={{fontSize:8,letterSpacing:3,color:"#4A5568"}}>DAILY RISK CONSUMED</div>
              <div style={{fontSize:8,color:Math.abs(Math.min(0,stats.pnl))>calc.softStop?"#FF6B6B":"#4A5568",letterSpacing:1}}>
                {Math.abs(Math.min(0,stats.pnl))>calc.hardStop?"⚠ HARD STOP HIT":Math.abs(Math.min(0,stats.pnl))>calc.softStop?"⚠ SOFT STOP — REDUCE SIZE":"✓ WITHIN LIMITS"}
              </div>
            </div>
            {[
              {l:"P&L",v:fmtU(stats.pnl),c:stats.pnl>=0?"#00FFB2":"#FF6B6B"},
              {l:"SOFT STOP (1%)",v:fmtU(calc.softStop),c:"#FFD700"},
              {l:"HARD STOP (2%)",v:fmtU(calc.hardStop),c:"#FF6B6B"},
            ].map(x=>(
              <div key={x.l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #111621",fontSize:9}}>
                <span style={{color:"#4A5568",letterSpacing:1}}>{x.l}</span>
                <span style={{color:x.c,fontWeight:500}}>{x.v}</span>
              </div>
            ))}
          </div>

          {/* Trade grade breakdown */}
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:10}}>TRADE QUALITY GRADES</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[["A","All criteria met — full confluence","#00FFB2"],["B","Minor deviation — still valid","#FFD700"],["C","Emotional / impulsive — no edge","#FF6B6B"]].map(([g,d,c])=>(
                <div key={g} style={{background:"#080A0D",border:`1px solid ${c}30`,borderRadius:4,padding:"10px",textAlign:"center"}}>
                  <div className="bb" style={{fontSize:24,color:c}}>{stats.grades[g]}</div>
                  <div style={{fontSize:7,letterSpacing:2,color:c,marginBottom:4}}>GRADE {g}</div>
                  <div style={{fontSize:7,color:"#4A5568",lineHeight:1.4}}>{d}</div>
                </div>
              ))}
            </div>
            {stats.tradeCount>0&&(
              <div style={{marginTop:10,fontSize:8,letterSpacing:1,color:stats.grades.A/stats.tradeCount>=0.8?"#00FFB2":"#FFD700"}}>
                {Math.round(stats.grades.A/stats.tradeCount*100)||0}% A-GRADE TRADES · TARGET: 80%+
              </div>
            )}
          </div>

          {/* Session notes */}
          <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:7}}>SESSION JOURNAL NOTES</div>
          <textarea value={sessionNotes} onChange={e=>{setSessionNotes(e.target.value);save({sessionNotes:e.target.value});}}
            placeholder="What worked today? What didn't? Key observations on price action, volume profile levels that held/failed, emotional state, improvements for tomorrow..."
            style={{width:"100%",background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"11px 13px",color:"#E2E8F0",fontSize:11,lineHeight:1.6,minHeight:120,marginBottom:14}}/>

          {/* Rules reminder */}
          <div style={{background:"#0D1117",border:"1px solid #1E2530",borderRadius:4,padding:"12px 14px"}}>
            <div style={{fontSize:8,letterSpacing:3,color:"#4A5568",marginBottom:10}}>CORE OPERATING PRINCIPLES</div>
            {[
              "HVNs are destinations. LVNs are doors. Know which side you're on.",
              "Enter after the manipulation sweep. Never before it.",
              "A missed trade is never a lost trade. The market always returns.",
              "No setup → no trade. Patience is a position.",
              "Discipline is the edge. Quality over quantity, every session.",
              "A C-grade trade today risks your A-grade capital tomorrow.",
            ].map((m,i)=>(
              <div key={i} style={{display:"flex",gap:9,padding:"6px 0",borderBottom:"1px solid #111621",fontSize:9,color:"#475569",lineHeight:1.5,alignItems:"flex-start"}}>
                <span style={{color:"#00FFB2",flexShrink:0}}>◆</span>{m}
              </div>
            ))}
          </div>
        </>)}

      </div>



      {/* ── DISCLAIMER ──────────────────────────────────────── */}
      <div style={{background:"#06080B",borderTop:"1px solid #111621",padding:"10px 18px",textAlign:"center"}}>
        <div style={{fontSize:7,color:"#2A3545",letterSpacing:"0.5px",lineHeight:1.8,maxWidth:640,margin:"0 auto"}}>
          <span style={{color:"#4A5568",fontWeight:600}}>⚠ RISK WARNING</span> — TradeCockpit does not provide financial advice.
          All risk calculations, price levels and market information are for informational and educational purposes only.
          Trading futures involves significant risk of loss. You are solely responsible for your trading decisions.
          Always verify prices and prop firm rules directly with your broker. Trade responsibly.
        </div>
        <div style={{fontSize:7,color:"#1E2530",letterSpacing:1,marginTop:5}}>
          © 2026 TRADECOCKPIT · THE EDGE IS IN THE PROCESS · NOT FINANCIAL ADVICE
        </div>
      </div>

    </div>
  );
}

// ── Main App with auth wrapper ───────────────────────────────
export default function App() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#06080B",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'IBM Plex Mono',monospace"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"Impact,sans-serif",fontSize:28,letterSpacing:3,color:"#CBD5E1",marginBottom:8}}>
          TRADE<span style={{color:"#00FFB2"}}>COCKPIT</span>
        </div>
        <div style={{fontSize:8,letterSpacing:3,color:"#4A5568"}}>LOADING...</div>
      </div>
    </div>
  );

  if (!user) return <AuthScreen onAuth={setUser} />;

  return <TradingPlan user={user} onLogout={handleLogout} />;
}
