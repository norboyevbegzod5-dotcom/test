import { DEFAULT_PRICING } from "./constants";
import {
  CostBreakdown,
  HardwareSummary,
  Panel,
  PricingMatrix,
  ProjectInput,
} from "./types";

const sumPanelArea = (panels: Panel[]) => panels.reduce((acc, panel) => acc + panel.area, 0);

const boardCostForPanels = (panels: Panel[], pricing: PricingMatrix) =>
  panels.reduce((acc, panel) => acc + panel.area * pricing.boardSqm[panel.material.materialType], 0);

const hardwareCost = (hardware: HardwareSummary, pricing: PricingMatrix) => {
  const hingeCost = hardware.hingeCount * pricing.hinge;
  const slideCost = hardware.slidePairs * pricing.slidePair;
  const screwCost = hardware.screwCount * pricing.screw;
  const confirmatCost = hardware.confirmatCount * pricing.confirmat;
  const legCost = hardware.legCount * pricing.leg;
  const handleCost = hardware.handleCount * pricing.handle;
  const edgeCost =
    hardware.edgeBand.thin * pricing.edgeBandPerMeter.thin +
    hardware.edgeBand.thick * pricing.edgeBandPerMeter.thick;

  return {
    hingeCost,
    slideCost,
    screwCost,
    confirmatCost,
    legCost,
    handleCost,
    edgeCost,
    total:
      hingeCost +
      slideCost +
      screwCost +
      confirmatCost +
      legCost +
      handleCost +
      edgeCost,
  };
};

export const calculateCost = (
  props: {
    panels: Panel[];
    hardware: HardwareSummary;
    project: ProjectInput;
  },
  overrides?: Partial<PricingMatrix>,
): CostBreakdown => {
  const pricing: PricingMatrix = {
    ...DEFAULT_PRICING,
    ...props.project.pricingOverrides,
    ...overrides,
    boardSqm: {
      ...DEFAULT_PRICING.boardSqm,
      ...props.project.pricingOverrides?.boardSqm,
      ...overrides?.boardSqm,
    },
    edgeBandPerMeter: {
      ...DEFAULT_PRICING.edgeBandPerMeter,
      ...props.project.pricingOverrides?.edgeBandPerMeter,
      ...overrides?.edgeBandPerMeter,
    },
  } as PricingMatrix;

  const boardArea = sumPanelArea(props.panels);
  const boardCost = boardCostForPanels(props.panels, pricing);
  const hardwareCosts = hardwareCost(props.hardware, pricing);
  const finishingCost = boardArea * pricing.lacquerSqm;
  const laborCost = pricing.laborPerHour * pricing.hoursPerModule * props.project.modules.length;
  const accessoriesCost = props.project.modules.filter((m) => m.hasDrawers).length * pricing.drawerSystem;
  const edgeBandCost = hardwareCosts.edgeCost;
  const hardwareTotal = hardwareCosts.total - edgeBandCost;
  const subtotal =
    boardCost + edgeBandCost + hardwareTotal + laborCost + finishingCost + accessoriesCost;
  const overheadCost = subtotal * pricing.overheadPercent;
  const profit = (subtotal + overheadCost) * pricing.profitPercent;
  const total = subtotal + overheadCost + profit;

  const lineItems = [
    { label: "Материалы (ЛДСП/МДФ)", amount: boardCost },
    { label: "Кромка", amount: edgeBandCost },
    { label: "Фурнитура", amount: hardwareTotal },
    { label: "Оплата труда", amount: laborCost },
    { label: "Финишная отделка", amount: finishingCost },
    { label: "Ящиковые системы", amount: accessoriesCost },
    { label: "Накладные расходы", amount: overheadCost },
    { label: "Прибыль", amount: profit },
  ];

  return {
    currency: props.project.currency,
    boardCost,
    edgeBandCost,
    hardwareCost: hardwareTotal,
    laborCost,
    finishingCost,
    accessoriesCost,
    overheadCost,
    profit,
    total,
    lineItems,
  };
};
