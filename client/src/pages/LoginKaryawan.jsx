import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginKaryawan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Response login:", response.data);

      if (response.data.success) {
        const userData = response.data.user;

        // Simpan data user lengkap ke localStorage sesuai struktur yang benar
        localStorage.setItem("user", JSON.stringify({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          photo: userData.photo || null
        }));
        localStorage.setItem("token", response.data.token);

        // Redirect ke beranda
        navigate("/absensi");
      } else {
        setError(response.data.message || "Email atau password tidak valid");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.message || "Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-center items-center bg-white px-10 sm:px-0 overflow-y-auto">
      <div className="w-full sm:w-[380px] p-6 sm:p-8 my-auto bg-white rounded-3xl p-4 shadow-2xl shadow-grey opacity-100 outline outline-2 outline-white">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bebas font-normal text-gray-800 tracking-wide">
          LOGIN AS EMPLOYEE
          </h2>
          <p className="mt-2 text-xs text-gray-600 px-1 font-montserrat">
          Please enter your data below to access your account!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-montserrat">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <span className="text-gray-500 text-lg">@</span>
            </div>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full pl-12 pr-3 py-3 sm:py-3.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base placeholder:text-sm font-montserrat"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              inputMode="email"
              autoCapitalize="none"
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              className="placeholder:text-sm block w-full pl-12 pr-3 py-3 sm:py-3.5 border border-gray-200 rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base font-montserrat"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[40px] py-3 sm:py-3.5 px-4 mt-2 bg-[#57AEFF] text-white rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white font-montserrat font-semibold flex items-center justify-center"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginKaryawan;
