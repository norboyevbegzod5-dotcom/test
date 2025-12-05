'use client';

import { ChangeEvent } from "react";

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}

export const DimensionInput = ({ label, value, onChange, min = 100, step = 10 }: DimensionInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(event.target.value);
    onChange(Number.isFinite(parsed) ? parsed : value);
  };

  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-400">
      {label}
      <input
        type="number"
        value={Math.round(value)}
        min={min}
        step={step}
        onChange={handleChange}
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-sky-300 focus:outline-none"
      />
    </label>
  );
};
