import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  const pos      = useRef({ x: -100, y: -100 });
  const ringPos  = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const clicking = useRef(false);
  const raf      = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isClickable = el?.closest(
        "button, a, [role='button'], input, select, label, [tabindex]"
      );
      hovering.current = !!isClickable;
    };

    const onDown = () => { clicking.current = true; };
    const onUp   = () => { clicking.current = false; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      const dot  = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) { raf.current = requestAnimationFrame(tick); return; }

      dot.style.left = `${pos.current.x}px`;
      dot.style.top  = `${pos.current.y}px`;

      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      ring.style.left   = `${ringPos.current.x}px`;
      ring.style.top    = `${ringPos.current.y}px`;

      const scale = clicking.current ? 0.7 : hovering.current ? 1.8 : 1;
      ring.style.transform   = `translate(-50%,-50%) scale(${scale})`;
      ring.style.borderColor = hovering.current
        ? "rgba(139,92,246,0.8)"
        : "rgba(255,255,255,0.35)";
      ring.style.background  = hovering.current
        ? "rgba(139,92,246,0.08)"
        : "transparent";
      ring.style.boxShadow   = hovering.current
        ? "0 0 20px rgba(139,92,246,0.4)"
        : "none";

      dot.style.transform = `translate(-50%,-50%) scale(${clicking.current ? 0.5 : hovering.current ? 0 : 1})`;
      dot.style.background = hovering.current ? "#a78bfa" : "#fff";

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position:      "fixed",
          pointerEvents: "none",
          zIndex:        99999,
          width:         8,
          height:        8,
          borderRadius:  "50%",
          background:    "#fff",
          transform:     "translate(-50%,-50%)",
          transition:    "transform 0.1s ease, background 0.2s ease",
          mixBlendMode:  "difference",
        }}
      />

      <div
        ref={ringRef}
        style={{
          position:      "fixed",
          pointerEvents: "none",
          zIndex:        99998,
          width:         36,
          height:        36,
          borderRadius:  "50%",
          border:        "1.5px solid rgba(255,255,255,0.35)",
          transform:     "translate(-50%,-50%) scale(1)",
          transition:    "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.25s, background 0.25s, box-shadow 0.25s",
        }}
      />

      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
