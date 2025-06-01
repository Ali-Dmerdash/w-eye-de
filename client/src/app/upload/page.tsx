"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { Plus, Download, Trash2, Info, Ellipsis, X } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";

interface UploadedFile {
  id: string;
  name: string;
  extension: string;
  size: string;
  agent?: string;
  file?: File; // Added to store the actual file object
}

export default function DataUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  useEffect(() => {
    const updateSidebarState = () => {
      const isCollapsed =
        document.documentElement.getAttribute("data-sidebar-collapsed") ===
        "true";
      setIsCollapsed(isCollapsed);
    };

    updateSidebarState();
    const observer = new MutationObserver(updateSidebarState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-sidebar-collapsed"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (files.length === 0) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (files.length > 0) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    if (files.length > 0) return;
    const file = fileList[0];
    const newFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name.split(".")[0],
      extension: file.name.split(".").pop() || "",
      size: formatFileSize(file.size),
      agent: undefined,
      file: file, // Store the actual file object
    };
    setFiles([newFile]);
    // Reset upload status when a new file is added
    setUploadStatus(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleClickUpload = () => {
    if (files.length === 0) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    // Reset upload status when file is removed
    setUploadStatus(null);
  };

  const openAgentModal = (id: string) => {
    setCurrentFileId(id);
    setShowModal(true);
  };

  const handleAgentSelection = (agentType: string) => {
    if (currentFileId) {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === currentFileId ? { ...file, agent: agentType } : file
        )
      );
      setShowModal(false);
    }
  };

  // Check if all files have agents selected
  const allFilesHaveAgents = files.every((file) => file.agent);

  // Handle file upload to API
  const handleUpload = async () => {
    if (files.length === 0 || !allFilesHaveAgents) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const fileToUpload = files[0];

      if (!fileToUpload.file) {
        throw new Error("File object not found");
      }

      const formData = new FormData();
      formData.append("file", fileToUpload.file);
      // Optionally add agent info if the API needs it
      formData.append("agent", fileToUpload.agent || "");

      const response = await fetch("http://localhost:3001/api/data/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus({
          success: true,
          message: `File "${fileToUpload.name}" uploaded successfully!`,
        });
        // Optionally clear the file list after successful upload
        // setFiles([]);
      } else {
        const errorText = await response.text();
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}${
            errorText ? ` - ${errorText}` : ""
          }`
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        success: false,
        message: `Upload failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#15191c] transition-all duration-300">
      <Sidebar />
      <Header />
      <div
        className={`p-4 md:p-6 pt-20 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}
      >
        <div className="flex items-center mb-4">
          <p className="text-gray-400 text-sm">Pages / Data Upload</p>
        </div>
        <div className="bg-[#4B65AB] dark:bg-[#191e21] p-8 rounded-xl">
          <h1 className="text-white text-3xl  mb-6 font-bayon">UPLOAD FILE</h1>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed dark:border-gray-600 border-[#AEC3FF]/50 rounded-lg mb-6 py-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                      ${
                        isDragging
                          ? "bg-[#1d2328] border-blue-500"
                          : "bg-transparent"
                      }
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

            <div
              className={`${
                files.length > 0 ? "opacity-50" : ""
              } flex flex-col items-center`}
            >
              <p className="dark:text-gray-400 text-[#AEC3FF] text-lg mb-2">
                Drag & drop or click to choose files
              </p>
              <div className="flex flex-col dark:text-gray-500 text-[#AEC3FF]/60 items-center">
                <p>Accepted files: .csv, .pdf, .json</p>

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
              accept=".csv, .pdf, .json"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-4 mb-6 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="dark:bg-[#1d2328] bg-[#AEC3FF]/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm gap-4"
                >
                  <div className="flex items-center">
                    <div className="mr-3 sm:mr-4">
                      <FileIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <h3 className="dark:text-white text-[#AEC3FF] text-base sm:text-lg md:text-xl font-medium truncate max-w-[180px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-full">
                        {file.name}
                      </h3>
                      <p className="dark:text-gray-400 text-[#AEC3FF]/80 text-xs sm:text-sm md:text-base">
                        {file.extension} | {file.size} |{" "}
                        {file.agent ? (
                          file.agent
                        ) : (
                          <span className="font-bold underline dark:text-gray-400 text-[#AEC3FF]/80 ">
                            Agent Not Selected
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row sm:justify-normal justify-center gap-3 sm:gap-4 mt-4 sm:mt-0">
                    <button
                      className={`flex justify-center w-full lg:w-auto items-center p-3 w-12 h-12 dark:bg-[#2a3441] bg-[#AEC3FF] border-[#AEC3FF]/50 bg-opacity-10 rounded-2xl md:rounded-full border dark:border-gray-600 hover:bg-[#AEC3FF]/40 transition-colors duration-150 ${
                        !file.agent ? "animate-pulse-attention" : ""
                      }`}
                      onClick={() => openAgentModal(file.id)}
                      aria-label="Select agent"
                      title="Select agent"
                    >
                      <Ellipsis className="w-5 h-5 dark:text-white text-[#AEC3FF]" />
                      <p className="text-xs ps-2 md:hidden dark:text-white text-[#AEC3FF]">
                        Select Agent
                      </p>
                    </button>
                    <button
                      className="flex justify-center w-full lg:w-auto items-center p-3 w-12 h-12 dark:bg-[#2a3441] bg-[#AEC3FF] border-[#AEC3FF]/50 bg-opacity-10 rounded-2xl md:rounded-full border dark:border-gray-600 hover:bg-[#AEC3FF]/40 transition-colors duration-150 "
                      onClick={() => handleRemoveFile(file.id)}
                      aria-label="Remove file"
                      title="Remove file"
                    >
                      <Trash2 className="w-5 h-5 dark:text-white text-[#AEC3FF]" />
                      <p className="text-xs ps-2 md:hidden dark:text-white text-[#AEC3FF]">
                        Remove File
                      </p>
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload Status Message */}
              {uploadStatus && (
                <div
                  className={`p-4 rounded-lg ${
                    uploadStatus.success
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                  }`}
                >
                  {uploadStatus.message}
                </div>
              )}

              <div className="flex justify-center font-mulish">
                <button
                  className={`dark:bg-[#1d2328] bg-[#AEC3FF]/10 dark:text-white text-[#AEC3FF] font-medium py-4 px-32 border dark:border-gray-700 border-[#AEC3FF]/50 rounded-lg transition-colors text-lg ${
                    allFilesHaveAgents && !isUploading
                      ? "hover:bg-[#AEC3FF]/20 cursor-pointer dark:hover:bg-[#2A3441]/40"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  disabled={!allFilesHaveAgents || isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? "Uploading..." : "Add"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white dark:bg-[#1d2328] rounded-lg shadow-xl w-full max-w-sm sm:max-w-md animate-fadeIn"
          >
            <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-bold dark:text-white text-[#4B65AB]">
                Select Agent
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              {/* Public Agent Section */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 dark:text-gray-300 text-gray-600">
                  Public Agent
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAgentSelection("Public Agent")}
                    className="w-full p-3 sm:p-4 text-left rounded-lg border dark:border-gray-700 border-[#AEC3FF]/50 dark:bg-[#2a3441] bg-[#AEC3FF]/10 dark:text-white text-[#4B65AB] hover:bg-[#AEC3FF]/20 dark:hover:bg-[#2A3441]/60 transition-colors text-sm sm:text-base"
                  >
                    <span className="font-medium">Public</span>
                    <p className="text-xs sm:text-sm mt-1 dark:text-gray-400 text-gray-500">
                      General purpose agent for public data
                    </p>
                  </button>
                </div>
              </div>

              {/* Specific Agent Section */}
              <div>
                <h3 className="text-sm font-semibold mb-2 dark:text-gray-300 text-gray-600">
                  Specific Agent
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => handleAgentSelection("Fraud Agent")}
                    className="w-full p-3 sm:p-4 text-left rounded-lg border dark:border-gray-700 border-[#AEC3FF]/50 dark:bg-[#2a3441] bg-[#AEC3FF]/10 dark:text-white text-[#4B65AB] hover:bg-[#AEC3FF]/20 dark:hover:bg-[#2A3441]/60 transition-colors text-sm sm:text-base"
                  >
                    <span className="font-medium">Fraud</span>
                    <p className="text-xs sm:text-sm mt-1 dark:text-gray-400 text-gray-500">
                      Detection of fraudulent activities
                    </p>
                  </button>
                  <button
                    onClick={() => handleAgentSelection("Market Agent")}
                    className="w-full p-3 sm:p-4 text-left rounded-lg border dark:border-gray-700 border-[#AEC3FF]/50 dark:bg-[#2a3441] bg-[#AEC3FF]/10 dark:text-white text-[#4B65AB] hover:bg-[#AEC3FF]/20 dark:hover:bg-[#2A3441]/60 transition-colors text-sm sm:text-base"
                  >
                    <span className="font-medium">Market</span>
                    <p className="text-xs sm:text-sm mt-1 dark:text-gray-400 text-gray-500">
                      Competitive market intelligence
                    </p>
                  </button>
                  <button
                    onClick={() => handleAgentSelection("Revenue Agent")}
                    className="w-full p-3 sm:p-4 text-left rounded-lg border dark:border-gray-700 border-[#AEC3FF]/50 dark:bg-[#2a3441] bg-[#AEC3FF]/10 dark:text-white text-[#4B65AB] hover:bg-[#AEC3FF]/20 dark:hover:bg-[#2A3441]/60 transition-colors text-sm sm:text-base"
                  >
                    <span className="font-medium">Revenue</span>
                    <p className="text-xs sm:text-sm mt-1 dark:text-gray-400 text-gray-500">
                      Analysis of revenue patterns
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
        <path
          d="M14 2V8H20"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 13H8"
          stroke="#E8F5E9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 17H8"
          stroke="#E8F5E9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 9H9H8"
          stroke="#E8F5E9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
