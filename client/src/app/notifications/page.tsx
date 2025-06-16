"use client"
import { useState, useEffect } from "react"
import { useNotifications, type Notification } from "@/context/NotificationContext"
import Header from "@/components/ui/Header"
import Sidebar from "@/components/ui/Sidebar"
import { useSidebar } from "@/context/SidebarContext"
import { Bell, CheckCircle, AlertTriangle, XCircle, Info, Clock, Filter } from "lucide-react"

export default function NotificationsPage() {
    const { notifications } = useNotifications()
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(
        notifications.length > 0 ? notifications[0] : null,
    )
    const { isCollapsed } = useSidebar()
    const [isLoaded, setIsLoaded] = useState(false)
    const [filter, setFilter] = useState<string>("all")
    const { deleteNotification, markAllAsRead, markAsUnread, markAsRead } = useNotifications();

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-white" />
            case "warning":
                return <AlertTriangle className="w-5 h-5 text-white" />
            case "error":
                return <XCircle className="w-5 h-5 text-white" />
            default:
                return <Info className="w-5 h-5 text-white" />
        }
    }

    const getNotificationBg = (type: string) => {
        switch (type) {
            case "success":
                return "bg-gradient-to-br from-green-500 to-emerald-600"
            case "warning":
                return "bg-gradient-to-br from-amber-500 to-orange-600"
            case "error":
                return "bg-gradient-to-br from-red-500 to-rose-600"
            default:
                return "bg-gradient-to-br from-blue-500 to-indigo-600"
        }
    }

    const getNotificationAccent = (type: string) => {
        switch (type) {
            case "success":
                return "border-green-500 bg-green-50 dark:bg-green-900/10"
            case "warning":
                return "border-amber-500 bg-amber-50 dark:bg-amber-900/10"
            case "error":
                return "border-red-500 bg-red-50 dark:bg-red-900/10"
            default:
                return "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
        }
    }

    const filteredNotifications = notifications.filter((notification) => {
        if (filter === "all") return true
        if (filter === "new") return notification.isNew
        return notification.type === filter
    })

    const selectedIdx = filteredNotifications.findIndex(n => n.id === selectedNotification?.id);

    const handlePrev = () => {
        if (selectedIdx > 0) {
            setSelectedNotification(filteredNotifications[selectedIdx - 1]);
        }
    };

    const handleNext = () => {
        if (selectedIdx < filteredNotifications.length - 1) {
            setSelectedNotification(filteredNotifications[selectedIdx + 1]);
        }
    };

    const handleDelete = async () => {
        if (selectedNotification) {
            await deleteNotification(selectedNotification.id);
            const newList = filteredNotifications.filter(n => n.id !== selectedNotification.id);
            setSelectedNotification(newList[selectedIdx] || newList[selectedIdx - 1] || null);
        }
    };

    const handleMarkAsRead = async () => {
        if (selectedNotification && selectedNotification.isNew) {
            await markAsRead(selectedNotification.id);
            setSelectedNotification({ ...selectedNotification, isNew: false });
        }
    };

    const handleMarkAsUnread = async () => {
        if (selectedNotification && !selectedNotification.isNew) {
            await markAsUnread(selectedNotification.id);
            setSelectedNotification({ ...selectedNotification, isNew: true });
        }
    };

    const notificationCounts = {
        all: notifications.length,
        new: notifications.filter((n) => n.isNew).length,
        success: notifications.filter((n) => n.type === "success").length,
        warning: notifications.filter((n) => n.type === "warning").length,
        error: notifications.filter((n) => n.type === "error").length,
        info: notifications.filter((n) => n.type === "info").length,
    }

    return (
        <div className="min-h-screen transition-colors duration-300 dark:bg-[#15191c] bg-[#fafafa]">
            <Header />
            <Sidebar />
            <main className={`p-4 md:p-6 pt-8 transition-all duration-300 ${isCollapsed ? "sm:ml-16" : "sm:ml-64"}`}>
                {/* Header Section */}
                <div
                    className={`mb-8 transform transition-all duration-500 ease-out ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                >
                    <div className="flex flex-col md:flex-row md:items-center  gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                            <Bell className="w-6 h-6 text-white" />

                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
                            <p className="text-gray-600 dark:text-gray-300">Stay updated with all your important notifications</p>
                        </div>
                        
                    </div>
                </div>

                {/* Filter Tabs */}
                <div
                    className={`mb-6 transform transition-all duration-500 ease-out delay-100 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-2">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: "all", label: "All", count: notificationCounts.all },
                                { key: "new", label: "New", count: notificationCounts.new },
                                { key: "success", label: "Success", count: notificationCounts.success },
                                { key: "warning", label: "Warning", count: notificationCounts.warning },
                                { key: "error", label: "Error", count: notificationCounts.error },
                                { key: "info", label: "Info", count: notificationCounts.info },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${filter === tab.key
                                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                                            : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                        }`}
                                >
                                    {tab.label}
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs ${filter === tab.key
                                                ? "bg-white/20 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                            }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notifications List */}
                    <div
                        className={`lg:col-span-2 transform transition-all duration-500 ease-out delay-200 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            } h-[400px]`}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {filter === "all"
                                            ? "All Notifications"
                                            : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Notifications`}
                                    </h2>
                                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                        {filteredNotifications.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto dark:custom-scrollbar">
                                {filteredNotifications.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                            <Bell className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">No notifications found</p>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                                            {filter !== "all" ? `No ${filter} notifications available` : "You're all caught up!"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredNotifications.map((notification, index) => (
                                            <div
                                                key={notification.id}
                                                className={`p-6 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 ${selectedNotification?.id === notification.id
                                                        ? getNotificationAccent(notification.type)
                                                        : "border-transparent"
                                                    }`}
                                                onClick={() => setSelectedNotification(notification)}
                                                style={{
                                                    animationDelay: `${index * 50}ms`,
                                                }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-xl shadow-lg ${getNotificationBg(notification.type)}`}>
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                                                                {notification.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(notification.timestamp).toLocaleDateString()}
                                                                </div>
                                                                {notification.isNew && (
                                                                    <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-medium">
                                                                        New
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                                                            {notification.message}
                                                        </p>
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${notification.type === "success"
                                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                                                        : notification.type === "warning"
                                                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                                                            : notification.type === "error"
                                                                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                                    }`}
                                                            >
                                                                {notification.type}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(notification.timestamp).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notification Details */}
                    <div
                        className={`transform transition-all duration-500 ease-out delay-300 ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            } h-[400px]`}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
                            {selectedNotification ? (
                                <>
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`p-3 rounded-xl shadow-lg ${getNotificationBg(selectedNotification.type)}`}>
                                                {getNotificationIcon(selectedNotification.type)}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {selectedNotification.title}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${selectedNotification.type === "success"
                                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                                                : selectedNotification.type === "warning"
                                                                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                                                    : selectedNotification.type === "error"
                                                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                                                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                            }`}
                                                    >
                                                        {selectedNotification.type}
                                                    </span>
                                                    {selectedNotification.isNew && (
                                                        <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-medium">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            {new Date(selectedNotification.timestamp).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto dark:custom-scrollbar p-6">
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                {selectedNotification.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/30">
                                        <div className="flex gap-2">
                                            <button
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                            {selectedNotification.isNew ? (
                                                <button
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                                                    onClick={handleMarkAsRead}
                                                >
                                                    Mark as Read
                                                </button>
                                            ) : (
                                                <button
                                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
                                                    onClick={handleMarkAsUnread}
                                                >
                                                    Mark as Unread
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm disabled:opacity-50"
                                                onClick={handlePrev}
                                                disabled={selectedIdx <= 0}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm disabled:opacity-50"
                                                onClick={handleNext}
                                                disabled={selectedIdx === -1 || selectedIdx >= filteredNotifications.length - 1}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <Bell className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Notification</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Choose a notification from the list to view its details
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
