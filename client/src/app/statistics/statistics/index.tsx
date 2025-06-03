import React from "react";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

const Dashboard = () => {
  return (
    <div className="w-full h-full font-mulish">
      <div className="grid gap-6 w-full">
        
        {/* Summary Section - All screen sizes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-4 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
          </div>
          <div className="relative z-10">
            <Row3 section="j" />
          </div>
        </div>
        
        {/* Large screens layout */}
        <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6 xl:grid-flow-row">
          <div className="h-[350px]">
            <Row1 section="a" />
          </div>
          <div className="h-[350px]">
            <Row1 section="b" />
          </div>
          <div className="h-[350px]">
            <Row1 section="c" />
          </div>
          <div className="h-[350px]">
            <Row2 section="d" />
          </div>
          <div className="h-[350px]">
            <Row2 section="e" />
          </div>
          <div className="h-[350px]">
            <Row2 section="f" />
          </div>
          <div className="h-[350px]">
            <Row3 section="g" />
          </div>
          <div className="h-[350px]">
            <Row3 section="h" />
          </div>
          <div className="h-[350px]">
            <Row3 section="i" />
          </div>
        </div>

        {/* Medium screens layout */}
        <div className="hidden md:grid md:grid-cols-2 xl:hidden md:gap-6">
          <div className="h-[350px]">
            <Row1 section="a" />
          </div>
          <div className="h-[350px]">
            <Row1 section="b" />
          </div>
          <div className="h-[350px]">
            <Row1 section="c" />
          </div>
          <div className="h-[350px]">
            <Row2 section="d" />
          </div>
          <div className="h-[350px]">
            <Row2 section="e" />
          </div>
          <div className="h-[350px]">
            <Row2 section="f" />
          </div>
          <div className="h-[350px]">
            <Row3 section="g" />
          </div>
          <div className="h-[350px]">
            <Row3 section="h" />
          </div>
          <div className="md:col-span-2 h-[350px]">
            <Row3 section="i" />
          </div>
        </div>

        {/* Small screens layout */}
        <div className="md:hidden flex flex-col gap-6">
          <div className="h-[350px]">
            <Row1 section="a" />
          </div>
          <div className="h-[350px]">
            <Row1 section="b" />
          </div>
          <div className="h-[350px]">
            <Row1 section="c" />
          </div>
          <div className="h-[350px]">
            <Row2 section="d" />
          </div>
          <div className="h-[350px]">
            <Row2 section="e" />
          </div>
          <div className="h-[350px]">
            <Row2 section="f" />
          </div>
          <div className="h-[350px]">
            <Row3 section="g" />
          </div>
          <div className="h-[350px]">
            <Row3 section="h" />
          </div>
          <div className="h-[350px]">
            <Row3 section="i" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
