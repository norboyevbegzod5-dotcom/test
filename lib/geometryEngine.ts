/**
 * Geometry Engine - Calculates all furniture components automatically
 * Similar to Базис Мебельщик logic
 */

import {
  Cabinet,
  Dimensions,
  Material,
  Panel,
  Door,
  Shelf,
  Partition,
  Base,
  BackPanel,
  SidePanel,
  TopBottom,
  MaterialThickness,
} from './types';

const DEFAULT_GAP = 2; // mm - зазор между фасадами
const DEFAULT_BACK_PANEL_THICKNESS = 3; // mm - толщина задней стенки
const DEFAULT_BASE_HEIGHT = 100; // mm - высота цоколя
const DEFAULT_SHELF_THICKNESS = 16; // mm

/**
 * Generate a complete cabinet with all components calculated
 */
export function generateCabinet(
  width: number,
  height: number,
  depth: number,
  materialThickness: MaterialThickness = 16,
  material: Material,
  doorType: 'swing' | 'sliding' | 'none' = 'swing',
  shelfCount: number = 1,
  partitionCount: number = 0
): Cabinet {
  const dimensions: Dimensions = { width, height, depth };
  
  // Calculate internal dimensions (accounting for material thickness)
  const internalWidth = width - (2 * materialThickness);
  const internalHeight = height - materialThickness; // top only
  const internalDepth = depth - materialThickness; // back panel

  // Generate side panels (боковины)
  const sidePanels = generateSidePanels(height, depth, materialThickness, material);

  // Generate top and bottom
  const topBottom = generateTopBottom(width, depth, materialThickness, material);

  // Generate base (цоколь)
  const base = generateBase(width, depth, materialThickness, material);

  // Generate back panel (задняя стенка)
  const backPanel = generateBackPanel(
    internalWidth,
    internalHeight,
    material
  );

  // Generate shelves (полки)
  const shelves = generateShelves(
    internalWidth,
    depth,
    internalHeight,
    shelfCount,
    materialThickness,
    material
  );

  // Generate partitions (перегородки)
  const partitions = generatePartitions(
    internalHeight,
    depth,
    partitionCount,
    internalWidth,
    materialThickness,
    material
  );

  // Generate doors (фасады)
  const doors = generateDoors(
    width,
    height,
    doorType,
    material,
    partitionCount
  );

  return {
    id: `cabinet-${Date.now()}`,
    name: 'Cabinet',
    dimensions,
    material,
    doors,
    shelves,
    partitions,
    base,
    backPanel,
    sidePanels,
    topBottom,
  };
}

/**
 * Generate side panels (боковины)
 */
function generateSidePanels(
  height: number,
  depth: number,
  thickness: number,
  material: Material
): SidePanel[] {
  return [
    {
      id: 'side-left',
      width: depth,
      height: height,
      thickness,
      material,
    },
    {
      id: 'side-right',
      width: depth,
      height: height,
      thickness,
      material,
    },
  ];
}

/**
 * Generate top and bottom panels
 */
function generateTopBottom(
  width: number,
  depth: number,
  thickness: number,
  material: Material
): TopBottom {
  return {
    top: {
      width,
      depth,
      thickness,
      material,
    },
    bottom: {
      width: width - (2 * thickness), // account for side panels
      depth: depth - thickness, // account for back panel
      thickness,
      material,
    },
  };
}

/**
 * Generate base (цоколь)
 */
function generateBase(
  width: number,
  depth: number,
  thickness: number,
  material: Material
): Base {
  return {
    height: DEFAULT_BASE_HEIGHT,
    width: width - (2 * thickness),
    depth: depth - thickness,
    material,
  };
}

/**
 * Generate back panel (задняя стенка)
 */
function generateBackPanel(
  width: number,
  height: number,
  material: Material
): BackPanel {
  return {
    width,
    height,
    thickness: DEFAULT_BACK_PANEL_THICKNESS,
    material: {
      ...material,
      thickness: DEFAULT_BACK_PANEL_THICKNESS as MaterialThickness,
    },
  };
}

/**
 * Generate shelves (полки)
 */
function generateShelves(
  width: number,
  depth: number,
  height: number,
  count: number,
  thickness: number,
  material: Material
): Shelf[] {
  if (count === 0) return [];

  const shelfSpacing = height / (count + 1);
  const shelves: Shelf[] = [];

  for (let i = 0; i < count; i++) {
    shelves.push({
      id: `shelf-${i + 1}`,
      width: width - (2 * thickness), // account for side panels
      depth: depth - thickness, // account for back panel
      thickness,
      quantity: 1,
      material,
    });
  }

  return shelves;
}

/**
 * Generate partitions (перегородки)
 */
function generatePartitions(
  height: number,
  depth: number,
  count: number,
  totalWidth: number,
  thickness: number,
  material: Material
): Partition[] {
  if (count === 0) return [];

  const partitionSpacing = totalWidth / (count + 1);
  const partitions: Partition[] = [];

  for (let i = 0; i < count; i++) {
    partitions.push({
      id: `partition-${i + 1}`,
      width: depth - thickness, // depth minus back panel
      height: height,
      thickness,
      material,
    });
  }

  return partitions;
}

