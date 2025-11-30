"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { usePhone } from "@/app/contexts/PhoneContext";
import { allApps } from "@/app/data/apps";
import { AppIcon } from "@/app/components/HomeScreen/AppIcon";

export function Spotlight() {
  const { setSpotlightOpen } = usePhone();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) {
      // Show suggestions when empty
      return allApps.slice(0, 8);
    }

    const query = searchQuery.toLowerCase();
    return allApps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleClose = () => {
    setSpotlightOpen(false);
    setSearchQuery("");
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Blur Background */}
      <div className="absolute inset-0 ios-blur-dark" onClick={handleClose} />

      {/* Content */}
      <div
        className="relative flex flex-col h-full"
        style={{ paddingTop: "var(--status-bar-height)" }}
      >
        {/* Search Bar */}
        <div className="px-4 pt-2 pb-4">
          <div className="ios-search-bar flex items-center gap-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-base"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-white/50 hover:text-white/80"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 px-4 overflow-y-auto hide-scrollbar pb-20">
          {/* Siri Suggestions Header */}
          {!searchQuery && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-white/60 text-sm font-medium">
                Siri Suggestions
              </span>
            </div>
          )}

          {/* App Grid */}
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-4 gap-y-6 gap-x-4 justify-items-center">
              {filteredApps.map((app) => (
                <AppIcon
                  key={app.id}
                  app={app}
                  onTap={() => {
                    console.log(`Opening ${app.name}`);
                    handleClose();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-white/50 text-lg">No Results</p>
              <p className="text-white/30 text-sm mt-1">
                No results for &quot;{searchQuery}&quot;
              </p>
            </div>
          )}

          {/* Web Search Suggestion */}
          {searchQuery && (
            <div className="mt-6">
              <div className="text-white/60 text-sm font-medium mb-3">
                Search Web
              </div>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 active:bg-white/20">
                <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <span className="text-white">
                  Search Web for &quot;{searchQuery}&quot;
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <div className="absolute top-0 right-0 pt-[62px] pr-4">
          <button
            onClick={handleClose}
            className="text-[#007AFF] text-base font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
