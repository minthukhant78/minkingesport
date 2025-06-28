"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: number;
  message: string;
  description?: string;
  icon?: ReactNode;
}

interface NotificationContextType {
  notification: Notification | null;
  showNotification: (notification: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((newNotification: Omit<Notification, 'id'>) => {
    const id = Date.now();
    setNotification({ ...newNotification, id });

    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 4000); // Hide after 4 seconds
  }, []);

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
