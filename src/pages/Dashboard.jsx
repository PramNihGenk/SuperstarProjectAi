import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [selectedCluster, setSelectedCluster] = useState("Semua");
  const [allData, setAllData] = useState([]);

  const [stats, setStats] = useState({
    total: 0,

    kasual: 0,
    sesekali: 0,
    aktif: 0,

    kasualPercent: 0,
    sesekaliPercent: 0,
    aktifPercent: 0,
  });

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("klasifikasi_hasil")
      .select("*");

    setAllData(data);

    if (error) {
      console.log(error);
      return;
    }

    console.log("DATA SUPABASE:", data);

    setAllData(data);

    const kasual = data.filter(
      (item) => item.label === "Pengunjung Kasual",
    ).length;

    const sesekali = data.filter(
      (item) => item.label === "Pengunjung Sesekali",
    ).length;

    const aktif = data.filter(
      (item) => item.label === "Pengunjung Aktif Sosial",
    ).length;

    const total = data.length;

    setStats({
      total,
      kasual,
      sesekali,
      aktif,

      kasualPercent: total > 0 ? Math.round((kasual / total) * 100) : 0,

      sesekaliPercent: total > 0 ? Math.round((sesekali / total) * 100) : 0,

      aktifPercent: total > 0 ? Math.round((aktif / total) * 100) : 0,
    });
  };

  const filteredData =
    selectedCluster === "Semua"
      ? allData
      : allData.filter((item) => item.label === selectedCluster);

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0f1a] text-white">
      <header className="border-b border-[#2a2f4a] bg-[#141726] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto min-h-[70px] flex items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-black text-blue-400">
              Dashboard Statistik
            </h1>

            <p className="text-s text-gray-500">Politeknik Caltex Riau</p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl bg-[#1c2035] border border-[#2a2f4a]"
          >
            ← Kembali
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-14">
        <div className="glass rounded-3xl p-10 fade-up">
          <h1 className="text-5xl font-black leading-tight glow-text">
            Statistik Aktivitas Mahasiswa
          </h1>

          <p className="text-gray-400 mt-5 max-w-2xl">
            Visualisasi hasil klasifikasi mahasiswa berdasarkan data survei.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {/* SEMUA */}
            <button
              onClick={() => setSelectedCluster("Semua")}
              className={`
      rounded-2xl
      p-5
      border
      duration-300
      text-left
      ${
        selectedCluster === "Semua"
          ? "border-blue-500 bg-blue-500/10"
          : "border-[#2a2f4a] bg-[#1c2035]"
      }
    `}
            >
              <h2 className="text-4xl font-black text-blue-400">
                {stats.total}
              </h2>

              <p className="text-gray-400 mt-2">Total Responden</p>
            </button>

            {/* KASUAL */}
            <button
              onClick={() => setSelectedCluster("Pengunjung Kasual")}
              className={`
      rounded-2xl
      p-5
      border
      duration-300
      text-left
      ${
        selectedCluster === "Pengunjung Kasual"
          ? "border-green-500 bg-green-500/10"
          : "border-[#2a2f4a] bg-[#1c2035]"
      }
    `}
            >
              <h2 className="text-4xl font-black text-green-400">
                {stats.kasual}
              </h2>

              <p className="text-gray-400 mt-2">Pengunjung Kasual</p>
            </button>

            {/* SESEKALI */}
            <button
              onClick={() => setSelectedCluster("Pengunjung Sesekali")}
              className={`
      rounded-2xl
      p-5
      border
      duration-300
      text-left
      ${
        selectedCluster === "Pengunjung Sesekali"
          ? "border-yellow-500 bg-yellow-500/10"
          : "border-[#2a2f4a] bg-[#1c2035]"
      }
    `}
            >
              <h2 className="text-4xl font-black text-yellow-400">
                {stats.sesekali}
              </h2>

              <p className="text-gray-400 mt-2">Pengunjung Sesekali</p>
            </button>

            {/* AKTIF */}
            <button
              onClick={() => setSelectedCluster("Pengunjung Aktif Sosial")}
              className={`
      rounded-2xl
      p-5
      border
      duration-300
      text-left
      ${
        selectedCluster === "Pengunjung Aktif Sosial"
          ? "border-purple-500 bg-purple-500/10"
          : "border-[#2a2f4a] bg-[#1c2035]"
      }
    `}
            >
              <h2 className="text-4xl font-black text-purple-400">
                {stats.aktif}
              </h2>

              <p className="text-gray-400 mt-2">Pengunjung Aktif Sosial</p>
            </button>
          </div>
          <div
            className="
    mt-10
    glass
    rounded-3xl
    p-8
    border
    border-white/10
    min-h-[650px]
    flex
    flex-col
  "
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black">Data Responden</h2>

                <p className="text-gray-400 text-sm mt-1">
                  Filter:
                  <span className="text-blue-400 ml-2">{selectedCluster}</span>
                </p>
              </div>

              <div className="text-sm text-gray-500">
                {filteredData.length} Data
              </div>
            </div>
            <div className="overflow-auto flex-1 pr-2">
              <table className="w-full min-w-[1100px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-gray-400 text-sm uppercase tracking-wider">
                    <th className="pb-4 px-6 font-semibold">Nama</th>

                    <th className="pb-4 px-6 font-semibold">Prodi</th>

                    <th className="pb-4 px-6 font-semibold">Frekuensi</th>

                    <th className="pb-4 px-6 font-semibold">Tujuan</th>

                    <th className="pb-4 px-6 font-semibold">Aktivitas</th>

                    <th className="pb-4 px-6 font-semibold">Cluster</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={index}
                        className="
    bg-white/[0.03]
    hover:bg-white/[0.06]
    transition
    duration-300
  "
                      >
                        {/* NAMA */}
                        <td className="px-6 py-5 text-white align-middle">
                          {item.nama || "-"}
                        </td>

                        {/* PRODI */}
                        <td className="px-6 py-5 text-white align-middle">
                          {item.prodi || "-"}
                        </td>

                        {/* FREKUENSI */}
                        <td className="px-6 py-5 text-white align-middle">
                          {item.frekuensi || "-"}
                        </td>

                        {/* TUJUAN */}
                        <td className="px-6 py-5 text-white align-middle">
                          {item.tujuan || "-"}
                        </td>

                        {/* AKTIVITAS */}
                        <td className="px-6 py-5 text-white align-middle">
                          {item.aktivitas || "-"}
                        </td>

                        {/* CLUSTER */}
                        <td className="py-4">
                          <span
                            className="
              px-3
              py-1
              rounded-full
              text-sm
              bg-blue-500/10
              text-blue-400
            "
                          >
                            {item.label || "-"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="
          py-10
          text-center
          text-gray-500
        "
                      >
                        Tidak ada data 😭
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
