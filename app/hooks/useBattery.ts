"use client";

import { useState, useEffect } from "react";

interface BatteryState {
  level: number; // 0-100
  charging: boolean;
  supported: boolean;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(
    type:
      | "chargingchange"
      | "levelchange"
      | "chargingtimechange"
      | "dischargingtimechange",
    listener: EventListener
  ): void;
  removeEventListener(
    type:
      | "chargingchange"
      | "levelchange"
      | "chargingtimechange"
      | "dischargingtimechange",
    listener: EventListener
  ): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function useBattery(): BatteryState {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    level: 100,
    charging: false,
    supported: false,
  });

  useEffect(() => {
    const nav = navigator as NavigatorWithBattery;

    if (!nav.getBattery) {
      // Battery API not supported, keep defaults
      return;
    }

    let battery: BatteryManager | null = null;

    const updateBatteryInfo = (b: BatteryManager) => {
      setBatteryState({
        level: Math.round(b.level * 100),
        charging: b.charging,
        supported: true,
      });
    };

    const handleLevelChange = () => {
      if (battery) {
        updateBatteryInfo(battery);
      }
    };

    const handleChargingChange = () => {
      if (battery) {
        updateBatteryInfo(battery);
      }
    };

    nav
      .getBattery()
      .then((b) => {
        battery = b;
        updateBatteryInfo(b);

        // Listen for changes
        b.addEventListener("levelchange", handleLevelChange);
        b.addEventListener("chargingchange", handleChargingChange);
      })
      .catch(() => {
        // API call failed, keep defaults
      });

    return () => {
      if (battery) {
        battery.removeEventListener("levelchange", handleLevelChange);
        battery.removeEventListener("chargingchange", handleChargingChange);
      }
    };
  }, []);

  return batteryState;
}
