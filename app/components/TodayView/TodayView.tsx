"use client";

import { motion } from "framer-motion";
import { usePhone } from "@/app/contexts/PhoneContext";
import { useTime } from "@/app/hooks/useTime";

export function TodayView() {
  const { setTodayViewOpen } = usePhone();
  const { fullDate } = useTime();

  const handleClose = () => {
    setTodayViewOpen(false);
  };

  return (
    <motion.div
      className="absolute inset-0"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x < -100 || info.velocity.x < -500) {
          handleClose();
        }
      }}
    >
      {/* Blur Background */}
      <div 
        className="absolute inset-0 ios-blur-dark"
        onClick={handleClose}
      />

      {/* Content */}
      <motion.div
        className="relative h-full flex flex-col overflow-y-auto hide-scrollbar"
        style={{ paddingTop: "var(--status-bar-height)" }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Date Header */}
        <div className="px-5 pt-4 pb-4">
          <h1 className="text-white text-3xl font-bold">{fullDate}</h1>
        </div>

        {/* Widgets Stack */}
        <div className="px-4 space-y-4 pb-20">
          {/* Weather Widget - Large */}
          <div className="ios-widget p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm opacity-80 flex items-center gap-1">
                  <span>Cupertino</span>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  </svg>
                </div>
                <div className="text-5xl font-light mt-1">72°</div>
              </div>
              <div className="text-4xl">⛅</div>
            </div>
            <div className="mt-4 text-sm opacity-90">Partly Cloudy</div>
            <div className="flex gap-4 mt-2 text-xs opacity-70">
              <span>H: 78°</span>
              <span>L: 65°</span>
            </div>
            
            {/* Hourly Forecast */}
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between">
              {["Now", "1PM", "2PM", "3PM", "4PM"].map((time, i) => (
                <div key={time} className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-70">{time}</span>
                  <span>{["⛅", "☀️", "☀️", "🌤️", "⛅"][i]}</span>
                  <span className="text-sm">{72 + i}°</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="bg-white/95 rounded-[22px] p-4 text-black">
            <div className="text-xs font-semibold text-red-500 uppercase">Calendar</div>
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-red-500 rounded-full" />
                <div>
                  <div className="font-medium">Team Meeting</div>
                  <div className="text-xs text-gray-500">10:00 AM - 11:00 AM</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 bg-blue-500 rounded-full" />
                <div>
                  <div className="font-medium">Lunch with Alex</div>
                  <div className="text-xs text-gray-500">12:30 PM - 1:30 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Screen Time Widget */}
          <div className="ios-widget p-4 text-white">
            <div className="text-xs opacity-70 uppercase font-medium">Screen Time</div>
            <div className="mt-2">
              <div className="text-2xl font-semibold">3h 42m</div>
              <div className="text-xs opacity-70 mt-1">Daily Average</div>
            </div>
            <div className="mt-4 flex gap-2">
              {[40, 65, 50, 80, 45, 70, 55].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-500 rounded-sm"
                  style={{ height: height * 0.5 }}
                />
              ))}
            </div>
          </div>

          {/* Reminders Widget */}
          <div className="bg-white/95 rounded-[22px] p-4 text-black">
            <div className="text-xs font-semibold text-gray-500 uppercase">Reminders</div>
            <div className="mt-2 space-y-2">
              {["Buy groceries", "Call mom", "Finish report"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-orange-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Swipe Hint */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <p className="text-white/40 text-xs">Swipe left to close</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

