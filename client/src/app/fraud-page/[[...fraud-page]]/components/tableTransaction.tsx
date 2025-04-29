"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const transactions = [
  {
    id: 1,
    name: "John Doe",
    amount: 120.5,
    currency: "USD",
    flag: "Orange",
    date: "2025/01/15",
    description: "Online purchase",
    category: "Tools",
    type: "Debit",
    fraudrate: 0.12
  },
  {
    id: 2,
    name: "Abdo Magdi",
    amount: "320.75",
    currency: "USD",
    flag: "Orange",
    date: "2025/01/13",
    description: "Travel expenses",
    category: "Travel",
    type: "Debit",
    fraudrate: 0.18
  },
  {
    id: 3,
    name: "Omar",
    amount: "99999999",
    currency: "USD",
    flag: "Red",
    date: "2024/08/08",
    description: "Travel expenses",
    category: "Travel",
    type: "Debit",
    fraudrate: 0.99
  },
];



export default function ProjectsTable() {
  return (
    <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          <p className="text-sm text-emerald-500">
            {transactions.length} transactions done this month</p>
        </div>
        <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto flex-grow text-xs text-center font-mulish">
        <table className="w-full">
          <thead>
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
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-800/50">
                <td className="px-2.5 py-3 font-medium">{transaction.name}</td>
                <td className="px-2.5 py-3">${transaction.amount}</td>
                <td className="px-2.5 py-3">{transaction.currency}</td>
                <td className="px-2.5 py-3">
                  <span className={`px-2.5 py-1 text-xs rounded-full ${transaction.flag === "Orange"
                    ? "bg-orange-500/20 text-orange-300"
                    : transaction.flag === "Red"
                      ? "bg-red-500/20 text-red-300"
                      : "bg-gray-500/20 text-gray-300"
                    }`}>
                    {transaction.flag}
                  </span>
                </td>
                <td className="px-2.5 py-3">{transaction.date}</td>
                <td className="px-2.5 py-3 text-gray-400">{transaction.description}</td>
                <td className="px-2.5 py-3">{transaction.category}</td>
                <td className="px-2.5 py-3">
                  <span className={`capitalize`}>
                    {transaction.type.toLowerCase()}
                  </span>
                </td>
                <td className="px-2.5 py-3">
                  <span className={`${transaction.fraudrate > 0.5
                    ? "text-red-400"
                    : "text-green-400"
                    }`}>
                    {(transaction.fraudrate * 100).toFixed(0)}%
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