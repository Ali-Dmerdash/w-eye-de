"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import TableSkeleton from "@/components/ui/tableSkeleton";

// Define interfaces for the expected data structure
interface Transaction {
  _id?: string; // Optional: if your API returns the _id string
  name: string;
  amount: number | string; // Allow string initially if data might not be clean
  currency: string;
  flag: string;
  date: string;
  description: string;
  category: string;
  type: string;
  fraud_rate: number;
}

interface FraudData {
  transactions: Transaction[];
  // Add other top-level fields if needed
}

export default function ProjectsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/fraud-data");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FraudData = await response.json();
        setTransactions(data.transactions || []); // Use fetched transactions
      } catch (e: any) {
        console.error("Failed to fetch transaction data:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="text-white p-8 bg-[#1d2328] rounded-lg h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          <p className="text-sm text-emerald-500">
            Loading transactions...
          </p>
        </div>
        <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
        <TableSkeleton columns={9} rows={5} />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-8 bg-[#1d2328] rounded-lg h-full flex items-center justify-center">
        Error: {error}
      </div>
    );

  return (
    <div className="p-8 bg-[#1d2328] rounded-lg h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          <p className="text-sm text-emerald-500">
            {transactions.length} transactions found
          </p>
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
            {transactions.map((transaction, index) => (
              // Use transaction._id if available and unique, otherwise fallback to index
              <tr
                key={transaction._id || index}
                className="hover:bg-gray-800/50"
              >
                <td className="px-2.5 py-3 font-medium">{transaction.name}</td>
                <td className="px-2.5 py-3">
                  $
                  {typeof transaction.amount === "number"
                    ? transaction.amount.toFixed(2)
                    : transaction.amount}
                </td>
                <td className="px-2.5 py-3">{transaction.currency}</td>
                <td className="px-2.5 py-3">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full ${
                      transaction.flag === "orange"
                        ? "bg-orange-500/20 text-orange-300"
                        : transaction.flag === "red"
                        ? "bg-red-500/20 text-red-300"
                        : transaction.flag === "green"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {transaction.flag}
                  </span>
                </td>
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
