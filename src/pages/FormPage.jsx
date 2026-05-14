import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function FieldGroup({ label, delay, children }) {
  return (
    <div className={`fade-up ${delay} space-y-2`}>
      <label className="text-sm text-gray-400 font-medium tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-[#0d1322] text-white border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 hover:border-white/20 placeholder-gray-600";

function CheckCard({ name, label, checked, onChange, accent, icon }) {
  return (
    <label
      className={`flex items-center gap-3 bg-[#0d1322] border rounded-2xl px-5 py-4 cursor-pointer transition-all duration-300
        ${checked
          ? `border-${accent}-500/50 bg-${accent}-500/10 shadow-lg shadow-${accent}-500/10`
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
        }`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0
          ${checked ? `border-${accent}-500 bg-${accent}-500` : "border-white/20"}`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
      </div>
      <span className="text-white font-medium">{icon} {label}</span>
    </label>
  );
}

const RESULT_CONFIG = {
  "Pengunjung Aktif Sosial": {
    emoji: "🏆", color: "text-purple-300",
    border: "border-purple-500/40", bg: "bg-purple-500/10",
    glow: "shadow-purple-500/20",
    desc: "Kamu sangat aktif di kantin kampus — senang bersosialisasi dan sering menghabiskan waktu bersama teman-teman!",
  },
  "Pengunjung Kasual": {
    emoji: "☕", color: "text-blue-300",
    border: "border-blue-500/40", bg: "bg-blue-500/10",
    glow: "shadow-blue-500/20",
    desc: "Kamu mengunjungi kantin secukupnya, biasanya untuk makan atau istirahat sejenak.",
  },
  "Pengunjung Sesekali": {
    emoji: "🌙", color: "text-yellow-300",
    border: "border-yellow-500/40", bg: "bg-yellow-500/10",
    glow: "shadow-yellow-500/20",
    desc: "Kamu jarang ke kantin kampus — mungkin lebih suka tempat lain atau membawa bekal sendiri.",
  },
};

export default function FormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "", prodi: "", generasi: "", usia: "",
    frekuensi: "", waktu: "", tujuan: "",
    ngobrol: false, tugas: false, hp: false, game: false,
  });

  const [notif,   setNotif]   = useState("");
  const [hasil,   setHasil]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const decisionTree = () => {
    const freq = parseInt(form.frekuensi);
    if (freq <= 1) return "Pengunjung Sesekali";
    if (freq >= 3) return "Pengunjung Aktif Sosial";
    return "Pengunjung Kasual";
  };

  const classify = async () => {
    if (!form.nama || !form.prodi || !form.generasi || !form.usia ||
        !form.frekuensi || !form.waktu || !form.tujuan) {
      setNotif("⚠️ Lengkapi semua field terlebih dahulu!");
      setTimeout(() => setNotif(""), 3000);
      return;
    }

    setLoading(true);
    const label = decisionTree();
    setHasil(null); // reset untuk re-trigger animasi

    const aktivitas = [];
    if (form.ngobrol) aktivitas.push("Mengobrol");
    if (form.tugas)   aktivitas.push("Mengerjakan Tugas");
    if (form.hp)      aktivitas.push("Main HP");
    if (form.game)    aktivitas.push("Main Game");

    const { error } = await supabase.from("klasifikasi_hasil").insert([{
      nama: form.nama, prodi: form.prodi, generasi: form.generasi,
      usia: form.usia, frekuensi: form.frekuensi, waktu: form.waktu,
      tujuan: form.tujuan, aktivitas: aktivitas.join(", "), label,
    }]);

    setLoading(false);

    if (error) {
      console.log(error);
      setNotif("❌ Gagal simpan data");
    } else {
      setTimeout(() => setHasil(label), 50); // tiny delay to re-trigger animation
      setNotif("✅ Data berhasil disimpan!");
      setTimeout(() => setNotif(""), 3000);
    }
  };

  const resultCfg = hasil ? RESULT_CONFIG[hasil] ?? RESULT_CONFIG["Pengunjung Kasual"] : null;

  return (
    <div className="relative text-white w-full max-w-4xl mx-auto">

      <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-5 md:p-10">

        <div className="fade-up mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm mb-5">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            AI Classification Form
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            Form
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Klasifikasi
            </span>
          </h1>

          <p className="text-gray-400 mt-4 max-w-xl leading-relaxed">
            Isi data survei mahasiswa untuk mendapatkan hasil klasifikasi
            aktivitas mahasiswa di kantin kampus.
          </p>

          <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.round(
                  ([form.nama, form.prodi, form.generasi, form.usia, form.frekuensi, form.waktu, form.tujuan]
                    .filter(Boolean).length / 7) * 100
                )}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {[form.nama, form.prodi, form.generasi, form.usia, form.frekuensi, form.waktu, form.tujuan].filter(Boolean).length} / 7 field terisi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          <FieldGroup label="Nama Responden" delay="delay-100">
            <input
              type="text" name="nama" value={form.nama} onChange={handleChange}
              placeholder="Masukkan nama..."
              className={inputCls}
            />
          </FieldGroup>

          <FieldGroup label="Program Studi" delay="delay-200">
            <select name="prodi" value={form.prodi} onChange={handleChange} className={inputCls}>
              <option value="" disabled hidden>-- Pilih Prodi --</option>
              <option>Teknik Informatika</option>
              <option>Sistem Informasi</option>
              <option>Teknik Rekayasa Komputer</option>
              <option>Teknik Rekayasa Sistem Eletronika</option>
              <option>Teknik Rekayasa Jaringan Telekomunikasi</option>
              <option>Teknologi Rekayasa Mekatronika</option>
              <option>Teknik Mesin</option>
              <option>Teknik Listrik</option>
              <option>Teknik Eletronika</option>
              <option>Akutansi Perpajakan</option>
              <option>Bisnis Digital</option>
              <option>Hubungan Masyarakat dan Komunikasi Digital</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Generasi" delay="delay-300">
            <select name="generasi" value={form.generasi} onChange={handleChange} className={inputCls}>
              <option value="" disabled hidden>-- Pilih Generasi --</option>
              <option>22</option>
              <option>23</option>
              <option>24</option>
              <option>25</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Usia" delay="delay-400">
            <select name="usia" value={form.usia} onChange={handleChange} className={inputCls}>
              <option value="" disabled hidden>-- Pilih Usia --</option>
              <option>17-19</option>
              <option>20-22</option>
              <option>22 Keatas</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Frekuensi ke Kantin" delay="delay-500">
            <select name="frekuensi" value={form.frekuensi} onChange={handleChange} className={inputCls}>
              <option value="" disabled hidden>-- Pilih --</option>
              <option value="1">Jarang</option>
              <option value="2">1-2x Seminggu</option>
              <option value="3">3-5x Seminggu</option>
              <option value="4">Setiap Hari</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Waktu di Kantin" delay="delay-600">
            <select name="waktu" value={form.waktu} onChange={handleChange} className={inputCls}>
              <option value="" disabled hidden>-- Pilih --</option>
              <option>Pagi</option>
              <option>Siang</option>
              <option>Sore</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Tujuan ke Kantin" delay="delay-700" >
            <select name="tujuan" value={form.tujuan} onChange={handleChange} className={`${inputCls} lg:col-span-2`}>
              <option value="" disabled hidden>-- Pilih --</option>
              <option>Makan & Minum</option>
              <option>Belajar / Mengerjakan Tugas</option>
              <option>Bersantai</option>
              <option>Bertemu Teman</option>
            </select>
          </FieldGroup>

        </div>

        <div className="fade-up delay-800 mt-10">
          <label className="text-sm text-gray-400 font-medium tracking-wide block mb-4">
            Aktivitas di Kantin
            <span className="ml-2 text-gray-600">(pilih semua yang sesuai)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CheckCard name="ngobrol" label="Mengobrol"        checked={form.ngobrol} onChange={handleChange} accent="blue"   icon="💬" />
            <CheckCard name="tugas"   label="Mengerjakan Tugas" checked={form.tugas}  onChange={handleChange} accent="purple" icon="📚" />
            <CheckCard name="hp"      label="Main HP"           checked={form.hp}     onChange={handleChange} accent="cyan"   icon="📱" />
            <CheckCard name="game"    label="Main Game"         checked={form.game}   onChange={handleChange} accent="pink"   icon="🎮" />
          </div>
        </div>

        <div className="fade-up delay-800 flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={classify}
            disabled={loading}
            className="relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-bold shadow-2xl shadow-blue-500/20 hover:scale-[1.03] hover:shadow-blue-500/40 duration-300 disabled:opacity-60 disabled:cursor-not-allowed gradient-animated"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                <> 🔍 Klasifikasikan </>
              )}
            </span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 duration-300 hover:scale-[1.02]"
          >
            ← Kembali
          </button>
        </div>

        {hasil && resultCfg && (
          <div className={`result-reveal mt-10 p-6 md:p-8 rounded-3xl border ${resultCfg.border} ${resultCfg.bg} backdrop-blur-xl shadow-2xl ${resultCfg.glow}`}>
            <div className="flex items-start gap-4">
              <div className="text-5xl counter-pop">{resultCfg.emoji}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-medium">
                  ✦ Hasil Klasifikasi
                </p>
                <h2 className={`text-2xl md:text-4xl font-black ${resultCfg.color} leading-tight`}>
                  {hasil}
                </h2>
                <p className="text-gray-300 mt-3 leading-relaxed">
                  {resultCfg.desc}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Berdasarkan</p>
              <div className="flex flex-wrap gap-2">
                {[
                  form.frekuensi && `Frekuensi: ${["","Jarang","1-2x/minggu","3-5x/minggu","Setiap Hari"][parseInt(form.frekuensi)]}`,
                  form.waktu     && `Waktu: ${form.waktu}`,
                  form.tujuan    && `Tujuan: ${form.tujuan}`,
                ].filter(Boolean).map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {notif && (
        <div className="animate-fadeIn fixed bottom-10 left-1/2 -translate-x-1/2 z-[1001] bg-gray-900/90 border border-white/20 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md text-sm font-medium">
          {notif}
        </div>
      )}
    </div>
  );
}
