import { SHEET_SIZE } from "./constants";
import { CuttingPlan, CuttingSheet, Panel } from "./types";

interface FreeRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ExpandedPanel extends Panel {
  instance: number;
}

const mmSqToSqM = (value: number) => value / 1_000_000;

const expandPanels = (panels: Panel[]): ExpandedPanel[] =>
  panels.flatMap((panel) =>
    Array.from({ length: panel.quantity }).map((_, idx) => ({
      ...panel,
      instance: idx,
    })),
  );

const sortPanels = (panels: ExpandedPanel[]) =>
  panels.sort((a, b) => {
    const areaDiff = b.width * b.height - a.width * a.height;
    if (areaDiff !== 0) return areaDiff;
    return Math.max(b.width, b.height) - Math.max(a.width, a.height);
  });

const splitFreeRect = (
  rects: FreeRectangle[],
  target: FreeRectangle,
  panelWidth: number,
  panelHeight: number,
) => {
  const rightRect: FreeRectangle = {
    x: target.x + panelWidth,
    y: target.y,
    width: target.width - panelWidth,
    height: panelHeight,
  };
  const topRect: FreeRectangle = {
    x: target.x,
    y: target.y + panelHeight,
    width: target.width,
    height: target.height - panelHeight,
  };

  const updated = rects.filter((r) => r !== target);
  if (rightRect.width > 0 && rightRect.height > 0) {
    updated.push(rightRect);
  }
  if (topRect.width > 0 && topRect.height > 0) {
    updated.push(topRect);
  }
  return updated;
};

export const optimizeCutting = (
  panels: Panel[],
  sheetSize = SHEET_SIZE,
): CuttingPlan => {
  const expanded = sortPanels(expandPanels(panels));
  const sheets: (CuttingSheet & { freeRects: FreeRectangle[] })[] = [];

  expanded.forEach((panel) => {
    let placed = false;

    for (const sheet of sheets) {
      if (
        sheet.material.id !== panel.material.id ||
        sheet.thickness !== panel.thickness
      ) {
        continue;
      }
      const freeRect = sheet.freeRects.find(
        (rect) =>
          (panel.width <= rect.width && panel.height <= rect.height) ||
          (panel.height <= rect.width && panel.width <= rect.height),
      );

      if (freeRect) {
        const rotated = !(panel.width <= freeRect.width && panel.height <= freeRect.height);
        const placement = {
          panelId: panel.id,
          origin: { x: freeRect.x, y: freeRect.y },
          width: rotated ? panel.height : panel.width,
          height: rotated ? panel.width : panel.height,
          rotated,
        };
        sheet.placements.push(placement);
        sheet.freeRects = splitFreeRect(
          sheet.freeRects,
          freeRect,
          placement.width,
          placement.height,
        );
        sheet.usedArea += mmSqToSqM(panel.width * panel.height);
        placed = true;
        break;
      }
    }

    if (!placed) {
      const newSheet: CuttingSheet & { freeRects: FreeRectangle[] } = {
        id: `sheet-${sheets.length + 1}`,
        material: panel.material,
        thickness: panel.thickness,
        placements: [],
        usedArea: 0,
        totalArea: mmSqToSqM(sheetSize.width * sheetSize.height),
        freeRects: [
          {
            x: 0,
            y: 0,
            width: sheetSize.width,
            height: sheetSize.height,
          },
        ],
      };

      const placement = {
        panelId: panel.id,
        origin: { x: 0, y: 0 },
        width: panel.width,
        height: panel.height,
        rotated: false,
      };
      newSheet.placements.push(placement);
      const initialRect = newSheet.freeRects[0];
      newSheet.freeRects = splitFreeRect(
        newSheet.freeRects,
        initialRect,
        placement.width,
        placement.height,
      );
      newSheet.usedArea += mmSqToSqM(panel.width * panel.height);
      sheets.push(newSheet);
    }
  });

  const totalArea = sheets.reduce((acc, sheet) => acc + sheet.totalArea, 0);
  const utilized = sheets.reduce((acc, sheet) => acc + sheet.usedArea, 0);

  const trimmedSheets = sheets.map((sheet) => {
    const { freeRects, ...rest } = sheet;
    void freeRects;
    return rest;
  });

  return {
    sheets: trimmedSheets,
    totalArea,
    utilizedArea: utilized,
    wastePercent: totalArea === 0 ? 0 : ((totalArea - utilized) / totalArea) * 100,
  };
};
