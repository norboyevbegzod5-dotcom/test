export type ModuleType = "base" | "wall" | "tall" | "corner";
export type DoorType = "swing" | "sliding" | "none";
export type MaterialType = "ldsp" | "mdf" | "plywood";

export interface MaterialOption {
  id: string;
  label: string;
  materialType: MaterialType;
  thickness: number; // millimeters
  densityKgM3: number;
  sheetSize: { width: number; height: number }; // millimeters
  finish: "matte" | "gloss" | "texture";
  pricePerSqM: number; // base board price in chosen currency
}

export interface ModuleConfig {
  id: string;
  name: string;
  type: ModuleType;
  width: number; // millimeters
  height: number;
  depth: number;
  shelves: number;
  partitions: number;
  hasDrawers: boolean;
  drawerCount: number;
  doorType: DoorType;
  material: MaterialOption;
  backPanel: boolean;
  toeKick: number; // millimeters
}

export interface Panel {
  id: string;
  moduleId: string;
  name: string;
  category:
    | "side"
    | "top"
    | "bottom"
    | "shelf"
    | "partition"
    | "door"
    | "back"
    | "drawer-front"
    | "drawer-side"
    | "drawer-back"
    | "drawer-bottom";
  width: number;
  height: number;
  thickness: number;
  material: MaterialOption;
  quantity: number;
  edgeBanding: {
    thin: number; // perimeter in millimeters for 0.4 mm band
    thick: number; // perimeter in millimeters for 2 mm band
  };
  grainDirection: "horizontal" | "vertical";
  notes?: string;
  area: number; // square meters
}

export interface DoorSpec {
  id: string;
  moduleId: string;
  type: DoorType;
  width: number;
  height: number;
  hingeCount: number;
}

export interface GeometryResult {
  panels: Panel[];
  doors: DoorSpec[];
  totalVolumeM3: number;
}

export interface CuttingPlacement {
  panelId: string;
  origin: { x: number; y: number };
  width: number;
  height: number;
  rotated: boolean;
}

export interface CuttingSheet {
  id: string;
  material: MaterialOption;
  thickness: number;
  placements: CuttingPlacement[];
  usedArea: number;
  totalArea: number;
}

export interface CuttingPlan {
  sheets: CuttingSheet[];
  totalArea: number;
  utilizedArea: number;
  wastePercent: number;
}

export interface HardwareItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category:
    | "hinge"
    | "slide"
    | "screw"
    | "confirmat"
    | "leg"
    | "handle"
    | "connector"
    | "edge-band"
    | "support";
  notes?: string;
}

export interface EdgeBandSummary {
  thin: number; // meters
  thick: number; // meters
}

export interface HardwareSummary {
  items: HardwareItem[];
  edgeBand: EdgeBandSummary;
  hingeCount: number;
  slidePairs: number;
  screwCount: number;
  confirmatCount: number;
  legCount: number;
  handleCount: number;
}

export interface PricingMatrix {
  boardSqm: Record<MaterialType, number>;
  edgeBandPerMeter: {
    thin: number;
    thick: number;
  };
  hinge: number;
  slidePair: number;
  screw: number;
  confirmat: number;
  leg: number;
  handle: number;
  connector: number;
  drawerSystem: number;
  lacquerSqm: number;
  laborPerHour: number;
  hoursPerModule: number;
  overheadPercent: number;
  profitPercent: number;
}

export interface CostLineItem {
  label: string;
  amount: number;
  description?: string;
}

export interface CostBreakdown {
  currency: string;
  boardCost: number;
  edgeBandCost: number;
  hardwareCost: number;
  laborCost: number;
  finishingCost: number;
  accessoriesCost: number;
  overheadCost: number;
  profit: number;
  total: number;
  lineItems: CostLineItem[];
}

export interface RenderStyle {
  perspective: "isometric" | "front" | "angled";
  mood: "studio" | "loft" | "dark";
  background: "light" | "dark" | "transparent";
}

export interface ProjectInput {
  name: string;
  client?: string;
  currency: string;
  modules: ModuleConfig[];
  material: MaterialOption;
  edgeBanding: EdgeBandSummary;
  pricingOverrides?: Partial<PricingMatrix>;
  renderStyle?: RenderStyle;
}

export interface ProjectSpecification {
  project: {
    name: string;
    client?: string;
    createdAt: string;
    totalModules: number;
    volumeM3: number;
    material: MaterialOption;
    renderUrl?: string | null;
  };
  panels: Panel[];
  cutting: CuttingPlan;
  hardware: HardwareSummary;
  cost: CostBreakdown;
}

export interface SavedProjectRecord {
  id: string;
  specification: ProjectSpecification;
  updatedAt: string;
}