/**
 * Generate doors (фасады)
 */
export function generateDoors(
  cabinetWidth: number,
  cabinetHeight: number,
  type: 'swing' | 'sliding' | 'none',
  material: Material,
  partitionCount: number = 0
): Door[] {
  if (type === 'none') return [];

  const doorCount = partitionCount + 1;
  const doorWidth = (cabinetWidth - (doorCount + 1) * DEFAULT_GAP) / doorCount;
  const doorHeight = cabinetHeight - (2 * DEFAULT_GAP);

  const doors: Door[] = [];

  for (let i = 0; i < doorCount; i++) {
    // Calculate hinges: 2 for doors < 800mm, 3 for taller
    const hinges = doorHeight < 800 ? 2 : 3;

    doors.push({
      id: `door-${i + 1}`,
      type,
      width: doorWidth,
      height: doorHeight,
      material,
      hinges,
    });
  }

  return doors;
}

/**
 * Convert cabinet to panel list for cutting
 */
export function calculatePanels(cabinet: Cabinet): Panel[] {
  const panels: Panel[] = [];

  // Side panels
  cabinet.sidePanels.forEach((side) => {
    panels.push({
      id: side.id,
      name: 'Боковина',
      width: side.width,
      height: side.height,
      thickness: side.thickness,
      quantity: 1,
      material: side.material,
      edgeBandTop: true,
      edgeBandBottom: true,
      edgeBandLeft: true,
      edgeBandRight: false, // connected to back
    });
  });

  // Top panel
  panels.push({
    id: 'top',
    name: 'Крышка',
    width: cabinet.topBottom.top.width,
    height: cabinet.topBottom.top.depth,
    thickness: cabinet.topBottom.top.thickness,
    quantity: 1,
    material: cabinet.topBottom.top.material,
    edgeBandTop: true,
    edgeBandBottom: false,
    edgeBandLeft: true,
    edgeBandRight: true,
  });

  // Bottom panel
  panels.push({
    id: 'bottom',
    name: 'Дно',
    width: cabinet.topBottom.bottom.width,
    height: cabinet.topBottom.bottom.depth,
    thickness: cabinet.topBottom.bottom.thickness,
    quantity: 1,
    material: cabinet.topBottom.bottom.material,
    edgeBandTop: true,
    edgeBandBottom: false,
    edgeBandLeft: true,
    edgeBandRight: true,
  });

  // Shelves
  cabinet.shelves.forEach((shelf) => {
    panels.push({
      id: shelf.id,
      name: 'Полка',
      width: shelf.width,
      height: shelf.depth,
      thickness: shelf.thickness,
      quantity: shelf.quantity,
      material: shelf.material,
      edgeBandTop: true,
      edgeBandBottom: false,
      edgeBandLeft: true,
      edgeBandRight: true,
    });
  });

  // Partitions
  cabinet.partitions.forEach((partition) => {
    panels.push({
      id: partition.id,
      name: 'Перегородка',
      width: partition.width,
      height: partition.height,
      thickness: partition.thickness,
      quantity: 1,
      material: partition.material,
      edgeBandTop: true,
      edgeBandBottom: true,
      edgeBandLeft: true,
      edgeBandRight: false,
    });
  });

  // Base
  panels.push({
    id: 'base',
    name: 'Цоколь',
    width: cabinet.base.width,
    height: cabinet.base.depth,
    thickness: cabinet.base.height,
    quantity: 1,
    material: cabinet.base.material,
    edgeBandTop: true,
    edgeBandBottom: false,
    edgeBandLeft: true,
    edgeBandRight: true,
  });

  // Doors
  cabinet.doors.forEach((door) => {
    panels.push({
      id: door.id,
      name: 'Фасад',
      width: door.width,
      height: door.height,
      thickness: door.material.thickness,
      quantity: 1,
      material: door.material,
      edgeBandTop: true,
      edgeBandBottom: true,
      edgeBandLeft: true,
      edgeBandRight: true,
    });
  });

  // Back panel (if not included in main calculation, add separately)
  panels.push({
    id: 'back',
    name: 'Задняя стенка',
    width: cabinet.backPanel.width,
    height: cabinet.backPanel.height,
    thickness: cabinet.backPanel.thickness,
    quantity: 1,
    material: cabinet.backPanel.material,
    edgeBandTop: false,
    edgeBandBottom: false,
    edgeBandLeft: false,
    edgeBandRight: false,
  });

  return panels;
}

/**
 * Calculate edge banding requirements
 */
export function calculateEdgeBand(panels: Panel[]): {
  length2mm: number;
  length04mm: number;
} {
  let length2mm = 0; // for visible edges
  let length04mm = 0; // for hidden edges

  panels.forEach((panel) => {
    if (panel.edgeBandTop) {
      length2mm += panel.width;
    }
    if (panel.edgeBandBottom) {
      length2mm += panel.width;
    }
    if (panel.edgeBandLeft) {
      length2mm += panel.height;
    }
    if (panel.edgeBandRight) {
      length2mm += panel.height;
    }
  });

  return { length2mm, length04mm };
}
