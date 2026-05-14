import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function FormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    prodi: "",
    generasi: "",
    usia: "",
    frekuensi: "",
    waktu: "",
    tujuan: "",
    ngobrol: false,
    tugas: false,
    hp: false,
    game: false,
  });

  const [notif, setNotif] = useState("");
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const decisionTree = () => {
    const freq = parseInt(form.frekuensi);

    let label = "Pengunjung Kasual";

    if (freq <= 1) {
      label = "Pengunjung Sesekali";
    } else if (freq >= 3) {
      label = "Pengunjung Aktif Sosial";
    }

    return label;
  };

  const classify = async () => {
    if (
      !form.nama ||
      !form.prodi ||
      !form.generasi ||
      !form.usia ||
      !form.frekuensi ||
      !form.waktu ||
      !form.tujuan
    ) {
      alert("Lengkapi semua field dulu brok 💀");
      return;
    }

    setLoading(true);

    const label = decisionTree();

    setHasil(label);

    const aktivitas = [];

    if (form.ngobrol) aktivitas.push("Mengobrol");
    if (form.tugas) aktivitas.push("Mengerjakan Tugas");
    if (form.hp) aktivitas.push("Main HP");
    if (form.game) aktivitas.push("Main Game");

    const { error } = await supabase.from("klasifikasi_hasil").insert([
      {
        nama: form.nama,
        prodi: form.prodi,
        generasi: form.generasi,
        usia: form.usia,
        frekuensi: form.frekuensi,
        waktu: form.waktu,
        tujuan: form.tujuan,
        aktivitas: aktivitas.join(", "),
        label,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log(error);
      setNotif("❌ Gagal simpan data");
    } else {
      setNotif("✅ Data berhasil disimpan!");
    }
  };

  return (
    <div className="relative text-white">
      <div className="absolute inset-0 overflow-hidden rounded-[32px]">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />

        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-8 md:p-10">
        <div className="flex items-start justify-between gap-5 mb-10">
          <div>
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

            <p className="text-gray-400 mt-4 max-w-xl">
              Isi data survei mahasiswa untuk mendapatkan hasil klasifikasi
              aktivitas mahasiswa di kantin kampus.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Nama Responden</label>

            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama..."
              className="
              w-full
    bg-[#141726]
    text-white
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/20
    duration-300
            "
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Program Studi</label>

            <select
              name="prodi"
              value={form.prodi}
              onChange={handleChange}
              className="
    w-full
    bg-[#141726]
    text-white
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/20
    duration-300
  "
            >
              <option value="">-- Pilih Prodi --</option>
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
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Generasi</label>

            <select
              name="generasi"
              value={form.generasi}
              onChange={handleChange}
              className="
              w-full
    bg-[#141726]
    text-white
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/20
    duration-300
            "
            >
              <option value="">-- Pilih Generasi --</option>
              <option>22</option>
              <option>23</option>
              <option>24</option>
              <option>25</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Usia</label>

            <select
              name="usia"
              value={form.usia}
              onChange={handleChange}
              className="
              w-full
    bg-[#141726]
    text-white
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/20
    duration-300
            "
            >
              <option value="">-- Pilih Usia --</option>
              <option>17-19</option>
              <option>20-22</option>
              <option>22 Keatas</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Frekuensi ke Kantin</label>

            <select
              name="frekuensi"
              value={form.frekuensi}
              onChange={handleChange}
              className="
              w-full
    bg-[#141726]
    text-white
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/20
    duration-300
            "
            >
              <option value="">-- Pilih --</option>
              <option value="1">Jarang</option>
              <option value="2">1-2x Seminggu</option>
              <option value="3">3-5x Seminggu</option>
              <option value="4">Setiap Hari</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Waktu di Kantin</label>

            <select
              name="waktu"
              value={form.waktu}
              onChange={handleChange}
              className="
              w-full
    bg-[#141726]
    text-white
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-500/20
    duration-300
            "
            >
              <option value="">-- Pilih --</option>
              <option>Pagi</option>
              <option>Siang</option>
              <option>Sore</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={classify}
            disabled={loading}
            className="
            relative
            overflow-hidden
            px-8
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-blue-500
            to-purple-500
            font-bold
            shadow-2xl
            shadow-blue-500/20
            hover:scale-[1.02]
            duration-300
          "
          >
            {loading ? "Loading..." : "🔍 Klasifikasikan"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="
            px-8
            py-4
            rounded-2xl
            border
            border-white/10
            bg-white/5
            hover:bg-white/10
            duration-300
          "
          >
            Tutup
          </button>
        </div>

        {hasil && (
          <div
            className="
            mt-10
            p-6
            rounded-3xl
            border
            border-green-500/30
            bg-green-500/10
            backdrop-blur-xl
          "
          >
            <p className="text-sm text-green-400 mb-3">HASIL KLASIFIKASI</p>

            <h2 className="text-3xl md:text-4xl font-black text-green-400">
              {hasil}
            </h2>

            <p className="text-gray-300 mt-3">
              Sistem berhasil melakukan klasifikasi berdasarkan pola aktivitas
              mahasiswa.
            </p>
          </div>
        )}
      </div>

      {notif && (
        <div
          className="
          fixed
          bottom-5
          right-5
          bg-[#141726]
          border
          border-green-500
          text-green-400
          px-5
          py-3
          rounded-2xl
          shadow-2xl
          backdrop-blur-xl
        "
        >
          {notif}
        </div>
      )}
    </div>
  );
}
