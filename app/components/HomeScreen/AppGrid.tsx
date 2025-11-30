"use client";

import { AppDefinition } from "@/app/data/apps";
import { AppIcon } from "./AppIcon";

interface AppGridProps {
  apps: AppDefinition[];
  columns?: number;
}

export function AppGrid({ apps, columns = 4 }: AppGridProps) {
  return (
    <div
      className="grid gap-y-[18px] gap-x-[10px] justify-items-center"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {apps.map((app) => (
        <AppIcon key={app.id} app={app} />
      ))}
    </div>
  );
}
