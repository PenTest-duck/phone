"use client";

import { useRef, useCallback } from "react";
import { motion, PanInfo } from "framer-motion";
import {
  PageLayout,
  GridItem,
  GRID_COLUMNS,
  GRID_ROWS,
  GridPosition,
  widgetFitsAt,
} from "@/app/data/grid";
import { appsById, widgetsById } from "@/app/data/apps";
import { AppIcon } from "./AppIcon";
import { Widget } from "./Widget";

interface PageGridProps {
  page: PageLayout;
  pageIndex: number;
  isEditMode: boolean;
  onMoveItem?: (
    itemId: string,
    fromPageIndex: number,
    newPosition: GridPosition
  ) => void;
  gridWidth: number;
}

export function PageGrid({
  page,
  pageIndex,
  isEditMode,
  onMoveItem,
  gridWidth,
}: PageGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // Calculate cell dimensions
  const horizontalPadding = 20;
  const gridGap = 10;
  const availableWidth = gridWidth - horizontalPadding * 2;
  const cellWidth = availableWidth / GRID_COLUMNS;
  const cellHeight = cellWidth + 14; // Extra space for labels

  const getItemPosition = (item: GridItem) => {
    return {
      left: horizontalPadding + item.position.col * cellWidth,
      top: item.position.row * cellHeight,
    };
  };

  const getItemSize = (item: GridItem) => {
    if (item.type === "widget") {
      const size = item.size || { width: 2, height: 2 };
      const widgetWidth = size.width * cellWidth - gridGap;
      return {
        width: widgetWidth,
        height: widgetWidth + 20, // Square widget + label space
      };
    }
    return {
      width: cellWidth,
      height: cellHeight,
    };
  };

  const pixelToGridPosition = (x: number, y: number): GridPosition => {
    const col = Math.round((x - horizontalPadding) / cellWidth);
    const row = Math.round(y / cellHeight);

    return {
      row: Math.max(0, Math.min(GRID_ROWS - 1, row)),
      col: Math.max(0, Math.min(GRID_COLUMNS - 1, col)),
    };
  };

  // Fixed dependencies and logic in handleDragEnd
  const handleDragEnd = useCallback(
    (
      itemId: string,
      item: GridItem,
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (!onMoveItem) return;

      const pos = getItemPosition(item);
      const newX = pos.left + info.offset.x;
      const newY = pos.top + info.offset.y;

      const newGridPos = pixelToGridPosition(newX, newY);

      // Validate position for widgets
      if (item.type === "widget") {
        const size = item.size || { width: 2, height: 2 };
        if (!widgetFitsAt(newGridPos, size)) return;
      }

      // Only move if actually different position
      if (
        newGridPos.row !== item.position.row ||
        newGridPos.col !== item.position.col
      ) {
        onMoveItem(itemId, pageIndex, newGridPos);
      }
    },
    [onMoveItem, pageIndex, getItemPosition, pixelToGridPosition]
  );

  const renderWidget = (item: GridItem) => {
    if (!item.widgetId) return null;
    const widget = widgetsById[item.widgetId];
    if (!widget) return null;

    const pos = getItemPosition(item);
    const size = getItemSize(item);

    return (
      <motion.div
        key={item.id}
        className="absolute flex flex-col items-center gap-[5px]"
        style={{
          left: pos.left,
          top: pos.top,
          width: size.width,
        }}
        drag={isEditMode}
        dragMomentum={false}
        dragElastic={0.1}
        dragSnapToOrigin
        onDragEnd={(e, info) => handleDragEnd(item.id, item, e, info)}
        whileDrag={{ scale: 1.05, zIndex: 100 }}
        animate={
          isEditMode
            ? {
                rotate: [0, -1, 1, -1, 0],
              }
            : { rotate: 0 }
        }
        transition={
          isEditMode
            ? {
                repeat: Infinity,
                duration: 0.3,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        <div
          className="aspect-square w-full"
          style={{ pointerEvents: isEditMode ? "none" : "auto" }}
        >
          <Widget widget={widget} />
        </div>
        <span
          className="text-white text-[10px] text-center drop-shadow-sm"
          style={{ pointerEvents: isEditMode ? "none" : "auto" }}
        >
          {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}
        </span>
      </motion.div>
    );
  };

  const renderApp = (item: GridItem) => {
    if (!item.appId) return null;
    const app = appsById[item.appId];
    if (!app) return null;

    const pos = getItemPosition(item);
    const size = getItemSize(item);

    return (
      <motion.div
        key={item.id}
        className="absolute flex items-center justify-center"
        style={{
          left: pos.left,
          top: pos.top,
          width: size.width,
          height: size.height,
        }}
        drag={isEditMode}
        dragMomentum={false}
        dragElastic={0.1}
        dragSnapToOrigin
        onDragEnd={(e, info) => handleDragEnd(item.id, item, e, info)}
        whileDrag={{ scale: 1.1, zIndex: 100 }}
        animate={
          isEditMode
            ? {
                rotate: [0, -2, 2, -2, 0],
              }
            : { rotate: 0 }
        }
        transition={
          isEditMode
            ? {
                repeat: Infinity,
                duration: 0.2,
                ease: "easeInOut",
              }
            : undefined
        }
      >
        <div style={{ pointerEvents: isEditMode ? "none" : "auto" }}>
          <AppIcon app={app} />
        </div>
      </motion.div>
    );
  };

  const renderItem = (item: GridItem) => {
    if (item.type === "widget") {
      return renderWidget(item);
    }
    return renderApp(item);
  };

  // Calculate total grid height
  const gridHeight = GRID_ROWS * cellHeight;

  return (
    <div
      ref={gridRef}
      className="relative w-full"
      style={{ height: gridHeight }}
    >
      {page.items.map(renderItem)}
    </div>
  );
}
