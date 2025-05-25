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

// Simple inline skeleton loader
const TableSkeleton = ({ columns, rows = 5 }: { columns: number, rows?: number }) => {
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
  [key: string]: any; // Allow for additional dynamic fields from API
}

interface FraudData {
  transactions: Transaction[];
  columns?: ApiColumnDefinition[]; // Column definitions from API
  // Add other top-level fields if needed
}

interface ApiColumnDefinition {
  key: string;
  label: string;
  required?: boolean;
  description?: string;
}

interface Column {
  key: keyof Transaction;
  label: string;
  always: boolean;
  description: string;
}

// Helper function to format dates consistently
const formatDate = (date: Date): string => {
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  
  // Format as MM/DD/YYYY
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Helper function to determine cell rendering based on value type and column key
const renderCell = (key: string | number | symbol, value: any) => {
  // Convert key to string to ensure type safety
  const keyStr = String(key);
  
  // Handle null or undefined values
  if (value === null || value === undefined) {
    return <span className="text-gray-400">—</span>;
  }
  
  // Special handling for known column types
  if (keyStr === "flag") {
    return (
      <span
        className={`px-2.5 py-1 text-xs rounded-full ${value === "orange"
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
    // Ensure it's a number
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return value;
    
    return (
      <span
        className={`${numValue > 0.5
          ? "text-red-400"
          : "text-green-400"
        }`}
      >
        {(numValue * 100).toFixed(0)}%
      </span>
    );
  }
  
  // Handle different value types
  if (typeof value === 'number') {
    // Check if it might be a currency value (based on column name hints)
    if (keyStr.includes('amount') || keyStr.includes('price') || keyStr.includes('cost')) {
      return `$${value.toFixed(2)}`;
    }
    
    // Check if it might be a timestamp (large numbers that could be Unix timestamps)
    if (keyStr.includes('date') || keyStr.includes('time') || keyStr.includes('timestamp')) {
      // Handle both seconds and milliseconds formats
      let timestamp = value;
      
      // If timestamp is in seconds (10 digits or less), convert to milliseconds
      if (value.toString().length <= 10) {
        timestamp = value * 1000;
      }
      
      try {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return formatDate(date);
        }
      } catch (e) {
        // If date conversion fails, fall back to just showing the number
      }
    }
    
    return value.toString();
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'string') {
    // Check if it's a date string
    if (
      keyStr.includes('date') || 
      keyStr.includes('time') || 
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) ||
      /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {
      try {
        const date = new Date(value);
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          return formatDate(date);
        }
        return value;
      } catch (e) {
        return value;
      }
    }

    // Check if it's a URL
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {value.replace(/^https?:\/\//, '')}
        </a>
      );
    }
  }

  // Default fallback
  return value.toString();
};

export default function ProjectsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Define required columns that should always be visible
  const requiredColumnKeys = ["name", "amount", "flag", "fraud_rate"];

  // State to store the dynamic columns
  const [allColumns, setAllColumns] = useState<Column[]>([]);

  // State to track which optional columns are visible - load from localStorage if available
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const savedColumns = localStorage.getItem('fraudTableVisibleColumns');
      if (savedColumns) {
        try {
          // Ensure required columns are always included
          const parsed = new Set<string>(JSON.parse(savedColumns) as string[]);
          requiredColumnKeys.forEach(key => {
            parsed.add(key);
          });
          return parsed;
        } catch (e) {
          console.error('Error parsing saved columns:', e);
        }
      }
    }
    return new Set(requiredColumnKeys);
  });

  // Generate columns from transaction data if API doesn't provide column definitions
  const generateColumnsFromData = (transactions: Transaction[]): Column[] => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Get a sample transaction to extract keys
    const sampleTransaction = transactions[0];

    // Create columns from transaction keys
    return Object.keys(sampleTransaction).map(key => ({
      key: key as keyof Transaction,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), // Convert snake_case to Title Case
      always: requiredColumnKeys.includes(key),
      description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')} data field`
    }));
  };

  // Process API column definitions into our format
  const processApiColumns = (apiColumns: ApiColumnDefinition[]): Column[] => {
    return apiColumns.map(apiCol => ({
      key: apiCol.key as keyof Transaction,
      label: apiCol.label,
      always: apiCol.required || requiredColumnKeys.includes(apiCol.key),
      description: apiCol.description || `${apiCol.label} data field`
    }));
  };

  // Save column visibility to localStorage
  const saveColumnSettings = () => {
    localStorage.setItem('fraudTableVisibleColumns', JSON.stringify([...visibleColumns]));
    setShowColumnMenu(false);
  };

  // Reset column visibility to default
  const resetColumnSettings = () => {
    const defaultColumns = new Set(requiredColumnKeys);
    setVisibleColumns(defaultColumns);
    localStorage.removeItem('fraudTableVisibleColumns');
  };

  // Toggle a column's visibility
  const toggleColumnVisibility = (columnKey: string) => {
    const newVisibleColumns = new Set(visibleColumns);

    if (newVisibleColumns.has(columnKey)) {
      newVisibleColumns.delete(columnKey);
    } else {
      newVisibleColumns.add(columnKey);
    }

    setVisibleColumns(newVisibleColumns);
  };

  // Check if a column should be visible
  const isColumnVisible = (column: Column) => {
    return column.always || requiredColumnKeys.includes(column.key.toString()) || visibleColumns.has(column.key.toString());
  };

  // Handle click outside of menu to close it
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:3001/api/fraud/results",
          {
            credentials: "include", // If you're using cookies for auth
            headers: {
              "Content-Type": "application/json",
              // "Authorization": `Bearer ${yourToken}` // if you're using Bearer tokens
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: FraudData[] = await response.json();

        if (!Array.isArray(json) || json.length === 0) {
          throw new Error("No analysis data available.");
        }

        const data = json[0];
        setTransactions(data.transactions);

        // Process columns from API or generate from transaction data
        let columnsToUse: Column[];

        if (data.columns && Array.isArray(data.columns) && data.columns.length > 0) {
          // Use column definitions from API
          columnsToUse = processApiColumns(data.columns);
        } else {
          // Generate columns from transaction data
          columnsToUse = generateColumnsFromData(data.transactions);
        }

        setAllColumns(columnsToUse);

        // Update visible columns to include any newly required columns
        setVisibleColumns(prev => {
          const newVisibleColumns = new Set(prev);
          columnsToUse.forEach(col => {
            if (col.always) {
              newVisibleColumns.add(col.key.toString());
            }
          });
          return newVisibleColumns;
        });

      } catch (e: any) {
        console.error("Failed to fetch transaction data:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    // Use required columns count for the skeleton
    const visibleColumnsCount = requiredColumnKeys.length;

    return (
      <div className="text-white p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="font-mulish">
            <h2 className="text-lg font-semibold text-white">Transactions</h2>
            <p className="text-sm text-emerald-500">
              Loading transactions...
            </p>
          </div>
          <div className="relative">
            <button className="p-2 text-gray-400 rounded-lg hover:bg-gray-800 opacity-50 cursor-not-allowed">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>
        <TableSkeleton columns={visibleColumnsCount} rows={5} />
      </div>
    );
  }
  if (error)
    return (
      <div className="text-red-500 p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex items-center justify-center">
        Error: {error}
      </div>
    );

  // Filter columns that should be visible
  const visibleColumnsList = allColumns.filter(column => isColumnVisible(column));

  return (
    <div className="p-8 bg-[#4B65AB] dark:bg-[#1d2328] rounded-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="font-mulish">
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          <p className="text-sm dark:text-emerald-500 text-emerald-300">
            {transactions.length} transactions found
          </p>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            className="p-2 text-gray-400 rounded-lg hover:bg-gray-800"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g data-name="Layer 24" id="Layer_24"> <path d="M10,12H6a1,1,0,0,1-1-1V7A1,1,0,0,1,6,6h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,12ZM7,10H9V8H7Z"></path> <path d="M6,8.47V11h4V8.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,8.47Z"></path> <path d="M21,15.47V18h4V15.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,21,15.47Z"></path> <path d="M6,22.47V25h4V22.47a2.11,2.11,0,0,1-2,1A2.11,2.11,0,0,1,6,22.47Z"></path> <path d="M29,10H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path> <path d="M6,10H3A1,1,0,0,1,3,8H6a1,1,0,0,1,0,2Z"></path> <path d="M10,26H6a1,1,0,0,1-1-1V21a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,10,26ZM7,24H9V22H7Z"></path> <path d="M6,24H3a1,1,0,0,1,0-2H6a1,1,0,0,1,0,2Z"></path> <path d="M29,24H10a1,1,0,0,1,0-2H29a1,1,0,0,1,0,2Z"></path> <path d="M25,19H21a1,1,0,0,1-1-1V14a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v4A1,1,0,0,1,25,19Zm-3-2h2V15H22Z"></path> <path d="M21,17H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z"></path> <path d="M29,17H25a1,1,0,0,1,0-2h4a1,1,0,0,1,0,2Z"></path> </g> </g></svg>            </svg>
          </button>

          {/* Column selection dropdown */}
          {showColumnMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1">
              <div className="px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Customize Table Columns
              </div>
              <div className="py-1 max-h-[300px] overflow-y-auto dark:custom-scrollbar">
                {allColumns.map(column => (
                  <div
                    key={column.key.toString()}
                    className={`flex items-start px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${column.always ? 'opacity-75 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (!column.always) {
                        toggleColumnVisibility(column.key.toString());
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center rounded border ${visibleColumns.has(column.key.toString()) ? 'bg-blue-500 border-blue-500' : 'border-gray-400 dark:border-gray-600'}`}>
                        {visibleColumns.has(column.key.toString()) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className={`${column.always ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'} font-medium`}>
                        {column.label}
                        {column.always && " (required)"}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t dark:border-gray-700 flex justify-between items-center">
                <button
                  onClick={resetColumnSettings}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Reset to Default
                </button>
                <button
                  onClick={saveColumnSettings}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-x-auto dark:custom-scrollbar text-xs text-center font-mulish">
        <table className="w-full">
          <thead>
            <tr className="text-xs dark:text-gray-400 text-[#AEC3FF] uppercase">
              {visibleColumnsList.map(column => (
                <th key={column.key.toString()} className="px-2.5 py-3">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction._id || index}
                className="hover:bg-gray-800/50"
              >
                {visibleColumnsList.map(column => {
                  const key = column.key;
                  const value = transaction[key];

                  // Standard cell with special styling for "name" column
                  return (
                    <td
                      key={key}
                      className={`px-2.5 py-3 ${key === "name" ? "font-medium" : ""}`}
                    >
                      {renderCell(key, value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
