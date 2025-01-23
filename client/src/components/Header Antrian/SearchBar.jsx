import React from 'react';
import LordIcon from "../Design/LordIcon";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search by customer name or treatment..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-[#E6EFF9] shadow-[4px_4px_10px_rgba(0,0,0,0.15)] outline outline-1 outline-white text-gray-700 placeholder-gray-400 placeholder:text-sm"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
        <LordIcon
          src="https://cdn.lordicon.com/wjyqkiew.json"
          trigger="loop"
          state="loop-oscillate"
          style={{ width: "25px", height: "25px" }}
        />
      </div>
    </div>
  );
};

export default SearchBar; 