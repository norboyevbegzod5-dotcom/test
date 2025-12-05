import {
  HardwareItem,
  HardwareSummary,
  ModuleConfig,
  Panel,
} from "./types";

interface HardwareConfig {
  hingeMultiplier?: number;
  slidePairPerDrawer?: number;
}

const defaultConfig: Required<HardwareConfig> = {
  hingeMultiplier: 1,
  slidePairPerDrawer: 1,
};

const metersFromMm = (value: number) => value / 1000;

const randomId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const createItem = (
  overrides: Partial<HardwareItem>,
  quantity: number,
): HardwareItem => ({
  id: `${overrides.category}-${randomId()}`,
  name: overrides.name ?? "",
  quantity,
  unit: overrides.unit ?? "pcs",
  category: overrides.category ?? "support",
  notes: overrides.notes,
});

const legCountForModule = (module: ModuleConfig) => {
  if (module.type === "wall") return 0;
  if (module.type === "tall") return 6;
  return module.width > 900 ? 6 : 4;
};

export const calculateHardware = (
  modules: ModuleConfig[],
  panels: Panel[],
  config: HardwareConfig = {},
): HardwareSummary => {
  const cfg = { ...defaultConfig, ...config };
  const items: HardwareItem[] = [];
  let hingeCount = 0;
  let slidePairs = 0;
  let screws = 0;
  let confirmats = 0;
  let handles = 0;
  let legs = 0;

  modules.forEach((module) => {
    const doors = panels.filter(
      (panel) => panel.moduleId === module.id && panel.category === "door",
    );
    doors.forEach((door) => {
      const hingeForDoor = door.height > 1500 ? 3 : door.height > 1100 ? 3 : 2;
      hingeCount += hingeForDoor * cfg.hingeMultiplier;
      handles += 1;
    });

    if (module.hasDrawers) {
      slidePairs += module.drawerCount * cfg.slidePairPerDrawer;
      handles += module.drawerCount;
      screws += module.drawerCount * 16;
    }

    const structureJoints = Math.ceil((module.width + module.height + module.depth) / 100);
    confirmats += structureJoints * 8;
    screws += module.shelves * 12 + module.partitions * 16;
    legs += legCountForModule(module);
  });

  const thinBandMm = panels.reduce((acc, panel) => acc + panel.edgeBanding.thin, 0);
  const thickBandMm = panels.reduce((acc, panel) => acc + panel.edgeBanding.thick, 0);

  items.push(createItem({ name: "Петли", category: "hinge" }, hingeCount));
  items.push(createItem({ name: "Направляющие", category: "slide", unit: "pair" }, slidePairs));
  items.push(createItem({ name: "Саморезы", category: "screw" }, screws));
  items.push(createItem({ name: "Конфирматы", category: "confirmat" }, confirmats));
  items.push(createItem({ name: "Ручки", category: "handle" }, handles));
  items.push(createItem({ name: "Опоры", category: "leg" }, legs));

  if (thinBandMm > 0 || thickBandMm > 0) {
    items.push(
      createItem(
        {
          name: "Кромка 0.4 мм",
          category: "edge-band",
          unit: "m",
        },
        Number(metersFromMm(thinBandMm).toFixed(2)),
      ),
    );
    items.push(
      createItem(
        {
          name: "Кромка 2 мм",
          category: "edge-band",
          unit: "m",
        },
        Number(metersFromMm(thickBandMm).toFixed(2)),
      ),
    );
  }

  return {
    items,
    edgeBand: {
      thin: metersFromMm(thinBandMm),
      thick: metersFromMm(thickBandMm),
    },
    hingeCount,
    slidePairs,
    screwCount: screws,
    confirmatCount: confirmats,
    legCount: legs,
    handleCount: handles,
  };
};
