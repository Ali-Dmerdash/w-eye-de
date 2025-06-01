import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isNew: boolean;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: []
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'isNew'>>) => {
      const newNotification: Notification = {
        ...action.payload,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        isNew: true
      };
      state.notifications.unshift(newNotification);
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isNew = false;
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.isNew = false;
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    }
  }
});

export const { addNotification, markAllAsRead, markAsRead, removeNotification } = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: { notifications: NotificationState }) => state.notifications.notifications;
export const selectNewNotificationsCount = (state: { notifications: NotificationState }) => 
  state.notifications.notifications.filter(notification => notification.isNew).length;

export default notificationSlice.reducer; 