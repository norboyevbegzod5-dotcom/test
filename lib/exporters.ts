import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib";
import * as XLSX from "xlsx";
import { ProjectSpecification } from "./types";

type TextOptions = {
  x: number;
  y: number;
  size?: number;
  color?: ReturnType<typeof rgb>;
};

const addText = (page: PDFPage, text: string, options: TextOptions) => {
  page.drawText(text, {
    x: options.x,
    y: options.y,
    size: options.size ?? 10,
    color: options.color ?? rgb(0, 0, 0),
  });
};

export const buildSpecificationPdf = async (
  spec: ProjectSpecification,
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 portrait
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.setFont(font);

  addText(page, `Карточка изделия: ${spec.project.name}`, { x: 40, y: 800, size: 18 });
  addText(page, `Клиент: ${spec.project.client ?? "не указан"}`, { x: 40, y: 780, size: 12 });
  addText(page, `Материал: ${spec.project.material.label}`, { x: 40, y: 760, size: 12 });
  addText(page, `Модулей: ${spec.project.totalModules}`, { x: 40, y: 740, size: 12 });
  addText(page, `Объем: ${spec.project.volumeM3.toFixed(2)} м³`, { x: 40, y: 720, size: 12 });

  addText(page, "Панели", { x: 40, y: 690, size: 14 });
  spec.panels.slice(0, 15).forEach((panel, index) => {
    addText(
      page,
      `${index + 1}. ${panel.name} ${Math.round(panel.width)}x${Math.round(panel.height)} мм x${panel.quantity}`,
      { x: 40, y: 670 - index * 14 },
    );
  });

  addText(page, "Фурнитура", { x: 40, y: 450, size: 14 });
  spec.hardware.items.slice(0, 10).forEach((item, index) => {
    addText(page, `${item.name}: ${item.quantity} ${item.unit}`, { x: 40, y: 430 - index * 14 });
  });

  addText(page, "Себестоимость", { x: 40, y: 260, size: 14 });
  spec.cost.lineItems.forEach((line, idx) => {
    addText(page, `${line.label}: ${line.amount.toFixed(2)} ${spec.cost.currency}`, {
      x: 40,
      y: 240 - idx * 14,
    });
  });
  addText(page, `Итого: ${spec.cost.total.toFixed(2)} ${spec.cost.currency}`, {
    x: 40,
    y: 80,
    size: 16,
  });

  return pdfDoc.save();
};

export const buildSpecificationWorkbook = (spec: ProjectSpecification): ArrayBuffer => {
  const panelsSheet = spec.panels.map((panel) => ({
    Модуль: panel.moduleId,
    Деталь: panel.name,
    Категория: panel.category,
    Размер: `${Math.round(panel.width)}x${Math.round(panel.height)}`,
    Толщина: panel.thickness,
    Количество: panel.quantity,
    Материал: panel.material.label,
  }));

  const hardwareSheet = spec.hardware.items.map((item) => ({
    Наименование: item.name,
    Категория: item.category,
    Количество: item.quantity,
    Ед: item.unit,
  }));

  const sheetsSheet = spec.cutting.sheets.map((sheet) => ({
    Лист: sheet.id,
    Материал: sheet.material.label,
    Толщина: sheet.thickness,
    Использовано: sheet.usedArea,
    Площадь: sheet.totalArea,
    Отходы: `${((sheet.totalArea - sheet.usedArea) / sheet.totalArea) * 100 || 0}%`,
  }));

  const summarySheet = [
    { Показатель: "Материал", Значение: spec.project.material.label },
    { Показатель: "Количество модулей", Значение: spec.project.totalModules },
    { Показатель: "Объем", Значение: `${spec.project.volumeM3.toFixed(2)} м³` },
    { Показатель: "Стоимость", Значение: spec.cost.total.toFixed(2) },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summarySheet), "Summary");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(panelsSheet), "Panels");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(hardwareSheet), "Hardware");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sheetsSheet), "Sheets");

  const wbout = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return wbout;
};
