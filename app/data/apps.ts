// Grid position configuration for explicit app placement
export interface GridPositionConfig {
  page: number; // 0-indexed page number (0 = first page, 1 = second page, etc.)
  row: number; // 0-5 (6 rows total)
  col: number; // 0-3 (4 columns total)
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string; // path to icon image/svg
  color?: string; // background color if no icon
  action?: () => void; // future: what happens when tapped
  badge?: number; // notification badge count
  isSystemApp?: boolean;
  hasImplementation?: boolean; // whether the app has a working implementation
  url?: string; // if set, opens this URL in a new browser tab when tapped
  gridPosition?: GridPositionConfig; // explicit grid position (page, row, col)
}

// Set of app IDs that have working implementations
export const implementedApps = new Set<string>([
  "calculator",
  "reddit",
  "spotify",
  "messages",
  "youtube",
]);

export interface WidgetDefinition {
  id: string;
  type: "weather" | "calendar" | "clock" | "custom";
  size: "small" | "medium" | "large";
  data?: Record<string, unknown>;
}

// Apps for the home screen grid (Page 0, rows 2-5 since widgets occupy rows 0-1)
export const homeScreenApps: AppDefinition[] = [
  // Row 2 (first row after widgets)
  {
    id: "facetime",
    name: "FaceTime",
    icon: "/app-icons/facetime.svg",
    color: "#32D74B",
    gridPosition: { page: 0, row: 2, col: 0 },
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "/app-icons/calendar.svg",
    gridPosition: { page: 0, row: 2, col: 1 },
  },
  {
    id: "photos",
    name: "Photos",
    icon: "/app-icons/photos.svg",
    color: "#FFFFFF",
    gridPosition: { page: 0, row: 2, col: 2 },
  },
  {
    id: "camera",
    name: "Camera",
    icon: "/app-icons/camera.svg",
    gridPosition: { page: 0, row: 2, col: 3 },
  },

  // Row 3
  {
    id: "mail",
    name: "Mail",
    icon: "/app-icons/mail.svg",
    color: "#007AFF",
    badge: 3,
    gridPosition: { page: 0, row: 3, col: 0 },
  },
  {
    id: "notes",
    name: "Notes",
    icon: "/app-icons/notes.svg",
    color: "#FFCC00",
    gridPosition: { page: 0, row: 3, col: 1 },
  },
  {
    id: "reminders",
    name: "Reminders",
    icon: "/app-icons/reminders.svg",
    color: "#FFFFFF",
    gridPosition: { page: 0, row: 3, col: 2 },
  },
  {
    id: "clock",
    name: "Clock",
    icon: "/app-icons/clock.svg",
    gridPosition: { page: 0, row: 3, col: 3 },
  },

  // Row 4
  {
    id: "news",
    name: "News",
    icon: "/app-icons/news.svg",
    color: "#FC3D39",
    gridPosition: { page: 0, row: 4, col: 0 },
  },
  {
    id: "appletv",
    name: "TV",
    icon: "/app-icons/appletv.svg",
    color: "#000000",
    gridPosition: { page: 0, row: 4, col: 1 },
  },
  {
    id: "podcasts",
    name: "Podcasts",
    icon: "/app-icons/podcasts.svg",
    color: "#872EC4",
    gridPosition: { page: 0, row: 4, col: 2 },
  },
  {
    id: "appstore",
    name: "App Store",
    icon: "/app-icons/app-store.svg",
    gridPosition: { page: 0, row: 4, col: 3 },
  },

  // Row 5
  {
    id: "maps",
    name: "Maps",
    icon: "/app-icons/maps.svg",
    color: "#5AC8FA",
    gridPosition: { page: 0, row: 5, col: 0 },
  },
  {
    id: "health",
    name: "Health",
    icon: "/app-icons/health.svg",
    color: "#FFFFFF",
    gridPosition: { page: 0, row: 5, col: 1 },
  },
  {
    id: "wallet",
    name: "Wallet",
    icon: "/app-icons/wallet.svg",
    gridPosition: { page: 0, row: 5, col: 2 },
  },
  {
    id: "settings",
    name: "Settings",
    icon: "/app-icons/settings.svg",
    gridPosition: { page: 0, row: 5, col: 3 },
  },
];

// Second page apps (Page 1)
export const secondPageApps: AppDefinition[] = [
  // Row 0
  {
    id: "weather",
    name: "Weather",
    icon: "/app-icons/weather.svg",
    gridPosition: { page: 1, row: 0, col: 0 },
  },
  {
    id: "stocks",
    name: "Stocks",
    icon: "/app-icons/stocks.svg",
    gridPosition: { page: 1, row: 0, col: 1 },
  },
  {
    id: "voicememos",
    name: "Voice Memos",
    icon: "/app-icons/voice-memos.svg",
    gridPosition: { page: 1, row: 0, col: 2 },
  },
  {
    id: "safari",
    name: "Safari",
    icon: "/app-icons/safari.svg",
    gridPosition: { page: 1, row: 0, col: 3 },
  },

  // Row 1
  {
    id: "reddit",
    name: "Reddit",
    icon: "/app-icons/reddit.svg",
    hasImplementation: true,
    gridPosition: { page: 1, row: 1, col: 0 },
  },
  {
    id: "duolingo",
    name: "Duolingo",
    icon: "/app-icons/duolingo.svg",
    gridPosition: { page: 1, row: 1, col: 1 },
  },
  {
    id: "shortcuts",
    name: "Shortcuts",
    icon: "/app-icons/my-shortcuts.svg",
    gridPosition: { page: 1, row: 1, col: 2 },
  },
  {
    id: "files",
    name: "Files",
    icon: "/app-icons/files.svg",
    color: "#007AFF",
    gridPosition: { page: 1, row: 1, col: 3 },
  },

  // Row 2
  {
    id: "calculator",
    name: "Calculator",
    icon: "/app-icons/calculator.svg",
    hasImplementation: true,
    gridPosition: { page: 1, row: 2, col: 0 },
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "/app-icons/spotify.svg",
    hasImplementation: true,
    gridPosition: { page: 1, row: 2, col: 1 },
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "/app-icons/youtube.svg",
    hasImplementation: true,
    gridPosition: { page: 1, row: 2, col: 2 },
  },

  // Row 6
  {
    id: "github",
    name: "GitHub",
    icon: "/app-icons/github.svg",
    url: "https://github.com/PenTest-duck",
    gridPosition: { page: 1, row: 5, col: 1 },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "/app-icons/linkedin.svg",
    url: "https://linkedin.com/in/chris-yoo",
    gridPosition: { page: 1, row: 5, col: 2 },
  },
  {
    id: "x",
    name: "X",
    icon: "/app-icons/x.svg",
    url: "https://x.com/pentestduck",
    gridPosition: { page: 1, row: 5, col: 3 },
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
    hasImplementation: true,
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
