import OpenAI from "openai";
import { ProjectInput } from "./types";

const FALLBACK_MODEL = "gpt-image-1";

export const buildRenderPrompt = (project: ProjectInput) => {
  const dominantMaterial = project.material.label;
  const profile = project.modules
    .map(
      (module) =>
        `${module.type} module ${Math.round(module.width)}x${Math.round(module.height)}x${Math.round(module.depth)} мм with ${module.doorType} doors`,
    )
    .join("; ");

  return `Generate an isometric furniture render of a modular cabinet system built with ${dominantMaterial}. Modules: ${profile}. Highlight real materials, edge banding and realistic lighting. background: ${project.renderStyle?.background ?? "light studio"}.`;
};

export const requestAiRender = async (project: ProjectInput): Promise<string | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const client = new OpenAI({ apiKey });
  const prompt = buildRenderPrompt(project);
  const response = await client.images.generate({
    model: process.env.OPENAI_IMAGE_MODEL ?? FALLBACK_MODEL,
    prompt,
    size: "1024x1024",
    quality: "high",
  });
  return response.data[0]?.url ?? null;
};
