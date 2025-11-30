"use client";

import { usePhone } from "@/app/contexts/PhoneContext";

interface PageIndicatorProps {
  includeSearch?: boolean;
}

export function PageIndicator({ includeSearch = true }: PageIndicatorProps) {
  const { currentPage, totalPages } = usePhone();

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {includeSearch && (
        <div className="page-dot" style={{ 
          background: "rgba(255,255,255,0.5)",
          width: 6,
          height: 6,
        }}>
          <svg width="6" height="6" viewBox="0 0 24 24" fill="white" className="opacity-0">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
      )}
      
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          key={index}
          className={`page-dot ${currentPage === index ? "active" : ""}`}
        />
      ))}
    </div>
  );
}

