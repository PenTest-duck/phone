"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  PageLayout,
  GridPosition,
  initialPages,
  moveItem,
} from "@/app/data/grid";

export type ScreenType =
  | "lock"
  | "home"
  | "spotlight"
  | "control-center"
  | "today-view";

interface PhoneContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  isLocked: boolean;
  unlock: () => void;
  lock: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  spotlightOpen: boolean;
  setSpotlightOpen: (open: boolean) => void;
  controlCenterOpen: boolean;
  setControlCenterOpen: (open: boolean) => void;
  todayViewOpen: boolean;
  setTodayViewOpen: (open: boolean) => void;
  // Grid management
  pages: PageLayout[];
  isEditMode: boolean;
  setEditMode: (edit: boolean) => void;
  moveGridItem: (
    itemId: string,
    fromPageIndex: number,
    toPageIndex: number,
    newPosition: GridPosition
  ) => boolean;
  // App management
  activeApp: string | null;
  openApp: (appId: string) => void;
  closeApp: () => void;
}

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);

interface PhoneProviderProps {
  children: ReactNode;
}

export function PhoneProvider({ children }: PhoneProviderProps) {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("lock");
  const [isLocked, setIsLocked] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const [todayViewOpen, setTodayViewOpen] = useState(false);

  // Grid state
  const [pages, setPages] = useState<PageLayout[]>(initialPages);
  const [isEditMode, setEditMode] = useState(false);

  // App state
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const totalPages = pages.length;

  const unlock = useCallback(() => {
    setIsLocked(false);
    setCurrentScreen("home");
  }, []);

  const lock = useCallback(() => {
    setIsLocked(true);
    setCurrentScreen("lock");
    setCurrentPage(0);
    setSpotlightOpen(false);
    setControlCenterOpen(false);
    setTodayViewOpen(false);
    setEditMode(false);
    setActiveApp(null);
  }, []);

  const moveGridItem = useCallback(
    (
      itemId: string,
      fromPageIndex: number,
      toPageIndex: number,
      newPosition: GridPosition
    ): boolean => {
      const newPages = moveItem(
        pages,
        itemId,
        fromPageIndex,
        toPageIndex,
        newPosition
      );
      if (newPages !== pages) {
        setPages(newPages);
        return true;
      }
      return false;
    },
    [pages]
  );

  const openApp = useCallback((appId: string) => {
    setActiveApp(appId);
    // Close any open overlays when opening an app
    setSpotlightOpen(false);
    setControlCenterOpen(false);
    setTodayViewOpen(false);
    setEditMode(false);
  }, []);

  const closeApp = useCallback(() => {
    setActiveApp(null);
  }, []);

  return (
    <PhoneContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isLocked,
        unlock,
        lock,
        currentPage,
        setCurrentPage,
        totalPages,
        spotlightOpen,
        setSpotlightOpen,
        controlCenterOpen,
        setControlCenterOpen,
        todayViewOpen,
        setTodayViewOpen,
        pages,
        isEditMode,
        setEditMode,
        moveGridItem,
        activeApp,
        openApp,
        closeApp,
      }}
    >
      {children}
    </PhoneContext.Provider>
  );
}

export function usePhone() {
  const context = useContext(PhoneContext);
  if (context === undefined) {
    throw new Error("usePhone must be used within a PhoneProvider");
  }
  return context;
}
