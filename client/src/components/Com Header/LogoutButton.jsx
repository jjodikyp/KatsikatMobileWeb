import AnimatedButton from "../Design/AnimatedButton";

const LogoutButton = ({ onClick }) => {
  const getTitleByPath = () => {
    const path = location.pathname;

    if (path.includes("berandakasir")) {
      return "Kasir";
    } else if (path.includes("berandakurir")) {
      return "Kurir";
    } else if (path.includes("berandateknisi")) {
      return "Teknisi";
    }
    return null;
  };

  const title = getTitleByPath();

  // Jika title tidak ada judul page, return null
  if (!title) return null;

  return (
    <AnimatedButton
      onClick={onClick}
      className="w-full h-[41px] p-4 rounded-full flex items-center justify-center bg-[#FD8087] transition-all shadow-2xl shadow-white opacity-100 gap-2 font-bebas text-xl text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="white"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
        />
      </svg>
      | {title}
    </AnimatedButton>
  );
};

export default LogoutButton;
