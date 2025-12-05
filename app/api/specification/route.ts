import { NextRequest, NextResponse } from "next/server";
import { calculatePanels } from "@/lib/geometryEngine";
import { optimizeCutting } from "@/lib/cuttingEngine";
import { calculateHardware } from "@/lib/hardwareEngine";
import { calculateCost } from "@/lib/costCalculator";
import { requestAiRender } from "@/lib/renderEngine";
import { ProjectInput, ProjectSpecification } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json()) as ProjectInput;
  if (!payload?.modules?.length) {
    return NextResponse.json({ error: "Нет модулей для расчета" }, { status: 400 });
  }

  const geometry = calculatePanels(payload.modules);
  const cutting = optimizeCutting(geometry.panels);
  const hardware = calculateHardware(payload.modules, geometry.panels);
  const cost = calculateCost({ panels: geometry.panels, hardware, project: payload }, payload.pricingOverrides);

  let renderUrl: string | null = null;
  try {
    renderUrl = await requestAiRender(payload);
  } catch (error) {
    console.warn("AI render skipped", error);
  }

  const specification: ProjectSpecification = {
    project: {
      name: payload.name,
      client: payload.client,
      createdAt: new Date().toISOString(),
      totalModules: payload.modules.length,
      volumeM3: geometry.totalVolumeM3,
      material: payload.material,
      renderUrl,
    },
    panels: geometry.panels,
    hardware,
    cutting,
    cost,
  };

  return NextResponse.json(specification);
};
