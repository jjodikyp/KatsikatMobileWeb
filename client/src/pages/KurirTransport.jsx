import { useState } from "react";
import { useNavigate } from "react-router-dom";
import goodImage from "../assets/images/good.png";
import axios from "axios";
import FuelCalculationModal from "../components/FuelCalculationModal";

const KurirTransport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    odoStart: "",
    odoEnd: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError("");
    }
  };

  const handleSubmit = () => {
    // Validasi input
    if (!formData.odoStart || !formData.odoEnd) {
      setError("Semua field harus diisi");
      return;
    }

    if (parseInt(formData.odoStart) >= parseInt(formData.odoEnd)) {
      setError("ODO End harus lebih besar dari ODO Start");
      return;
    }

    setShowModal(true);
  };

  const handleConfirm = async (fuelCost) => {
    try {
      setLoading(true);

      const requestData = {
        odoStart: Number(formData.odoStart),
        odoEnd: Number(formData.odoEnd),
        totalFuelCost: fuelCost,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/kurir/transport`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        navigate("/kurir/next-page");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setError(
        error.response?.data?.message || "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto pt-10">
        <img
          src={goodImage}
          alt="Transport"
          className="w-[130px] h-auto object-contain mx-auto mb-6"
        />

        <h1 className="text-3xl font-bebas text-center mb-2">
          Pendataan Biaya Transportasi
        </h1>

        <p className="font-montserrat text-center text-gray-600 mb-8">
          Isi data sesuai dengan bukti yang akan diupload pada akhir sesi!
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 p-4 max-w-xs mx-auto">
          <div>
            <label className="block font-montserrat text-sm text-gray-600 mb-1">
              ODO Start
            </label>
            <input
              type="text"
              name="odoStart"
              value={formData.odoStart}
              onChange={handleInputChange}
              className="h-10 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 font-montserrat"
              placeholder="Masukkan jarak mulai"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-montserrat text-sm text-gray-600 mb-1">
              ODO End
            </label>
            <input
              type="text"
              name="odoEnd"
              value={formData.odoEnd}
              onChange={handleInputChange}
              className="h-10 w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 font-montserrat"
              placeholder="Masukkan jarak selesai"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`h-10 w-full py-3 bg-[#51A7D9] text-white rounded-xl font-medium transition-all mt-6 font-montserrat text-center flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"
            }`}
          >
            {loading ? "Menyimpan..." : "Selanjutnya"}
          </button>
        </div>
      </div>

      <FuelCalculationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        data={formData}
      />
    </div>
  );
};

export default KurirTransport;
