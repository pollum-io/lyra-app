"use client";

import React, { useEffect } from "react";

const ToastNotification = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type?: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const borderColor =
    type === "success"
      ? "border-green-500"
      : type === "error"
      ? "border-red"
      : "border-orange";

  return (
    <div
      className={`fixed right-5 top-14 z-40 border p-4 ${borderColor} bg-primary rounded-xl shadow-lg`}
    >
      <div className="flex h-full max-w-[400px] items-center justify-between gap-4">
        <span>{message}</span>
        <button onClick={onClose}>
          <svg
            className="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
