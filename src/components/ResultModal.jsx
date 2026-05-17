import { useEffect } from "react";

const RESULT_CONFIG = {
  "Pengunjung Aktif Sosial": {
    emoji: "🏆", color: "text-purple-300",
    gradientFrom: "from-purple-600", gradientTo: "to-pink-600",
    border: "border-purple-500/40", bg: "bg-purple-500/10",
    glow: "shadow-purple-500/30", glowBlur: "bg-purple-500/20",
    desc: "Kamu sangat aktif di kantin kampus — senang bersosialisasi dan sering menghabiskan waktu bersama teman-teman!",
  },
  "Pengunjung Kasual": {
    emoji: "☕", color: "text-blue-300",
    gradientFrom: "from-blue-600", gradientTo: "to-cyan-600",
    border: "border-blue-500/40", bg: "bg-blue-500/10",
    glow: "shadow-blue-500/30", glowBlur: "bg-blue-500/20",
    desc: "Kamu mengunjungi kantin secukupnya, biasanya untuk makan atau istirahat sejenak.",
  },
  "Pengunjung Sesekali": {
    emoji: "🌙", color: "text-yellow-300",
    gradientFrom: "from-yellow-600", gradientTo: "to-orange-600",
    border: "border-yellow-500/40", bg: "bg-yellow-500/10",
    glow: "shadow-yellow-500/30", glowBlur: "bg-yellow-500/20",
    desc: "Kamu jarang ke kantin kampus — mungkin lebih suka tempat lain atau membawa bekal sendiri.",
  },
};

export default function ResultModal({ hasil, form, onClose }) {
  const cfg = RESULT_CONFIG[hasil] ?? RESULT_CONFIG["Pengunjung Kasual"];
  const freqLabel = ["", "Jarang", "1-2x/minggu", "3-5x/minggu", "Setiap Hari"][parseInt(form.frekuensi)] ?? "-";

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4"
      style={{ animation: "fadeInBackdrop 0.3s ease forwards" }}
    >
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg"
        style={{ animation: "modalSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        {/* glow blob */}
        <div className={`absolute -inset-6 rounded-[48px] blur-3xl opacity-40 ${cfg.glowBlur}`} />

        <div className={`relative rounded-3xl border ${cfg.border} bg-[#0a0f1e]/95 backdrop-blur-xl shadow-2xl ${cfg.glow} overflow-hidden`}>
          {/* top gradient bar */}
          <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradientFrom} ${cfg.gradientTo}`} />

          <div className="p-8">
            {/* badge */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${cfg.gradientFrom} ${cfg.gradientTo} text-white text-xs font-bold uppercase tracking-widest shadow-lg`}>
                <span>✦</span> Hasil Klasifikasi
              </div>
            </div>

            {/* emoji + label */}
            <div className="flex items-center gap-5 mb-6">
              <div className="text-6xl" style={{ animation: "bounceIn 0.6s 0.2s both" }}>
                {cfg.emoji}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Kamu termasuk</p>
                <h2 className={`text-2xl md:text-3xl font-black ${cfg.color} leading-tight`}>
                  {hasil}
                </h2>
              </div>
            </div>

            {/* description */}
            <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base border-l-2 border-white/10 pl-4">
              {cfg.desc}
            </p>

            {/* detail grid */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Detail Responden</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Nama",      value: form.nama },
                  { label: "Prodi",     value: form.prodi },
                  { label: "Generasi",  value: `Angkatan ${form.generasi}` },
                  { label: "Usia",      value: form.usia },
                  { label: "Frekuensi", value: freqLabel },
                  { label: "Waktu",     value: form.waktu },
                  { label: "Tujuan",    value: form.tujuan },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">{item.label}</span>
                    <span className="text-white text-sm font-medium truncate">{item.value || "-"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* back button */}
            <button
              onClick={onClose}
              className={`w-full py-4 rounded-2xl bg-gradient-to-r ${cfg.gradientFrom} ${cfg.gradientTo} font-bold text-white shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-300`}
            >
              ← Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes bounceIn {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg);  opacity: 1; }
          100% { transform: scale(1)   rotate(0deg);              }
        }
      `}</style>
    </div>
  );
}
