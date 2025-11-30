"use client";

import { ReactNode, useRef, useState } from "react";
import { motion, PanInfo, useMotionValue, animate } from "framer-motion";
import { usePhone } from "@/app/contexts/PhoneContext";
import { StatusBar } from "@/app/components/StatusBar/StatusBar";

interface AppContainerProps {
  children: ReactNode;
  appId: string;
  backgroundColor?: string;
  statusBarVariant?: "light" | "dark";
}

export function AppContainer({
  children,
  backgroundColor = "#000000",
  statusBarVariant = "light",
}: AppContainerProps) {
  const { closeApp } = usePhone();
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    // Swipe down to close (like going home)
    if (info.offset.y > 150 || (info.offset.y > 50 && info.velocity.y > 500)) {
      closeApp();
    } else {
      // Snap back
      animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ backgroundColor, y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 300 }}
      dragElastic={{ top: 0, bottom: 0.5 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Status Bar */}
      <StatusBar variant={statusBarVariant} showTime={true} />

      {/* App Content - padded to account for absolute status bar */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ paddingTop: "var(--status-bar-height)" }}
      >
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
        <div
          className="home-indicator"
          style={{ background: "rgba(255,255,255,0.4)" }}
        />
      </div>
    </motion.div>
  );
}
