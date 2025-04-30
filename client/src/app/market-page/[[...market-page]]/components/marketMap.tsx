"use client";

import Map from "@/assets/map.png";
import Image from "next/image";
import { useState } from "react";

const LocationPin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-blue-500 mb-1"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
  </svg>
);

const locations = [
  { name: "APPLE", top: "45%", left: "15%" },
  { name: "XIAOMI", top: "30%", left: "65%" },
  { name: "SAMSUNG", top: "70%", left: "48%" },
];

export default function MarketMap() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <div className="bg-[#1d2328] rounded-xl h-[40vh] relative overflow-hidden hidden md:block shadow-inner-custom2">
      <Image src={Map} alt="Map" fill className="object-cover opacity-15 z-0" />

      {locations.map((loc) => (
        <div
          key={loc.name}
          onClick={() => setSelectedLocation(loc.name)}
          className="absolute z-10 flex flex-col items-center cursor-pointer hover:scale-125 duration-300"
          style={{ top: loc.top, left: loc.left }}
        >
          <LocationPin />
          <span className="text-xs bg-white/20 text-white font-mulish px-2 py-0.5 rounded">
            {loc.name}
          </span>
        </div>
      ))}

      {selectedLocation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#1d2328] rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedLocation(null)}
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-2 text-white">{selectedLocation} Details</h2>
            <p className="text-sm text-gray-400">This is an empty modal for {selectedLocation}.</p>
          </div>
        </div>
      )}
    </div>
  );
}
