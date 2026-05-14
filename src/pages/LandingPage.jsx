import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import FormPage from "./FormPage";
import logo1 from "../assets/LogoPCR.png";
import logo2 from "../assets/Logo-ITSA.png";
import logo3 from "../assets/Logo-IDEAL.png";
import logo4 from "../assets/Logo-Unggul.png";

export default function LandingPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    aktifPercent: 0,
    kasualPercent: 0,
    sesekaliPercent: 0,
  });

  const [openForm, setOpenForm] = useState(false);

  const fetchStats = async () => {
    const { data, error } = await supabase
      .from("klasifikasi_hasil")
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("Data kosong");
      return;
    }

    console.log("DATA:", data);

    const total = data.length;

    const kasual = data.filter(
      (item) => item.label === "Pengunjung Kasual",
    ).length;

    const sesekali = data.filter(
      (item) => item.label === "Pengunjung Sesekali",
    ).length;

    const aktif = data.filter(
      (item) => item.label === "Pengunjung Aktif Sosial",
    ).length;

    setStats({
      aktifPercent: total > 0 ? Math.round((aktif / total) * 100) : 0,

      kasualPercent: total > 0 ? Math.round((kasual / total) * 100) : 0,

      sesekaliPercent: total > 0 ? Math.round((sesekali / total) * 100) : 0,
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060816] text-white">
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-500/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <header className="relative z-50 max-w-7xl mx-auto px-4 md:px-6 pt-5 md:pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* TITLE */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-5 py-2.5 shadow-lg">
            <h1 className="font-semibold tracking-wide text-sm md:text-base text-white/90 text-center">
              AI Project Group 1
            </h1>
          </div>

          {/* LOGOS */}
          <div
            className="
        flex
        flex-wrap
        justify-center
        items-center
        gap-3
        md:gap-4
        backdrop-blur-xl
        bg-white/5
        border
        border-white/10
        rounded-full
        px-4
        md:px-5
        py-2
        w-full
        md:w-auto
      "
          >
            <img
              src={logo1}
              alt="logo1"
              className="h-7 md:h-8 object-contain opacity-80"
            />

            <img
              src={logo2}
              alt="logo2"
              className="h-8 md:h-9 scale-125 md:scale-150 object-contain opacity-80"
            />

            <img
              src={logo3}
              alt="logo3"
              className="h-7 md:h-8 object-contain opacity-80"
            />

            <img
              src={logo4}
              alt="logo4"
              className="h-7 md:h-8 object-contain opacity-80"
            />
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-14 md:min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm mb-8 backdrop-blur-xl">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Decision Tree Analytics
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1] tracking-tight">
              Sistem
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Klasifikasi
              </span>
              Mahasiswa
            </h1>

            <p className="mt-8 text-gray-400 text-lg leading-relaxed max-w-xl">
              Platform klasifikasi perilaku mahasiswa berbasis AI menggunakan
              metode Decision Tree untuk menganalisis aktivitas mahasiswa di
              kantin kampus.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => setOpenForm(true)}
                className="w-full sm:w-auto group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 font-bold shadow-2xl shadow-blue-500/20 hover:scale-[1.03] duration-300 "
              >
                <span className="relative z-10">Isi Form Survei</span>

                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-white/10 duration-300" />
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 duration-300"
              >
                Lihat Statistik
              </button>
            </div>

            <div className="flex flex-wrap gap-8 mt-16">
              <div>
                <h2 className="text-3xl font-black text-blue-400">AI</h2>
                <p className="text-gray-500 text-sm mt-1">Decision Tree</p>
              </div>
              <div>
                <h2 className="text-3xl font-black text-purple-400">PCR</h2>
                <p className="text-gray-500 text-sm mt-1">Student Research</p>
              </div>
              <div>
                <h2 className="text-3xl font-black text-green-400">Smart</h2>
                <p className="text-gray-500 text-sm mt-1">Classification</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center">
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[140px]" />
            <div
              className="
                relative
                w-full
                max-w-md
                backdrop-blur-2xl
                bg-white/5
                border
                border-white/10
                rounded-[32px]
                p-8
                shadow-2xl
                animate-[float_6s_ease-in-out_infinite]
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">AI Analytics</p>

                  <h2 className="text-2xl font-black mt-1">Smart Dashboard</h2>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
                  🧠
                </div>
              </div>

              <div className="mt-10 space-y-5">
                {[
                  {
                    label: "Pengunjung Aktif Sosial",
                    value: stats.aktifPercent,
                  },
                  {
                    label: "Pengunjung Kasual",
                    value: stats.kasualPercent,
                  },
                  {
                    label: "Pengunjung Sesekali",
                    value: stats.sesekaliPercent,
                  },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">{item.label}</span>

                      <span className="font-semibold">{item.value}%</span>
                    </div>

                    <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {openForm && (
        <div
          className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/70
      backdrop-blur-md
      p-2
      md:p-4
    "
        >
          <div
            className="
        relative
        w-full
        h-full
        md:h-auto
        md:max-w-5xl
        md:max-h-[90vh]
        overflow-y-auto
        rounded-none
        md:rounded-3xl
        border
        border-white/10
        bg-[#0f172a]
        shadow-2xl
      "
          >
            <button
              onClick={() => setOpenForm(false)}
              className="
          fixed
          md:absolute
          top-4
          right-4
          z-50
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-white/10
          text-white
          hover:bg-red-500
          duration-300
        "
            >
              ✕
            </button>

            <FormPage />
          </div>
        </div>
      )}
    </div>
  );
}
