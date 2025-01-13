import { useEffect, useState } from 'react';
import akhirSound from "../assets/sound/akhir.mp3";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fungsi untuk memainkan suara
  const playAkhirSound = async () => {
    try {
      const audio = new Audio(akhirSound);
      audio.volume = 0.7; // Set ke 70%
      
      // Tambahkan event listener untuk debugging
      audio.addEventListener('play', () => {
        console.log('Audio akhir mulai diputar');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Error audio akhir:', e);
      });

      try {
        await audio.play();
        console.log("Sound effect akhir berhasil diputar");
      } catch (playError) {
        console.error("Gagal memutar sound akhir:", playError);
      }
    } catch (error) {
      console.error("Error setup audio akhir:", error);
    }
  };

  // Modifikasi handler untuk onConfirm
  const handleConfirm = async () => {
    try {
      await playAkhirSound();
      onConfirm();
    } catch (error) {
      console.error("Error saat memainkan suara dan konfirmasi:", error);
      onConfirm(); // Tetap jalankan onConfirm meskipun suara gagal
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowOverlay(true);
      setTimeout(() => {
        setShowModal(true);
      }, 100);
    } else {
      setShowModal(false);
      setTimeout(() => {
        setShowOverlay(false);
      }, 300);
    }
  }, [isOpen]);

  if (!showOverlay) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center z-50
        ${showOverlay ? 'bg-opacity-50' : 'bg-opacity-0'}`}
    >
      <div 
        className={`bg-white rounded-2xl p-6 w-[90%] max-w-md transform transition-all duration-300
          ${showModal ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-full scale-150'}`}
      >
        <h3 className="text-2xl font-bebas mb-4">{title}</h3>
        <p className="text-gray-600 mb-6 font-montserrat">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-montserrat"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all font-montserrat"
          >
            Ya
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 