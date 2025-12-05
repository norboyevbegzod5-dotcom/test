import { NextRequest, NextResponse } from "next/server";
import { buildSpecificationPdf } from "@/lib/exporters";
import { ProjectSpecification } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  const { specification } = (await request.json()) as { specification: ProjectSpecification };
  if (!specification) {
    return NextResponse.json({ error: "Нет данных" }, { status: 400 });
  }
  const pdf = await buildSpecificationPdf(specification);
  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${specification.project.name}.pdf"`,
    },
  });
};
