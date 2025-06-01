"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux';
import { 
  addNotification as addNotificationAction, 
  markAllAsRead as markAllAsReadAction,
  selectNotifications,
  selectNewNotificationsCount,
  Notification
} from '@/app/redux/notificationSlice';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isNew'>) => void;
  markAllAsRead: () => void;
  getNewNotificationsCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);
  const newNotificationsCount = useSelector(selectNewNotificationsCount);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isNew'>) => {
    dispatch(addNotificationAction(notification));
  };

  const markAllAsRead = () => {
    dispatch(markAllAsReadAction());
  };

  const getNewNotificationsCount = () => {
    return newNotificationsCount;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAllAsRead,
      getNewNotificationsCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 