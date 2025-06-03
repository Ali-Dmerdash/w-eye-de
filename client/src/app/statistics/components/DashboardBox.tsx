import React from "react";

type DashboardBoxProps = {
  className?: string;
  children: React.ReactNode;
};

const DashboardBox: React.FC<DashboardBoxProps> = ({ className = "", children }) => {
  return (
    <div className={`h-full w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-xl relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
      </div>
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default DashboardBox;
