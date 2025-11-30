"use client";

import { usePhone } from "@/app/contexts/PhoneContext";
import { LockClock } from "./LockClock";
import { LockActions } from "./LockActions";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  animate,
} from "framer-motion";
import { useState } from "react";

export function LockScreen() {
  const { unlock } = usePhone();
  const [isDragging, setIsDragging] = useState(false);
  const y = useMotionValue(0);

  // Transform for parallax effect on content
  const contentY = useTransform(y, [0, -200], [0, -50]);
  const contentOpacity = useTransform(y, [0, -150], [1, 0]);
  const contentScale = useTransform(y, [0, -200], [1, 0.95]);

  // Transform for unlock indicator
  const indicatorOpacity = useTransform(y, [0, -50], [0.6, 0]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    // If dragged up enough, unlock
    if (info.offset.y < -100 || info.velocity.y < -500) {
      unlock();
    } else {
      // Snap back
      animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ paddingTop: "var(--status-bar-height)", y }}
      drag="y"
      dragConstraints={{ top: -250, bottom: 0 }}
      dragElastic={0.15}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
    >
      {/* Lock Screen Content */}
      <motion.div
        className="flex-1 flex flex-col items-center pt-6"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        <LockClock />

        {/* Notifications area */}
        <div className="flex-1 w-full px-4 mt-8">
          {/* Notification indicator */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-white/60" />
              <span className="text-white/60 text-sm">No notifications</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div className="pb-2" style={{ opacity: contentOpacity }}>
        <LockActions />

        {/* Home Indicator */}
        <div className="flex justify-center mt-4 mb-2">
          <motion.div
            className="home-indicator"
            style={{ opacity: indicatorOpacity }}
            animate={
              !isDragging
                ? {
                    y: [0, -4, 0],
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Swipe hint text */}
        <motion.p
          className="text-white/40 text-center text-[13px] mb-4 font-medium"
          style={{ opacity: indicatorOpacity }}
        >
          Swipe up to unlock
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
