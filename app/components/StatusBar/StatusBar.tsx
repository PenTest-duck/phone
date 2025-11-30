"use client";

import { useTime } from "@/app/hooks/useTime";
import { useBattery } from "@/app/hooks/useBattery";
import { usePhone } from "@/app/contexts/PhoneContext";

interface StatusBarProps {
  variant?: "light" | "dark";
  showTime?: boolean;
}

export function StatusBar({
  variant = "light",
  showTime = false,
}: StatusBarProps) {
  const { time12 } = useTime();
  const { level: batteryLevel, charging: isCharging } = useBattery();
  const { setControlCenterOpen, isLocked } = usePhone();
  const textColor = variant === "light" ? "text-white" : "text-black";

  const handleRightSideClick = () => {
    if (!isLocked) {
      setControlCenterOpen(true);
    }
  };

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 ${textColor}`}
      style={{ height: "var(--status-bar-height)", paddingTop: "12px" }}
    >
      {/* Left side - Time or Carrier */}
      <div className="flex items-center gap-1 w-[72px]">
        {showTime ? (
          <span className="status-bar-text font-semibold">{time12}</span>
        ) : (
          <span className="status-bar-text font-semibold">AT&T</span>
        )}
      </div>

      {/* Center - Dynamic Island space (empty for our purposes) */}
      <div className="flex-1" />

      {/* Right side - Status icons (tappable to open Control Center) */}
      <button
        className="flex items-center gap-[5px] w-[72px] justify-end"
        onClick={handleRightSideClick}
        aria-label="Open Control Center"
      >
        {/* Signal Bars */}
        <SignalBars
          strength={4}
          color={variant === "light" ? "white" : "black"}
        />

        {/* WiFi Icon */}
        <WifiIcon color={variant === "light" ? "white" : "black"} />

        {/* Battery */}
        <BatteryIcon
          percentage={batteryLevel}
          charging={isCharging}
          color={variant === "light" ? "white" : "black"}
        />
      </button>
    </div>
  );
}

function SignalBars({ strength, color }: { strength: number; color: string }) {
  return (
    <div className="flex items-end gap-[1px] h-[12px]">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className="rounded-[1px]"
          style={{
            width: 3,
            height: 3 + bar * 2.5,
            backgroundColor: bar <= strength ? color : `${color}40`,
          }}
        />
      ))}
    </div>
  );
}

function WifiIcon({ color }: { color: string }) {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <path
        d="M8.5 2.5C11.1 2.5 13.5 3.5 15.3 5.1C15.7 5.5 16.3 5.5 16.6 5.1C17 4.7 17 4.1 16.6 3.8C14.4 1.8 11.6 0.5 8.5 0.5C5.4 0.5 2.6 1.8 0.4 3.8C0 4.2 0 4.8 0.4 5.1C0.7 5.5 1.3 5.5 1.7 5.1C3.5 3.5 5.9 2.5 8.5 2.5Z"
        fill={color}
      />
      <path
        d="M8.5 5.5C10.3 5.5 11.9 6.2 13.1 7.3C13.5 7.7 14.1 7.7 14.4 7.3C14.8 6.9 14.8 6.3 14.4 6C12.8 4.5 10.8 3.5 8.5 3.5C6.2 3.5 4.2 4.5 2.6 6C2.2 6.4 2.2 7 2.6 7.3C2.9 7.7 3.5 7.7 3.9 7.3C5.1 6.2 6.7 5.5 8.5 5.5Z"
        fill={color}
      />
      <path
        d="M8.5 8.5C9.5 8.5 10.4 8.9 11.1 9.5C11.5 9.9 12.1 9.9 12.4 9.5C12.8 9.1 12.8 8.5 12.4 8.2C11.3 7.2 9.9 6.5 8.5 6.5C7.1 6.5 5.7 7.2 4.6 8.2C4.2 8.6 4.2 9.2 4.6 9.5C4.9 9.9 5.5 9.9 5.9 9.5C6.6 8.9 7.5 8.5 8.5 8.5Z"
        fill={color}
      />
      <circle cx="8.5" cy="11" r="1.5" fill={color} />
    </svg>
  );
}

function BatteryIcon({
  percentage,
  charging,
  color,
}: {
  percentage: number;
  charging: boolean;
  color: string;
}) {
  const fillWidth = Math.min(21, (percentage / 100) * 21);
  // Green color when charging, red when low, otherwise use the provided color
  const fillColor = charging ? "#30D158" : percentage > 20 ? color : "#FF3B30";

  return (
    <div className="flex items-center gap-[3px]">
      <span className="text-[12px] font-medium" style={{ color }}>
        {percentage}
      </span>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
        {/* Battery body outline */}
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="12"
          rx="3"
          stroke={color}
          strokeWidth="1"
          fill="none"
        />
        {/* Battery fill */}
        <rect
          x="2"
          y="2"
          width={fillWidth}
          height="9"
          rx="1.5"
          fill={fillColor}
        />
        {/* Charging bolt icon */}
        {charging && (
          <path
            d="M13 2L9 7H12L11 11L15 6H12L13 2Z"
            fill={percentage > 50 ? "#000" : "#fff"}
            opacity={0.9}
          />
        )}
        {/* Battery cap */}
        <path
          d="M25 4V9C26.1 9 27 8.1 27 7V6C27 4.9 26.1 4 25 4Z"
          fill={color}
          opacity={0.4}
        />
      </svg>
    </div>
  );
}
