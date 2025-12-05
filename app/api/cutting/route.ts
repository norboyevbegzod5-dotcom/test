import { NextRequest, NextResponse } from "next/server";
import { optimizeCutting } from "@/lib/cuttingEngine";
import { calculatePanels } from "@/lib/geometryEngine";
import { ModuleConfig, Panel } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const modules = (body.modules ?? []) as ModuleConfig[];
  const panels = (body.panels ?? []) as Panel[];

  const sourcePanels = panels.length ? panels : calculatePanels(modules).panels;
  if (!sourcePanels.length) {
    return NextResponse.json({ error: "Нет панелей для расчета" }, { status: 400 });
  }

  const plan = optimizeCutting(sourcePanels, body.sheetSize);
  return NextResponse.json(plan);
};
