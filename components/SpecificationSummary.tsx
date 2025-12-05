'use client';

import { ProjectSpecification } from "@/lib/types";
import { formatArea } from "@/lib/utils/formatters";

interface Props {
  specification?: ProjectSpecification;
}

const SummaryCell = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
    <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </div>
);

export const SpecificationSummary = ({ specification }: Props) => {
  if (!specification) {
    return <p className="text-sm text-slate-400">Нет данных. Постройте проект.</p>;
  }

  const boardArea = specification.panels.reduce((acc, panel) => acc + panel.area, 0);

  return (
    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
      <SummaryCell label="Модули" value={`${specification.project.totalModules}`} />
      <SummaryCell label="Материал" value={specification.project.material.label} />
      <SummaryCell label="Площадь" value={formatArea(boardArea)} />
      <SummaryCell label="Отходы" value={`${specification.cutting.wastePercent.toFixed(1)}%`} />
    </div>
  );
};
