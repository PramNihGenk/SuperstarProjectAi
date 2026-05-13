import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
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
        label: label,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log(error);
      setNotif("❌ Gagal simpan data");
    } else {
      setNotif("✅ Data berhasil disimpan!");

      resetForm();

      setHasil(null);
      setTimeout(() => {
        setNotif("");
      }, 3000);
    }
  };

  const resetForm = () => {
    setForm({
      nama: "",
      prodi: "",
      generasi: "",
      usia: "",
      frekuensi: "",
      waktu: "",
      tujuan: "",
      makanminum: false,
      ngobrol: false,
      tugas: false,
      hp: false,
      game: false,
    });

    setHasil(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white">
      <header className="border-b border-[#2a2f4a] bg-[#141726] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto min-h-[70px] flex flex-col md:flex-row md:items-center justify-between px-4 md:px-6 py-3 gap-3">
          <div>
            <h1 className="text-lg md:text-2xl font-black text-blue-400 leading-tight">
              Survei Kegiatan Mahasiswa di Kantin
            </h1>

            <p className="text-xs text-gray-500">Politeknik Caltex Riau</p>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-[#1c2035]">
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-14">
        <div className="bg-gradient-to-br from-[#141726] to-[#1b1f35] border border-[#2a2f4a] rounded-3xl p-5 md:p-10">
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            Sistem Klasifikasi
            <br />
            Kegiatan Mahasiswa
          </h1>

          <p className="text-gray-400 mt-5 max-w-2xl">
            Sistem klasifikasi kegiatan mahasiswa berbasis Decision Tree
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#1c2035] rounded-2xl p-5 border border-[#2a2f4a]">
              <h2 className="text-3xl font-black text-blue-400">3</h2>
              <p className="text-sm text-gray-400">Cluster</p>
            </div>

            <div className="bg-[#1c2035] rounded-2xl p-5 border border-[#2a2f4a]">
              <h2 className="text-3xl font-black text-green-400">100%</h2>
              <p className="text-sm text-gray-400">Akurasi</p>
            </div>

            <div className="bg-[#1c2035] rounded-2xl p-5 border border-[#2a2f4a]">
              <h2 className="text-3xl font-black text-yellow-400">64</h2>
              <p className="text-sm text-gray-400">Data Training</p>
            </div>

            <div className="bg-[#1c2035] rounded-2xl p-5 border border-[#2a2f4a]">
              <h2 className="text-3xl font-black text-purple-400">9</h2>
              <p className="text-sm text-gray-400">Features</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="bg-[#141726] border border-[#2a2f4a] rounded-3xl p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
            📝 Form Klasifikasi Mahasiswa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Nama Lengkap
              </label>

              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Masukkan nama..."
                className="w-full bg-[#1c2035] border border-[#2a2f4a] rounded-xl px-4 py-3 text-sm md:text-base"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Program Studi
              </label>

              <select
                name="prodi"
                value={form.prodi}
                onChange={handleChange}
                className="w-full bg-[#1c2035] border border-[#2a2f4a] rounded-xl px-4 py-3"
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

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Generasi
              </label>

              <select
                name="generasi"
                value={form.generasi}
                onChange={handleChange}
                className="w-full bg-[#1c2035] border border-[#2a2f4a] rounded-xl px-4 py-3"
              >
                <option value="">-- Pilih Generasi --</option>

                <option>22</option>
                <option>23</option>
                <option>24</option>
                <option>25</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Usia</label>

              <select
                name="usia"
                value={form.usia}
                onChange={handleChange}
                className="w-full bg-[#1c2035] border border-[#2a2f4a] rounded-xl px-4 py-3"
              >
                <option value="">-- Pilih Usia --</option>
                <option>17-19</option>
                <option>20-22</option>
                <option>22 Keatas</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Frekuensi ke Kantin
              </label>

              <select
                name="frekuensi"
                value={form.frekuensi}
                onChange={handleChange}
                className="w-full bg-[#1c2035] border border-[#2a2f4a] rounded-xl px-4 py-3"
              >
                <option value="">-- Pilih --</option>

                <option value="1">Jarang</option>
                <option value="2">1-2x Seminggu</option>
                <option value="3">3-5x Seminggu</option>
                <option value="4">Setiap Hari</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Waktu di Kantin
              </label>

              <select
                name="waktu"
                value={form.waktu}
                onChange={handleChange}
                className="w-full bg-[#1c2035] border border-[#2a2f4a] rounded-xl px-4 py-3"
              >
                <option value="">-- Pilih --</option>

                <option>Pagi</option>
                <option>Siang</option>
                <option>Sore</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-400 mb-2 block">
                Tujuan Utama
              </label>

              <select
                name="tujuan"
                value={form.tujuan}
                onChange={handleChange}
                className="w-full bg-[#1c2035] border border-[#2a2f4a] rounded-xl px-4 py-3"
              >
                <option value="">-- Pilih --</option>

                <option>Makan</option>
                <option>Nongkrong</option>
                <option>Diskusi/tugas</option>
                <option>Menunggu Kelas</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-sm text-gray-400 block mb-4">
              Aktivitas di Kantin
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "makanminum", label: "Makan/Minum" },
                { key: "ngobrol", label: "Mengobrol dengan Teman" },
                { key: "tugas", label: "Mengerjakan Tugas" },
                { key: "hp", label: "Bermain HP" },
                { key: "game", label: "Main Game" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 bg-[#1c2035] border border-[#2a2f4a] px-3 py-3 rounded-xl text-sm"
                >
                  <input
                    type="checkbox"
                    name={item.key}
                    checked={form[item.key]}
                    onChange={handleChange}
                  />

                  {item.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={classify}
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-bold"
            >
              {loading ? "Loading..." : "🔍 Klasifikasikan"}
            </button>

            <button
              onClick={resetForm}
              className="px-7 py-3 rounded-xl bg-[#1c2035] border border-[#2a2f4a]"
            >
              Reset
            </button>
          </div>

          {hasil && (
            <div className="mt-10 p-6 rounded-2xl border border-green-500 bg-green-500/10">
              <h2 className="text-2xl md:text-3xl font-black text-green-400">
                {hasil}
              </h2>

              <p className="text-gray-300 mt-3">
                Sistem berhasil melakukan klasifikasi berdasarkan data perilaku
                mahasiswa.
              </p>
            </div>
          )}
        </div>
      </section>
      {notif && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:right-5 md:translate-x-0 bg-[#141726] border border-green-500 text-green-400 px-5 py-3 rounded-xl shadow-xl">
          {notif}
        </div>
      )}
    </div>
  );
}
