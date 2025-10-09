"use client";

import { icons } from "@/contants/icons";
import Image from "next/image";


interface Props {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ placeholder, onPress, value, onChangeText }: Props) => {
  return (
    <div className="flex items-center rounded-full bg-dark-200 px-5 py-4">
      {/* Icon */}
      <button type="button" onClick={onPress} className="shrink-0">
        <Image
          src={icons.search}
          alt="search"
          width={20}
          height={20}
          className="text-purple-400"
        />
      </button>

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText?.(e.target.value)}
        className="ml-2 flex-1 bg-transparent text-white placeholder-[#a8b5db] focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
