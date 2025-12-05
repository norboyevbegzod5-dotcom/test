'use client';

import { Panel } from "@/lib/types";
import { formatArea } from "@/lib/utils/formatters";

interface MaterialsTableProps {
  panels?: Panel[];
}

export const MaterialsTable = ({ panels }: MaterialsTableProps) => {
  if (!panels?.length) {
    return <p className="text-sm text-slate-400">Рассчитайте проект, чтобы увидеть деталировку.</p>;
  }

  return (
    <div className="max-h-96 overflow-y-auto rounded-2xl border border-white/5 bg-slate-900/60">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-3">Деталь</th>
            <th className="px-4 py-3">Размер</th>
            <th className="px-4 py-3">Кол-во</th>
            <th className="px-4 py-3">Материал</th>
            <th className="px-4 py-3">Площадь</th>
          </tr>
        </thead>
        <tbody>
          {panels.map((panel) => (
            <tr key={panel.id} className="border-t border-white/5 text-slate-200">
              <td className="px-4 py-2 text-sm">{panel.name}</td>
              <td className="px-4 py-2 text-slate-400">
                {Math.round(panel.width)}×{Math.round(panel.height)} мм
              </td>
              <td className="px-4 py-2">{panel.quantity}</td>
              <td className="px-4 py-2 text-slate-400">{panel.material.label}</td>
              <td className="px-4 py-2">{formatArea(panel.area)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
