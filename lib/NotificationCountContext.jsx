import React, { createContext, useState, useContext } from 'react';

const NotificationCountContext = createContext();

export const useNotificationCountContext = () => useContext(NotificationCountContext);

export const NotificationProvider = ({ children }) => {
  const [notifCount, setNotifCount] = useState(0);

  const updateNotifCount = (count) => {
    setNotifCount(count);
  };

  return (
    <NotificationCountContext.Provider value={{ notifCount, updateNotifCount }}>
      {children}
    </NotificationCountContext.Provider>
  );
};
