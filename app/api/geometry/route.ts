import { NextRequest, NextResponse } from "next/server";
import { calculatePanels } from "@/lib/geometryEngine";
import { ModuleConfig } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const modules = (body.modules ?? []) as ModuleConfig[];
  if (!modules.length) {
    return NextResponse.json({ error: "Не переданы модули" }, { status: 400 });
  }
  const geometry = calculatePanels(modules);
  return NextResponse.json(geometry);
};
