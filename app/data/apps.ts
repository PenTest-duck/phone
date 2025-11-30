export interface AppDefinition {
  id: string;
  name: string;
  icon: string; // path to icon image/svg
  color?: string; // background color if no icon
  action?: () => void; // future: what happens when tapped
  badge?: number; // notification badge count
  isSystemApp?: boolean;
  hasImplementation?: boolean; // whether the app has a working implementation
}

// Set of app IDs that have working implementations
export const implementedApps = new Set<string>([
  "calculator",
  "reddit",
  "spotify",
]);

export interface WidgetDefinition {
  id: string;
  type: "weather" | "calendar" | "clock" | "custom";
  size: "small" | "medium" | "large";
  data?: Record<string, unknown>;
}

// Apps for the home screen grid
export const homeScreenApps: AppDefinition[] = [
  // Row 1 - After widgets
  {
    id: "facetime",
    name: "FaceTime",
    icon: "/app-icons/facetime.svg",
    color: "#32D74B",
  },
  { id: "calendar", name: "Calendar", icon: "/app-icons/calendar.svg" },
  {
    id: "photos",
    name: "Photos",
    icon: "/app-icons/photos.svg",
    color: "#FFFFFF",
  },
  { id: "camera", name: "Camera", icon: "/app-icons/camera.svg" },

  // Row 2
  {
    id: "mail",
    name: "Mail",
    icon: "/app-icons/mail.svg",
    color: "#007AFF",
    badge: 3,
  },
  {
    id: "notes",
    name: "Notes",
    icon: "/app-icons/notes.svg",
    color: "#FFCC00",
  },
  {
    id: "reminders",
    name: "Reminders",
    icon: "/app-icons/reminders.svg",
    color: "#FFFFFF",
  },
  { id: "clock", name: "Clock", icon: "/app-icons/clock.svg" },

  // Row 3
  { id: "news", name: "News", icon: "/app-icons/news.svg", color: "#FC3D39" },
  {
    id: "appletv",
    name: "TV",
    icon: "/app-icons/appletv.svg",
    color: "#000000",
  },
  {
    id: "podcasts",
    name: "Podcasts",
    icon: "/app-icons/podcasts.svg",
    color: "#872EC4",
  },
  { id: "appstore", name: "App Store", icon: "/app-icons/app-store.svg" },

  // Row 4
  { id: "maps", name: "Maps", icon: "/app-icons/maps.svg", color: "#5AC8FA" },
  {
    id: "health",
    name: "Health",
    icon: "/app-icons/health.svg",
    color: "#FFFFFF",
  },
  { id: "wallet", name: "Wallet", icon: "/app-icons/wallet.svg" },
  { id: "settings", name: "Settings", icon: "/app-icons/settings.svg" },
];

// Second page apps
export const secondPageApps: AppDefinition[] = [
  { id: "weather", name: "Weather", icon: "/app-icons/weather.svg" },
  { id: "stocks", name: "Stocks", icon: "/app-icons/stocks.svg" },
  { id: "voicememos", name: "Voice Memos", icon: "/app-icons/voice-memos.svg" },
  { id: "safari", name: "Safari", icon: "/app-icons/safari.svg" },

  {
    id: "reddit",
    name: "Reddit",
    icon: "/app-icons/reddit.svg",
    hasImplementation: true,
  },
  { id: "duolingo", name: "Duolingo", icon: "/app-icons/duolingo.svg" },
  { id: "shortcuts", name: "Shortcuts", icon: "/app-icons/my-shortcuts.svg" },
  {
    id: "files",
    name: "Files",
    icon: "/app-icons/files.svg",
    color: "#007AFF",
  },

  {
    id: "calculator",
    name: "Calculator",
    icon: "/app-icons/calculator.svg",
    hasImplementation: true,
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "/app-icons/spotify.svg",
    hasImplementation: true,
  },
  {
    id: "github",
    name: "GitHub",
    icon: "/app-icons/github.svg",
  },
];

// Dock apps (always visible at bottom)
export const dockApps: AppDefinition[] = [
  {
    id: "phone",
    name: "Phone",
    icon: "/app-icons/phone.svg",
    color: "#32D74B",
    isSystemApp: true,
  },
  {
    id: "safari-dock",
    name: "Safari",
    icon: "/app-icons/safari.svg",
    isSystemApp: true,
  },
  {
    id: "messages",
    name: "Messages",
    icon: "/app-icons/messages.svg",
    color: "#32D74B",
    isSystemApp: true,
  },
  {
    id: "music",
    name: "Music",
    icon: "/app-icons/music.svg",
    color: "#FC3D39",
    isSystemApp: true,
  },
];

// All apps combined for search
export const allApps: AppDefinition[] = [
  ...homeScreenApps,
  ...secondPageApps,
  ...dockApps,
];

// Widget configurations
export const defaultWidgets: WidgetDefinition[] = [
  {
    id: "weather-widget",
    type: "weather",
    size: "medium",
    data: {
      location: "Cupertino",
      temperature: 72,
      condition: "Partly Cloudy",
      high: 78,
      low: 65,
    },
  },
  {
    id: "calendar-widget",
    type: "calendar",
    size: "medium",
    data: {
      events: [],
    },
  },
];

// Widget lookup by ID
export const widgetsById: Record<string, WidgetDefinition> =
  defaultWidgets.reduce((acc, widget) => ({ ...acc, [widget.id]: widget }), {});

// Apps lookup by ID
export const appsById: Record<string, AppDefinition> = [
  ...homeScreenApps,
  ...secondPageApps,
  ...dockApps,
].reduce((acc, app) => ({ ...acc, [app.id]: app }), {});
