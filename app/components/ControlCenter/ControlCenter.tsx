"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePhone } from "@/app/contexts/PhoneContext";

export function ControlCenter() {
  const { setControlCenterOpen } = usePhone();
  const [activeToggles, setActiveToggles] = useState<Set<string>>(
    new Set(["wifi", "bluetooth"])
  );
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(50);

  const handleClose = () => {
    setControlCenterOpen(false);
  };

  const toggleControl = (id: string) => {
    setActiveToggles((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <motion.div
      className="absolute inset-0"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.y < -100 || info.velocity.y < -500) {
          handleClose();
        }
      }}
    >
      {/* Blur Background */}
      <div 
        className="absolute inset-0 ios-blur-dark"
        onClick={handleClose}
      />

      {/* Control Center Panel */}
      <motion.div
        className="absolute top-0 left-2 right-2 rounded-[40px] overflow-hidden"
        style={{ marginTop: "var(--status-bar-height)" }}
        initial={{ y: -50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="p-4 space-y-3">
          {/* Top Row - Connectivity + Now Playing */}
          <div className="flex gap-3">
            {/* Connectivity Grid */}
            <div className="grid grid-cols-2 gap-2 p-2 bg-white/20 rounded-[20px]">
              {/* Airplane Mode */}
              <ControlToggle
                icon={<AirplaneIcon />}
                active={activeToggles.has("airplane")}
                onClick={() => toggleControl("airplane")}
                activeColor="#FF9500"
              />
              {/* Cellular */}
              <ControlToggle
                icon={<CellularIcon />}
                active={activeToggles.has("cellular")}
                onClick={() => toggleControl("cellular")}
                activeColor="#32D74B"
              />
              {/* WiFi */}
              <ControlToggle
                icon={<WifiIcon />}
                active={activeToggles.has("wifi")}
                onClick={() => toggleControl("wifi")}
                activeColor="#007AFF"
              />
              {/* Bluetooth */}
              <ControlToggle
                icon={<BluetoothIcon />}
                active={activeToggles.has("bluetooth")}
                onClick={() => toggleControl("bluetooth")}
                activeColor="#007AFF"
              />
            </div>

            {/* Now Playing */}
            <div className="flex-1 bg-white/20 rounded-[20px] p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span>🎵</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">Not Playing</div>
                <div className="text-white/60 text-xs truncate">Music</div>
              </div>
            </div>
          </div>

          {/* Middle Row - More Toggles */}
          <div className="flex gap-3">
            {/* Focus / DND */}
            <ControlToggle
              icon={<MoonIcon />}
              active={activeToggles.has("dnd")}
              onClick={() => toggleControl("dnd")}
              activeColor="#5856D6"
              large
              label="Focus"
            />
            {/* Screen Mirroring */}
            <ControlToggle
              icon={<MirrorIcon />}
              active={activeToggles.has("mirror")}
              onClick={() => toggleControl("mirror")}
              activeColor="#007AFF"
              large
              label="Screen Mirroring"
            />
          </div>

          {/* Sliders Row */}
          <div className="flex gap-3">
            {/* Brightness */}
            <div className="flex-1 bg-white/20 rounded-[20px] p-3">
              <div className="flex flex-col items-center gap-2">
                <BrightnessIcon />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-24 appearance-none rounded-full"
                  style={{
                    writingMode: "vertical-lr",
                    direction: "rtl",
                    background: `linear-gradient(to top, white ${brightness}%, rgba(255,255,255,0.3) ${brightness}%)`,
                  }}
                />
              </div>
            </div>

            {/* Volume */}
            <div className="flex-1 bg-white/20 rounded-[20px] p-3">
              <div className="flex flex-col items-center gap-2">
                <VolumeIcon />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-24 appearance-none rounded-full"
                  style={{
                    writingMode: "vertical-lr",
                    direction: "rtl",
                    background: `linear-gradient(to top, white ${volume}%, rgba(255,255,255,0.3) ${volume}%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bottom Row - Quick Actions */}
          <div className="grid grid-cols-4 gap-3">
            <ControlButton icon={<FlashlightIcon />} label="Flashlight" />
            <ControlButton icon={<TimerIcon />} label="Timer" />
            <ControlButton icon={<CalculatorIcon />} label="Calculator" />
            <ControlButton icon={<CameraIcon />} label="Camera" />
          </div>
        </div>
      </motion.div>

      {/* Close hint */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <p className="text-white/40 text-xs">Swipe up to close</p>
      </div>
    </motion.div>
  );
}

interface ControlToggleProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  activeColor?: string;
  large?: boolean;
  label?: string;
}

function ControlToggle({ icon, active, onClick, activeColor = "#007AFF", large, label }: ControlToggleProps) {
  const baseClasses = large 
    ? "flex-1 h-24 rounded-[20px] flex flex-col items-center justify-center gap-2"
    : "w-14 h-14 rounded-full flex items-center justify-center";
  
  return (
    <motion.button
      className={`${baseClasses} transition-colors`}
      style={{
        backgroundColor: active ? activeColor : "rgba(255,255,255,0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className={active ? "text-white" : "text-white/80"}>
        {icon}
      </div>
      {label && (
        <span className={`text-xs ${active ? "text-white" : "text-white/80"}`}>
          {label}
        </span>
      )}
    </motion.button>
  );
}

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
}

function ControlButton({ icon, label }: ControlButtonProps) {
  return (
    <motion.button
      className="bg-white/20 rounded-[20px] p-3 flex flex-col items-center justify-center gap-1 aspect-square"
      whileTap={{ scale: 0.95, backgroundColor: "rgba(255,255,255,0.4)" }}
    >
      <div className="text-white">{icon}</div>
      <span className="text-white/80 text-[10px]">{label}</span>
    </motion.button>
  );
}

// Icons
function AirplaneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  );
}

function CellularIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 22h4V12H2v10zm6 0h4V7H8v15zm6 0h4V2h-4v20z"/>
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
    </svg>
  );
}

function BluetoothIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
    </svg>
  );
}

function MirrorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7l-3 3.99h9L13 9l-2.5 3z"/>
    </svg>
  );
}

function BrightnessIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  );
}

function FlashlightIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h12v4l-3 3v13h-6V9L6 6V2zm3 0v3h6V2H9z"/>
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm-8 8H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2z"/>
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3.2"/>
      <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    </svg>
  );
}

