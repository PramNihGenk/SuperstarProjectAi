import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CLUSTER_CONFIG = {
  "Pengunjung Aktif Sosial": {
    color: "text-purple-400",
    border: "border-purple-500",
    activeBg: "bg-purple-500/10",
    badgeBg: "bg-purple-500/15",
    badgeBorder: "border-purple-500/30",
    glow: "shadow-purple-500/20",
    hex: "#8b5cf6",
    icon: "🏆",
  },
  "Pengunjung Kasual": {
    color: "text-emerald-400",
    border: "border-emerald-500",
    activeBg: "bg-emerald-500/10",
    badgeBg: "bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    hex: "#10b981",
    icon: "☕",
  },
  "Pengunjung Sesekali": {
    color: "text-amber-400",
    border: "border-amber-500",
    activeBg: "bg-amber-500/10",
    badgeBg: "bg-amber-500/15",
    badgeBorder: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    hex: "#f59e0b",
    icon: "🌙",
  },
};

const PARTICLES = [
  {
    top: "12%",
    left: "5%",
    w: 20,
    h: 20,
    color: "#8b5cf6",
    dur: "7s",
    del: "0s",
  },
  {
    top: "45%",
    left: "2%",
    w: 14,
    h: 14,
    color: "#10b981",
    dur: "9s",
    del: "1.5s",
  },
  {
    top: "75%",
    left: "8%",
    w: 28,
    h: 28,
    color: "#06b6d4",
    dur: "11s",
    del: "0.8s",
  },
  {
    top: "18%",
    left: "92%",
    w: 18,
    h: 18,
    color: "#ec4899",
    dur: "8s",
    del: "2s",
  },
  {
    top: "60%",
    left: "88%",
    w: 24,
    h: 24,
    color: "#3b82f6",
    dur: "10s",
    del: "0.4s",
  },
  {
    top: "85%",
    left: "82%",
    w: 12,
    h: 12,
    color: "#a78bfa",
    dur: "12s",
    del: "1.2s",
  },
  {
    top: "8%",
    left: "52%",
    w: 10,
    h: 10,
    color: "#22d3ee",
    dur: "9s",
    del: "3s",
  },
  {
    top: "90%",
    left: "48%",
    w: 16,
    h: 16,
    color: "#818cf8",
    dur: "8s",
    del: "2.5s",
  },
];

