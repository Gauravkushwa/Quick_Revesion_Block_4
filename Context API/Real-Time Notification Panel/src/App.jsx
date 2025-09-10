// src/App.js
import React from "react";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import NotificationList from "./components/NotificationList";

const Controls = () => {
  const { markAllAsRead, stopNotifications, startNotifications } = useNotifications();

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={markAllAsRead}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
      >
        Mark All as Read
      </button>
      <button
        onClick={stopNotifications}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Stop Notifications
      </button>
      <button
        onClick={startNotifications}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Resume Notifications
      </button>
    </div>
  );
};

function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold mb-4">Real-Time Notifications</h1>
        <NotificationList />
        <Controls />
      </div>
    </NotificationProvider>
  );
}

export default App;
