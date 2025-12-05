import { NextRequest, NextResponse } from "next/server";
import { listProjects, saveProject } from "@/lib/projectRepository";
import { ProjectSpecification } from "@/lib/types";

export const GET = async () => {
  const projects = await listProjects();
  return NextResponse.json(projects);
};

export const POST = async (request: NextRequest) => {
  const { specification, id } = (await request.json()) as {
    specification: ProjectSpecification;
    id?: string;
  };

  if (!specification) {
    return NextResponse.json({ error: "Отсутствует спецификация" }, { status: 400 });
  }

  const saved = await saveProject(specification, id);
  return NextResponse.json(saved);
};
