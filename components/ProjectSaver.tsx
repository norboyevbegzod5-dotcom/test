'use client';

import { useState } from "react";
import { useProjectStore } from "@/lib/store";
import { ProjectSpecification } from "@/lib/types";

interface Props {
  specification?: ProjectSpecification;
}

export const ProjectSaver = ({ specification }: Props) => {
  const projectName = useProjectStore((state) => state.projectName);
  const setProjectName = useProjectStore((state) => state.setProjectName);
  const clientName = useProjectStore((state) => state.clientName);
  const setClientName = useProjectStore((state) => state.setClientName);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!specification) return;
    const payload: ProjectSpecification = {
      ...specification,
      project: {
        ...specification.project,
        name: projectName,
        client: clientName,
      },
    };
    setSaving(true);
    setStatus(null);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specification: payload }),
      });
      if (!response.ok) throw new Error("Не удалось сохранить проект");
      setStatus("Проект сохранен");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Название проекта
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Клиент
          <input
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={handleSave}
        disabled={!specification || saving}
        className="w-full rounded-xl border border-white/10 bg-white/10 py-3 text-sm font-semibold text-white transition hover:border-sky-300 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Сохранение..." : "Сохранить в базе"}
      </button>
      {status && <p className="text-xs text-slate-400">{status}</p>}
    </div>
  );
};
