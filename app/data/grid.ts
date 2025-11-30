import { homeScreenApps, secondPageApps, defaultWidgets } from "./apps";

// Grid dimensions
export const GRID_COLUMNS = 4;
export const GRID_ROWS = 6;
export const SLOTS_PER_PAGE = GRID_COLUMNS * GRID_ROWS; // 24

// Grid item types
export type GridItemType = "app" | "widget";

export interface GridPosition {
  row: number; // 0-5
  col: number; // 0-3
}

export interface GridItem {
  id: string;
  type: GridItemType;
  position: GridPosition;
  // For widgets, this defines the size (default 2x2)
  size?: { width: number; height: number };
  // Reference to the actual app or widget data
  appId?: string;
  widgetId?: string;
}

export interface PageLayout {
  id: string;
  items: GridItem[];
}

// Helper to check if a position is valid
export function isValidPosition(pos: GridPosition): boolean {
  return (
    pos.row >= 0 &&
    pos.row < GRID_ROWS &&
    pos.col >= 0 &&
    pos.col < GRID_COLUMNS
  );
}

// Helper to check if a widget fits at a position
export function widgetFitsAt(
  pos: GridPosition,
  size: { width: number; height: number } = { width: 2, height: 2 }
): boolean {
  return (
    pos.col + size.width <= GRID_COLUMNS && pos.row + size.height <= GRID_ROWS
  );
}

// Get all positions occupied by an item
export function getOccupiedPositions(item: GridItem): GridPosition[] {
  const positions: GridPosition[] = [];
  const size =
    item.type === "widget"
      ? item.size || { width: 2, height: 2 }
      : { width: 1, height: 1 };

  for (let r = 0; r < size.height; r++) {
    for (let c = 0; c < size.width; c++) {
      positions.push({
        row: item.position.row + r,
        col: item.position.col + c,
      });
    }
  }
  return positions;
}

// Check if two items overlap
export function itemsOverlap(item1: GridItem, item2: GridItem): boolean {
  const pos1 = getOccupiedPositions(item1);
  const pos2 = getOccupiedPositions(item2);

  return pos1.some((p1) =>
    pos2.some((p2) => p1.row === p2.row && p1.col === p2.col)
  );
}

// Check if a position is occupied by any item in the page
export function isPositionOccupied(
  page: PageLayout,
  pos: GridPosition,
  excludeItemId?: string
): boolean {
  return page.items.some((item) => {
    if (excludeItemId && item.id === excludeItemId) return false;
    const occupied = getOccupiedPositions(item);
    return occupied.some((p) => p.row === pos.row && p.col === pos.col);
  });
}

// Find the first available position for an app (1x1)
export function findAvailableAppPosition(
  page: PageLayout
): GridPosition | null {
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      const pos = { row, col };
      if (!isPositionOccupied(page, pos)) {
        return pos;
      }
    }
  }
  return null;
}

// Find the first available position for a widget (2x2)
export function findAvailableWidgetPosition(
  page: PageLayout,
  size: { width: number; height: number } = { width: 2, height: 2 }
): GridPosition | null {
  for (let row = 0; row <= GRID_ROWS - size.height; row++) {
    for (let col = 0; col <= GRID_COLUMNS - size.width; col++) {
      const pos = { row, col };
      let fits = true;

      // Check all positions the widget would occupy
      for (let r = 0; r < size.height && fits; r++) {
        for (let c = 0; c < size.width && fits; c++) {
          if (isPositionOccupied(page, { row: row + r, col: col + c })) {
            fits = false;
          }
        }
      }

      if (fits) return pos;
    }
  }
  return null;
}

// Convert pixel position to grid position
export function pixelToGrid(
  x: number,
  y: number,
  cellWidth: number,
  cellHeight: number,
  gridOffsetX: number = 0,
  gridOffsetY: number = 0
): GridPosition {
  const col = Math.floor((x - gridOffsetX) / cellWidth);
  const row = Math.floor((y - gridOffsetY) / cellHeight);

  return {
    row: Math.max(0, Math.min(GRID_ROWS - 1, row)),
    col: Math.max(0, Math.min(GRID_COLUMNS - 1, col)),
  };
}

// Move an item to a new position
export function moveItem(
  pages: PageLayout[],
  itemId: string,
  fromPageIndex: number,
  toPageIndex: number,
  newPosition: GridPosition
): PageLayout[] {
  const newPages = pages.map((p) => ({ ...p, items: [...p.items] }));

  // Find and remove the item from its current page
  const fromPage = newPages[fromPageIndex];
  const itemIndex = fromPage.items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) return pages;

  const [item] = fromPage.items.splice(itemIndex, 1);

  // Add to new position
  const toPage = newPages[toPageIndex];
  const newItem: GridItem = { ...item, position: newPosition };

  // Check if position is valid
  if (item.type === "widget") {
    const size = item.size || { width: 2, height: 2 };
    if (!widgetFitsAt(newPosition, size)) return pages;
  }

  // Check for overlaps (excluding the item being moved)
  const hasOverlap = toPage.items.some((existingItem) =>
    itemsOverlap(existingItem, newItem)
  );

  if (hasOverlap) return pages;

  toPage.items.push(newItem);
  return newPages;
}

// Create initial page layouts from existing app data
function createInitialPages(): PageLayout[] {
  const pages: PageLayout[] = [];

  // Page 1: Widgets (top-left 2x2 and top-right 2x2) + remaining apps
  const page1Items: GridItem[] = [];

  // Add weather widget at position (0,0) - takes 2x2
  page1Items.push({
    id: "grid-weather-widget",
    type: "widget",
    position: { row: 0, col: 0 },
    size: { width: 2, height: 2 },
    widgetId: "weather-widget",
  });

  // Add calendar widget at position (0,2) - takes 2x2
  page1Items.push({
    id: "grid-calendar-widget",
    type: "widget",
    position: { row: 0, col: 2 },
    size: { width: 2, height: 2 },
    widgetId: "calendar-widget",
  });

  // Add first page apps starting at row 2
  let appIndex = 0;
  for (let row = 2; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      if (appIndex < homeScreenApps.length) {
        page1Items.push({
          id: `grid-app-${homeScreenApps[appIndex].id}`,
          type: "app",
          position: { row, col },
          appId: homeScreenApps[appIndex].id,
        });
        appIndex++;
      }
    }
  }

  pages.push({ id: "page-1", items: page1Items });

  // Page 2: Remaining apps
  const page2Items: GridItem[] = [];
  let page2AppIndex = 0;

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLUMNS; col++) {
      if (page2AppIndex < secondPageApps.length) {
        page2Items.push({
          id: `grid-app-${secondPageApps[page2AppIndex].id}`,
          type: "app",
          position: { row, col },
          appId: secondPageApps[page2AppIndex].id,
        });
        page2AppIndex++;
      }
    }
  }

  pages.push({ id: "page-2", items: page2Items });

  return pages;
}

// Export initial pages (rebuilt when app data changes)
export const initialPages: PageLayout[] = createInitialPages();
