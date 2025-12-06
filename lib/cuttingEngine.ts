/**
 * Cutting Engine - Optimizes panel placement on sheets
 * Similar to Базис Раскрой logic
 */

import { Panel, Sheet, CuttingPlan, Material } from './types';

const STANDARD_SHEET_WIDTH = 2800; // mm
const STANDARD_SHEET_HEIGHT = 2070; // mm
const CUTTING_KERF = 3; // mm - толщина пропила

interface PlacedPanel {
  panel: Panel;
  x: number;
  y: number;
  rotated: boolean;
}

interface SheetLayout {
  width: number;
  height: number;
  material: Material;
  placedPanels: PlacedPanel[];
  usedArea: number;
}

/**
 * Optimize cutting plan for given panels
 */
export function optimizeCutting(
  panelList: Panel[],
  sheetWidth: number = STANDARD_SHEET_WIDTH,
  sheetHeight: number = STANDARD_SHEET_HEIGHT
): CuttingPlan {
  // Group panels by material and thickness
  const groupedPanels = groupPanelsByMaterial(panelList);

  const allSheets: Sheet[] = [];
  let totalWaste = 0;
  let totalSquareMeters = 0;
  const allPanels: Panel[] = [];

  // Process each material group separately
  Object.entries(groupedPanels).forEach(([key, panels]) => {
    const { sheets, waste, squareMeters } = optimizeForMaterial(
      panels,
      sheetWidth,
      sheetHeight
    );
    allSheets.push(...sheets);
    totalWaste += waste;
    totalSquareMeters += squareMeters;
    allPanels.push(...panels);
  });

  return {
    sheets: allSheets,
    totalWaste: totalWaste / allSheets.length || 0,
    totalSquareMeters,
    panels: allPanels,
  };
}

/**
 * Group panels by material type and thickness
 */
function groupPanelsByMaterial(panels: Panel[]): Record<string, Panel[]> {
  const groups: Record<string, Panel[]> = {};

  panels.forEach((panel) => {
    const key = `${panel.material.type}-${panel.material.thickness}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    // Add multiple copies if quantity > 1
    for (let i = 0; i < panel.quantity; i++) {
      groups[key].push({ ...panel, id: `${panel.id}-${i}`, quantity: 1 });
    }
  });

  return groups;
}

/**
 * Optimize cutting for a specific material
 */
function optimizeForMaterial(
  panels: Panel[],
  sheetWidth: number,
  sheetHeight: number
): {
  sheets: Sheet[];
  waste: number;
  squareMeters: number;
} {
  if (panels.length === 0) {
    return { sheets: [], waste: 0, squareMeters: 0 };
  }

  const material = panels[0].material;
  const sheets: Sheet[] = [];
  const remainingPanels = [...panels];

  while (remainingPanels.length > 0) {
    const layout = createSheetLayout(sheetWidth, sheetHeight, material);
    const placed = placePanelsOnSheet(layout, remainingPanels);

    // Remove placed panels from remaining
    placed.forEach((placedPanel) => {
      const index = remainingPanels.findIndex(
        (p) => p.id === placedPanel.panel.id
      );
      if (index !== -1) {
        remainingPanels.splice(index, 1);
      }
    });

    // Calculate waste for this sheet
    const usedArea = calculateUsedArea(placed, sheetWidth, sheetHeight);
    const totalArea = sheetWidth * sheetHeight;
    const wastePercent = ((totalArea - usedArea) / totalArea) * 100;

    sheets.push({
      width: sheetWidth,
      height: sheetHeight,
      material,
      panels: placed.map((p) => p.panel),
      waste: wastePercent,
    });
  }

  const totalSquareMeters = sheets.reduce(
    (sum, sheet) => sum + (sheet.width * sheet.height) / 1000000,
    0
  );

  const avgWaste =
    sheets.reduce((sum, sheet) => sum + sheet.waste, 0) / sheets.length || 0;

  return {
    sheets,
    waste: avgWaste,
    squareMeters: totalSquareMeters,
  };
}

/**
 * Create a new sheet layout
 */
function createSheetLayout(
  width: number,
  height: number,
  material: Material
): SheetLayout {
  return {
    width,
    height,
    material,
    placedPanels: [],
    usedArea: 0,
  };
}

/**
 * Place panels on a sheet using a simple bottom-left fill algorithm
 */
function placePanelsOnSheet(
  layout: SheetLayout,
  panels: Panel[]
): PlacedPanel[] {
  const placed: PlacedPanel[] = [];
  const occupied: Array<{ x: number; y: number; width: number; height: number }> = [];

  // Sort panels by area (largest first) for better packing
  const sortedPanels = [...panels].sort(
    (a, b) => b.width * b.height - a.width * a.height
  );

  for (const panel of sortedPanels) {
    // Try both orientations
    const orientations = [
      { width: panel.width, height: panel.height, rotated: false },
      { width: panel.height, height: panel.width, rotated: true },
    ];

    let placedPanel: PlacedPanel | null = null;

    for (const orientation of orientations) {
      const position = findBestPosition(
        orientation.width,
        orientation.height,
        layout.width,
        layout.height,
        occupied
      );

      if (position) {
        placedPanel = {
          panel,
          x: position.x,
          y: position.y,
          rotated: orientation.rotated,
        };
        break;
      }
    }

    if (placedPanel) {
      placed.push(placedPanel);
      occupied.push({
        x: placedPanel.x,
        y: placedPanel.y,
        width: placedPanel.rotated ? panel.height : panel.width,
        height: placedPanel.rotated ? panel.width : panel.height,
      });
    }
  }

  return placed;
}

/**
 * Find best position for a panel using bottom-left fill
 */
function findBestPosition(
  width: number,
  height: number,
  sheetWidth: number,
  sheetHeight: number,
  occupied: Array<{ x: number; y: number; width: number; height: number }>
): { x: number; y: number } | null {
  // Add cutting kerf
  const panelWidth = width + CUTTING_KERF;
  const panelHeight = height + CUTTING_KERF;

  if (panelWidth > sheetWidth || panelHeight > sheetHeight) {
    return null;
  }

  // Try positions from bottom-left
  for (let y = 0; y <= sheetHeight - panelHeight; y += 10) {
    for (let x = 0; x <= sheetWidth - panelWidth; x += 10) {
      if (!collides(x, y, panelWidth, panelHeight, occupied)) {
        return { x, y };
      }
    }
  }

  return null;
}

/**
 * Check if a position collides with existing panels
 */
function collides(
  x: number,
  y: number,
  width: number,
  height: number,
  occupied: Array<{ x: number; y: number; width: number; height: number }>
): boolean {
  for (const rect of occupied) {
    if (
      x < rect.x + rect.width &&
      x + width > rect.x &&
      y < rect.y + rect.height &&
      y + height > rect.y
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Calculate total used area on a sheet
 */
function calculateUsedArea(
  placed: PlacedPanel[],
  sheetWidth: number,
  sheetHeight: number
): number {
  let usedArea = 0;
  placed.forEach((placedPanel) => {
    const width = placedPanel.rotated
      ? placedPanel.panel.height
      : placedPanel.panel.width;
    const height = placedPanel.rotated
      ? placedPanel.panel.width
      : placedPanel.panel.height;
    usedArea += width * height;
  });
  return usedArea;
}
