"use client";
import React, { useState } from "react";
import { Bell } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "success",
    message: "Your grain deposit was successful.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "price",
    message: "Wheat price increased by 12%.",
    time: "1 day ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    message: "Scheduled maintenance on Sunday.",
    time: "3 days ago",
    read: false,
  },
];

const NotificationsContent = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Bell className="mr-2 text-blue-600" />
          Notifications
        </h2>

        <div className="flex justify-end mb-3">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() =>
              setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))
            }
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 rounded-lg border-l-4 ${
                notification.type === "success"
                  ? "bg-green-50 border-green-500"
                  : notification.type === "price"
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-50 border-gray-400"
              } ${notification.read ? "opacity-60" : ""}`}
            >
              <Bell className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-gray-600">{notification.time}</p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-sm text-gray-500">No notifications</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsContent;
