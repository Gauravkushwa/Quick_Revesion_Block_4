
import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const intervalRef = useRef(null);
  const counterRef = useRef(1);

  // Add a new notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
    };
    setNotifications((prev) => [...prev, newNotification]);

    // Play sound (bonus)
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {});
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  // Start notifications
  const startNotifications = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        addNotification(`You have a new message #${counterRef.current}`);
        counterRef.current++;
      }, 5000);
    }
  };

  // Stop notifications
  const stopNotifications = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  // Start on mount
  useEffect(() => {
    startNotifications();
    return () => stopNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAllAsRead,
        stopNotifications,
        startNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
