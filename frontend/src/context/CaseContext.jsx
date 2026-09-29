import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CaseContext = createContext();

export const CaseProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeCaseId, setActiveCaseId] = useState('CASE-2026-001');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationsAPI.getNotifications();
      if (res.data?.data) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.data.filter(n => !n.read).length);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markNotificationRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.warn('Failed to mark read:', err.message);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.warn('Failed to mark all read:', err.message);
    }
  };

  return (
    <CaseContext.Provider
      value={{
        activeCaseId,
        setActiveCaseId,
        notifications,
        unreadCount,
        isSearchOpen,
        setIsSearchOpen,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => useContext(CaseContext);
