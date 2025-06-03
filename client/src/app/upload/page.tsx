"use client";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import { Plus, Download, Trash2, Info, Ellipsis, X, Upload, FileText, CheckCircle } from "lucide-react";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { useNotifications } from '@/context/NotificationContext';

interface UploadedFile {
  id: string;
  name: string;
  extension: string;
  size: string;
  agent?: string;
  file?: File;
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const successModalRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotifications();

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
      if (
        showSuccessModal &&
        successModalRef.current &&
        !successModalRef.current.contains(event.target as Node)
      ) {
        setShowSuccessModal(false);
        setFiles([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal, showSuccessModal]);

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
      file: file,
    };
    setFiles([newFile]);
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

  const allFilesHaveAgents = files.every((file) => file.agent);

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
      formData.append("agent", fileToUpload.agent || "");

      const response = await fetch("http://localhost:3001/api/data/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus(null);
        setShowSuccessModal(true);
        setUploadedFileName(fileToUpload.name);
        addNotification({
          title: "Upload Successful",
          message: `File "${fileToUpload.name}" has been uploaded and is ready for processing.`,
          type: "success",
        });
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#15191c] transition-all duration-300">
      <Sidebar />
      <Header />
      <div
        className={`p-4 md:p-6 pt-20 transition-all duration-300 ${
          isCollapsed ? "sm:ml-16" : "sm:ml-64"
        }`}
      >
        {/* Header Section */}
        <div className="mb-8 flex flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Data Upload</h1>
            
          </div>
          
        </div>

        {/* Main Upload Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
          </div>

          <div className="relative z-10">
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl shadow-sm">
                <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Your Files</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Drag and drop or click to select files</p>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-xl mb-6 py-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500"
                  : "border-purple-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-gray-500 hover:bg-purple-25 dark:hover:bg-gray-700/30"
              } ${files.length > 0 ? "pointer-events-none opacity-75" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
            >
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6 shadow-sm">
                <Plus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>

              <div className={`${files.length > 0 ? "opacity-50" : ""} flex flex-col items-center`}>
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-2 font-medium">
                  Drag & drop or click to choose files
                </p>
                <div className="flex flex-col text-gray-500 dark:text-gray-400 items-center space-y-1">
                  <p className="text-sm">Accepted files: .csv, .pdf, .json</p>
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    <p className="text-sm">Max file size: 50 MB</p>
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

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Uploaded Files
                </h3>
                
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-purple-100 dark:border-gray-600 hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center">
                        <div className="mr-3 sm:mr-4">
                          <FileIcon className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <h4 className="font-medium text-gray-900 dark:text-white text-base sm:text-lg md:text-xl truncate max-w-[180px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-full">{file.name}</h4>
                          <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                            <span>{file.extension.toUpperCase()}</span>
                            <span>|</span>
                            <span>{file.size}</span>
                            <span>|</span>
                            {file.agent ? (
                              <span className="text-purple-600 dark:text-purple-400 font-medium">{file.agent}</span>
                            ) : (
                              <span className="font-bold underline text-amber-600 dark:text-amber-400">
                                Agent Not Selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row sm:justify-normal justify-center gap-3 sm:gap-4 mt-4 sm:mt-0">
                        <button
                          className={`flex justify-center w-full lg:w-auto items-center p-3 w-12 h-12 bg-white dark:bg-gray-700 border border-purple-200 dark:border-gray-600 rounded-2xl md:rounded-full hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors duration-150 ${
                            !file.agent ? "animate-pulse-attention ring-2 ring-purple-300 dark:ring-purple-600" : ""
                          }`}
                          onClick={() => openAgentModal(file.id)}
                          aria-label="Select agent"
                          title="Select agent"
                        >
                          <Ellipsis className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <p className="text-xs ps-2 md:hidden text-purple-600 dark:text-purple-400">
                            Select Agent
                          </p>
                        </button>
                        <button
                          className="flex justify-center w-full lg:w-auto items-center p-3 w-12 h-12 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-600 rounded-2xl md:rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-150"
                          onClick={() => handleRemoveFile(file.id)}
                          aria-label="Remove file"
                          title="Remove file"
                        >
                          <Trash2 className="w-5 h-5 text-red-500 dark:text-red-400" />
                          <p className="text-xs ps-2 md:hidden text-red-500 dark:text-red-400">
                            Remove File
                          </p>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Status */}
                {uploadStatus && !uploadStatus.success && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-red-100 dark:bg-red-900/50 rounded-full">
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <p className="text-red-800 dark:text-red-200 font-medium">Upload Failed</p>
                    </div>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1 ml-6">{uploadStatus.message}</p>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex justify-center pt-4">
                  <button
                    className={`px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 ${
                      allFilesHaveAgents && !isUploading
                        ? "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                        : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!allFilesHaveAgents || isUploading}
                    onClick={handleUpload}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </div>
                    ) : (
                      "Upload File"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-md transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
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
                    <Ellipsis className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Agent</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10">
              {/* Public Agent Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-300">
                  General Purpose
                </h3>
                <button
                  onClick={() => handleAgentSelection("Public Agent")}
                  className="w-full p-4 text-left rounded-xl border border-purple-100 dark:border-gray-600 bg-purple-25 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Public Agent
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    General purpose analysis for public data processing
                  </p>
                </button>
              </div>

              {/* Specific Agents Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-300">
                  Specialized Agents
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Fraud Agent",
                      description: "Specialized in fraud detection and risk analysis"
                    },
                    {
                      name: "Market Agent", 
                      description: "Competitive analysis and market intelligence"
                    },
                    {
                      name: "Revenue Agent",
                      description: "Revenue forecasting and financial analysis"
                    }
                  ].map((agent) => (
                    <button
                      key={agent.name}
                      onClick={() => handleAgentSelection(agent.name)}
                      className="w-full p-4 text-left rounded-xl border border-purple-100 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <div className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {agent.name}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {agent.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            ref={successModalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-md transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <div className="w-full h-full bg-green-300 rounded-full transform translate-x-12 -translate-y-12"></div>
            </div>

            {/* Header */}
            <div className="p-6 border-b border-purple-100 dark:border-gray-700 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-sm">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Successful!</h2>
                </div>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setFiles([]);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center relative z-10">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full inline-flex mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                File Uploaded Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                "{uploadedFileName}" has been uploaded and is ready for processing.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setFiles([]);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Upload Another File
              </button>
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
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="14,2 14,8 20,8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
