import { NextRequest, NextResponse } from "next/server";
import { buildSpecificationWorkbook } from "@/lib/exporters";
import { ProjectSpecification } from "@/lib/types";

export const POST = async (request: NextRequest) => {
  const { specification } = (await request.json()) as { specification: ProjectSpecification };
  if (!specification) {
    return NextResponse.json({ error: "Нет данных" }, { status: 400 });
  }
  const workbook = buildSpecificationWorkbook(specification);
  return new NextResponse(Buffer.from(workbook), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${specification.project.name}.xlsx"`,
    },
  });
};
