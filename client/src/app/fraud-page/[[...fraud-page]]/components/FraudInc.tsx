"use client"

export default function FraudInc() {
  return (
    <div className="bg-[#1d2328] text-white font-bayon p-6 rounded-lg h-full flex flex-col">
      {/* Fraud Incidence Rate Box */}
      <div className="shadow-lg">
        <div className="bg-[#243461] shadow-inner-custom p-6 rounded-lg text-center mb-6">
          <h2 className="text-2xl tracking-wider text-white mb-2">FRAUD INCIDENCE RATE</h2>
          <p className="text-5xl text-red-600">90%</p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-700 mb-6"></div>

      {/* Common Fraudulent Patterns */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold mb-4 font-mulish">COMMON FRAUDULENT PATTERNS</h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl  text-white">60%</span>
              <span className="text-gray-400 uppercase text-sm font-mulish">CARD-NOT-PRESENT TRANSACTIONS.</span>
            </div>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl  text-white">25%</span>
              <span className="text-gray-400 uppercase text-sm font-mulish">TRANSACTIONS FROM HIGH-RISK COUNTRIES.</span>
            </div>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl  text-white">15%</span>
              <span className="text-gray-400 uppercase text-sm font-mulish">ACCOUNT TAKEOVERS</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

