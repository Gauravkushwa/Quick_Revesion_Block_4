
import React from "react";
import { useNotifications } from "../context/NotificationContext";

const NotificationList = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return <p className="text-gray-500">No notifications yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {notifications.map((n) => (
        <li
          key={n.id}
          className={`p-2 rounded-lg shadow ${
            n.read ? "bg-gray-100 text-gray-700" : "bg-blue-100 font-bold"
          }`}
        >
          {n.message}
        </li>
      ))}
    </ul>
  );
};

export default NotificationList;
