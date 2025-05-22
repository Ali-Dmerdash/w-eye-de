"use client";

interface ReferralCardProps {
  score: number
}

export default function ReferralCard({ score }: ReferralCardProps) {
  // Calculate the percentage for the circle
  const percentage = (score / 10) * 100
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="font-mulish rounded-lg p-6 bg-[#4B65AB] dark:bg-[#1d2328]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Referral Tracking</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-lg flex flex-col items-center justify-center p-4 shadow-lg bg-[#484B6A] dark:bg-[#243461]">
          <p className="text-[#E4E5F1] dark:text-gray-400 text-xs mb-1">Invited</p>
          <p className="text-white font-medium text-xs lg:text-sm">145 people</p>
        </div>
        <div className="rounded-lg flex flex-col items-center justify-center p-4 shadow-lg bg-[#484B6A] dark:bg-[#243461]">
          <p className="text-[#E4E5F1] dark:text-gray-400 text-xs mb-1">Invited</p>
          <p className="text-[#E4E5F1] dark:text-white font-medium text-xs md:text-sm">1,465</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#2a3441" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e63946"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white">{score}</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-2">Total Score</p>
      </div>
    </div>
  )
}

