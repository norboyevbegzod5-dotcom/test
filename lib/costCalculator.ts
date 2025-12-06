/**
 * Cost Calculator - Calculates total project cost
 */

import {
  Cabinet,
  CuttingPlan,
  Hardware,
  CostBreakdown,
  Material,
} from './types';
import { calculatePanels } from './geometryEngine';
import { optimizeCutting } from './cuttingEngine';
import { calculateHardware } from './hardwareEngine';

/**
 * Calculate total cost for a cabinet project
 */
export function calculateCost(
  cabinet: Cabinet,
  cuttingPlan: CuttingPlan,
  hardware: Hardware[],
  laborRate: number = 0
): CostBreakdown {
  // Material cost
  const materialsCost = calculateMaterialCost(cuttingPlan);

  // Hardware cost
  const hardwareCost = hardware.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // Edge banding cost (included in hardware)
  const edgeBandCost = hardware
    .filter((h) => h.type === 'edge_band')
    .reduce((sum, item) => sum + item.totalPrice, 0);

  // Labor cost (optional)
  const laborCost = calculateLaborCost(cabinet, laborRate);

  const total = materialsCost + hardwareCost + laborCost;

  return {
    materials: materialsCost,
    hardware: hardwareCost,
    edgeBand: edgeBandCost,
    labor: laborCost > 0 ? laborCost : undefined,
    total,
  };
}

/**
 * Calculate material cost from cutting plan
 */
function calculateMaterialCost(cuttingPlan: CuttingPlan): number {
  let totalCost = 0;

  cuttingPlan.sheets.forEach((sheet) => {
    const squareMeters = (sheet.width * sheet.height) / 1000000; // mm² to m²
    const cost = squareMeters * sheet.material.pricePerSquareMeter;
    totalCost += cost;
  });

  return totalCost;
}

/**
 * Calculate labor cost (simplified)
 */
function calculateLaborCost(cabinet: Cabinet, ratePerHour: number): number {
  if (ratePerHour === 0) return 0;

  // Estimate hours based on complexity
  const panels = calculatePanels(cabinet);
  const baseHours = 2; // base time
  const panelHours = panels.length * 0.1; // 0.1 hours per panel
  const doorHours = cabinet.doors.length * 0.5; // 0.5 hours per door

  const totalHours = baseHours + panelHours + doorHours;
  return totalHours * ratePerHour;
}

/**
 * Calculate cost breakdown for a complete project
 */
export function calculateProjectCost(
  cabinet: Cabinet,
  materialPrices?: Record<string, number>
): {
  cuttingPlan: CuttingPlan;
  hardware: Hardware[];
  cost: CostBreakdown;
} {
  // Get panels
  const panels = calculatePanels(cabinet);

  // Update material prices if provided
  if (materialPrices) {
    panels.forEach((panel) => {
      const key = `${panel.material.type}-${panel.material.thickness}`;
      if (materialPrices[key]) {
        panel.material.pricePerSquareMeter = materialPrices[key];
      }
    });
  }

  // Calculate cutting plan
  const cuttingPlan = optimizeCutting(panels);

  // Calculate hardware
  const hardware = calculateHardware(cabinet);

  // Calculate cost
  const cost = calculateCost(cabinet, cuttingPlan, hardware);

  return {
    cuttingPlan,
    hardware,
    cost,
  };
}
