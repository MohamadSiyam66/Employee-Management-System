// src/contexts/NotificationContext.jsx
import { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addNotification = (message) => {
    setNotifications((prev) => [...prev, { id: Date.now(), message }]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;