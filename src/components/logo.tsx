import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center">
      <div className="relative w-[120px] h-[40px]">
        <img
          src="/Group 3.svg"
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </Link>
  );
} 