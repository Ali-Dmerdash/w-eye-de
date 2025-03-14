// "use client"

// export default function FraudMetrics() {
//   return (
//     <div className="p-3 bg-[#1d2328] rounded-lg h-full flex flex-col">
//       <div className="mb-2">
//         <h2 className="text-base font-semibold text-white">FRAUD INCIDENCE RATE</h2>
//         <p className="text-4xl font-bold text-red-500 mt-1">90%</p>
//       </div>

//       <div className="flex-grow space-y-3">
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-400">CARD-NOT-PRESENT TRANSACTIONS</span>
//           <span className="text-xs text-white">60%</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-400">TRANSACTIONS FROM HIGH-RISK COUNTRIES</span>
//           <span className="text-xs text-white">25%</span>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-xs text-gray-400">ACCOUNT TAKEOVERS</span>
//           <span className="text-xs text-white">15%</span>
//         </div>
//       </div>

//       <div className="mt-auto">
//         <button className="w-full py-2 text-xs text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
//           View Details
//         </button>
//       </div>
//     </div>
//   )
// }
"use client"

export default function FraudInc() {
  return (
    <div className="bg-[#1d2328] text-white p-6 rounded-lg h-full flex flex-col">
      {/* Fraud Incidence Rate Box */}
      <div className="bg-[#243461] p-6 rounded-lg text-center mb-6">
        <h2 className="text-lg font-bold tracking-wider text-white mb-2">FRAUD INCIDENCE RATE</h2>
        <p className="text-5xl font-bold text-red-600">90%</p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-700 mb-6"></div>

      {/* Common Fraudulent Patterns */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-4">COMMON FRAUDULENT PATTERNS</h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">60%</span>
              <span className="text-gray-400 uppercase text-sm">CARD-NOT-PRESENT TRANSACTIONS.</span>
            </div>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">25%</span>
              <span className="text-gray-400 uppercase text-sm">TRANSACTIONS FROM HIGH-RISK COUNTRIES.</span>
            </div>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">15%</span>
              <span className="text-gray-400 uppercase text-sm">ACCOUNT TAKEOVERS</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

