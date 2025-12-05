import { NextRequest, NextResponse } from "next/server";
import { listProjects, saveProject } from "@/lib/projectRepository";
import { ProjectSpecification } from "@/lib/types";

export const GET = async (_: NextRequest, context: { params: { id: string } }) => {
  const projects = await listProjects();
  const project = projects.find((item) => item.id === context.params.id);
  if (!project) {
    return NextResponse.json({ error: "Проект не найден" }, { status: 404 });
  }
  return NextResponse.json(project);
};

export const PUT = async (request: NextRequest, context: { params: { id: string } }) => {
  const { specification } = (await request.json()) as { specification: ProjectSpecification };
  if (!specification) {
    return NextResponse.json({ error: "Нужна спецификация" }, { status: 400 });
  }
  const saved = await saveProject(specification, context.params.id);
  return NextResponse.json(saved);
};
