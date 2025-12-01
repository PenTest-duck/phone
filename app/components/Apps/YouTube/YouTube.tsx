"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AppContainer } from "@/app/components/Apps/AppContainer";
import { motion, AnimatePresence } from "framer-motion";

// Icons
function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

function CaptionsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
    </svg>
  );
}

function ThumbsUpIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function YouTube() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Video metadata
  const videoData = {
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    channel: "Rick Astley",
    channelAvatar:
      "https://yt3.ggpht.com/ytc/AIdro_n_zxsS3wWpb8Z3F6A0ZjSS7xGwAhTRjDKQQX5D8w=s48-c-k-c0x00ffffff-no-rj",
    subscribers: "4.26M subscribers",
    views: "1.6B views",
    uploadDate: "15 years ago",
    likes: "16M",
    description:
      'The official video for "Never Gonna Give You Up" by Rick Astley.\n\n"Never Gonna Give You Up" was a global smash on its release in July 1987...',
  };

  const resetHideTimer = useCallback(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    setShowControls(true);
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) {
        clearTimeout(hideControlsTimeout.current);
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        // When pausing, show controls and clear any hide timeout
        setShowControls(true);
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current);
        }
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        resetHideTimer();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVideoClick = () => {
    resetHideTimer();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AppContainer
      appId="youtube"
      backgroundColor="#0f0f0f"
      statusBarVariant="light"
    >
      <div
        className="flex flex-col h-full bg-[#0f0f0f] overflow-hidden"
        onPointerDown={handleVideoClick}
      >
        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black flex-shrink-0">
          <video
            ref={videoRef}
            src="/app-media/youtube/rickroll.mp4"
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              setShowControls(true);
              if (hideControlsTimeout.current) {
                clearTimeout(hideControlsTimeout.current);
              }
            }}
            playsInline
          />

          {/* Video Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 flex flex-col justify-between"
              >
                {/* Top Controls */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <button className="text-white/90 hover:text-white">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-white/90 hover:text-white">
                      <CaptionsIcon />
                    </button>
                    <button className="text-white/90 hover:text-white">
                      <SettingsIcon />
                    </button>
                  </div>
                </div>

                {/* Center Play/Pause */}
                <div className="flex items-center justify-center">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayPause}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    {isPlaying ? (
                      <PauseIcon size={36} />
                    ) : (
                      <PlayIcon size={36} />
                    )}
                  </motion.button>
                </div>

                {/* Bottom Controls */}
                <div className="p-3 space-y-2">
                  {/* Progress Bar */}
                  <div
                    ref={progressRef}
                    className="relative h-1 bg-white/30 rounded-full cursor-pointer group"
                    onClick={handleProgressClick}
                  >
                    {/* Buffered */}
                    <div
                      className="absolute h-full bg-white/50 rounded-full"
                      style={{ width: `${Math.min(progress + 10, 100)}%` }}
                    />
                    {/* Progress */}
                    <div
                      className="absolute h-full bg-[#ff0000] rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Thumb */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#ff0000] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        left: `${progress}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>

                  {/* Time & Controls */}
                  <div className="flex items-center justify-between text-white text-xs">
                    <span>
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <button className="text-white/90 hover:text-white">
                      <FullscreenIcon />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Video Info Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 space-y-3">
            {/* Title */}
            <h1 className="text-white text-[15px] font-medium leading-tight">
              {videoData.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-1 text-[#aaa] text-xs">
              <span>{videoData.views}</span>
              <span>•</span>
              <span>{videoData.uploadDate}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
              <ActionButton icon={<ThumbsUpIcon />} label={videoData.likes} />
              <ActionButton icon={<ThumbsDownIcon />} label="Dislike" />
              <ActionButton icon={<ShareIcon />} label="Share" />
              <ActionButton icon={<SaveIcon />} label="Save" />
            </div>

            {/* Channel Info */}
            <div className="flex items-center justify-between py-3 border-t border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center overflow-hidden">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <h3 className="text-white text-sm font-medium">
                    {videoData.channel}
                  </h3>
                  <p className="text-[#aaa] text-xs">{videoData.subscribers}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white text-black text-sm font-medium rounded-full">
                Subscribe
              </button>
            </div>

            {/* Description Preview */}
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-[#aaa] text-xs line-clamp-3">
                {videoData.description}
              </p>
              <button className="text-[#aaa] text-xs mt-1 font-medium">
                Show more
              </button>
            </div>

            {/* Comments Header */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium">Comments</span>
                <span className="text-[#aaa] text-xs">1.2M</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#aaa">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
              </svg>
            </div>

            {/* Top Comment */}
            <div className="flex gap-3 pb-4">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">U</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-medium">@user</span>
                  <span className="text-[#aaa] text-xs">2 days ago</span>
                </div>
                <p className="text-white text-xs mt-1">
                  This song will never get old. A true classic! 🎵
                </p>
                <div className="flex items-center gap-4 mt-2 text-[#aaa]">
                  <div className="flex items-center gap-1">
                    <ThumbsUpIcon />
                    <span className="text-xs">42K</span>
                  </div>
                  <ThumbsDownIcon />
                  <span className="text-xs">Reply</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-around py-2 border-t border-white/10 bg-[#0f0f0f]">
          <NavItem icon={<HomeNavIcon />} label="Home" active />
          <NavItem icon={<ShortsIcon />} label="Shorts" />
          <NavItem icon={<PlusCircleIcon />} label="" isCreate />
          <NavItem icon={<SubscriptionsIcon />} label="Subscriptions" />
          <NavItem icon={<LibraryIcon />} label="You" />
        </div>
      </div>
    </AppContainer>
  );
}

// Action Button Component
function ActionButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full flex-shrink-0">
      <span className="text-white">{icon}</span>
      <span className="text-white text-xs font-medium">{label}</span>
    </button>
  );
}

// Navigation Icons
function HomeNavIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.33l7 6.12V20h-4v-6H9v6H5v-9.55l7-6.12M12 3 2 12h3v9h6v-6h2v6h6v-9h3L12 3z" />
    </svg>
  );
}

function ShortsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z" />
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="12" rx="6" fill="currentColor" />
      <path
        d="M12 8v8M8 12h8"
        stroke="#0f0f0f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SubscriptionsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 20V10h18v10H3z" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 7l6 3.5-6 3.5V7zm7 13H4V6H3v15h15v-1zm3-2H6V3h15v15zM7 17h13V4H7v13z" />
    </svg>
  );
}

// Navigation Item
function NavItem({
  icon,
  label,
  active,
  isCreate,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isCreate?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center gap-0.5 ${
        isCreate ? "" : "min-w-[48px]"
      }`}
    >
      <span className={active ? "text-white" : "text-[#aaa]"}>{icon}</span>
      {label && (
        <span
          className={`text-[10px] ${active ? "text-white" : "text-[#aaa]"}`}
        >
          {label}
        </span>
      )}
    </button>
  );
}
