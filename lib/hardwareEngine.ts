/**
 * Hardware Engine - Automatically calculates required hardware
 * Similar to Базис Смета logic
 */

import {
  Cabinet,
  Hardware,
  HardwareType,
  Panel,
  calculateEdgeBand,
} from './types';
import { calculatePanels } from './geometryEngine';

// Hardware pricing (in rubles, can be configured)
const HARDWARE_PRICES: Record<HardwareType, number> = {
  hinge: 45, // петля
  drawer_slide: 350, // направляющая
  screw: 0.5, // шуруп
  confirmat: 2.5, // конфирмат
  dowel: 0.3, // шкант
  edge_band: 15, // кромка за метр
  leg: 120, // ножка опорная
  handle: 150, // ручка
  back_panel_fastener: 0.8, // крепеж задней стенки
};

/**
 * Calculate all hardware for a cabinet
 */
export function calculateHardware(cabinet: Cabinet): Hardware[] {
  const hardware: Hardware[] = [];

  // Hinges for doors
  hardware.push(...calculateHinges(cabinet));

  // Drawer slides (if drawers exist - simplified, assuming no drawers for now)
  // hardware.push(...calculateDrawerSlides(cabinet));

  // Screws and connectors
  hardware.push(...calculateConnectors(cabinet));

  // Edge banding
  hardware.push(...calculateEdgeBanding(cabinet));

  // Support legs
  hardware.push(...calculateLegs(cabinet));

  // Handles
  hardware.push(...calculateHandles(cabinet));

  // Back panel fasteners
  hardware.push(...calculateBackPanelFasteners(cabinet));

  return hardware;
}

/**
 * Calculate hinges based on door height
 */
function calculateHinges(cabinet: Cabinet): Hardware[] {
  const hinges: Hardware[] = [];

  cabinet.doors.forEach((door) => {
    const quantity = door.hinges;
    hinges.push({
      id: `hinge-${door.id}`,
      name: 'Петля мебельная',
      type: 'hinge',
      quantity,
      unitPrice: HARDWARE_PRICES.hinge,
      totalPrice: quantity * HARDWARE_PRICES.hinge,
    });
  });

  return hinges;
}

/**
 * Calculate connectors (confirmats and screws)
 */
function calculateConnectors(cabinet: Cabinet): Hardware[] {
  const connectors: Hardware[] = [];
  const panels = calculatePanels(cabinet);

  // Estimate confirmats: ~4-6 per major connection
  // Simplified: count major panels
  const majorPanels = panels.filter(
    (p) =>
      p.name === 'Боковина' ||
      p.name === 'Крышка' ||
      p.name === 'Дно' ||
      p.name === 'Перегородка'
  );

  const confirmatCount = majorPanels.length * 5; // average 5 per panel
  connectors.push({
    id: 'confirmats',
    name: 'Конфирмат 7x50',
    type: 'confirmat',
    quantity: confirmatCount,
    unitPrice: HARDWARE_PRICES.confirmat,
    totalPrice: confirmatCount * HARDWARE_PRICES.confirmat,
  });

  // Screws for various connections
  const screwCount = panels.length * 8; // average 8 screws per panel
  connectors.push({
    id: 'screws',
    name: 'Шуруп 4x16',
    type: 'screw',
    quantity: screwCount,
    unitPrice: HARDWARE_PRICES.screw,
    totalPrice: screwCount * HARDWARE_PRICES.screw,
  });

  return connectors;
}

/**
 * Calculate edge banding requirements
 */
function calculateEdgeBanding(cabinet: Cabinet): Hardware[] {
  const panels = calculatePanels(cabinet);
  const { length2mm, length04mm } = calculateEdgeBand(panels);

  const edgeBanding: Hardware[] = [];

  if (length2mm > 0) {
    edgeBanding.push({
      id: 'edge-band-2mm',
      name: 'Кромка ПВХ 2мм',
      type: 'edge_band',
      quantity: Math.ceil(length2mm / 1000), // convert to meters
      unitPrice: HARDWARE_PRICES.edge_band,
      totalPrice: Math.ceil(length2mm / 1000) * HARDWARE_PRICES.edge_band,
    });
  }

  if (length04mm > 0) {
    edgeBanding.push({
      id: 'edge-band-04mm',
      name: 'Кромка ПВХ 0.4мм',
      type: 'edge_band',
      quantity: Math.ceil(length04mm / 1000),
      unitPrice: HARDWARE_PRICES.edge_band * 0.5, // thinner is cheaper
      totalPrice: Math.ceil(length04mm / 1000) * HARDWARE_PRICES.edge_band * 0.5,
    });
  }

  return edgeBanding;
}

/**
 * Calculate support legs
 */
function calculateLegs(cabinet: Cabinet): Hardware[] {
  // 4-6 legs depending on cabinet size
  const legCount = cabinet.dimensions.width > 1200 ? 6 : 4;

  return [
    {
      id: 'legs',
      name: 'Ножка опорная регулируемая',
      type: 'leg',
      quantity: legCount,
      unitPrice: HARDWARE_PRICES.leg,
      totalPrice: legCount * HARDWARE_PRICES.leg,
    },
  ];
}

/**
 * Calculate handles
 */
function calculateHandles(cabinet: Cabinet): Hardware[] {
  const handles: Hardware[] = [];

  cabinet.doors.forEach((door) => {
    handles.push({
      id: `handle-${door.id}`,
      name: 'Ручка мебельная',
      type: 'handle',
      quantity: 1,
      unitPrice: HARDWARE_PRICES.handle,
      totalPrice: HARDWARE_PRICES.handle,
    });
  });

  return handles;
}

/**
 * Calculate back panel fasteners
 */
function calculateBackPanelFasteners(cabinet: Cabinet): Hardware[] {
  // Estimate: ~1 fastener per 200mm of perimeter
  const perimeter =
    2 * cabinet.backPanel.width + 2 * cabinet.backPanel.height;
  const fastenerCount = Math.ceil(perimeter / 200);

  return [
    {
      id: 'back-fasteners',
      name: 'Крепеж задней стенки',
      type: 'back_panel_fastener',
      quantity: fastenerCount,
      unitPrice: HARDWARE_PRICES.back_panel_fastener,
      totalPrice: fastenerCount * HARDWARE_PRICES.back_panel_fastener,
    },
  ];
}

/**
 * Update hardware prices (for configuration)
 */
export function updateHardwarePrice(
  type: HardwareType,
  price: number
): void {
  HARDWARE_PRICES[type] = price;
}

/**
 * Get current hardware prices
 */
export function getHardwarePrices(): Record<HardwareType, number> {
  return { ...HARDWARE_PRICES };
}
