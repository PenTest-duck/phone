"use client";

import { PhoneProvider, usePhone } from "@/app/contexts/PhoneContext";
import { StatusBar } from "@/app/components/StatusBar/StatusBar";
import { LockScreen } from "@/app/components/LockScreen/LockScreen";
import { HomeScreen } from "@/app/components/HomeScreen/HomeScreen";
import { Spotlight } from "@/app/components/Spotlight/Spotlight";
import { ControlCenter } from "@/app/components/ControlCenter/ControlCenter";
import { TodayView } from "@/app/components/TodayView/TodayView";
import { Calculator } from "@/app/components/Apps/Calculator";
import { Messages } from "@/app/components/Apps/Messages";
import { YouTube } from "@/app/components/Apps/YouTube";
import { WebApp } from "@/app/components/Apps/WebApp";
import { isWebApp, getWebAppConfig } from "@/app/data/webApps";
import { AnimatePresence, motion } from "framer-motion";

// App renderer - maps app IDs to their components
function AppRenderer({ appId }: { appId: string }) {
  // Check if this is a web-based app (iframe)
  if (isWebApp(appId)) {
    const config = getWebAppConfig(appId);
    if (config) {
      return <WebApp config={config} />;
    }
  }

  // Native app implementations
  switch (appId) {
    case "calculator":
      return <Calculator />;
    case "messages":
      return <Messages />;
    case "youtube":
      return <YouTube />;
    default:
      return null;
  }
}

function PhoneContent() {
  const {
    isLocked,
    controlCenterOpen,
    spotlightOpen,
    todayViewOpen,
    activeApp,
  } = usePhone();

  return (
    <div className="phone-container relative w-full h-full overflow-hidden bg-black rounded-[40px]">
      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/ios17-wallpaper.png')" }}
      />

      {/* Dim overlay when overlays are active */}
      <AnimatePresence>
        {(controlCenterOpen || spotlightOpen || todayViewOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 z-30"
          />
        )}
      </AnimatePresence>

      {/* Status Bar - visible when no app is open */}
      {!activeApp && <StatusBar variant="light" showTime={!isLocked} />}

      {/* Main Screen Content */}
      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <LockScreen />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <HomeScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Components */}
      <AnimatePresence>
        {spotlightOpen && (
          <motion.div
            key="spotlight"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 z-40"
          >
            <Spotlight />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {controlCenterOpen && (
          <motion.div
            key="control-center"
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="absolute inset-0 z-50"
          >
            <ControlCenter />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {todayViewOpen && (
          <motion.div
            key="today-view"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="absolute inset-0 z-40"
          >
            <TodayView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active App */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            key={`app-${activeApp}`}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.8,
            }}
            className="absolute inset-0"
            style={{ zIndex: 60 }}
          >
            <AppRenderer appId={activeApp} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Phone() {
  return (
    <PhoneProvider>
      <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Phone Frame - 19.5:9 aspect ratio */}
        <div
          className="relative overflow-hidden rounded-[40px]"
          style={{
            aspectRatio: "9 / 19.5",
            height: "100vh",
            maxHeight: "var(--phone-height)",
            maxWidth: "var(--phone-width)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <PhoneContent />
        </div>
      </div>
    </PhoneProvider>
  );
}
