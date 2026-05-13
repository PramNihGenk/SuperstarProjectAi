import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f1a] px-4">
      <div className="w-full max-w-md bg-[#141726] border border-[#2a2f4a] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">SiKantin PCR</h1>

          <p className="text-[#7b82a8] mt-2">Sistem Klasifikasi Mahasiswa</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] transition-all"
        >
          Login
        </button>
      </div>
    </div>
  );
}
