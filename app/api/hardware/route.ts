import { NextRequest, NextResponse } from "next/server";
import { calculateHardware } from "@/lib/hardwareEngine";
import { calculatePanels } from "@/lib/geometryEngine";
import { ModuleConfig, Panel } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const modules = (body.modules ?? []) as ModuleConfig[];
  const panels = (body.panels ?? []) as Panel[];
  const sourcePanels = panels.length ? panels : calculatePanels(modules).panels;
  if (!modules.length && !panels.length) {
    return NextResponse.json({ error: "Нет данных для расчета" }, { status: 400 });
  }

  const result = calculateHardware(modules, sourcePanels);
  return NextResponse.json(result);
};
