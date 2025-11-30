"use client";

import { usePhone } from "@/app/contexts/PhoneContext";
import { PageGrid } from "./PageGrid";
import { Dock } from "./Dock";
import { PageIndicator } from "./PageIndicator";
import { GridPosition } from "@/app/data/grid";
import { motion, PanInfo, useMotionValue, animate } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export function HomeScreen() {
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    setSpotlightOpen,
    setTodayViewOpen,
    pages,
    isEditMode,
    setEditMode,
    moveGridItem,
  } = usePhone();

  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [pageWidth, setPageWidth] = useState(393);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Update page width based on actual container size
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = pageWidth * 0.2;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    let newPage = currentPage;

    if (offset < -threshold || velocity < -500) {
      // Swipe left - go to next page
      newPage = Math.min(currentPage + 1, totalPages - 1);
    } else if (offset > threshold || velocity > 500) {
      // Swipe right - go to previous page or open today view
      if (currentPage === 0) {
        // Already on first page, open today view
        setTodayViewOpen(true);
        animate(x, 0);
        return;
      }
      newPage = Math.max(currentPage - 1, 0);
    }

    setCurrentPage(newPage);
    animate(x, -newPage * pageWidth, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Handle vertical drags for spotlight (only when dragging primarily up)
    if (
      info.offset.y < -60 &&
      Math.abs(info.offset.y) > Math.abs(info.offset.x) * 1.5
    ) {
      setSpotlightOpen(true);
    }
  };

  // Long press to enter edit mode
  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      setEditMode(true);
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Exit edit mode on tap outside
  const handleBackgroundTap = () => {
    if (isEditMode) {
      setEditMode(false);
    }
  };

  // Handle moving items within the grid
  const handleMoveItem = useCallback(
    (itemId: string, fromPageIndex: number, newPosition: GridPosition) => {
      moveGridItem(itemId, fromPageIndex, fromPageIndex, newPosition);
    },
    [moveGridItem]
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{ paddingTop: "var(--status-bar-height)" }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Pages Container */}
      <motion.div
        className="flex-1 flex"
        style={{ x }}
        drag={isEditMode ? false : "x"}
        dragConstraints={{
          left: -(totalPages - 1) * pageWidth - 100,
          right: 100,
        }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleBackgroundTap}
      >
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="flex-shrink-0 flex flex-col pt-4 pb-32 overflow-y-auto hide-scrollbar"
            style={{ width: pageWidth }}
          >
            <PageGrid
              page={page}
              pageIndex={index}
              isEditMode={isEditMode}
              onMoveItem={handleMoveItem}
              gridWidth={pageWidth}
            />
          </div>
        ))}
      </motion.div>

      {/* Search Pill */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ bottom: 94 }}
      >
        <motion.button
          className="px-4 py-[5px] rounded-full flex items-center gap-[6px]"
          style={{
            background: "rgba(120, 120, 128, 0.24)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSpotlightOpen(true)}
        >
          <Image src="/icons/search.svg" alt="Search" width={10} height={10} />
          <span className="text-white/50 text-[12px]">Search</span>
        </motion.button>
      </div>

      {/* Page Indicator */}
      <div className="absolute left-0 right-0" style={{ bottom: 80 }}>
        <PageIndicator />
      </div>

      {/* Dock */}
      <Dock />

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-center">
        <div
          className="home-indicator"
          style={{ background: "rgba(255,255,255,0.4)" }}
        />
      </div>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <motion.div
          className="absolute top-16 left-0 right-0 flex justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="text-white text-xs">Tap to exit edit mode</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
