import React from "react";
import FlexBetween from "./FlexBetween";

type Props = {
  title: string;
  sideText: string;
  subtitle?: string;
  icon?: React.ReactNode;
};

const BoxHeader = ({ icon, title, subtitle, sideText }: Props) => {
  return (
    <FlexBetween className="text-[#15191c] dark:text-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4B65AB]/40 dark:bg-[#15191c]">
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-base font-semibold tracking-tight text-[#15191c] dark:text-white">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-[#4B65AB] dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-2.5 py-1 rounded-md bg-[#4B65AB]/30 dark:bg-[#15191c] text-[#4B65AB] dark:text-blue-400 text-sm font-bold">
        {sideText}
      </div>
    </FlexBetween>
  );
};

export default BoxHeader;
