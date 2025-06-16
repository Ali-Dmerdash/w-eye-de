"use client"
import type React from "react"
import { useState, useEffect } from "react"
import Header from "@/components/ui/Header"
import Sidebar from "@/components/ui/Sidebar"
import { useSidebar } from "@/context/SidebarContext"
import { useNotifications } from "@/context/NotificationContext"
import { Send, CheckCircle, AlertTriangle, XCircle, Info, Users, MessageSquare, Sparkles, Clock, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

const notificationTypes = [
  {
    value: "info",
    label: "Info",
    icon: Info,
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    borderColor: "border-blue-100 dark:border-blue-800/30",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "success",
    label: "Success",
    icon: CheckCircle,
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    borderColor: "border-green-100 dark:border-green-800/30",
    textColor: "text-green-600 dark:text-green-400",
  },
  {
    value: "warning",
    label: "Warning",
    icon: AlertTriangle,
    color: "from-amber-500 to-orange-600",
    bgColor: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    borderColor: "border-amber-100 dark:border-amber-800/30",
    textColor: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "error",
    label: "Error",
    icon: XCircle,
    color: "from-red-500 to-rose-600",
    bgColor: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
    borderColor: "border-red-100 dark:border-red-800/30",
    textColor: "text-red-600 dark:text-red-400",
  },
]

export default function AdminPanelNotifications() {
  const { addNotification } = useNotifications()
  const { isCollapsed } = useSidebar()
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("info")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [showPage, setShowPage] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Use environment variable for admin password
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await addNotification({
        title,
        message,
        type: type as any,
      })
      setSuccess(true)
      setTitle("")
      setMessage("")
      setType("info")

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to send notification. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setShowPage(true)
      setPasswordError("")
    } else {
      setPasswordError("Incorrect password. Please try again.")
    }
  }

  const selectedType = notificationTypes.find((nt) => nt.value === type)

  return (
    <div className="min-h-screen transition-colors duration-300 dark:bg-[#15191c] bg-[#fafafa] relative">
      <Header />
      <Sidebar />

      {/* Password Modal Overlay */}
      {!showPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-sm p-8 relative flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Admin Access Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Enter the admin password to access this page.</p>
            <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Admin password"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <div className="text-red-600 text-sm font-medium text-center">{passwordError}</div>
              )}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Unlock Admin Panel
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 shadow"
              >
                Return Home
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {showPage && (
        <main className={`p-4 md:p-6 pt-8 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}>
          <div className="mx-auto">
            {/* Header Section */}
            <div
              className={`mb-8 transform transition-all duration-500 ease-out ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                      Send notifications to all users with custom messages
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div
                className={`lg:col-span-2 transform transition-all duration-500 ease-out delay-100 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <form
                  onSubmit={handleSubmit}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Notification</h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                        Notification Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        maxLength={100}
                        placeholder="Enter a compelling title for your notification"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{title.length}/100 characters</p>
                    </div>

                    {/* Message Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                        Message Content
                      </label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 min-h-[120px] resize-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        maxLength={1000}
                        placeholder="Write your notification message here. Be clear and concise to ensure maximum impact."
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{message.length}/1000 characters</p>
                    </div>

                    {/* Notification Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                        Notification Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {notificationTypes.map((nt) => {
                          const IconComponent = nt.icon
                          return (
                            <label
                              key={nt.value}
                              className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 hover:shadow-md ${
                                type === nt.value
                                  ? `bg-gradient-to-br ${nt.bgColor} ${nt.borderColor} shadow-lg`
                                  : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                              }`}
                            >
                               <input
                                 type="radio"
                                 name="type"
                                 value={nt.value}
                                 checked={type === nt.value}
                                 onChange={() => setType(nt.value)}
                                 className="sr-only"
                               />
                               <div className={`p-2 rounded-lg bg-gradient-to-br ${nt.color} shadow-lg`}>
                                 <IconComponent className="w-4 h-4 text-white" />
                               </div>
                               <div className="flex-1">
                                 <span
                                   className={`font-medium ${type === nt.value ? nt.textColor : "text-gray-700 dark:text-gray-200"}`}
                                 >
                                    {nt.label}
                                 </span>
                               </div>
                               {type === nt.value && (
                                 <div className="absolute top-2 right-2">
                                   <CheckCircle className={`w-5 h-5 ${nt.textColor}`} />
                                 </div>
                               )}
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Status Messages */}
                    {error && (
                      <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-100 dark:border-red-800/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                          <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="text-green-700 dark:text-green-300 font-medium">
                            Notification sent successfully to all users!
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending Notification...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Notification
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Preview Panel */}
              <div
                className={`transform transition-all duration-500 ease-out delay-200 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 overflow-hidden sticky top-6">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-3">
                        {selectedType && (
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-br ${selectedType.color} shadow-lg flex-shrink-0`}
                          >
                            <selectedType.icon className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {title || "Notification Title"}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {message || "Your notification message will appear here..."}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                selectedType
                                  ? `bg-gradient-to-br ${selectedType.bgColor} ${selectedType.textColor}`
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              }`}
                            >
                              {selectedType?.label || "Info"}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              Just now
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Delivery Info</span>
                      </div>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        This notification will be sent to all active users immediately upon submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
