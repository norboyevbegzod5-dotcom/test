import { MaterialOption, MaterialType, PricingMatrix } from "./types";

export const SHEET_SIZE = {
  width: 2800,
  height: 2070,
};

const materialFactory = (
  id: string,
  label: string,
  materialType: MaterialType,
  thickness: number,
  pricePerSqM: number,
  densityKgM3: number,
): MaterialOption => ({
  id,
  label,
  materialType,
  thickness,
  pricePerSqM,
  densityKgM3,
  sheetSize: SHEET_SIZE,
  finish: "matte",
});

export const DEFAULT_MATERIALS: MaterialOption[] = [
  materialFactory("ldsp-16", "ЛДСП 16 мм", "ldsp", 16, 12.5, 650),
  materialFactory("ldsp-18", "ЛДСП 18 мм", "ldsp", 18, 14.1, 680),
  materialFactory("ldsp-25", "ЛДСП 25 мм", "ldsp", 25, 19.8, 700),
  materialFactory("mdf-16", "МДФ 16 мм", "mdf", 16, 16.2, 720),
  materialFactory("plywood-15", "Фанера 15 мм", "plywood", 15, 13.4, 550),
];

export const DEFAULT_PRICING: PricingMatrix = {
  boardSqm: {
    ldsp: 13.8,
    mdf: 17.4,
    plywood: 12.2,
  },
  edgeBandPerMeter: {
    thin: 0.18,
    thick: 0.36,
  },
  hinge: 1.9,
  slidePair: 4.2,
  screw: 0.04,
  confirmat: 0.09,
  leg: 2.5,
  handle: 3.2,
  connector: 0.45,
  drawerSystem: 16,
  lacquerSqm: 6.5,
  laborPerHour: 20,
  hoursPerModule: 1.3,
  overheadPercent: 0.17,
  profitPercent: 0.18,
};
