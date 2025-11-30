"use client";

import { useState } from "react";
import { AppContainer } from "@/app/components/Apps/AppContainer";
import { WebAppConfig } from "@/app/data/webApps";

interface WebAppProps {
  config: WebAppConfig;
}

/**
 * Inner component that handles the iframe state
 * Separated to allow key-based remounting when config changes
 */
function WebAppContent({ config }: WebAppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use mobile URL if available, otherwise fall back to main URL
  const targetUrl = config.mobileUrl || config.url;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <LoadingSpinner />
          <p className="text-white/60 text-sm mt-4">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8">
          <div className="text-white/40 text-6xl mb-4">⚠️</div>
          <p className="text-white/80 text-center">Unable to load content</p>
          <p className="text-white/40 text-sm text-center mt-2">
            This website may not allow embedding
          </p>
        </div>
      )}

      {/* Iframe - Mobile Web View */}
      <iframe
        src={targetUrl}
        className="w-full h-full border-0"
        style={{
          opacity: isLoading || hasError ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        onLoad={handleLoad}
        onError={handleError}
        // Sandbox with necessary permissions for most web apps
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        // Allow fullscreen if configured
        allowFullScreen={config.allowFullscreen}
        // Important: This tells the page we want mobile experience
        // Note: Some sites ignore this, but many respect it
        title={`${config.id} app`}
      />
    </div>
  );
}

/**
 * Generic web app component that renders websites in a mobile-like iframe
 * Simulates the experience of opening a native app that displays web content
 */
export function WebApp({ config }: WebAppProps) {
  return (
    <AppContainer
      appId={config.id}
      backgroundColor={config.backgroundColor || "#000000"}
      statusBarVariant={config.statusBarVariant || "light"}
    >
      {/* Key forces remount when config changes, resetting all state */}
      <WebAppContent key={config.id} config={config} />
    </AppContainer>
  );
}

/**
 * iOS-style loading spinner
 */
function LoadingSpinner() {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 animate-spin">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-2.5 bg-white/80 rounded-full"
            style={{
              left: "50%",
              top: "0",
              transformOrigin: "50% 20px",
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              opacity: 1 - i * 0.07,
            }}
          />
        ))}
      </div>
    </div>
  );
}
