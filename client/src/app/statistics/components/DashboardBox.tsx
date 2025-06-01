import React from "react";

type DashboardBoxProps = {
  className?: string;
  children: React.ReactNode;
};

const DashboardBox: React.FC<DashboardBoxProps> = ({ className = "", children }) => {
  return (
    <div className={`h-full w-full bg-[#AEC3FF]/20 dark:bg-[#1d2328] rounded-xl border border-[#AEC3FF]/30 dark:border-gray-700/30 shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default DashboardBox;
