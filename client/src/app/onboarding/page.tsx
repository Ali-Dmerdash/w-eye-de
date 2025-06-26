"use client"

import type React from "react"
import { useState, Suspense, lazy } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/app/sphere/ui/badge"
import { Upload, FileText, CheckCircle, Loader2, X, File, ImageIcon, ArrowRight, Sparkles, Plus, Ellipsis, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
// Lazy load Spline to improve initial loading
const Spline = lazy(() => import("@splinetool/react-spline"))
import logo from "../../assets/LOGO1.png"
import eye from "@/assets/eye.png"
import { Textarea } from "@/app/sphere/ui/textarea"
import { useAuthFlow } from "@/hooks/useAuthFlow"

interface FileAttachment {
    id: string
    name: string
    extension: string
    size: string
    agent?: string
    file?: File
}

export default function OnboardingPage() {
    const { user } = useUser()
    const router = useRouter()
    const { completeOnboarding, redirectToHome } = useAuthFlow()

    const [userDescription, setUserDescription] = useState("")
    const [uploadedFiles, setUploadedFiles] = useState<FileAttachment[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<"description" | "files" | "complete">("description")
    const [showAgentModal, setShowAgentModal] = useState(false)
    const [currentFileId, setCurrentFileId] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<{
        success?: boolean;
        message?: string;
    } | null>(null)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const newAttachments: FileAttachment[] = files.map(file => ({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name.split(".")[0],
            extension: file.name.split(".").pop() || "",
            size: formatFileSize(file.size),
            agent: undefined,
            file: file,
        }))

        setUploadedFiles((prev) => [...prev, ...newAttachments])
        setUploadStatus(null)
        event.target.value = ""
    }

    const handleClickUpload = () => {
        document.getElementById('file-upload')?.click()
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
        );
    }

    const handleSkipDescription = async () => {
        setIsLoading(true)
        try {
            await user?.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    userDescription: "Skipped by user",
                    descriptionCompleted: true,
                },
            })
            setStep("files")
        } catch (error) {
            console.error("Error skipping description:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const removeFile = (id: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
        setUploadStatus(null)
    }

    const openAgentModal = (id: string) => {
        setCurrentFileId(id)
        setShowAgentModal(true)
    }

    const handleAgentSelection = (agentType: string) => {
        if (currentFileId) {
            setUploadedFiles((prevFiles) =>
                prevFiles.map((file) =>
                    file.id === currentFileId ? { ...file, agent: agentType } : file
                )
            )
            setShowAgentModal(false)
        }
    }

    const allFilesHaveAgents = uploadedFiles.every((file) => file.agent)

    const getFileIcon = (extension: string) => {
        const ext = extension.toLowerCase()
        if (ext === "pdf") {
            return <FileText className="w-4 h-4" />
        } else if (ext === "csv" || ext === "xlsx" || ext === "xls") {
            return <FileText className="w-4 h-4" />
        } else {
            return <File className="w-4 h-4" />
        }
    }

    const handleSaveDescription = async () => {
        if (!userDescription.trim()) return

        setIsLoading(true)
        try {
            await user?.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    userDescription: userDescription.trim(),
                    descriptionCompleted: true,
                },
            })
            setStep("files")
        } catch (error) {
            console.error("Error saving description:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCompleteOnboarding = async () => {
        setIsLoading(true)
        setUploadStatus(null)

        try {
            // If there are files with agents, upload them first
            if (uploadedFiles.length > 0 && allFilesHaveAgents) {
                setIsUploading(true)

                // Track successful uploads
                let successCount = 0
                let failedCount = 0
                let uploadedFileNames: string[] = []

                // Process each file
                for (const fileToUpload of uploadedFiles) {
                    if (!fileToUpload.file) {
                        failedCount++
                        continue
                    }

                    try {
                        const formData = new FormData()
                        formData.append("file", fileToUpload.file)
                        formData.append("agent", fileToUpload.agent || "")

                        const response = await fetch("http://localhost:3001/api/data/upload", {
                            method: "POST",
                            body: formData,
                        })

                        if (response.ok) {
                            successCount++
                            uploadedFileNames.push(fileToUpload.name)
                        } else {
                            failedCount++
                        }
                    } catch (error) {
                        failedCount++
                    }
                }

                setIsUploading(false)

                // If some uploads failed, show error but continue with onboarding
                if (failedCount > 0 && successCount === 0) {
                    setUploadStatus({
                        success: false,
                        message: "All file uploads failed. Continuing with onboarding..."
                    })
                }

                // --- NEW LOGIC: Call LLMRun endpoints for each unique agent type ---
                // Map agent display names to endpoint paths
                const agentEndpointMap: Record<string, string> = {
                    "Fraud Agent": "http://localhost:3001/api/fraud/LLMRun",
                    "Market Agent": "http://localhost:3001/api/market/LLMRun",
                    "Revenue Agent": "http://localhost:3001/api/revenue/LLMRun",
                };
                // Get unique agent types from uploaded files
                const uniqueAgents = Array.from(new Set(uploadedFiles.map(f => f.agent).filter(Boolean)));
                console.log("[Onboarding] Unique agents to call LLMRun for:", uniqueAgents);
                // Call each endpoint for the agent types present
                for (const agent of uniqueAgents) {
                    const endpoint = agentEndpointMap[agent as string];
                    if (endpoint) {
                        console.log(`[Onboarding] Calling LLMRun endpoint for agent: ${agent} -> ${endpoint}`);
                        try {
                            const resp = await fetch(endpoint, { method: "GET" });
                            console.log(`[Onboarding] Response for ${agent}:`, resp.status, resp.statusText);
                        } catch (err) {
                            console.error(`Error calling LLMRun for agent ${agent}:`, err);
                        }
                    } else {
                        console.warn(`[Onboarding] No endpoint mapped for agent: ${agent}`);
                    }
                }
                // --- END NEW LOGIC ---
            }

            setStep("complete")

            // Show completion screen first, then update metadata to prevent immediate redirect
            setTimeout(async () => {
                // Update user metadata with onboarding completion
                await user?.update({
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        firstLogin: false,
                        onboardingCompleted: true,
                        filesUploaded: uploadedFiles.length > 0,
                        uploadedFileNames: uploadedFiles.map((f) => f.name),
                    },
                })

                // Small delay after metadata update before redirect
                setTimeout(() => {
                    window.location.href = "/home-page"
                }, 500)
            }, 10000) // Show completion screen for 5 seconds first

        } catch (error) {
            console.error("Error completing onboarding:", error)
            setUploadStatus({
                success: false,
                message: "Onboarding completion failed. Please try again."
            })
            // Even on error, show completion and redirect to prevent being stuck
            setStep("complete")
            setTimeout(() => {
                window.location.href = "/home-page"
            }, 80000)
        } finally {
            setIsLoading(false)
            setIsUploading(false)
        }
    }

    if (step === "complete") {
        return (
            <div className="h-screen flex-col items-center justify-center shadow-inner-custom ">
                <div className="relative h-full flex-col rounded-xl flex p-6 px-24 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#15191c] to-[#000000]">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20" />}>
                            <Spline scene="https://prod.spline.design/TIm8seQKPePe4NAE/scene.splinecode" />
                        </Suspense>
                    </div>

                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-12 z-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-full blur-xl"></div>
                            <Image src={logo || "/placeholder.svg"} alt="logo" className="w-36 opacity-90 relative z-10" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center z-10 w-full">
                        <div className="relative p-8 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 text-center shadow-2xl">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-purple-400/10 rounded-3xl"></div>

                            <div className="flex justify-center mb-8 relative z-10">
                                <div className="relative p-6 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full backdrop-blur-sm border border-emerald-400/30">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full animate-pulse"></div>
                                    <CheckCircle className="md:h-20 md:w-20 h-10 w-10 text-emerald-400 relative z-10" />
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent mb-4">
                                    Setup Complete!
                                </h2>
                                <p className="text-gray-300 mb-8 text-sm md:text-xl leading-relaxed max-w-md mx-auto">
                                    Welcome to your custom based dashboard. Analyzing your data...
                                </p>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-600/30 rounded-full blur-lg animate-pulse"></div>
                                        <Loader2 className="h-10 w-10 animate-spin text-purple-400 relative z-10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#15191c] to-[#000000] relative">
            {/* Top center logo, always visible */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-8 z-20">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 to-purple-400/15 rounded-full blur-2xl scale-150"></div>
                    <Image src={logo || "/placeholder.svg"} alt="logo" className="w-32 opacity-90 relative z-10 drop-shadow-2xl" />
                </div>
            </div>

            {/* Agent selection modal, always rendered above all content */}
            {showAgentModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-r from-black/10 via-transparent to-transparent rounded-2xl shadow-2xl border border-white/10 w-full max-w-md transform relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                            <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
                        </div>
                        <div className="p-6 border-b border-white/10 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-purple-600/20 rounded-xl">
                                        <Ellipsis className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-white">
                                        Select Agent
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowAgentModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 relative z-10">
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                                    General Purpose
                                </h3>
                                <button
                                    onClick={() => handleAgentSelection("Public Agent")}
                                    className="w-full p-4 text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                                >
                                    <div className="font-medium text-white group-hover:text-purple-400">
                                        Public Agent
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">
                                        General purpose analysis for public data processing
                                    </p>
                                </button>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                                    Specialized Agents
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        {
                                            name: "Fraud Agent",
                                            description: "Specialized in fraud detection and risk analysis",
                                        },
                                        {
                                            name: "Market Agent",
                                            description: "Competitive analysis and market intelligence",
                                        },
                                        {
                                            name: "Revenue Agent",
                                            description: "Revenue forecasting and financial analysis",
                                        },
                                    ].map((agent) => (
                                        <button
                                            key={agent.name}
                                            onClick={() => handleAgentSelection(agent.name)}
                                            className="w-full p-4 text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
                                        >
                                            <div className="font-medium text-white group-hover:text-purple-400">
                                                {agent.name}
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">
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

            {/* Step content below the logo */}
            <div className="w-full flex-1 flex flex-col items-center justify-center">
                <div className="max-w-md p-6 ">
                    <div className="absolute inset-0 z-0 opacity-20">
                        <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20" />}>
                            <Spline scene="https://prod.spline.design/TIm8seQKPePe4NAE/scene.splinecode" />
                        </Suspense>
                    </div>
                    
                    <div className="w-full z-10 flex flex-col justify-center items-center py-16">
                        <div className="mb-8 w-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-bold">
                                        {step === "description" ? "1" : "2"}
                                    </div>
                                    <span className="text-sm font-medium bg-gradient-to-r from-gray-300 to-white bg-clip-text text-transparent">
                                        Step {step === "description" ? "1" : "2"} of 2
                                    </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <span className="text-xs text-gray-400">Almost there</span>
                                </div>
                            </div>
                            <div className="relative w-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full"></div>
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-purple-500 h-full rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                                    style={{ width: step === "description" ? "50%" : "100%" }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            {step === "description" ? (
                                <div className="space-y-8 w-full">
                                    <Card className="dark relative bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-500/5 rounded-2xl"></div>

                                        <CardHeader className="relative z-10 pb-6">
                                            <CardTitle className="text-white text-center text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                                                Tell us what you need
                                            </CardTitle>
                                            <CardDescription className="text-gray-300 text-center text-base leading-relaxed mt-3">
                                                Describe what you want the system to do for you
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6 relative z-10">
                                            <div className="relative">
                                                <Textarea
                                                    placeholder="I need a system that helps me with..."
                                                    value={userDescription}
                                                    onChange={(e) => setUserDescription(e.target.value)}
                                                    className="custom-scrollbar1 bg-gradient-to-r from-white/5 to-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl min-h-[150px] backdrop-blur-sm focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 resize-none"
                                                />
                                            </div>

                                            <Button
                                                onClick={handleSaveDescription}
                                                disabled={!userDescription.trim() || isLoading}
                                                className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 text-white rounded-xl h-14 text-base font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center">
                                                        <Loader2 className="h-5 w-5 animate-spin mr-3" />
                                                        Processing...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        Next Step
                                                        <ArrowRight className="ml-3 h-5 w-5" />
                                                    </div>
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                    <div className="mt-6 text-center relative">
                                        <div className="w-full border-t border-white/10 pb-4"></div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 text-sm text-gray-400">or</span>
                                        </div>
                                        <button
                                            onClick={handleSkipDescription}
                                            className="mt-6 group relative flex items-center justify-center w-full py-3 px-6 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                            disabled={isLoading}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-purple-500/10 to-purple-600/10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-white/20 transition-colors duration-300"></div>
                                            <div className="absolute -inset-px bg-gradient-to-r from-purple-500/0 via-purple-400/0 to-purple-500/0 group-hover:from-purple-500/20 group-hover:via-purple-400/20 group-hover:to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="p-2 bg-gradient-to-br from-purple-600/20 to-purple-500/20 rounded-full group-hover:from-purple-600/30 group-hover:to-purple-500/30 transition-all duration-300">
                                                    <Upload className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                                                </div>
                                                <span className="text-base font-medium bg-gradient-to-r from-gray-100 to-white bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-100 transition-all duration-300">
                                                    Skip to File Upload
                                                </span>
                                            </div>
                                        </button>
                                        <p className="mt-3 text-xs text-gray-500">You can describe your needs later</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8 w-full">
                                    <Card className="dark custom-scrollbar relative bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-purple-500/5 rounded-2xl"></div>

                                        <CardHeader className="relative z-10 pb-6">
                                            <CardTitle className="text-white text-center text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                                                Upload your data
                                            </CardTitle>
                                            <CardDescription className="text-gray-300 text-center text-base leading-relaxed mt-3">
                                                Start with your existing files to personalize your experience
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6 relative z-10">
                                            <div onClick={handleClickUpload} className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-400/50 transition-all duration-300 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm group cursor-pointer">
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                <div className="relative z-10">
                                                    <div className="mb-4 flex justify-center">
                                                        <div className="p-4 bg-gradient-to-br from-purple-600/20 to-purple-500/20 rounded-full">
                                                            <Upload className="h-8 w-8 text-purple-400" />
                                                        </div>
                                                    </div>
                                                    <Label
                                                        className="text-gray-200 block text-lg font-medium mb-2"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Click to upload files
                                                        <Input
                                                            id="file-upload"
                                                            type="file"
                                                            multiple
                                                            accept=".csv,.pdf,.json,.txt"
                                                            className="hidden"
                                                            onChange={handleFileUpload}

                                                        />
                                                    </Label>
                                                    <p className="text-sm text-gray-400">CSV, PDF, JSON, TXT files supported</p>
                                                </div>
                                            </div>

                                            {uploadedFiles.length > 0 && (
                                                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h3 className="text-base font-semibold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                                                            Uploaded Files ({uploadedFiles.length})
                                                        </h3>
                                                    </div>
                                                    {uploadedFiles.map((file) => (
                                                        <div
                                                            key={file.id}
                                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="p-2 bg-gradient-to-br from-purple-600/20 to-purple-500/20 rounded-lg">
                                                                    {getFileIcon(file.extension)}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm text-white truncate max-w-[180px] font-medium">{file.name}</span>
                                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                        <span>{file.extension.toUpperCase()}</span>
                                                                        <span>|</span>
                                                                        <span>{file.size}</span>
                                                                        <span>|</span>
                                                                        {file.agent ? (
                                                                            <span className="text-purple-400 font-medium">
                                                                                {file.agent}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="font-bold underline text-amber-400">
                                                                                Agent Not Selected
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    className={`p-2 bg-white/10 border border-purple-200/20 rounded-lg hover:bg-purple-50/10 transition-colors duration-150 ${!file.agent
                                                                        ? "animate-pulse-attention ring-2 ring-purple-300/50"
                                                                        : ""
                                                                        }`}
                                                                    onClick={() => openAgentModal(file.id)}
                                                                    title="Select agent"
                                                                >
                                                                    <Ellipsis className="w-4 h-4 text-purple-400" />
                                                                </button>
                                                                <button
                                                                    onClick={() => removeFile(file.id)}
                                                                    className="p-2 bg-white/10 border border-red-200/20 rounded-lg hover:bg-red-50/10 transition-colors duration-150"
                                                                    title="Remove file"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-400" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {uploadStatus && !uploadStatus.success && (
                                                <div className="p-4 rounded-xl bg-red-50/10 border border-red-200/20">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1 bg-red-100/20 rounded-full">
                                                            <X className="w-4 h-4 text-red-400" />
                                                        </div>
                                                        <p className="text-red-200 font-medium">
                                                            Upload Failed
                                                        </p>
                                                    </div>
                                                    <p className="text-red-300 text-sm mt-1 ml-6">
                                                        {uploadStatus?.message}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex space-x-4 pt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setStep("description")}
                                                    className="border-white/20 text-gray-300 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/15 rounded-xl h-14 px-8 backdrop-blur-sm transition-all duration-300"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    onClick={handleCompleteOnboarding}
                                                    disabled={isLoading || isUploading || uploadedFiles.length === 0 || !allFilesHaveAgents}
                                                    className={`flex-1 rounded-xl h-14 text-base font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${uploadedFiles.length === 0 || !allFilesHaveAgents || isLoading || isUploading
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 hover:from-purple-700 hover:via-purple-600 hover:to-purple-700 text-white shadow-purple-500/25"
                                                        }`}
                                                >
                                                    {isLoading || isUploading ? (
                                                        <div className="flex items-center">
                                                            <Loader2 className="h-5 w-5 animate-spin mr-3" />
                                                            {isUploading ? "Uploading Files..." : "Completing Setup..."}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <Sparkles className="mr-3 h-5 w-5" />
                                                            {uploadedFiles.length === 0
                                                                ? "Upload Files to Continue"
                                                                : allFilesHaveAgents
                                                                    ? "Complete Setup"
                                                                    : "Select Agents for All Files"
                                                            }
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
