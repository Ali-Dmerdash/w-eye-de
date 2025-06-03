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
    <FlexBetween className="text-gray-900 dark:text-gray-200 px-4 py-4 border-b border-purple-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 shadow-sm">
            {icon}
          </div>
        )}
        <div>
          <h4 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-semibold border border-purple-200 dark:border-purple-800/30">
        {sideText}
      </div>
    </FlexBetween>
  );
};

export default BoxHeader;
