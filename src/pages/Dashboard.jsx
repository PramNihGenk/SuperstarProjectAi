import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [selectedCluster, setSelectedCluster] = useState("Semua");
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCluster]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0d0f1a] text-white">
      <header className="border-b border-[#2a2f4a] bg-[#141726] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto min-h-[70px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4">
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 mt-4 sm:mt-10">
        <div className="glass rounded-3xl p-5 sm:p-8 lg:p-10 fade-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight glow-text">
            Statistik Aktivitas Mahasiswa
          </h1>

          <p className="text-gray-400 mt-5 max-w-2xl">
            Visualisasi hasil klasifikasi mahasiswa berdasarkan data survei.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mt-8 sm:mt-10">
            <button
              onClick={() => setSelectedCluster("Semua")}
              className={`rounded-2xl p-4 sm:p-5 border duration-300 text-left
      ${
        selectedCluster === "Semua"
          ? "border-blue-500 bg-blue-500/10"
          : "border-[#2a2f4a] bg-[#1c2035]"
      }
    `}
            >
              <h2 className="text-3xl sm:text-4xl font-black text-blue-400">
                {stats.total}
              </h2>

              <p className="text-gray-400 mt-2">Total Responden</p>
            </button>
            <button
              onClick={() => setSelectedCluster("Pengunjung Kasual")}
              className={`rounded-2xl p-4 sm:p-5 border duration-300 text-left
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
            <button
              onClick={() => setSelectedCluster("Pengunjung Sesekali")}
              className={`rounded-2xl p-4 sm:p-5 border duration-300 text-left
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
            <button
              onClick={() => setSelectedCluster("Pengunjung Aktif Sosial")}
              className={`rounded-2xl p-4 sm:p-5 border duration-300 text-left
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
          <div className="mt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
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
          </div>
          <div className="table-scroll w-full">
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 overflow-hidden">
              <table className="w-full min-w-[950px] border-separate border-spacing-y-3 text-left">
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
                    currentData.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-white/[0.03] hover:bg-white/[0.06] transition duration-300"
                      >
                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-white align-middle">
                          {item.nama || "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-white align-middle">
                          {item.prodi || "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-white align-middle">
                          {item.frekuensi === "1"
                            ? "Jarang"
                            : item.frekuensi === "2"
                              ? "1-2x Seminggu"
                              : item.frekuensi === "3"
                                ? "3-5x Seminggu"
                                : item.frekuensi === "4"
                                  ? "Setiap Hari"
                                  : "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-white align-middle">
                          {item.tujuan || "-"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-white align-middle">
                          {item.aktivitas || "-"}
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-400">
                            {item.label || "-"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-10 text-centertext-gray-500"
                      >
                        Tidak ada data 😭
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-[#1c2035] border border-white/10 disabled:opacity-40"
            >
              ← Prev
            </button>

            <div className="text-sm text-gray-400">
              Page {currentPage} / {totalPages || 1}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 rounded-xl bg-[#1c2035] border border-white/10 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
