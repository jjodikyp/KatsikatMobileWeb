import { useEffect, useState } from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowOverlay(true);
      // Tambah delay kecil untuk memastikan overlay muncul dulu
      setTimeout(() => {
        setShowModal(true);
      }, 100);
    } else {
      setShowModal(false);
      // Tunggu animasi modal selesai sebelum sembunyikan overlay
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
            onClick={onConfirm}
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