"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Plus, Download, Trash2, Info } from "lucide-react"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"

interface UploadedFile {
  id: string
  name: string
  extension: string
  size: string
}

export default function DataUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed =
        document.documentElement.getAttribute("data-sidebar-collapsed") === "true"
      setIsCollapsed(isCollapsed)
    }

    updateSidebarState()
    const observer = new MutationObserver(updateSidebarState)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sidebar-collapsed"],
    })

    return () => observer.disconnect()
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (files.length === 0) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (files.length > 0) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    if (files.length > 0) return
    const file = fileList[0]
    const newFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name.split(".")[0],
      extension: file.name.split(".").pop() || "",
      size: formatFileSize(file.size),
    }
    setFiles([newFile])
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleClickUpload = () => {
    if (files.length === 0) {
      fileInputRef.current?.click()
    }
  }

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#15191c] transition-all duration-300">
      <Sidebar />
      <Header />
      <div className={`p-4 md:p-6 pt-20 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}>
        <div className="flex items-center mb-4">
          <p className="text-gray-400 text-sm">Pages / Data Upload</p>
        </div>
        <div className="bg-[#4B65AB] dark:bg-[#191e21] p-8 rounded-xl">
          <h1 className="text-white text-3xl  mb-6 font-bayon">UPLOAD FILE</h1>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed dark:border-gray-600 border-[#AEC3FF]/50 rounded-lg mb-6 py-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
    ${isDragging ? "bg-[#1d2328] border-blue-500" : "bg-transparent"}
    ${files.length > 0 ? "pointer-events-none" : ""}
  `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            <div className="w-20 h-20 dark:bg-gray-700/30 bg-[#AEC3FF]/20 rounded-full flex items-center justify-center mb-4 border dark:border-gray-600 border-[#AEC3FF]/50 bg-opacity-10">
              <Plus className="w-10 h-10 dark:text-gray-400 text-[#AEC3FF]" />
            </div>

            <div className={`${files.length > 0 ? "opacity-50" : ""} flex flex-col items-center`}>
              <p className="dark:text-gray-400 text-[#AEC3FF] text-lg mb-2">Drag & drop or click to choose files</p>
              <div className="flex flex-col dark:text-gray-500 text-[#AEC3FF]/60 items-center">
                <p>Accepted files: .pdf, .csv, .xls, .xlsx,</p>

                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  <p>Max file size : ***** MB</p>
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileInputChange}
              multiple={false}
              accept=".pdf,.csv,.xls,.xlsx"
            />
          </div>


          {files.length > 0 && (
            <div className="space-y-4 mb-6 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="dark:bg-[#1d2328] bg-[#AEC3FF]/10 rounded-lg p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center">
                    <div className="mr-4">
                      <FileIcon className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="dark:text-white text-[#AEC3FF] text-lg font-medium">{file.name}</h3>
                      <p className="dark:text-gray-400 text-[#AEC3FF]/80">
                        {file.extension} | {file.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      disabled
                      className="p-3 dark:bg-[#2a3441] bg-[#AEC3FF]/20 rounded-full opacity-50 border dark:border-gray-600 border-[#AEC3FF]/50 bg-opacity-10"
                    >
                      <Download className="w-5 h-5 dark:text-white text-[#AEC3FF]" />
                    </button>
                    <button
                      className="p-3 dark:bg-[#2a3441] bg-[#AEC3FF]/20 border-[#AEC3FF]/50 bg-opacity-10 rounded-full border dark:border-gray-600"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <Trash2 className="w-5 h-5 dark:text-white text-[#AEC3FF]" />
                    </button>

                  </div>
                </div>
              ))}
              <div className="flex justify-center font-mulish">
                <button
                  disabled
                  className="dark:bg-[#1d2328] bg-[#AEC3FF]/10 dark:text-white text-[#AEC3FF] font-medium py-4 px-32 border dark:border-gray-700 border-[#AEC3FF]/50  rounded-lg opacity-50 transition-colors text-lg"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FileIcon({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 2H6C5.47 2 4.96 2.21 4.59 2.59C4.21 2.96 4 3.47 4 4V20C4 20.53 4.21 21.04 4.59 21.41C4.96 21.79 5.47 22 6 22H18C18.53 22 19.04 21.79 19.41 21.41C19.79 21.04 20 20.53 20 20V8L14 2Z"
          fill="#4CAF50"
          stroke="#4CAF50"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M14 2V8H20" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 13H8" stroke="#E8F5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17H8" stroke="#E8F5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 9H9H8" stroke="#E8F5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