function toPercents(counts, total) {
  if (total === 0) return counts.map(() => 0);
  const floors = counts.map((c) => Math.floor((c / total) * 100));
  const rems = counts.map((c) => ((c / total) * 100) % 1);
  let leftover = 100 - floors.reduce((a, b) => a + b, 0);
  rems
    .map((r, i) => ({ i, r }))
    .sort((a, b) => b.r - a.r)
    .forEach(({ i }) => {
      if (leftover-- > 0) floors[i] += 1;
    });
  return floors;
}

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let startTime = null;
    let raf;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [selectedCluster, setSelectedCluster] = useState("Semua");
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);

  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    total: 0,
    kasual: 0,
    sesekali: 0,
    aktif: 0,
    kasualPercent: 0,
    sesekaliPercent: 0,
    aktifPercent: 0,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("klasifikasi_hasil")
      .select("*");
    if (error) {
      console.log(error);
      return;
    }
    if (!data) return;

    setAllData(data);

    const kasual = data.filter((i) => i.label === "Pengunjung Kasual").length;
    const sesekali = data.filter(
      (i) => i.label === "Pengunjung Sesekali",
    ).length;
    const aktif = data.filter(
      (i) => i.label === "Pengunjung Aktif Sosial",
    ).length;
    const total = data.length;

    const [aktifPct, kasualPct, sesekaliPct] = toPercents(
      [aktif, kasual, sesekali],
      total,
    );

    setStats({
      total,
      kasual,
      sesekali,
      aktif,
      kasualPercent: kasualPct,
      sesekaliPercent: sesekaliPct,
      aktifPercent: aktifPct,
    });
  };

  const filteredData =
    selectedCluster === "Semua"
      ? allData
      : allData.filter((i) => i.label === selectedCluster);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchStats();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCluster]);

  const cTotal = useCountUp(stats.total);
  const cAktif = useCountUp(stats.aktif);
  const cKasual = useCountUp(stats.kasual);
  const cSesekali = useCountUp(stats.sesekali);
  const getLabelStyle = (label) => {
    const cfg = CLUSTER_CONFIG[label];
    return cfg
      ? `${cfg.badgeBg} border ${cfg.badgeBorder} ${cfg.color}`
      : "bg-white/10 border border-white/10 text-gray-400";
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060816] text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-80px] left-[-80px] w-[380px] h-[380px] bg-purple-500/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]" />
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="particle rounded-full absolute"
            style={{
              top: p.top,
              left: p.left,
              width: p.w,
              height: p.h,
              background: p.hex ?? p.color,
              opacity: 0.25,
              "--duration": p.dur,
              "--delay": p.del,
            }}
          />
        ))}
      </div>

      <header
        className={`relative z-50 border-b border-white/5 backdrop-blur-2xl bg-[#060816]/80 sticky top-0 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <div className="max-w-7xl mx-auto min-h-[70px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs mb-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
              Analytics Dashboard
            </div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Dashboard Statistik
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Politeknik Caltex Riau
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] text-sm"
          >
            ← Kembali
          </button>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 mt-4 sm:mt-6 pb-16">
        <div className="fade-up mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Statistik Aktivitas
            <span className="block bg-gradient-to-r from-purple-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent gradient-animated">
              Mahasiswa
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Visualisasi hasil klasifikasi mahasiswa berdasarkan data survei
            kantin kampus.
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-10">
          <button
            onClick={() => setSelectedCluster("Semua")}
            className={`fade-up delay-100 relative overflow-hidden rounded-2xl p-4 sm:p-5 border text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
              ${
                selectedCluster === "Semua"
                  ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
          >
            <div className="text-2xl mb-3">📊</div>
            <h2 className="text-3xl sm:text-4xl font-black text-blue-400">
              {cTotal}
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Total Responden</p>
            {selectedCluster === "Semua" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-b-2xl" />
            )}
          </button>

          {[
            {
              key: "Pengunjung Aktif Sosial",
              count: cAktif,
              pct: stats.aktifPercent,
            },
            {
              key: "Pengunjung Kasual",
              count: cKasual,
              pct: stats.kasualPercent,
            },
            {
              key: "Pengunjung Sesekali",
              count: cSesekali,
              pct: stats.sesekaliPercent,
            },
          ].map(({ key, count, pct }, i) => {
            const cfg = CLUSTER_CONFIG[key];
            const active = selectedCluster === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCluster(key)}
                className={`fade-up delay-${(i + 2) * 100} relative overflow-hidden rounded-2xl p-4 sm:p-5 border text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                  ${
                    active
                      ? `${cfg.border} ${cfg.activeBg} shadow-lg ${cfg.glow}`
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
              >
                <div className="text-2xl mb-3">{cfg.icon}</div>
                <h2 className={`text-3xl sm:text-4xl font-black ${cfg.color}`}>
                  {count}
                </h2>
                <p className="text-gray-400 mt-2 text-sm">{key}</p>

                <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: cfg.hex }}
                  />
                </div>
                <p className={`text-xs mt-1 font-bold ${cfg.color}`}>{pct}%</p>

                {active && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                    style={{ background: cfg.hex }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="fade-up delay-500 backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">Data Responden</h2>
              <p className="text-gray-400 text-sm mt-1">
                Filter:{" "}
                <span
                  className={`font-semibold ml-1 ${
                    selectedCluster === "Semua"
                      ? "text-blue-400"
                      : (CLUSTER_CONFIG[selectedCluster]?.color ?? "text-white")
                  }`}
                >
                  {selectedCluster}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="font-bold text-white">
                {filteredData.length}
              </span>{" "}
              data ditemukan
            </div>
          </div>

          <div className="table-scroll w-full overflow-x-auto pb-2">
            <table className="min-w-[1100px] w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest">
                  <th className="pb-4 px-4 font-semibold">Nama</th>
                  <th className="pb-4 px-4 font-semibold">Prodi</th>
                  <th className="pb-4 px-4 font-semibold">Generasi</th>
                  <th className="pb-4 px-4 font-semibold">Frekuensi</th>
                  <th className="pb-4 px-4 font-semibold">Tujuan</th>
                  <th className="pb-4 px-4 font-semibold">Aktivitas</th>
                  <th className="pb-4 px-4 font-semibold">Cluster</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-200 rounded-xl"
                    >
                      <td className="px-4 py-4 text-white align-middle font-medium rounded-l-xl">
                        {item.nama || "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-300 align-middle text-sm">
                        {item.prodi || "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-300 align-middle text-sm text-center">
                        {item.generasi ? `${item.generasi}` : "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-300 align-middle text-sm">
                        {item.frekuensi === "1"
                          ? "Jarang"
                          : item.frekuensi === "2"
                            ? "1-2x/minggu"
                            : item.frekuensi === "3"
                              ? "3-5x/minggu"
                              : item.frekuensi === "4"
                                ? "Setiap Hari"
                                : "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-300 align-middle text-sm">
                        {item.tujuan || "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-300 align-middle text-sm">
                        {item.aktivitas || "—"}
                      </td>
                      <td className="px-4 py-4 align-middle rounded-r-xl">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getLabelStyle(item.label)}`}
                        >
                          {CLUSTER_CONFIG[item.label]?.icon ?? ""}{" "}
                          {item.label || "—"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-gray-500">
                      Tidak ada data untuk cluster ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition-all duration-200 text-sm"
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200
                    ${
                      currentPage === page
                        ? "bg-gradient-to-r from-purple-500 to-emerald-500 text-white shadow-lg"
                        : "bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400"
                    }`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-gray-500 text-sm">…</span>}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 transition-all duration-200 text-sm"
            >
              Next →
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-3">
            Halaman {currentPage} dari {totalPages || 1}
          </p>
        </div>
      </section>
    </div>
  );
}
