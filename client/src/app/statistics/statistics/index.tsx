import React from "react";
import Row1 from "./Row1";
import Row2 from "./Row2";
import Row3 from "./Row3";

const Dashboard = () => {
  return (
    <div className="w-full h-full font-mulish">
      <div className="grid gap-4 w-full">
        
        {/* Summary Section - All screen sizes */}
        <div className="bg-[#AEC3FF]/20 dark:bg-[#1d2328] rounded-xl p-3">
          <Row3 section="j" />
        </div>
        
        {/* Large screens layout */}
        <div className="hidden xl:grid xl:grid-cols-3 xl:gap-4 xl:grid-flow-row">
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
        <div className="hidden md:grid md:grid-cols-2 xl:hidden md:gap-4">
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
        <div className="md:hidden flex flex-col gap-4">
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
