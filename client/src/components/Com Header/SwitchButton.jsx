import { useState } from "react";
import Modal from "../Modal/SwitchModal"; // Gunakan modal general yang kamu pakai
import SwitchRole from "./SwitchRole";
import AnimatedButton from "../Design/AnimatedButton";
import LordIcon from "../Design/LordIcon";

const SwitchRoleModalTrigger = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AnimatedButton
        onClick={() => setIsModalOpen(true)}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white"
        title="Switch Role"
      >
        <LordIcon
                    src="https://cdn.lordicon.com/urswgamh.json"
                    trigger="loop"
                    colors="primary:#ffffff,secondary:#ffffff"
                    size={30}
                    style={{ width: "45px", height: "45px" }}
                  />
      </AnimatedButton>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pilih peran anda"
      >
        <div className="mt-4 mb-2">
          <SwitchRole />
        </div>
      </Modal>
    </>
  );
};

export default SwitchRoleModalTrigger;
