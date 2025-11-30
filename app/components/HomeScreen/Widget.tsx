"use client";

import { WidgetDefinition } from "@/app/data/apps";
import { useTime } from "@/app/hooks/useTime";

interface WidgetProps {
  widget: WidgetDefinition;
}

export function Widget({ widget }: WidgetProps) {
  switch (widget.type) {
    case "weather":
      return <WeatherWidget data={widget.data} />;
    case "calendar":
      return <CalendarWidget data={widget.data} />;
    case "clock":
      return <ClockWidget />;
    default:
      return <PlaceholderWidget />;
  }
}

interface WeatherWidgetProps {
  data?: Record<string, unknown>;
}

function WeatherWidget({ data }: WeatherWidgetProps) {
  const location = (data?.location as string) || "Cupertino";
  const temperature = (data?.temperature as number) || 72;
  const condition = (data?.condition as string) || "Partly Cloudy";
  const high = (data?.high as number) || 78;
  const low = (data?.low as number) || 65;

  return (
    <div className="ios-widget w-full h-full p-[8px] flex flex-col justify-between text-white">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium opacity-90">{location}</span>
          <svg
            width="7"
            height="7"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="opacity-70"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          </svg>
        </div>
        <div className="text-[28px] font-light leading-tight">
          {temperature}°
        </div>
      </div>

      {/* Weather Icon */}
      <div className="flex justify-center -mt-2">
        <div className="text-xl">
          {condition.includes("Cloud")
            ? "⛅"
            : condition.includes("Rain")
            ? "🌧️"
            : "☀️"}
        </div>
      </div>

      {/* Footer */}
      <div>
        <div className="text-[10px] opacity-90">{condition}</div>
        <div className="text-[9px] opacity-70">
          H:{high}° L:{low}°
        </div>
      </div>
    </div>
  );
}

interface CalendarWidgetProps {
  data?: Record<string, unknown>;
}

function CalendarWidget({ data }: CalendarWidgetProps) {
  const { dayOfWeek } = useTime();
  const today = new Date();
  const dayNumber = today.getDate();
  const events = (data?.events as Array<{ title: string; time: string }>) || [];

  return (
    <div className="w-full h-full rounded-[16px] overflow-hidden flex flex-col bg-white text-black">
      {/* Header */}
      <div className="bg-white px-[8px] pt-[6px]">
        <div className="text-[#FF3B30] text-[9px] font-semibold uppercase">
          {dayOfWeek.toUpperCase()}
        </div>
        <div className="text-[24px] font-light text-black leading-tight">
          {dayNumber}
        </div>
      </div>

      {/* Events */}
      <div className="flex-1 px-[8px] py-1 overflow-hidden">
        {events.length > 0 ? (
          events.slice(0, 2).map((event, i) => (
            <div key={i} className="text-[10px] text-gray-600 truncate">
              {event.time} - {event.title}
            </div>
          ))
        ) : (
          <div className="text-[11px] text-gray-400">No events today</div>
        )}
      </div>

      {/* Footer label */}
      <div className="px-[8px] pb-[6px]">
        <div className="text-[9px] text-gray-500">Calendar</div>
      </div>
    </div>
  );
}

function ClockWidget() {
  const { time24 } = useTime();

  return (
    <div className="ios-widget w-full h-full p-4 flex flex-col items-center justify-center text-white">
      <div className="text-3xl font-light">{time24}</div>
      <div className="text-sm opacity-70">Clock</div>
    </div>
  );
}

function PlaceholderWidget() {
  return (
    <div className="ios-widget w-full h-full p-4 flex items-center justify-center text-white/50">
      Widget
    </div>
  );
}
