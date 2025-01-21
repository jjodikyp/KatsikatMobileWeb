import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const CekGaji = () => {
  const navigate = useNavigate();
  const [gajiData, setGajiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchGajiData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dummyData = {
        pendapatan: {
          gajiPokok: 2500000,
          bonus: Math.floor(Math.random() * 600000),
        },
        potongan: {
          totalAlpha: 3,
          totalIzin: 2,
          gajiPerHari: 2500000 / 22,
          potonganAlpha: 0,
          potonganIzin: 0,
        },
        totalPendapatan: 0
      };

      dummyData.potongan.potonganAlpha = dummyData.potongan.totalAlpha * (dummyData.potongan.gajiPerHari * 1.3);
      dummyData.potongan.potonganIzin = dummyData.potongan.totalIzin * dummyData.potongan.gajiPerHari;
      
      dummyData.totalPendapatan = (dummyData.pendapatan.gajiPokok + dummyData.pendapatan.bonus) - 
        (dummyData.potongan.potonganAlpha + dummyData.potongan.potonganIzin);

      setGajiData(dummyData);
    } catch (error) {
      console.error('Error fetching gaji data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGajiData();
  }, [month, year]); // Refetch when month/year changes

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleBack = () => {
    navigate('/pilih-role');
  };

  const handleSetCurrentDate = () => {
    const currentDate = new Date();
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthNumber - 1];
  };

  const handleDownloadSlip = () => {
    // Simulasi download file
    alert('Mengunduh slip gaji...');
  };

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#E6EFF9] font-montserrat">
      <Header />
      <main className="pt-24 px-4 md:px-10 pb-10 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="p-2 bg-[#E2F2FF] rounded-full shadow-[4px_4px_10px_rgba(0,0,0,0.15)] hover:bg-[#d5e9fa] transition-colors w-[41px] h-[41px] flex items-center justify-center outline outline-2 outline-white"
            title="Kembali ke Pilih Role"
          >
            <img 
              src="/src/assets/images/Home Button.gif" 
              alt="Beranda"
              className="w-5 h-5"
            />
          </button>
          <h1 className="text-2xl font-bebas">Penghasilan & Slip Gaji</h1>
        </div>

        {/* Rentang Waktu */}
        <div className="mb-4 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] mt-4 opacity-100 outline outline-1 outline-white">
          <h2 className="text-2xl font-bebas mb-3">Rentang Waktu</h2>
          <div className="flex gap-2">
            <input
              type="month"
              value={`${year}-${month < 10 ? '0' + month : month}`}
              onChange={(e) => {
                const [selectedYear, selectedMonth] = e.target.value.split('-');
                setYear(parseInt(selectedYear));
                setMonth(parseInt(selectedMonth));
              }}
              className="flex-1 bg-[#E6EFF9] text-gray-600 shadow shadow-white opacity-100 outline outline-1 outline-white w-full p-2 rounded-xl font-semibold"
            />
            <button
              onClick={handleSetCurrentDate}
              className="bg-[#57AEFF] text-white shadow shadow-white opacity-100 outline outline-1 outline-white px-4 rounded-xl font-semibold hover:bg-[#4499e9] transition-colors"
            >
              Sekarang
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <>
            {/* Bagian 1: Total Pendapatan */}
            <div className="mb-4 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white">
              <h2 className="text-2xl font-bebas mb-3">Total Pendapatan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                  <div className="text-sm text-gray-600">Gaji Pokok</div>
                  <div className="text-2xl font-semibold text-[#2E7CF6]">{formatCurrency(gajiData.pendapatan.gajiPokok)}</div>
                </div>
                <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                  <div className="text-sm text-gray-600">Bonus</div>
                  <div className="text-2xl font-semibold text-[#2E7CF6]">{formatCurrency(gajiData.pendapatan.bonus)}</div>
                </div>
              </div>
            </div>

            {/* Bagian 2: Potongan Bulanan */}
            <div className="mb-4 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white">
              <h2 className="text-2xl font-bebas mb-3">Potongan Bulanan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-inner shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                  <div className="text-sm text-gray-600">Potongan Alpha ({gajiData.potongan.totalAlpha} hari)</div>
                  <div className="text-2xl font-semibold text-red-600">{formatCurrency(gajiData.potongan.potonganAlpha)}</div>
                </div>
                <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-inner shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                  <div className="text-sm text-gray-600">Potongan Izin ({gajiData.potongan.totalIzin} hari)</div>
                  <div className="text-2xl font-semibold text-red-600">{formatCurrency(gajiData.potongan.potonganIzin)}</div>
                </div>
              </div>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-inner shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Total Potongan</div>
                <div className="text-2xl font-semibold text-red-600">
                  {formatCurrency(gajiData.potongan.potonganAlpha + gajiData.potongan.potonganIzin)}
                </div>
              </div>
            </div>

            {/* Bagian 3: Grand Total */}
            <div className="bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white">
              <h2 className="text-2xl font-bebas mb-3">Total Gaji Bulan Ini</h2>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="text-sm text-gray-600">Grand Total</div>
                <div className="text-2xl font-semibold text-blue-600">{formatCurrency(gajiData.totalPendapatan)}</div>
              </div>
            </div>

            {/* Setelah Grand Total, tambahkan section Slip Gaji */}
            <div className="mt-4 bg-[#E2F2FF] rounded-3xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.15)] opacity-100 outline outline-1 outline-white">
              <h2 className="text-2xl font-bebas mb-3">Slip Gaji</h2>
              <div className="bg-[#E6EFF9] p-4 rounded-xl shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/src/assets/images/pdf.svg" 
                      alt="PDF Icon"
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        Slip Gaji Bulan {getMonthName(month)} {year}
                      </div>
                      <div className="text-sm text-gray-500">PDF • 245 KB</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadSlip}
                    className="flex items-center gap-2 bg-[#57AEFF] text-white px-4 py-2 rounded-xl hover:bg-[#4499e9] transition-colors shadow-md outline outline-1 outline-white"
                  >
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CekGaji;