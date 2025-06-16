"use client"
import React, { useRef, useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, Clock, Calendar, Trash2 } from "lucide-react"
import type { Notification } from "@/context/NotificationContext"
import { useNotifications } from "@/context/NotificationContext"

interface NotificationModalProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { deleteNotification } = useNotifications()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleDelete = async () => {
    if (notification) {
      await deleteNotification(notification.id)
      onClose()
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getNotificationIcon = (type: string) => {
    const iconClasses = "w-6 h-6"
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClasses} text-green-600 dark:text-green-400`} />
      case "warning":
        return <AlertTriangle className={`${iconClasses} text-amber-600 dark:text-amber-400`} />
      case "error":
        return <AlertCircle className={`${iconClasses} text-red-600 dark:text-red-400`} />
      default:
        return <Info className={`${iconClasses} text-blue-600 dark:text-blue-400`} />
    }
  }

  const getIconBackground = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-900/30"
      case "warning":
        return "bg-amber-100 dark:bg-amber-900/30"
      case "error":
        return "bg-red-100 dark:bg-red-900/30"
      default:
        return "bg-blue-100 dark:bg-blue-900/30"
    }
  }

  const getGradientBackground = (type: string) => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
      case "warning":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
      case "error":
        return "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"
      default:
        return "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 dark:border-green-800/30"
      case "warning":
        return "border-amber-200 dark:border-amber-800/30"
      case "error":
        return "border-red-200 dark:border-red-800/30"
      default:
        return "border-blue-200 dark:border-blue-800/30"
    }
  }

  const getButtonStyle = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700 focus:ring-green-500"
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
      case "error":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      default:
        return "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
    }
  }

  if (!isOpen || !notification) return null

  return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 w-full max-w-lg transform animate-in zoom-in-95 duration-200 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="w-full h-full bg-purple-300 rounded-full transform translate-x-12 -translate-y-12"></div>
          </div>

          {/* Header */}
          <div className="p-6 border-b border-purple-100 dark:border-gray-700 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shadow-sm ${getIconBackground(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Details</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {getRelativeTime(notification.timestamp)}
                  </span>
                  </div>
                </div>
              </div>
              <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 relative z-[99999999]">
            {/* Title */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{notification.title}</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
            </div>

            {/* Message */}
            <div
                className={`p-4 rounded-xl border ${getBorderColor(notification.type)} ${getGradientBackground(notification.type)} mb-6`}
            >
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {notification.message.split('\n').map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>

            {/* Timestamp */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Received</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{formatTimestamp(notification.timestamp)}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Dismiss
              </button>
              <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
        </div>
      </div>
  )
}

export default NotificationModal
