import { NextRequest, NextResponse } from "next/server";
import { requestAiRender } from "@/lib/renderEngine";
import { ProjectInput } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json()) as ProjectInput;
  if (!payload?.modules?.length) {
    return NextResponse.json({ error: "Нет модулей" }, { status: 400 });
  }

  try {
    const url = await requestAiRender(payload);
    if (!url) {
      return NextResponse.json({ error: "API ключ не настроен" }, { status: 400 });
    }
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка генерации" },
      { status: 500 },
    );
  }
};
