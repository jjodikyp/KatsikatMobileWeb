import { Twirl as Hamburger } from "hamburger-react";

const UserName = ({ name, isOpen, setOpen, onToggle }) => {
  return (
    <div className="bg-gradient-to-r from-[#008A6B] to-[#00A98C] px-4 py-2 rounded-full gap-1 flex items-center h-[41px]">
      <span className="font-bebas text-xl text-white flex items-center justify-center h-full w-full text-center mb-[-2px]">
        {name ? name.split(" ").slice(0, 2).join(" ") : "Guest"}
      </span>
      <div className="flex items-center justify-center mr-[-10px] ml-[-5px]">
        <Hamburger
          toggled={isOpen}
          toggle={setOpen}
          size={17}
          color="white"
          onToggle={onToggle}
        />
      </div>
    </div>
  );
};

export default UserName; 