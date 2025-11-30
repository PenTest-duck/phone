"use client";

import { dockApps } from "@/app/data/apps";
import { AppIcon } from "./AppIcon";

export function Dock() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-[10px] pb-3"
      style={{ height: "var(--dock-height)" }}
    >
      <div className="dock-blur rounded-[24px] h-full flex items-center justify-evenly px-1">
        {dockApps.map((app) => (
          <AppIcon key={app.id} app={app} size="dock" />
        ))}
      </div>
    </div>
  );
}
