"use client";
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isNew: boolean;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isNew'>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getNewNotificationsCount: () => number;
  markAsUnread: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();

  // Get notifications from Clerk metadata
  const notifications: Notification[] = (user?.unsafeMetadata?.notifications as Notification[]) || [];

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'timestamp' | 'isNew'>) => {
    if (!user) return;

    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      isNew: true
    };

    const updatedNotifications = [newNotification, ...notifications];

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: updatedNotifications
        }
      });
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  }, [user, notifications]);

  const deleteNotification = useCallback(async (id: string) => {
    if (!user) return;

    const updatedNotifications = notifications.filter(n => n.id !== id);

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: updatedNotifications
        }
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [user, notifications]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isNew: false
    }));

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: updatedNotifications
        }
      });
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  }, [user, notifications]);

  const getNewNotificationsCount = useCallback(() => {
    return notifications.filter(notification => notification.isNew).length;
  }, [notifications]);

  const markAsUnread = useCallback(async (id: string) => {
    if (!user) return;

    const updatedNotifications = notifications.map(notification =>
      notification.id === id
        ? { ...notification, isNew: true }
        : notification
    );

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: updatedNotifications
        }
      });
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
    }
  }, [user, notifications]);

  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;

    const updatedNotifications = notifications.map(notification =>
      notification.id === id
        ? { ...notification, isNew: false }
        : notification
    );

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          notifications: updatedNotifications
        }
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [user, notifications]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      deleteNotification,
      markAllAsRead,
      getNewNotificationsCount,
      markAsUnread,
      markAsRead,
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