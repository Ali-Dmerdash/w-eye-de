"use client"
import React, { useRef, useEffect, useMemo } from "react"
import { ArrowLeft, ArrowRight, Bell, Dot, MessageSquare } from "lucide-react"
import Image from "next/image"
import eye from "@/assets/eye.png"
import eyeLight from "@/assets/eyeLight.png"
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux';
import { selectNotifications, selectNewNotificationsCount, markAllAsRead, Notification } from '@/app/redux/notificationSlice';
import NotificationModal from "./NotificationModal";

export default function Header() {
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const [isEditing, setIsEditing] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);
  const [showNotificationModal, setShowNotificationModal] = React.useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const { openChat, setShowHelpModal } = useChat();
  const notifications = useSelector(selectNotifications);
  const newNotificationsCount = useSelector(selectNewNotificationsCount);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      // Mark notifications as read when opening the dropdown
      setTimeout(() => dispatch(markAllAsRead()), 1000);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    setNotificationsOpen(false); // Close dropdown when opening modal
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedNotification(null);
  };

  const handleClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBlur = () => {
    if (!inputRef.current?.value) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputRef.current?.value) {
      const query = inputRef.current.value;
      
      if (query.trim().toLowerCase() === '/help') {
        setShowHelpModal(true);
        openChat();
        inputRef.current.value = '';
        setIsEditing(false);
        return;
      }
      
      openChat(query);
      inputRef.current.value = '';
      setIsEditing(false);
    }
  };

  const todayDate = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    return `${today.toLocaleDateString("en-US", options)}`;
  }, []);

  const yesterdayDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric'
    };
    return `${today.toLocaleDateString("en-US", options)}`;
  }, []);

  const tmwDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric'
    };
    return `${today.toLocaleDateString("en-US", options)}`;
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return new Date(timestamp).toLocaleDateString();
    }
  };

  const getNotificationBorderColor = (type: string, isNew: boolean) => {
    if (!isNew) return 'border-gray-300 dark:border-gray-600';
    
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'warning':
        return 'border-[#ef672d]';
      case 'error':
        return 'border-red-500';
      default:
        return 'border-blue-500';
    }
  };

  const getNotificationBgColor = (type: string, isNew: boolean) => {
    if (!isNew) return 'hover:bg-gray-100 dark:hover:bg-gray-700/30';
    
    switch (type) {
      case 'success':
        return 'bg-green-500/10 dark:bg-green-500/5 hover:bg-green-500/20 dark:hover:bg-green-500/10';
      case 'warning':
        return 'bg-[#ef672d]/10 dark:bg-[#ef672d]/5 hover:bg-[#ef672d]/20 dark:hover:bg-[#ef672d]/10';
      case 'error':
        return 'bg-red-500/10 dark:bg-red-500/5 hover:bg-red-500/20 dark:hover:bg-red-500/10';
      default:
        return 'bg-blue-500/10 dark:bg-blue-500/5 hover:bg-blue-500/20 dark:hover:bg-blue-500/10';
    }
  };

  const toggleButton = theme === "dark" ? (
    <div id="lightMode-btn" className="relative flex items-center border border-gray-200 border-opacity-30 h-10 px-4 md:space-x-2 space-x-1 rounded-xl">
      <button type="button" className="flex items-center rounded-full text-sm text-white" onClick={() => setTheme("light")}>
        <svg className="shrink-0 size-4 text-white" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={12} cy={12} r={4} />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </button>
    </div>
  ) : (
    <div id="darkMode-btn" className="relative flex items-center border border-[#15191c] border-opacity-40 h-10 px-4 md:space-x-2 space-x-1 rounded-xl">
      <button type="button" className="flex items-center rounded-full text-sm text-[#15191c]" onClick={() => setTheme("dark")}>
        <svg className="shrink-0 size-4 text-[#15191c]" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      <div
        className={`font-mulish top-0 right-0 z-40 flex items-center justify-between w-full px-6 py-3 bg-[#fafafa] dark:bg-[#15191c] transition-all duration-300 ${isCollapsed ? "sm:ml-16 sm:w-[calc(100%-4rem)]" : "sm:ml-64 sm:w-[calc(100%-16rem)]"}`}
      >
        <div className="sm:hidden flex items-center">
          <Image
            onClick={() => setIsMobileOpen((prev) => !prev)}
            src={theme === "dark" ? eye : eyeLight || "/placeholder.svg"}
            className="cursor-pointer rotate-90 md:hidden"
            alt="Logo"
          />
        </div>
        <div className="flex items-center">
          <div className="hidden md:flex items-center px-4 py-2 bg-[#E4E5F1] dark:bg-[#1B2131] rounded-xl lg:w-96 w-48" onClick={handleClick}>
            <svg
              className="w-5 h-5 mr-2 text-[#15191c] dark:text-gray-200 cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering handleClick
                openChat();
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                className="text-sm font-medium text-[#15191c] dark:text-gray-200 bg-transparent border-none outline-none w-full"
                placeholder="Type something..."
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <span className="text-sm font-medium text-[#15191c] dark:text-gray-200 opacity-80 cursor-text">AI Assistant</span>
            )}
          </div>
        </div>
        <div className="flex items-center md:space-x-4 space-x-2 ms-1">
          {/* Chat icon for small screens */}
          <div 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-[#15191c] dark:border-gray-200 border-opacity-40 dark:border-opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
            onClick={() => openChat()}
          >
            <MessageSquare className="w-5 h-5 text-[#15191c] dark:text-gray-200" />
          </div>
          
          {toggleButton}
          <div 
            ref={notificationRef} 
            className="relative flex items-center border border-[#15191c] dark:border-gray-200 border-opacity-40 dark:border-opacity-30 h-10 px-4 md:space-x-2 space-x-1 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/30 transition-colors"
            onClick={toggleNotifications}
          >
            <div className="flex items-center relative">
              <Bell className="w-5 h-5 text-[#15191c] dark:text-gray-200" />
              {newNotificationsCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <span className="relative flex items-center justify-center size-[0.5rem]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ef672d] opacity-75" />
                    <span className="relative inline-flex size-[0.4rem] rounded-full bg-[#ef672d]" />
                  </span>
                </div>
              )}
            </div>
            {newNotificationsCount > 0 && (
              <div className="bg-[#e0e0e0] dark:bg-[#3d464e70] border border-[#15191c] dark:border-gray-200 border-opacity-40 dark:border-opacity-30 rounded-lg px-2">
                <span className="mx-1 md:text-sm text-xs font-medium text-[#15191c] dark:text-white text-nowrap">
                  {newNotificationsCount} NEW
                </span>
              </div>
            )}
            
            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 top-12 w-80 rounded-md shadow-lg bg-white dark:bg-[#1d2328] border dark:border-gray-700 border-gray-200 z-50 no-scrollbar">
                <div className="py-2 px-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-[#15191c] dark:text-white">Notifications</h3>
                  {newNotificationsCount > 0 && (
                    <span className="bg-[#e0e0e0] dark:bg-[#3d464e70] border border-[#15191c] dark:border-gray-200 border-opacity-40 dark:border-opacity-30 rounded-lg px-2">
                      <span className="mx-1 text-xs font-medium text-[#15191c] dark:text-white text-nowrap">
                        {newNotificationsCount} NEW
                      </span>
                    </span>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 border-l-4 ${getNotificationBorderColor(notification.type, notification.isNew)} ${getNotificationBgColor(notification.type, notification.isNew)} transition-colors cursor-pointer hover:scale-[1.02] transform`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold text-sm ${notification.isNew ? 'text-[#15191c] dark:text-white' : 'text-[#15191c]/80 dark:text-gray-300'}`}>
                            {notification.title}
                          </span>
                          <span className={`text-xs ${notification.isNew ? 'text-[#15191c]/70 dark:text-gray-400' : 'text-[#15191c]/60 dark:text-gray-500'}`}>
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-sm ${notification.isNew ? 'text-[#15191c]/80 dark:text-gray-300' : 'text-[#15191c]/70 dark:text-gray-400'}`}>
                          {notification.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700/30 rounded-full flex items-center justify-center">
                        <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">You'll see notifications here when they arrive</p>
                    </div>
                  )}
                </div>
                <div className="py-2 px-3 border-t border-gray-200 dark:border-gray-700 text-center">
                  <button className="text-sm text-[#4B65AB] dark:text-[#AEC3FF] hover:underline">View All Notifications</button>
                </div>
              </div>
            )}
          </div>
          <div className="hidden sm:flex items-center px-4 h-10 border border-[#15191c] dark:border-gray-200 border-opacity-40 dark:border-opacity-30 md:space-x-6 space-x-2 rounded-xl text-nowrap">
            <span className="flex flex-row items-center justify-center space-y-">
              {/* <ArrowLeft className="md:w-5 w-3 md:h-5 h-3 text-[#15191c] dark:text-gray-200" /> */}
              <span className="text-gray-500 dark:text-gray-400 text-[0.5rem] hidden md:block">
                {yesterdayDate}
              </span>
            </span>
            <span className="md:text-sm text-xs font-medium text-[#15191c] dark:text-gray-200">{todayDate}</span>
            <span className="flex flex-row-reverse items-center justify-center space-y-">
              {/* <ArrowRight className="md:w-5 w-3 md:h-5 h-3 text-[#15191c] dark:text-gray-200" /> */}
              <span className="text-gray-500 dark:text-gray-400 text-[0.5rem] hidden md:block">
                {tmwDate}
              </span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Notification Modal */}
      <NotificationModal
        notification={selectedNotification}
        isOpen={showNotificationModal}
        onClose={closeNotificationModal}
      />
    </>
  );
}

