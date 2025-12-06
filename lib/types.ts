/**
 * Core types for furniture design and calculation system
 */

export type MaterialType = 'ЛДСП' | 'МДФ' | 'Фанера';
export type MaterialThickness = 16 | 18 | 25;
export type DoorType = 'swing' | 'sliding' | 'none';
export type JoineryType = 'confirmat' | 'dowel' | 'screw';

export interface Dimensions {
  width: number;  // mm
  height: number; // mm
  depth: number;  // mm
}

export interface Material {
  type: MaterialType;
  thickness: MaterialThickness;
  pricePerSquareMeter: number;
  name: string;
}

export interface Panel {
  id: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  quantity: number;
  material: Material;
  edgeBandTop?: boolean;
  edgeBandBottom?: boolean;
  edgeBandLeft?: boolean;
  edgeBandRight?: boolean;
}

export interface Cabinet {
  id: string;
  name: string;
  dimensions: Dimensions;
  material: Material;
  doors: Door[];
  shelves: Shelf[];
  partitions: Partition[];
  base: Base;
  backPanel: BackPanel;
  sidePanels: SidePanel[];
  topBottom: TopBottom;
}

export interface Door {
  id: string;
  type: DoorType;
  width: number;
  height: number;
  material: Material;
  hinges: number;
}

export interface Shelf {
  id: string;
  width: number;
  depth: number;
  thickness: number;
  quantity: number;
  material: Material;
}

export interface Partition {
  id: string;
  width: number;
  height: number;
  thickness: number;
  material: Material;
}

export interface Base {
  height: number;
  width: number;
  depth: number;
  material: Material;
}

export interface BackPanel {
  width: number;
  height: number;
  thickness: number;
  material: Material;
}

export interface SidePanel {
  id: string;
  width: number;
  height: number;
  thickness: number;
  material: Material;
}

export interface TopBottom {
  top: {
    width: number;
    depth: number;
    thickness: number;
    material: Material;
  };
  bottom: {
    width: number;
    depth: number;
    thickness: number;
    material: Material;
  };
}

export interface Hardware {
  id: string;
  name: string;
  type: HardwareType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type HardwareType = 
  | 'hinge'
  | 'drawer_slide'
  | 'screw'
  | 'confirmat'
  | 'dowel'
  | 'edge_band'
  | 'leg'
  | 'handle'
  | 'back_panel_fastener';

export interface EdgeBand {
  thickness: number; // 0.4 or 2.0 mm
  length: number;    // mm
  pricePerMeter: number;
}

export interface Sheet {
  width: number;  // 2800 mm standard
  height: number; // 2070 mm standard
  material: Material;
  panels: Panel[];
  waste: number;  // percentage
}

export interface CuttingPlan {
  sheets: Sheet[];
  totalWaste: number;
  totalSquareMeters: number;
  panels: Panel[];
}

export interface CostBreakdown {
  materials: number;
  hardware: number;
  edgeBand: number;
  labor?: number;
  total: number;
}

export interface Project {
  id: string;
  name: string;
  cabinet: Cabinet;
  cuttingPlan: CuttingPlan;
  hardware: Hardware[];
  cost: CostBreakdown;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface Specification {
  project: Project;
  panels: Panel[];
  hardware: Hardware[];
  cuttingPlan: CuttingPlan;
  cost: CostBreakdown;
}
