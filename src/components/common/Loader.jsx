"use client";
import React from "react";

export default function Loader() {
  return (
    <div className=" flex items-center justify-center ">
      <span className="loader"></span>

      <style jsx>{`
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid #3b82f6; /* blue-500 */
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}