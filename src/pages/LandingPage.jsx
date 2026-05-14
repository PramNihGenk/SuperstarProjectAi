import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import FormPage from "./FormPage";
import logo1 from "../assets/LogoPCR.png";
import logo2 from "../assets/Logo-ITSA.png";
import logo3 from "../assets/Logo-IDEAL.png";
import logo4 from "../assets/Logo-Unggul.png";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/* ---------- Animated counter ---------- */
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const step = Math.ceil(duration / target);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ---------- Particle ---------- */
const PARTICLES = [
  {
    w: 6,
    h: 6,
    top: "15%",
    left: "8%",
    color: "bg-blue-400/30",
    dur: "7s",
    del: "0s",
  },
  {
    w: 4,
    h: 4,
    top: "40%",
    left: "3%",
    color: "bg-purple-400/30",
    dur: "9s",
    del: "1.5s",
  },
  {
    w: 8,
    h: 8,
    top: "70%",
    left: "12%",
    color: "bg-cyan-400/20",
    dur: "11s",
    del: "0.8s",
  },
  {
    w: 5,
    h: 5,
    top: "20%",
    left: "90%",
    color: "bg-pink-400/25",
    dur: "8s",
    del: "2s",
  },
  {
    w: 7,
    h: 7,
    top: "55%",
    left: "85%",
    color: "bg-blue-300/20",
    dur: "10s",
    del: "0.4s",
  },
  {
    w: 4,
    h: 4,
    top: "80%",
    left: "80%",
    color: "bg-purple-300/25",
    dur: "12s",
    del: "1.2s",
  },
  {
    w: 3,
    h: 3,
    top: "10%",
    left: "50%",
    color: "bg-cyan-300/20",
    dur: "9s",
    del: "3s",
  },
  {
    w: 5,
    h: 5,
    top: "88%",
    left: "45%",
    color: "bg-indigo-400/20",
    dur: "8s",
    del: "2.5s",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    aktifPercent: 0,
    kasualPercent: 0,
    sesekaliPercent: 0,
  });
  const [openForm, setOpenForm] = useState(false);
  const [visible, setVisible] = useState(false);

  const aktifCount = useCountUp(stats.aktifPercent);
  const kasualCount = useCountUp(stats.kasualPercent);
  const sesekaliCount = useCountUp(stats.sesekaliPercent);

  /* trigger entrance animations after mount */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("klasifikasi_hasil")
      .select("*");
    if (error || !data || data.length === 0) return;
    const total = data.length;
    const kasual = data.filter((i) => i.label === "Pengunjung Kasual").length;
    const sesekali = data.filter(
      (i) => i.label === "Pengunjung Sesekali",
    ).length;
    const aktif = data.filter(
      (i) => i.label === "Pengunjung Aktif Sosial",
    ).length;

    // Largest-remainder algorithm — total selalu tepat 100%
    const counts = [aktif, kasual, sesekali];
    const floors = counts.map((c) => Math.floor((c / total) * 100));
    const remainders = counts.map((c) => ((c / total) * 100) % 1);
    let leftover = 100 - floors.reduce((a, b) => a + b, 0);
    const sorted = remainders
      .map((r, i) => ({ i, r }))
      .sort((a, b) => b.r - a.r);
    sorted.forEach(({ i }) => {
      if (leftover-- > 0) floors[i] += 1;
    });

    setStats({
      aktifPercent: total > 0 ? floors[0] : 0,
      kasualPercent: total > 0 ? floors[1] : 0,
      sesekaliPercent: total > 0 ? floors[2] : 0,
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    document.body.style.overflow = openForm ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openForm]);

  const chartData = [
    { name: "Aktif Sosial", value: stats.aktifPercent },
    { name: "Kasual", value: stats.kasualPercent },
    { name: "Sesekali", value: stats.sesekaliPercent },
  ];

  // Aktif=ungu, Kasual=hijau-teal (kontras jelas), Sesekali=amber
  const COLORS = ["#8b5cf6", "#10b981", "#f59e0b"];

  const renderLabel = ({ cx, cy, midAngle, outerRadius, name, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 22;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const isMobile = window.innerWidth < 480;
    const pct = `${(percent * 100).toFixed(0)}%`;
    return (
      <text
        x={x}
        y={y}
        fill="rgba(255,255,255,0.75)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: isMobile ? "9px" : "11px", fontWeight: 600 }}
      >
        {isMobile ? pct : `${name} ${pct}`}
      </text>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px]" />

        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className={`particle w-${p.w} h-${p.h} ${p.color} rounded-full`}
            style={{
              top: p.top,
              left: p.left,
              width: `${p.w * 4}px`,
              height: `${p.h * 4}px`,
              "--duration": p.dur,
              "--delay": p.del,
            }}
          />
        ))}
      </div>

      <header
        className={`relative z-50 max-w-7xl mx-auto px-4 md:px-6 pt-5 md:pt-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-5 py-2.5 shadow-lg hover:border-blue-500/30 transition-colors duration-300">
            <h1 className="font-semibold tracking-wide text-sm md:text-base text-white/90 text-center">
              AI Project Group 1
            </h1>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-4 md:px-5 py-2 w-full md:w-auto hover:border-purple-500/20 transition-colors duration-300">
            {[
              { src: logo1, alt: "logo1", cls: "h-7 md:h-8" },
              {
                src: logo2,
                alt: "logo2",
                cls: "h-8 md:h-9 scale-150 md:scale-150",
              },
              { src: logo3, alt: "logo3", cls: "h-7 md:h-8" },
              { src: logo4, alt: "logo4", cls: "h-7 md:h-8" },
            ].map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className={`${logo.cls} object-contain opacity-75 hover:opacity-100 transition-opacity duration-300`}
              />
            ))}
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-14 md:min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center w-full">
          <div>
            <div
              className={`fade-up delay-100 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm mb-8 backdrop-blur-xl`}
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Decision Tree Analytics
            </div>
            <h1 className="fade-up delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1] tracking-tight">
              Sistem
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent gradient-animated">
                Klasifikasi
              </span>
              Mahasiswa
            </h1>

            <p className="fade-up delay-300 mt-8 text-gray-400 text-lg leading-relaxed max-w-xl">
              Platform klasifikasi perilaku mahasiswa berbasis AI menggunakan
              metode{" "}
              <span className="text-blue-400 font-semibold">Decision Tree</span>{" "}
              untuk menganalisis aktivitas mahasiswa di kantin kampus.
            </p>

            <div className="fade-up delay-400 flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => setOpenForm(true)}
                className="w-full sm:w-auto group relative overflow-hidden px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-blue-500/25 hover:scale-[1.04] hover:shadow-blue-500/40 duration-300 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 gradient-animated"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <span>✦</span> Isi Form Survei
                </span>
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-white/10 duration-300 rounded-2xl" />
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-blue-500/30 duration-300 hover:scale-[1.02]"
              >
                Lihat Statistik →
              </button>
            </div>

            <div className="fade-up delay-500 flex flex-wrap gap-8 mt-16">
              {[
                { label: "Decision Tree", value: "AI", color: "text-purple-400" },
                {
                  label: "Student Research",
                  value: "PCR",
                  color: "text-emerald-400",
                },
                {
                  label: "Classification",
                  value: "Smart",
                  color: "text-amber-400",
                },
              ].map((item, i) => (
                <div key={i} className="group cursor-default">
                  <h2
                    className={`text-3xl font-black ${item.color} group-hover:scale-110 transition-transform duration-200 inline-block`}
                  >
                    {item.value}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="slide-in-right delay-300 relative flex justify-center mt-16 lg:mt-0">
            <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/20 rounded-full blur-[100px] md:blur-[140px] glow-pulse" />
            <div className="shimmer-border relative w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl animate-[float_6s_ease-in-out_infinite] overflow-hidden">
              <div className="scan-line" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs md:text-sm">
                    AI Analytics
                  </p>
                  <h2 className="text-xl md:text-2xl font-black mt-1">
                    Smart Dashboard
                  </h2>
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl md:text-2xl shadow-lg glow-pulse">
                  🧠
                </div>
              </div>

              <div className="mt-8 md:mt-10">
                <div className="h-[200px] md:h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={400}
                        animationDuration={1200}
                        label={renderLabel}
                        labelLine={{
                          stroke: "rgba(255,255,255,0.2)",
                          strokeWidth: 1,
                        }}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#111827",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "16px",
                          color: "white",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3 mt-6">
                  {[
                    {
                      count: aktifCount,
                      label: "Aktif",
                      bg: "bg-purple-500/10",
                      border: "border-purple-500/20",
                      text: "text-purple-400",
                    },
                    {
                      count: kasualCount,
                      label: "Kasual",
                      bg: "bg-emerald-500/10",
                      border: "border-emerald-500/20",
                      text: "text-emerald-400",
                    },
                    {
                      count: sesekaliCount,
                      label: "Sesekali",
                      bg: "bg-amber-500/10",
                      border: "border-amber-500/20",
                      text: "text-amber-400",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl ${item.bg} border ${item.border} p-2 md:p-3 text-center hover:scale-105 transition-transform duration-300`}
                    >
                      <p
                        className={`text-lg md:text-2xl font-black ${item.text}`}
                      >
                        {item.count}%
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-tighter">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {openForm && (
        <div className="overlay-enter fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4 overflow-hidden">
          <button
            onClick={() => setOpenForm(false)}
            className="fixed top-4 right-4 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-red-500 hover:rotate-90 transition-all duration-300"
          >
            ✕
          </button>

          <div className="modal-enter relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] overflow-y-auto bg-[#0f172a] md:rounded-3xl border-none md:border md:border-white/10 shadow-2xl">
            <div className="p-6 md:p-10">
              <FormPage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
