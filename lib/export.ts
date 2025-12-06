/**
 * Export functionality for PDF and Excel
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { Project, Specification, Panel, Hardware, CuttingPlan, CostBreakdown } from './types'

/**
 * Export specification to PDF
 */
export function exportToPDF(specification: Specification): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Title
  doc.setFontSize(20)
  doc.text('Карточка изделия', pageWidth / 2, 20, { align: 'center' })

  let yPos = 35

  // Project Info
  doc.setFontSize(14)
  doc.text(`Проект: ${specification.project.name}`, 14, yPos)
  yPos += 10
  doc.text(
    `Дата: ${new Date(specification.project.createdAt).toLocaleDateString('ru-RU')}`,
    14,
    yPos
  )
  yPos += 15

  // Dimensions
  doc.setFontSize(12)
  doc.text('Габариты:', 14, yPos)
  yPos += 7
  doc.setFontSize(10)
  doc.text(
    `Ширина: ${specification.project.cabinet.dimensions.width}мм`,
    20,
    yPos
  )
  yPos += 5
  doc.text(
    `Высота: ${specification.project.cabinet.dimensions.height}мм`,
    20,
    yPos
  )
  yPos += 5
  doc.text(
    `Глубина: ${specification.project.cabinet.dimensions.depth}мм`,
    20,
    yPos
  )
  yPos += 10

  // Panels Table
  doc.setFontSize(12)
  doc.text('Деталировка:', 14, yPos)
  yPos += 7

  autoTable(doc, {
    startY: yPos,
    head: [['Наименование', 'Ширина', 'Высота', 'Толщина', 'Кол-во']],
    body: specification.panels.map((panel) => [
      panel.name,
      `${panel.width}мм`,
      `${panel.height}мм`,
      `${panel.thickness}мм`,
      panel.quantity.toString(),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Hardware Table
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(12)
  doc.text('Фурнитура:', 14, yPos)
  yPos += 7

  autoTable(doc, {
    startY: yPos,
    head: [['Наименование', 'Количество', 'Цена', 'Сумма']],
    body: specification.hardware.map((item) => [
      item.name,
      item.quantity.toString(),
      `${item.unitPrice.toFixed(2)} ₽`,
      `${item.totalPrice.toFixed(2)} ₽`,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  })

  yPos = (doc as any).lastAutoTable.finalY + 10

  // Cost Summary
  if (yPos > pageHeight - 50) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(12)
  doc.text('Смета:', 14, yPos)
  yPos += 7
  doc.setFontSize(10)
  doc.text(`Материалы: ${specification.cost.materials.toFixed(2)} ₽`, 20, yPos)
  yPos += 5
  doc.text(`Фурнитура: ${specification.cost.hardware.toFixed(2)} ₽`, 20, yPos)
  if (specification.cost.labor) {
    yPos += 5
    doc.text(`Работа: ${specification.cost.labor.toFixed(2)} ₽`, 20, yPos)
  }
  yPos += 5
  doc.setFontSize(12)
  doc.text(
    `Итого: ${specification.cost.total.toFixed(2)} ₽`,
    20,
    yPos
  )

  // Save PDF
  doc.save(`${specification.project.name}_specification.pdf`)
}

/**
 * Export specification to Excel
 */
export function exportToExcel(specification: Specification): void {
  const workbook = XLSX.utils.book_new()

  // Project Info Sheet
  const projectData = [
    ['Карточка изделия'],
    [],
    ['Проект:', specification.project.name],
    ['Дата:', new Date(specification.project.createdAt).toLocaleDateString('ru-RU')],
    [],
    ['Габариты:'],
    ['Ширина (мм):', specification.project.cabinet.dimensions.width],
    ['Высота (мм):', specification.project.cabinet.dimensions.height],
    ['Глубина (мм):', specification.project.cabinet.dimensions.depth],
  ]
  const projectSheet = XLSX.utils.aoa_to_sheet(projectData)
  XLSX.utils.book_append_sheet(workbook, projectSheet, 'Информация')

  // Panels Sheet
  const panelsData = [
    ['Наименование', 'Ширина (мм)', 'Высота (мм)', 'Толщина (мм)', 'Количество'],
    ...specification.panels.map((panel) => [
      panel.name,
      panel.width,
      panel.height,
      panel.thickness,
      panel.quantity,
    ]),
  ]
  const panelsSheet = XLSX.utils.aoa_to_sheet(panelsData)
  XLSX.utils.book_append_sheet(workbook, panelsSheet, 'Деталировка')

  // Hardware Sheet
  const hardwareData = [
    ['Наименование', 'Количество', 'Цена за ед.', 'Сумма'],
    ...specification.hardware.map((item) => [
      item.name,
      item.quantity,
      item.unitPrice,
      item.totalPrice,
    ]),
  ]
  const hardwareSheet = XLSX.utils.aoa_to_sheet(hardwareData)
  XLSX.utils.book_append_sheet(workbook, hardwareSheet, 'Фурнитура')

  // Cutting Plan Sheet
  const cuttingData = [
    ['Лист', 'Материал', 'Количество панелей', 'Отходы (%)'],
    ...specification.cuttingPlan.sheets.map((sheet, index) => [
      index + 1,
      `${sheet.material.type} ${sheet.material.thickness}мм`,
      sheet.panels.length,
      sheet.waste.toFixed(1),
    ]),
    [],
    ['Всего листов:', specification.cuttingPlan.sheets.length],
    ['Общая площадь (м²):', specification.cuttingPlan.totalSquareMeters.toFixed(2)],
    ['Средний отход:', `${specification.cuttingPlan.totalWaste.toFixed(1)}%`],
  ]
  const cuttingSheet = XLSX.utils.aoa_to_sheet(cuttingData)
  XLSX.utils.book_append_sheet(workbook, cuttingSheet, 'Раскрой')

  // Cost Sheet
  const costData = [
    ['Смета'],
    [],
    ['Материалы:', specification.cost.materials],
    ['Фурнитура:', specification.cost.hardware],
    ['Кромка:', specification.cost.edgeBand],
    ...(specification.cost.labor ? [['Работа:', specification.cost.labor]] : []),
    [],
    ['ИТОГО:', specification.cost.total],
  ]
  const costSheet = XLSX.utils.aoa_to_sheet(costData)
  XLSX.utils.book_append_sheet(workbook, costSheet, 'Смета')

  // Save Excel
  XLSX.writeFile(workbook, `${specification.project.name}_specification.xlsx`)
}
