'use client';

import { HardwareSummary } from "@/lib/types";

interface HardwareListProps {
  hardware?: HardwareSummary;
}

export const HardwareList = ({ hardware }: HardwareListProps) => {
  if (!hardware) {
    return <p className="text-sm text-slate-400">Фурнитура появится после расчета.</p>;
  }

  return (
    <div className="space-y-3 text-sm">
      {hardware.items.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-3 py-2">
          <div>
            <p className="font-medium text-white">{item.name}</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.category}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-white">{item.quantity}</p>
            <p className="text-xs text-slate-400">{item.unit}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
