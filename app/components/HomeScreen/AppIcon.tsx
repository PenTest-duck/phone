"use client";

import { motion } from "framer-motion";
import { AppDefinition, implementedApps } from "@/app/data/apps";
import { usePhone } from "@/app/contexts/PhoneContext";
import Image from "next/image";

interface AppIconProps {
  app: AppDefinition;
  size?: "small" | "normal" | "dock";
  onTap?: () => void;
}

export function AppIcon({ app, size = "normal", onTap }: AppIconProps) {
  const { openApp } = usePhone();
  const iconSize = size === "dock" ? 50 : size === "small" ? 44 : 52;
  const fontSize = size === "dock" ? 0 : size === "small" ? 9 : 10;

  const handleTap = () => {
    // If a custom onTap is provided, use it
    if (onTap) {
      onTap();
      return;
    }

    // If the app has a URL, open it in a new browser tab
    if (app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer");
      return;
    }

    // Check if the app has an implementation and open it
    if (implementedApps.has(app.id)) {
      openApp(app.id);
    }
  };

  return (
    <motion.button
      className="flex flex-col items-center gap-[5px]"
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={handleTap}
    >
      <div className="relative">
        {/* Icon Container */}
        <div
          className="ios-app-icon overflow-hidden flex items-center justify-center relative"
          style={{
            width: iconSize,
            height: iconSize,
            backgroundColor: app.icon ? "transparent" : app.color || "#8E8E93",
          }}
        >
          {app.icon ? (
            <Image
              src={app.icon}
              alt={app.name}
              width={iconSize}
              height={iconSize}
              className="w-full h-full object-cover"
            />
          ) : (
            <PlaceholderIcon appId={app.id} color={app.color} />
          )}
        </div>

        {/* Badge */}
        {app.badge && app.badge > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-[#FF3B30] rounded-full flex items-center justify-center px-1">
            <span className="text-white text-[13px] font-semibold">
              {app.badge > 99 ? "99+" : app.badge}
            </span>
          </div>
        )}
      </div>

      {/* App Name */}
      {size !== "dock" && (
        <span
          className="text-white text-center leading-tight drop-shadow-sm max-w-[58px] truncate"
          style={{ fontSize }}
        >
          {app.name}
        </span>
      )}
    </motion.button>
  );
}

// Placeholder icons for apps without custom SVGs
function PlaceholderIcon({ appId, color }: { appId: string; color?: string }) {
  const iconStyle = "w-full h-full flex items-center justify-center";

  switch (appId) {
    case "phone":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#32D74B" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </div>
      );

    case "messages":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#32D74B" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
      );

    case "music":
      return (
        <div
          className={iconStyle}
          style={{
            background: "linear-gradient(180deg, #FC3D39 0%, #FA2D55 100%)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
      );

    case "facetime":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#32D74B" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </div>
      );

    case "photos":
      return (
        <div
          className={iconStyle}
          style={{
            background:
              "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 25%, #4ECDC4 50%, #A06CD5 75%, #FF6B6B 100%)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="3.2" />
            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
          </svg>
        </div>
      );

    case "mail":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#007AFF" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </div>
      );

    case "notes":
      return (
        <div
          className={iconStyle}
          style={{
            background: "linear-gradient(180deg, #FFCC00 0%, #FFB800 100%)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
          </svg>
        </div>
      );

    case "reminders":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#FFFFFF" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="6" cy="8" r="2" fill="#FF9500" />
            <circle cx="6" cy="14" r="2" fill="#007AFF" />
            <line x1="10" y1="8" x2="20" y2="8" stroke="#333" strokeWidth="2" />
            <line
              x1="10"
              y1="14"
              x2="20"
              y2="14"
              stroke="#333"
              strokeWidth="2"
            />
          </svg>
        </div>
      );

    case "news":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#FC3D39" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2z" />
          </svg>
        </div>
      );

    case "appletv":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#000000" }}>
          <span className="text-white text-sm font-bold">tv</span>
        </div>
      );

    case "podcasts":
      return (
        <div
          className={iconStyle}
          style={{
            background: "linear-gradient(180deg, #872EC4 0%, #5B21B6 100%)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      );

    case "maps":
      return (
        <div
          className={iconStyle}
          style={{
            background: "linear-gradient(180deg, #5AC8FA 0%, #4A9FF5 100%)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
          </svg>
        </div>
      );

    case "health":
      return (
        <div className={iconStyle} style={{ backgroundColor: "#FFFFFF" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF2D55">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      );

    case "files":
      return (
        <div
          className={iconStyle}
          style={{
            background: "linear-gradient(180deg, #007AFF 0%, #0051D4 100%)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        </div>
      );

    default:
      return (
        <div
          className={iconStyle}
          style={{ backgroundColor: color || "#8E8E93" }}
        >
          <span className="text-white text-lg font-semibold">
            {appId.charAt(0).toUpperCase()}
          </span>
        </div>
      );
  }
}
