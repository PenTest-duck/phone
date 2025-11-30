"use client";

import { useState, useEffect } from "react";

interface TimeInfo {
  hours: string;
  minutes: string;
  time24: string;
  time12: string;
  ampm: string;
  date: string;
  dayOfWeek: string;
  fullDate: string;
}

export function useTime(): TimeInfo {
  const [time, setTime] = useState<TimeInfo>(getTimeInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeInfo());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}

function getTimeInfo(): TimeInfo {
  const now = new Date();

  const hours24 = now.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = now.getMinutes();

  const hoursStr = hours24.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = days[now.getDay()];
  const month = months[now.getMonth()];
  const dayOfMonth = now.getDate();

  return {
    hours: hoursStr,
    minutes: minutesStr,
    time24: `${hoursStr}:${minutesStr}`,
    time12: `${hours12}:${minutesStr}`,
    ampm: hours24 >= 12 ? "PM" : "AM",
    date: `${month} ${dayOfMonth}`,
    dayOfWeek,
    fullDate: `${dayOfWeek}, ${month} ${dayOfMonth}`,
  };
}
