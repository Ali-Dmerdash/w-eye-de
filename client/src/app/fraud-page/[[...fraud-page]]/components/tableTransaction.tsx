"use client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useGetFraudDataQuery } from "@/state/api"; // Import the Redux hook
import {
  FraudModelResponse,
  Transaction,
  ApiColumnDefinition,
} from "@/state/type"; // Import shared types

// Helper function to get a safe error message string
function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred";
  }
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      // Handle RTK Query error structure
      let details = "";
      if (
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        details = error.data.message;
      } else if ("error" in error && typeof error.error === "string") {
        details = error.error;
      }
      return `Error ${error.status}${details ? ": " + details : ""}`;
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  // Fallback for other types of errors or if message is not a string
  try {
    return String(error);
  } catch {
    return "An unknown error occurred";
  }
}

// Simple inline skeleton loader (remains the same)
const TableSkeleton = ({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) => {
  return (
    <div className="overflow-x-auto flex-grow text-xs text-center font-mulish">
      <table className="w-full">
        <thead>
          <tr className="text-xs dark:text-gray-400 text-[#AEC3FF] uppercase">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-2.5 py-3">
                <div className="h-3 bg-gray-300/50 dark:bg-gray-700/50 rounded w-3/4 mx-auto animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-800/50">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-2.5 py-3">
                  <div className="h-3 bg-gray-300/50 dark:bg-gray-700/50 rounded w-2/3 mx-auto animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Keep Column definition here for local use
interface Column {
  key: keyof Transaction | string; // Allow string for dynamic keys
  label: string;
  always: boolean;
  description: string;
}

// Helper function to format dates consistently (remains the same)
const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

// Helper function to determine cell rendering (remains the same)
const renderCell = (key: string | number | symbol, value: any) => {
  const keyStr = String(key);
  if (value === null || value === undefined) {
    return <span className="text-gray-400">—</span>;
  }
  if (keyStr === "flag") {
    return (
      <span
        className={`px-2.5 py-1 text-xs rounded-full ${
          value === "orange"
            ? "bg-orange-500/20 text-orange-300"
            : value === "red"
            ? "bg-red-500/20 text-red-300"
            : value === "green"
            ? "bg-green-500/20 text-green-300"
            : "bg-gray-500/20 text-gray-300"
        }`}
      >
        {value}
      </span>
    );
  }
  if (keyStr === "fraud_rate") {
    const numValue = typeof value === "number" ? value : parseFloat(value);
    if (isNaN(numValue)) return value;
    return (
      <span className={`${numValue > 0.5 ? "text-red-400" : "text-green-400"}`}>
        {(numValue * 100).toFixed(0)}%
      </span>
    );
  }
  if (typeof value === "number") {
    if (
      keyStr.includes("amount") ||
      keyStr.includes("price") ||
      keyStr.includes("cost")
    ) {
      return `$${value.toFixed(2)}`;
    }
    if (
      keyStr.includes("date") ||
      keyStr.includes("time") ||
      keyStr.includes("timestamp")
    ) {
      let timestamp = value;
      if (value.toString().length <= 10) {
        timestamp = value * 1000;
      }
      try {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return formatDate(date);
        }
      } catch (e) {}
    }
    return value.toString();
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "string") {
    if (
      keyStr.includes("date") ||
      keyStr.includes("time") ||
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) ||
      /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return formatDate(date);
        }
        return value;
      } catch (e) {
        return value;
      }
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {value.replace(/^https?:\/\//, "")}
        </a>
      );
    }
  }
  return String(value); // Ensure value is always converted to string
};

