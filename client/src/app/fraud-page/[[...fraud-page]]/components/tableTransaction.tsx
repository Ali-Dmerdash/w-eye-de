"use client"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Settings, AlertTriangle, CheckCircle, Database, X, Eye, Download, MessageSquare } from "lucide-react"
import { useGetFraudDataQuery } from "@/state/api"
import type { FraudModelResponse, Transaction, ApiColumnDefinition } from "@/state/type"
import { useChat } from "@/context/ChatContext"
import { useUser } from "@clerk/nextjs"

// Helper function to get a safe error message string
function getErrorMessage(error: unknown): string {
  if (!error) {
    return "An unknown error occurred"
  }
  if (typeof error === "object" && error !== null) {
    if ("status" in error) {
      let details = ""
      if (
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        details = error.data.message
      } else if ("error" in error && typeof error.error === "string") {
        details = error.error
      }
      return `Error ${error.status}${details ? ": " + details : ""}`
    }
    if ("message" in error && typeof error.message === "string") {
      return error.message
    }
  }
  try {
    return String(error)
  } catch {
    return "An unknown error occurred"
  }
}

// Simple inline skeleton loader
const TableSkeleton = ({
  columns,
  rows = 5,
}: {
  columns: number
  rows?: number
}) => {
  return (
    <div className="overflow-x-auto flex-grow">
      <table className="w-full">
        <thead>
          <tr className="border-b border-purple-100 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="h-4 bg-purple-100 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-purple-50 dark:border-gray-800">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-3">
                  <div className="h-4 bg-purple-50 dark:bg-gray-800 rounded w-2/3 animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Transaction Detail Modal Component
const TransactionModal = ({ 
  transaction, 
  allColumns, 
  isOpen, 
  onClose 
}: { 
  transaction: Transaction | null
  allColumns: Column[]
  isOpen: boolean
  onClose: () => void
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { openChat } = useChat()

  // Helper function to convert transaction to CSV
  const downloadTransactionAsCSV = () => {
    if (!transaction) return

    const headers = allColumns.map(col => col.label).join(',')
    const values = allColumns.map(col => {
      const value = transaction[col.key as keyof Transaction]
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value || ''
    }).join(',')

    const csvContent = `${headers}\n${values}`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transaction-${transaction._id || 'data'}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Helper function to open chat and send transaction row directly
  const sendRowToChat = () => {
    if (!transaction) return;
    // Create a readable message for the transaction row
    const rowText = allColumns.map(col => `${col.label}: ${transaction[col.key as keyof Transaction]}`).join('\n');
    openChat(`Analyze this transaction:\n${rowText}`);
    onClose();
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !transaction) return null

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] flex flex-col transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
        </div>

        {/* Header */}
        <div className="p-6 border-b border-purple-100 dark:border-gray-700 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl shadow-sm">
                <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transaction Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete transaction information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative z-10 dark:custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allColumns.map((column) => {
              const value = transaction[column.key as keyof Transaction]
              return (
                <div 
                  key={column.key.toString()} 
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 border border-purple-100 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                        {column.label}
                      </span>
                      {column.always && (
                        <span className="px-1.5 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                          Key
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-900 dark:text-white font-medium min-h-[1.25rem] flex items-center">
                      {renderCell(column.key, value)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Card */}
          {transaction.fraud_rate !== undefined && (
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Risk Assessment
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Fraud Probability</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {((transaction.fraud_rate as number) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Risk Level</p>
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    (transaction.fraud_rate as number) > 0.7 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : (transaction.fraud_rate as number) > 0.3
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}>
                    {(transaction.fraud_rate as number) > 0.7 ? "High" : (transaction.fraud_rate as number) > 0.3 ? "Medium" : "Low"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-100 dark:border-gray-700 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {/* Download CSV Button */}
              <button
                onClick={downloadTransactionAsCSV}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                title="Download transaction as CSV"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Download className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Download CSV</span>
              </button>

              {/* Send Row to Chat Button */}
              <button
                onClick={sendRowToChat}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                title="Send transaction to chat for analysis"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <MessageSquare className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Analyze in Chat</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="group relative px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] border border-gray-300 dark:border-gray-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null
}

// Column definition interface
interface Column {
  key: keyof Transaction | string
  label: string
  always: boolean
  description: string
}

// Helper function to format dates consistently
const formatDate = (date: Date): string => {
  if (isNaN(date.getTime())) {
    return "Invalid Date"
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

// Helper function to determine cell rendering
const renderCell = (key: string | number | symbol, value: any) => {
  const keyStr = String(key)
  if (value === null || value === undefined) {
    return <span className="text-gray-400">—</span>
  }
  if (keyStr === "flag") {
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${value === "orange"
            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            : value === "red"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : value === "green"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
      >
        {value}
      </span>
    )
  }
  if (keyStr === "fraud_rate") {
    const numValue = typeof value === "number" ? value : Number.parseFloat(value)
    if (isNaN(numValue)) return value
    return (
      <span
        className={`font-medium ${numValue > 0.5 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
      >
        {(numValue * 100).toFixed(0)}%
      </span>
    )
  }
  if (typeof value === "number") {
    if (keyStr.includes("amount") || keyStr.includes("price") || keyStr.includes("cost")) {
      return `$${value.toFixed(2)}`
    }
    if (keyStr.includes("date") || keyStr.includes("time") || keyStr.includes("timestamp")) {
      let timestamp = value
      if (value.toString().length <= 10) {
        timestamp = value * 1000
      }
      try {
        const date = new Date(timestamp)
        if (!isNaN(date.getTime())) {
          return formatDate(date)
        }
      } catch (e) { }
    }
    return value.toString()
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }
  if (typeof value === "string") {
    if (
      keyStr.includes("date") ||
      keyStr.includes("time") ||
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) ||
      /^\d{4}-\d{2}-\d{2}/.test(value)
    ) {
      try {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          return formatDate(date)
        }
        return value
      } catch (e) {
        return value
      }
    }
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 hover:underline"
        >
          {value.replace(/^https?:\/\//, "")}
        </a>
      )
    }
  }
  return String(value)
}

export default function ProjectsTable() {
  const { data: fraudDataArray, isLoading, error } = useGetFraudDataQuery()
  const fraudData: FraudModelResponse | undefined = fraudDataArray?.[0]
  const transactions: Transaction[] = fraudData?.transactions || []
  const apiColumns: ApiColumnDefinition[] | undefined = fraudData?.columns

  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const requiredColumnKeys = ["name", "amount", "flag", "fraud_rate"]
  const [allColumns, setAllColumns] = useState<Column[]>([])
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const savedColumns = localStorage.getItem("fraudTableVisibleColumns")
      if (savedColumns) {
        try {
          const parsed = new Set<string>(JSON.parse(savedColumns) as string[])
          requiredColumnKeys.forEach((key) => parsed.add(key))
          return parsed
        } catch (e) {
          console.error("Error parsing saved columns:", e)
        }
      }
    }
    return new Set(requiredColumnKeys)
  })

  const { user, isLoaded } = useUser();
  const filesUploaded = user?.unsafeMetadata?.filesUploaded;
  if (isLoaded && filesUploaded === false) {
    return (
      <div className="bg-white h-full dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mb-2" />
        <span className="text-gray-500 dark:text-gray-400 text-center font-medium">
          No data to display — file upload was bypassed.
        </span>
      </div>
    );
  }

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const generateColumnsFromData = (transactions: Transaction[]): Column[] => {
    if (!transactions || transactions.length === 0) return []
    const sampleTransaction = transactions[0]
    return Object.keys(sampleTransaction)
      .filter((key) => key !== "_id")
      .map((key) => ({
        key: key as keyof Transaction,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        always: requiredColumnKeys.includes(key),
        description: `${key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")} data field`,
      }))
  }

  const processApiColumns = (apiColumns: ApiColumnDefinition[]): Column[] => {
    return apiColumns.map((apiCol) => ({
      key: apiCol.key as keyof Transaction,
      label: apiCol.label,
      always: apiCol.required || requiredColumnKeys.includes(apiCol.key),
      description: apiCol.description || `${apiCol.label} data field`,
    }))
  }

  useEffect(() => {
    console.log("fraudData", fraudDataArray)
    if (fraudData) {
      let columnsToUse: Column[]
      if (apiColumns && Array.isArray(apiColumns) && apiColumns.length > 0) {
        columnsToUse = processApiColumns(apiColumns)
      } else {
        columnsToUse = generateColumnsFromData(transactions)
      }
      setAllColumns(columnsToUse)
      setVisibleColumns((prev) => {
        const newVisibleColumns = new Set(prev)
        columnsToUse.forEach((col) => {
          if (col.always) newVisibleColumns.add(col.key.toString())
        })
        requiredColumnKeys.forEach((key) => newVisibleColumns.add(key))
        return newVisibleColumns
      })
    }
  }, [fraudData, transactions, apiColumns])

  const saveColumnSettings = () => {
    localStorage.setItem("fraudTableVisibleColumns", JSON.stringify([...visibleColumns]))
    setShowColumnMenu(false)
  }

  const resetColumnSettings = () => {
    const defaultColumns = new Set(requiredColumnKeys)
    allColumns.forEach((col) => {
      if (col.always) defaultColumns.add(col.key.toString())
    })
    setVisibleColumns(defaultColumns)
    localStorage.setItem("fraudTableVisibleColumns", JSON.stringify([...defaultColumns]))
  }

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => {
      const newVisibleColumns = new Set(prev)
      if (newVisibleColumns.has(columnKey)) {
        newVisibleColumns.delete(columnKey)
      } else {
        newVisibleColumns.add(columnKey)
      }
      return newVisibleColumns
    })
  }

  const isColumnVisible = (column: Column) => {
    return column.always || visibleColumns.has(column.key.toString())
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowColumnMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // --- Loading State ---
  if (isLoading) {
    const initialVisibleCount = requiredColumnKeys.length
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-5 w-32 bg-purple-100 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-3 w-24 bg-purple-50 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-10 h-10 bg-purple-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <TableSkeleton columns={initialVisibleCount} rows={5} />
      </div>
    )
  }

  // --- Error State ---
  if (error) {
    const errorMessage = getErrorMessage(error)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-200 dark:border-red-800 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">Error: {errorMessage}</p>
        </div>
      </div>
    )
  }

  // --- No Data State ---
  if (!fraudData || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Data</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          </div>
          <button
            className="p-2 text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No transaction data to display</p>
          </div>
        </div>
      </div>
    )
  }

  // --- Success State ---
  const visibleColumnsList = allColumns.filter((column) => isColumnVisible(column))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction Data</h2>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} loaded
              </span>
            </div>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            className="p-2 text-gray-400 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setShowColumnMenu(!showColumnMenu)}
          >
            <Settings className="w-5 h-5" />
          </button>
          {showColumnMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-purple-100 dark:border-gray-700 z-10 py-2">
              <div className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-purple-100 dark:border-gray-700 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Customize Columns
              </div>
              <div className="py-2 max-h-[300px] overflow-y-auto">
                {allColumns.length > 0 ? (
                  allColumns.map((column) => (
                    <label
                      key={column.key.toString()}
                      className={`flex items-start px-4 py-2 text-sm cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors ${column.always ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-3 mt-0.5 form-checkbox h-4 w-4 text-purple-600 dark:text-purple-400 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 dark:focus:ring-purple-600 focus:ring-2 disabled:opacity-50"
                        checked={isColumnVisible(column)}
                        onChange={() => !column.always && toggleColumnVisibility(column.key.toString())}
                        disabled={column.always}
                      />
                      <div className="flex-1">
                        <span className="text-gray-800 dark:text-gray-200 block">{column.label}</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">No columns defined.</div>
                )}
              </div>
              <div className="px-4 py-3 border-t border-purple-100 dark:border-gray-700 flex justify-between">
                <button
                  onClick={resetColumnSettings}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Reset
                </button>
                <button
                  onClick={saveColumnSettings}
                  className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto flex-grow">
        <Table className="w-full min-w-[600px]">
          <TableHeader>
            <TableRow className="border-b border-purple-100 dark:border-gray-700">
              {visibleColumnsList.map((column) => (
                <TableHead
                  key={column.key.toString()}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow
                key={transaction._id || index}
                className="border-b border-purple-50 dark:border-gray-800 cursor-pointer"
                onClick={() => handleRowClick(transaction)}
              >
                {visibleColumnsList.map((column) => (
                  <td key={column.key.toString()} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {renderCell(column.key, transaction[column.key as keyof Transaction])}
                  </td>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionModal 
        transaction={selectedTransaction}
        allColumns={allColumns}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
}
