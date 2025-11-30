"use client";

import { useTime } from "@/app/hooks/useTime";

export function LockClock() {
  const { time24, fullDate } = useTime();

  return (
    <div className="flex flex-col items-center text-white">
      {/* Date */}
      <p className="text-[20px] font-medium tracking-tight opacity-90">
        {fullDate}
      </p>

      {/* Time */}
      <h1 className="lock-time text-[86px] leading-none mt-0">{time24}</h1>
    </div>
  );
}
