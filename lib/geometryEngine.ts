import { DEFAULT_MATERIALS } from "./constants";
import { DoorSpec, GeometryResult, ModuleConfig, Panel } from "./types";

const FRONT_GAP = 2; // mm
const DOOR_GAP = 1.5; // mm between leaves
const DRAWER_SIDE_THICKNESS = 16;
const BACK_PANEL_THICKNESS = 4;

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const areaSqM = (widthMm: number, heightMm: number): number =>
  (widthMm * heightMm) / 1_000_000;

interface PanelInput {
  module: ModuleConfig;
  name: string;
  category: Panel["category"];
  width: number;
  height: number;
  thickness?: number;
  quantity?: number;
  notes?: string;
  exposure?: "front" | "full" | "minimal";
  grain?: Panel["grainDirection"];
}

const buildPanel = ({
  module,
  name,
  category,
  width,
  height,
  thickness,
  quantity = 1,
  notes,
  exposure = "front",
  grain = "vertical",
}: PanelInput): Panel => {
  const frontEdges = exposure === "full" ? 4 : exposure === "front" ? 2 : 0;
  const perimeter = 2 * (width + height);
  const thickBand =
    exposure === "minimal" ? 0 : frontEdges === 4 ? perimeter : frontEdges * height;
  const thinBand = perimeter - thickBand;

  return {
    id: uid(),
    moduleId: module.id,
    name,
    category,
    width,
    height,
    thickness: thickness ?? module.material.thickness,
    material: module.material,
    quantity,
    grainDirection: grain,
    notes,
    area: areaSqM(width, height) * quantity,
    edgeBanding: {
      thick: thickBand,
      thin: Math.max(thinBand, 0),
    },
  };
};

export const generateCabinet = (module: ModuleConfig) => {
  const panels: Panel[] = [];
  const doors: DoorSpec[] = [];
  const mat = module.material ?? DEFAULT_MATERIALS[0];
  const workingModule = module.material ? module : { ...module, material: mat };
  const thickness = mat.thickness;
  const innerWidth = workingModule.width - 2 * thickness;
  const innerHeight = workingModule.height - thickness;
  const usableDepth =
    workingModule.depth - (workingModule.backPanel ? BACK_PANEL_THICKNESS : 0);

  // Sides
  panels.push(
    buildPanel({
      module: workingModule,
      name: "Левая боковина",
      category: "side",
      width: usableDepth,
      height: module.height,
      exposure: "front",
    }),
  );
  panels.push(
    buildPanel({
      module: workingModule,
      name: "Правая боковина",
      category: "side",
      width: usableDepth,
      height: module.height,
      exposure: "front",
    }),
  );

  // Top & bottom
  panels.push(
    buildPanel({
      module: workingModule,
      name: "Крышка",
      category: "top",
      width: innerWidth,
      height: usableDepth,
      exposure: "front",
      grain: "horizontal",
    }),
  );
  panels.push(
    buildPanel({
      module: workingModule,
      name: "Дно",
      category: "bottom",
      width: innerWidth,
      height: usableDepth,
      exposure: "front",
      grain: "horizontal",
    }),
  );

  // Shelves
  for (let i = 0; i < module.shelves; i += 1) {
    panels.push(
      buildPanel({
        module: workingModule,
        name: `Полка ${i + 1}`,
        category: "shelf",
        width: innerWidth,
        height: usableDepth,
        exposure: "front",
        grain: "horizontal",
      }),
    );
  }

  // Partitions
  for (let i = 0; i < module.partitions; i += 1) {
    panels.push(
      buildPanel({
        module: workingModule,
        name: `Перегородка ${i + 1}`,
        category: "partition",
        width: usableDepth,
        height: innerHeight,
        exposure: "minimal",
      }),
    );
  }

  // Back panel
  if (workingModule.backPanel) {
    panels.push(
      buildPanel({
        module: workingModule,
        name: "Задняя стенка",
        category: "back",
        width: innerWidth,
        height: innerHeight,
        thickness: BACK_PANEL_THICKNESS,
        exposure: "minimal",
        notes: "ХДФ/МДФ 4 мм",
      }),
    );
  }

  // Drawers
  if (workingModule.hasDrawers && workingModule.drawerCount > 0) {
    const drawerHeight = Math.max(180, (innerHeight - workingModule.toeKick) / workingModule.drawerCount - 10);
    for (let i = 0; i < workingModule.drawerCount; i += 1) {
      panels.push(
        buildPanel({
          module: workingModule,
          name: `Фасад ящика ${i + 1}`,
          category: "drawer-front",
          width: innerWidth,
          height: drawerHeight,
          exposure: "full",
        }),
      );

      panels.push(
        buildPanel({
          module: workingModule,
          name: `Боковина ящика ${i + 1}`,
          category: "drawer-side",
          width: module.depth - 50,
          height: drawerHeight - 40,
          thickness: DRAWER_SIDE_THICKNESS,
          quantity: 2,
          exposure: "minimal",
        }),
      );

      panels.push(
        buildPanel({
          module: workingModule,
          name: `Задняя стенка ящика ${i + 1}`,
          category: "drawer-back",
          width: innerWidth - 32,
          height: drawerHeight - 40,
          thickness: DRAWER_SIDE_THICKNESS,
          exposure: "minimal",
        }),
      );

      panels.push(
        buildPanel({
          module: workingModule,
          name: `Дно ящика ${i + 1}`,
          category: "drawer-bottom",
          width: innerWidth - 32,
          height: module.depth - 60,
          thickness: 10,
          exposure: "minimal",
          notes: "ХДФ 10 мм",
        }),
      );
    }
  }

  // Doors
  if (workingModule.doorType !== "none") {
    const doorPanels = generateDoors(workingModule);
    doors.push(...doorPanels);
    doorPanels.forEach((door, idx) => {
      panels.push(
        buildPanel({
          module: workingModule,
          name: `Фасад ${idx + 1}`,
          category: "door",
          width: door.width,
          height: door.height,
          exposure: "full",
          notes: `${door.hingeCount} петель`,
        }),
      );
    });
  }

  const totalVolumeM3 =
    (workingModule.width * workingModule.height * workingModule.depth) / 1_000_000_000;

  return { panels, doors, totalVolumeM3 };
};

export const generateDoors = (module: ModuleConfig): DoorSpec[] => {
  if (module.doorType === "none") return [];
  const doorCount = module.doorType === "sliding" ? 2 : module.width > 800 ? 2 : 1;
  const calculatedWidth =
    module.width / doorCount - FRONT_GAP - (module.doorType === "sliding" ? 30 : DOOR_GAP);
  const doorWidth = Math.max(150, calculatedWidth);
  const doorHeight = module.height - module.toeKick - 2 * FRONT_GAP;

  const doors: DoorSpec[] = [];
  for (let i = 0; i < doorCount; i += 1) {
    doors.push({
      id: uid(),
      moduleId: module.id,
      type: module.doorType,
      width: doorWidth,
      height: doorHeight,
      hingeCount: doorHeight > 1100 ? 3 : 2,
    });
  }
  return doors;
};

export const calculatePanels = (modules: ModuleConfig[]): GeometryResult => {
  const panels: Panel[] = [];
  const doors: DoorSpec[] = [];
  let volume = 0;

  modules.forEach((module) => {
    const result = generateCabinet(module);
    panels.push(...result.panels);
    doors.push(...result.doors);
    volume += result.totalVolumeM3;
  });

  return { panels, doors, totalVolumeM3: volume };
};
