import { useEffect, useState } from 'react';

const FuelCalculationModal = ({ isOpen, onClose, onConfirm, data }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const distance = data.odoEnd - data.odoStart;
  const fuelUsage = distance / 45; // Liter
  const fuelCost = fuelUsage * 10000; // Rupiah

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center z-50
        ${showOverlay ? 'bg-opacity-50' : 'bg-opacity-0'}`}
    >
      <div 
        className={`bg-white rounded-2xl p-6 w-[90%] max-w-md transform transition-all duration-300
          ${showModal ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-full scale-150'}`}
      >
        <h3 className="font-bebas text-2xl mb-4">Ringkasan Penggunaan BBM</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600 font-montserrat">ODO Start:</span>
            <span className="font-medium font-montserrat">{data.odoStart} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-montserrat">ODO End:</span>
            <span className="font-medium font-montserrat">{data.odoEnd} km</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600 font-montserrat">Jarak Tempuh:</span>
            <span className="font-medium font-montserrat">{distance} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-montserrat">Penggunaan Bensin:</span>
            <span className="font-medium font-montserrat">{fuelUsage.toFixed(2)} liter</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600 font-montserrat">Harga Pertalite:</span>
            <span className="font-montserrat">Rp 10.000/liter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 font-montserrat">Biaya Bensin:</span>
            <span className="font-bold font-montserrat">Rp {fuelCost.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all font-montserrat"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(fuelCost)}
            className="px-4 py-2 rounded-lg bg-[#51A7D9] text-white hover:bg-opacity-90 transition-all font-montserrat"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelCalculationModal; 