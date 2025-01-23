import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../Design/AnimatedButton';

const ConfirmRoleModal = ({ isOpen, onClose, selectedRole }) => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getRoleName = (role) => {
    switch (role) {
      case 'teknisi':
        return 'Technician';
      case 'kasir':
        return 'Cashier';
      case 'kurir':
        return 'Courier';
      default:
        return '';
    }
  };

  const handleConfirm = () => {
    switch (selectedRole) {
      case 'teknisi':
        navigate('/berandateknisi');
        break;
      case 'kasir':
        navigate('/berandakasir');
        break;
      case 'kurir':
        navigate('/berandakurir');
        break;
      default:
        break;
    }
    onClose();
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
        <h2 className="text-2xl font-bebas text-center mb-4">Role Confirmation</h2>
        <p className="text-center mb-6 font-montserrat">
          You have selected the role as <span className="font-bold">{getRoleName(selectedRole)}</span>.
          Are you sure with this selection?
        </p>
        <div className="flex gap-4">
          <AnimatedButton
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors font-montserrat text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white items-center justify-center"
          >
            Back
          </AnimatedButton>
          <AnimatedButton
            onClick={handleConfirm}
            className="flex-1 py-2 px-4 rounded-xl bg-[#57AEFF] text-white hover:bg-opacity-90 transition-colors font-montserrat text-sm shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white items-center justify-center"
          >
            Continue
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRoleModal; 