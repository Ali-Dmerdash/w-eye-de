"use client";
import React, { useRef, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '@/app/redux/notificationSlice';

interface NotificationModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  notification, 
  isOpen, 
  onClose 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type: string) => {
    const iconClasses = "w-8 h-8";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-amber-500`} />;
      case 'error':
        return <AlertCircle className={`${iconClasses} text-red-500`} />;
      default:
        return <Info className={`${iconClasses} text-blue-500`} />;
    }
  };

  const getIconBackground = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'warning':
        return 'bg-gradient-to-br from-amber-400 to-amber-600';
      case 'error':
        return 'bg-gradient-to-br from-red-400 to-red-600';
      default:
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
    }
  };

  const getModalAccent = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-t-4 border-green-500';
      case 'warning':
        return 'border-t-4 border-amber-500';
      case 'error':
        return 'border-t-4 border-red-500';
      default:
        return 'border-t-4 border-blue-500';
    }
  };

  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#1d2328] rounded-lg shadow-xl w-full max-w-md animate-fadeIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Notification
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Bold Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {notification.title}
          </h3>
          
          {/* Notification Message */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {notification.message}
          </p>

          {/* Date */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {formatTimestamp(notification.timestamp)}
          </p>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#4B65AB] hover:bg-[#3d5291] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 