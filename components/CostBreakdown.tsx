'use client';

import { CostBreakdown } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatters";

interface Props {
  cost?: CostBreakdown;
}

export const CostBreakdownCard = ({ cost }: Props) => {
  if (!cost) {
    return <p className="text-sm text-slate-400">Смета появится после расчета.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <p className="text-sm uppercase tracking-wide text-emerald-200">Итого</p>
        <p className="text-3xl font-semibold text-white">{formatCurrency(cost.total, cost.currency)}</p>
      </div>
      <ul className="space-y-2 text-sm text-slate-300">
        {cost.lineItems.map((line) => (
          <li key={line.label} className="flex items-center justify-between border-b border-white/5 pb-1">
            <span>{line.label}</span>
            <span className="font-medium text-white">
              {formatCurrency(line.amount, cost.currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
