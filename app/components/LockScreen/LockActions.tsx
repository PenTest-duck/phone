"use client";

import { motion } from "framer-motion";

export function LockActions() {
  return (
    <div className="flex justify-between items-center px-10">
      {/* Flashlight Button */}
      <motion.button
        className="lock-action-button ios-pressable"
        whileTap={{ scale: 0.9 }}
        aria-label="Flashlight"
      >
        <FlashlightIcon />
      </motion.button>

      {/* Camera Button */}
      <motion.button
        className="lock-action-button ios-pressable"
        whileTap={{ scale: 0.9 }}
        aria-label="Camera"
      >
        <CameraIcon />
      </motion.button>
    </div>
  );
}

function FlashlightIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M7 1H15L17 5V9L14 12V21H8V12L5 9V5L7 1Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="5" y1="5" x2="17" y2="5" stroke="white" strokeWidth="1.5" />
      <circle cx="11" cy="8" r="1.5" fill="white" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
      <path
        d="M3 5C3 3.89543 3.89543 3 5 3H7L8.5 1H15.5L17 3H19C20.1046 3 21 3.89543 21 5V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle
        cx="12"
        cy="11"
        r="4"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
