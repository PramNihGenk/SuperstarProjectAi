import { useEffect, useRef, useState } from "react";

const TAGLINE = "Sistem Klasifikasi Mahasiswa";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase]         = useState("enter");
  const [charIdx, setCharIdx]     = useState(0);
  const [particles, setParticles] = useState([]);
  const hasFired                  = useRef(false);

  useEffect(() => {
    if (phase !== "hold") return;
    if (charIdx >= TAGLINE.length) return;
    const t = setTimeout(() => setCharIdx((c) => c + 1), 45);
    return () => clearTimeout(t);
  }, [phase, charIdx]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => onDone(), 3900);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "hold" || hasFired.current) return;
    hasFired.current = true;
    const pts = Array.from({ length: 24 }, (_, i) => ({
      id:    i,
      angle: (360 / 24) * i,
      dist:  120 + Math.random() * 80,
      size:  3 + Math.random() * 5,
      color: ["#8b5cf6","#10b981","#f59e0b","#3b82f6","#ec4899","#22d3ee"][i % 6],
      dur:   0.8 + Math.random() * 0.6,
    }));
    setParticles(pts);
    setTimeout(() => setParticles([]), 2000);
  }, [phase]);

  return (
    <div
      className={`splash-root ${phase === "exit" ? "splash-exit" : "splash-enter"}`}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         9999,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        background:     "radial-gradient(ellipse at 40% 40%, #0d0f2b 0%, #060816 70%)",
        overflow:       "hidden",
      }}
    >
      <div style={{
        position:   "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
        backgroundSize: "70px 70px",
      }} />

      <div style={{ position:"absolute", top:"-15%", left:"-10%", width:500, height:500,
        borderRadius:"50%", background:"rgba(139,92,246,0.12)", filter:"blur(120px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:450, height:450,
        borderRadius:"50%", background:"rgba(16,185,129,0.10)", filter:"blur(120px)", pointerEvents:"none" }} />

      {particles.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const tx  = Math.cos(rad) * p.dist;
        const ty  = Math.sin(rad) * p.dist;
        return (
          <div
            key={p.id}
            style={{
              position:      "absolute",
              width:         p.size,
              height:        p.size,
              borderRadius:  "50%",
              background:    p.color,
              left:          "50%",
              top:           "50%",
              transform:     "translate(-50%,-50%)",
              animation:     `burst ${p.dur}s cubic-bezier(0.22,1,0.36,1) forwards`,
              "--tx":        `${tx}px`,
              "--ty":        `${ty}px`,
              boxShadow:     `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        );
      })}

      <div
        className={phase === "enter" ? "splash-content-enter" : "splash-content-hold"}
        style={{ textAlign:"center", position:"relative", zIndex:1 }}
      >
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          padding:"6px 18px", borderRadius:999,
          border:"1px solid rgba(139,92,246,0.35)",
          background:"rgba(139,92,246,0.12)",
          color:"#a78bfa", fontSize:12, fontWeight:600,
          letterSpacing:"0.12em", textTransform:"uppercase",
          marginBottom:28,
        }}>
          <span style={{
            width:7, height:7, borderRadius:"50%",
            background:"#a78bfa",
            animation:"pulse 1.5s ease-in-out infinite",
            display:"inline-block",
          }} />
          AI · Decision Tree
        </div>

        <div style={{
          fontSize: "clamp(48px, 10vw, 96px)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "#fff",
          textShadow: "0 0 60px rgba(139,92,246,0.4)",
        }}>
          Welcome
        </div>

        <div style={{
          height:3, borderRadius:99, margin:"20px auto",
          width: phase === "hold" ? 300 : 0,
          background:"linear-gradient(90deg,#8b5cf6,#10b981,#f59e0b)",
          transition:"width 0.9s cubic-bezier(0.22,1,0.36,1)",
        }} />

        <p style={{
          color:"rgba(255,255,255,0.55)", fontSize:"clamp(13px,2vw,17px)",
          fontWeight:500, letterSpacing:"0.03em", minHeight:28,
          visibility: phase === "hold" ? "visible" : "hidden",
        }}>
          {TAGLINE.slice(0, charIdx)}
          {charIdx < TAGLINE.length && (
            <span style={{ animation:"blink 1s step-end infinite", color:"#60a5fa" }}>|</span>
          )}
        </p>

        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:32 }}>
          {[0,1,2].map((i) => (
            <div key={i} style={{
              width:8, height:8, borderRadius:"50%",
              background: ["#8b5cf6","#10b981","#f59e0b"][i],
              animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        .splash-root {
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .splash-enter { opacity: 1; transform: scale(1); }
        .splash-exit  { opacity: 0; transform: scale(1.04); pointer-events: none; }

        .splash-content-enter {
          opacity: 0;
          transform: translateY(30px) scale(0.96);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .splash-content-hold {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }

        @keyframes burst {
          0%   { transform: translate(-50%,-50%) translate(0,0); opacity:1; }
          100% { transform: translate(-50%,-50%) translate(var(--tx),var(--ty)); opacity:0; }
        }

        @keyframes dotBounce {
          0%,100% { transform: translateY(0); opacity:0.4; }
          50%      { transform: translateY(-10px); opacity:1; }
        }

        @keyframes blink {
          0%,100% { opacity:1; }
          50%     { opacity:0; }
        }

        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.5; transform:scale(0.7); }
        }
      `}</style>
    </div>
  );
}
