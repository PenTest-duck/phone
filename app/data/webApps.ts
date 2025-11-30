/**
 * Configuration for apps that open as embedded web views (iframes)
 * These apps display websites in a mobile viewport experience
 */

export interface WebAppConfig {
  id: string; // Must match the app ID in apps.ts
  url: string; // The URL to load in the iframe
  mobileUrl?: string; // Alternative mobile-specific URL if available
  allowFullscreen?: boolean;
  backgroundColor?: string; // Loading/fallback background color
  statusBarVariant?: "light" | "dark";
}

/**
 * Registry of apps that should open as web views
 * Add new web-based apps here
 */
export const webApps: Record<string, WebAppConfig> = {
  reddit: {
    id: "reddit",
    url: "https://www.reddit.com",
    backgroundColor: "#0e1113",
    statusBarVariant: "light",
  },
  spotify: {
    id: "spotify",
    url: "https://open.spotify.com",
    backgroundColor: "#1ed760",
    statusBarVariant: "dark",
  },
  // Future web apps can be added here:
  // twitch: {
  //   id: "twitch",
  //   url: "https://m.twitch.tv",
  //   backgroundColor: "#0e0e10",
  //   statusBarVariant: "light",
  // },
  // twitter: {
  //   id: "twitter",
  //   url: "https://twitter.com",
  //   mobileUrl: "https://mobile.twitter.com",
  //   backgroundColor: "#000000",
  //   statusBarVariant: "light",
  // },
};

/**
 * Check if an app should open as a web view
 */
export function isWebApp(appId: string): boolean {
  return appId in webApps;
}

/**
 * Get web app configuration by ID
 */
export function getWebAppConfig(appId: string): WebAppConfig | undefined {
  return webApps[appId];
}
