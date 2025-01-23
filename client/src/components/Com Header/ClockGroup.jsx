import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import LordIcon from "../Design/LordIcon";

const ClockGroup = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 outline outline-1 outline-black px-4 py-2 rounded-full h-[41px]">
      <LordIcon
        src="https://cdn.lordicon.com/warimioc.json"
        trigger="loop"
        state="loop-oscillate"
        style={{ width: "25px", height: "25px" }}
      />
      <span className="font-bebas text-xl text-[#383838]">
        {format(currentTime, "HH:mm:ss", { locale: id })}
      </span>
    </div>
  );
};

export default ClockGroup; 