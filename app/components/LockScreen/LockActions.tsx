"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LockActions() {
  return (
    <div className="flex justify-between items-center px-10">
      {/* Flashlight Button */}
      <motion.button
        className="lock-action-button ios-pressable"
        whileTap={{ scale: 0.9 }}
        aria-label="Flashlight"
      >
        <Image
          src="/sf-symbols/flashlight.off.fill.svg"
          alt="Flashlight"
          width={20}
          height={40}
          style={{ filter: "invert(1)" }}
        />
      </motion.button>

      {/* Camera Button */}
      <motion.button
        className="lock-action-button ios-pressable"
        whileTap={{ scale: 0.9 }}
        aria-label="Camera"
      >
        <Image
          src="/sf-symbols/camera.svg"
          alt="Camera"
          width={28}
          height={22}
          style={{ filter: "invert(1)" }}
        />
      </motion.button>
    </div>
  );
}