export default function ProjectsTable() {
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery();
  const fraudData: FraudModelResponse | undefined = fraudDataArray?.[0];
  const transactions: Transaction[] = fraudData?.transactions || [];
  const apiColumns: ApiColumnDefinition[] | undefined = fraudData?.columns;

  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const requiredColumnKeys = ["name", "amount", "flag", "fraud_rate"];
  const [allColumns, setAllColumns] = useState<Column[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const savedColumns = localStorage.getItem("fraudTableVisibleColumns");
      if (savedColumns) {
        try {
          const parsed = new Set<string>(JSON.parse(savedColumns) as string[]);
          requiredColumnKeys.forEach((key) => parsed.add(key));
          return parsed;
        } catch (e) {
          console.error("Error parsing saved columns:", e);
        }
      }
    }
    return new Set(requiredColumnKeys);
  });

  const generateColumnsFromData = (transactions: Transaction[]): Column[] => {
    if (!transactions || transactions.length === 0) return [];
    const sampleTransaction = transactions[0];
    return Object.keys(sampleTransaction)
      .filter((key) => key !== "_id")
      .map((key) => ({
        key: key as keyof Transaction,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        always: requiredColumnKeys.includes(key),
        description: `${
          key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
        } data field`,
      }));
  };

  const processApiColumns = (apiColumns: ApiColumnDefinition[]): Column[] => {
    return apiColumns.map((apiCol) => ({
      key: apiCol.key as keyof Transaction,
      label: apiCol.label,
      always: apiCol.required || requiredColumnKeys.includes(apiCol.key),
      description: apiCol.description || `${apiCol.label} data field`,
    }));
  };

  useEffect(() => {
    if (fraudData) {
      let columnsToUse: Column[];
      if (apiColumns && Array.isArray(apiColumns) && apiColumns.length > 0) {
        columnsToUse = processApiColumns(apiColumns);
      } else {
        columnsToUse = generateColumnsFromData(transactions);
      }
      setAllColumns(columnsToUse);
      setVisibleColumns((prev) => {
        const newVisibleColumns = new Set(prev);
        columnsToUse.forEach((col) => {
          if (col.always) newVisibleColumns.add(col.key.toString());
        });
        requiredColumnKeys.forEach((key) => newVisibleColumns.add(key));
        return newVisibleColumns;
      });
    }
  }, [fraudData, transactions, apiColumns]);

  const saveColumnSettings = () => {
    localStorage.setItem(
      "fraudTableVisibleColumns",
      JSON.stringify([...visibleColumns])
    );
    setShowColumnMenu(false);
  };

  const resetColumnSettings = () => {
    const defaultColumns = new Set(requiredColumnKeys);
    allColumns.forEach((col) => {
      if (col.always) defaultColumns.add(col.key.toString());
    });
    setVisibleColumns(defaultColumns);
    localStorage.setItem(
      "fraudTableVisibleColumns",
      JSON.stringify([...defaultColumns])
    );
  };

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const newVisibleColumns = new Set(prev);
      if (newVisibleColumns.has(columnKey)) {
        newVisibleColumns.delete(columnKey);
      } else {
        newVisibleColumns.add(columnKey);
      }
      return newVisibleColumns;
    });
  };

  const isColumnVisible = (column: Column) => {
    return column.always || visibleColumns.has(column.key.toString());
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Loading State ---
  if (isLoading) {
    const initialVisibleCount = requiredColumnKeys.length;
    return (
      <div className="text-white p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex flex-col">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-mulish">
            <h2 className="text-lg font-semibold text-white">Transactions</h2>
            <p className="text-sm text-emerald-500">Loading transactions...</p>
          </div>
          <div className="relative">
            <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-800 opacity-50 cursor-not-allowed">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <svg
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <title></title>{" "}
                    <g data-name="Layer 24" id="Layer_24">
                      {" "}
                      <path d="M10,12H6a1,1,0,0,1-1-1V7A1,1,0,0,1,6,6h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,12ZM7,10H9V8H7Z"></path>{" "}
                      <path d="M6,8.47V11h4V8.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,8.47Z"></path>{" "}
                      <path d="M21,15.47V18h4V15.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,21,15.47Z"></path>{" "}
                      <path d="M6,22.47V25h4V22.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,22.47Z"></path>{" "}
                      <path d="M29,10H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M6,10H3A1,1,0,0,1,3,8H6a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M10,26H6a1,1,0,0,1-1-1V21a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,26ZM7,24H9V22H7Z"></path>{" "}
                      <path d="M6,24H3a1,1,0,0,1,0-2H6a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M29,24H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M25,19H21a1,1,0,0,1-1-1V14a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,25,19Zm-3-2h2V15H22Z"></path>{" "}
                      <path d="M21,17H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M29,17H25a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </svg>
            </button>
          </div>
        </div>
        {/* Skeleton Table */}
        <TableSkeleton columns={initialVisibleCount} rows={5} />
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    const errorMessage = getErrorMessage(error); // Use the helper function
    return (
      <div className="text-red-500 p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        Error: {errorMessage}
      </div>
    );
  }

  // --- No Data State (or empty transactions) ---
  if (!fraudData || transactions.length === 0) {
    return (
      <div className="text-white p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex flex-col">
        {/* Header remains functional */}
        <div className="flex items-center justify-between mb-6">
          <div className="font-mulish">
            <h2 className="text-lg font-semibold text-white">Transactions</h2>
            <p className="text-sm text-gray-400">No transactions found.</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              className="p-2 text-gray-400 rounded-lg hover:bg-gray-800"
              onClick={() => setShowColumnMenu(!showColumnMenu)}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <svg
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <title></title>{" "}
                    <g data-name="Layer 24" id="Layer_24">
                      {" "}
                      <path d="M10,12H6a1,1,0,0,1-1-1V7A1,1,0,0,1,6,6h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,12ZM7,10H9V8H7Z"></path>{" "}
                      <path d="M6,8.47V11h4V8.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,8.47Z"></path>{" "}
                      <path d="M21,15.47V18h4V15.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,21,15.47Z"></path>{" "}
                      <path d="M6,22.47V25h4V22.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,22.47Z"></path>{" "}
                      <path d="M29,10H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M6,10H3A1,1,0,0,1,3,8H6a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M10,26H6a1,1,0,0,1-1-1V21a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,26ZM7,24H9V22H7Z"></path>{" "}
                      <path d="M6,24H3a1,1,0,0,1,0-2H6a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M29,24H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M25,19H21a1,1,0,0,1-1-1V14a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,25,19Zm-3-2h2V15H22Z"></path>{" "}
                      <path d="M21,17H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z"></path>{" "}
                      <path d="M29,17H25a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z"></path>{" "}
                    </g>{" "}
                  </g>
                </svg>
              </svg>
            </button>
            {showColumnMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1">
                <div className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  Customize Table Columns
                </div>
                <div className="py-1 max-h-[300px] overflow-y-auto dark:custom-scrollbar">
                  {allColumns.length > 0 ? (
                    allColumns.map((column) => (
                      <label
                        key={column.key.toString()}
                        className={`flex items-start px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          column.always ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="mr-3 mt-0.5 form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 disabled:opacity-50"
                          checked={isColumnVisible(column)}
                          onChange={() =>
                            !column.always &&
                            toggleColumnVisibility(column.key.toString())
                          }
                          disabled={column.always}
                        />
                        <div className="flex-1">
                          <span className="text-gray-800 dark:text-gray-200 block">
                            {column.label}
                          </span>
                          {column.description && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 block">
                              {column.description}
                            </span>
                          )}
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No columns defined.
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t dark:border-gray-700 flex justify-between">
                  <button
                    onClick={resetColumnSettings}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Reset
                  </button>
                  <button
                    onClick={saveColumnSettings}
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Message indicating no data */}
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-400">No transaction data to display.</p>
        </div>
      </div>
    );
  }

  // --- Success State ---
  const visibleColumnsList = allColumns.filter((column) =>
    isColumnVisible(column)
  );

  return (
    <div className="p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex flex-col">
      {/* Header remains the same */}
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          <p className="text-sm dark:text-emerald-500 text-emerald-300">
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            className="p-2 text-gray-400 rounded-lg hover:bg-gray-800"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <svg
                fill="currentColor"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title></title>{" "}
                  <g data-name="Layer 24" id="Layer_24">
                    {" "}
                    <path d="M10,12H6a1,1,0,0,1-1-1V7A1,1,0,0,1,6,6h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,12ZM7,10H9V8H7Z"></path>{" "}
                    <path d="M6,8.47V11h4V8.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,8.47Z"></path>{" "}
                    <path d="M21,15.47V18h4V15.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,21,15.47Z"></path>{" "}
                    <path d="M6,22.47V25h4V22.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,22.47Z"></path>{" "}
                    <path d="M29,10H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path>{" "}
                    <path d="M6,10H3A1,1,0,0,1,3,8H6a1,1,0,0,1,0,2Z"></path>{" "}
                    <path d="M10,26H6a1,1,0,0,1-1-1V21a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,26ZM7,24H9V22H7Z"></path>{" "}
                    <path d="M6,24H3a1,1,0,0,1,0-2H6a1,1,0,0,1,0,2Z"></path>{" "}
                    <path d="M29,24H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path>{" "}
                    <path d="M25,19H21a1,1,0,0,1-1-1V14a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,25,19Zm-3-2h2V15H22Z"></path>{" "}
                    <path d="M21,17H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z"></path>{" "}
                    <path d="M29,17H25a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z"></path>{" "}
                  </g>{" "}
                </g>
              </svg>
            </svg>
          </button>
          {showColumnMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                Customize Table Columns
              </div>
              <div className="py-1 max-h-[300px] overflow-y-auto dark:custom-scrollbar">
                {allColumns.map((column) => (
                  <label
                    key={column.key.toString()}
                    className={`flex items-start px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      column.always ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-3 mt-0.5 form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 disabled:opacity-50"
                      checked={isColumnVisible(column)}
                      onChange={() =>
                        !column.always &&
                        toggleColumnVisibility(column.key.toString())
                      }
                      disabled={column.always}
                    />
                    <div className="flex-1">
                      <span className="text-gray-800 dark:text-gray-200 block">
                        {column.label}
                      </span>
                      {column.description && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">
                          {column.description}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <div className="px-4 py-2 border-t dark:border-gray-700 flex justify-between">
                <button
                  onClick={resetColumnSettings}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reset
                </button>
                <button
                  onClick={saveColumnSettings}
                  className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-grow text-xs text-center font-mulish dark:custom-scrollbar">
        <Table className="w-full min-w-[600px]">
          <TableHeader>
            <TableRow className="text-xs dark:text-gray-400 text-[#AEC3FF] uppercase">
              {visibleColumnsList.map((column) => (
                <TableHead key={column.key.toString()} className="px-2.5 py-3">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="dark:text-gray-300 text-white">
            {transactions.map((transaction, index) => (
              <TableRow
                key={transaction._id || index}
                className="hover:bg-gray-800/50"
              >
                {visibleColumnsList.map((column) => (
                  <td
                    key={column.key.toString()}
                    className="px-2.5 py-3 whitespace-nowrap"
                  >
                    {renderCell(
                      column.key,
                      transaction[column.key as keyof Transaction]
                    )}
                  </td>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
