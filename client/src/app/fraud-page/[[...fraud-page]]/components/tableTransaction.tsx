"use client";
import Image from "next/image"; // Keep existing imports from new code
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Keep existing imports from new code
import { useState } from "react"; // Keep existing imports from new code
import fraudData from "../fraudData.json"; // Import the fraud data JSON file

// Use transactions data from the imported JSON file
const transactions = fraudData.transactions || [];

// Keep the component name from the new code
export default function ProjectsTable() {
  return (
    // Keep the existing structure and styling from the new code
    <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          {/* Update transaction count source */}
          <p className="text-sm text-emerald-500">
            {transactions.length} transactions found
          </p>
        </div>
        {/* Keep existing button */}
        <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Keep existing table structure */}
      <div className="overflow-x-auto flex-grow text-xs text-center font-mulish">
        <table className="w-full">
          <thead>
            {/* Keep existing headers */}
            <tr className="text-xs text-gray-400 uppercase">
              <th className="px-2.5 py-3">name</th>
              <th className="px-2.5 py-3">amount</th>
              <th className="px-2.5 py-3">currency</th>
              <th className="px-2.5 py-3">flag</th>
              <th className="px-2.5 py-3">date</th>
              <th className="px-2.5 py-3">description</th>
              <th className="px-2.5 py-3">category</th>
              <th className="px-2.5 py-3">type</th>
              <th className="px-2.5 py-3">fraud rate</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {/* Map over transactions from JSON data */}
            {transactions.map((transaction, index) => (
              // Use index as key if no unique ID is guaranteed in JSON
              <tr key={index} className="hover:bg-gray-800/50">
                <td className="px-2.5 py-3 font-medium">{transaction.name}</td>
                {/* Ensure amount is formatted correctly */}
                <td className="px-2.5 py-3">
                  $
                  {typeof transaction.amount === "number"
                    ? transaction.amount.toFixed(2)
                    : transaction.amount}
                </td>
                <td className="px-2.5 py-3">{transaction.currency}</td>
                <td className="px-2.5 py-3">
                  {/* Adjust flag styling based on JSON values (lowercase) */}
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full ${
                      transaction.flag === "orange"
                        ? "bg-orange-500/20 text-orange-300"
                        : transaction.flag === "red" // Assuming 'red' might appear, handle like new code
                        ? "bg-red-500/20 text-red-300"
                        : transaction.flag === "green"
                        ? "bg-green-500/20 text-green-300" // Added green based on JSON
                        : "bg-gray-500/20 text-gray-300" // Default/other flags
                    }`}
                  >
                    {transaction.flag}
                  </span>
                </td>
                {/* Use date directly from JSON */}
                <td className="px-2.5 py-3">{transaction.date}</td>
                <td className="px-2.5 py-3 text-gray-400">
                  {transaction.description}
                </td>
                <td className="px-2.5 py-3">{transaction.category}</td>
                <td className="px-2.5 py-3">
                  <span className={`capitalize`}>
                    {transaction.type.toLowerCase()}
                  </span>
                </td>
                <td className="px-2.5 py-3">
                  {/* Use fraud_rate from JSON and adjust styling logic */}
                  <span
                    className={`${
                      transaction.fraud_rate > 0.5
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {(transaction.fraud_rate * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
