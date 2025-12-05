'use client';

import { DEFAULT_MATERIALS } from "@/lib/constants";
import { useProjectStore } from "@/lib/store";
import { ModuleConfig } from "@/lib/types";
import { DimensionInput } from "./DimensionInput";

const moduleTypeOptions = [
  { value: "base", label: "Тумба" },
  { value: "wall", label: "Навесной" },
  { value: "tall", label: "Пенал" },
  { value: "corner", label: "Угловой" },
];

const doorOptions = [
  { value: "swing", label: "Распашные" },
  { value: "sliding", label: "Раздвижные" },
  { value: "none", label: "Без фасадов" },
];

const ModuleCard = ({
  module,
  onRemove,
  canRemove,
}: {
  module: ModuleConfig;
  onRemove: () => void;
  canRemove: boolean;
}) => {
  const updateModule = useProjectStore((state) => state.updateModule);

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Модуль</p>
          <h3 className="text-lg font-semibold">{module.name}</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-slate-400 transition hover:text-rose-400 disabled:opacity-40"
          disabled={!canRemove}
        >
          Удалить
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <DimensionInput
          label="Ширина"
          value={module.width}
          onChange={(value) => updateModule(module.id, { width: value })}
        />
        <DimensionInput
          label="Высота"
          value={module.height}
          onChange={(value) => updateModule(module.id, { height: value })}
        />
        <DimensionInput
          label="Глубина"
          value={module.depth}
          onChange={(value) => updateModule(module.id, { depth: value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Тип
          <select
            value={module.type}
            onChange={(event) => updateModule(module.id, { type: event.target.value as ModuleConfig["type"] })}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          >
            {moduleTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Фасады
          <select
            value={module.doorType}
            onChange={(event) => updateModule(module.id, { doorType: event.target.value as ModuleConfig["doorType"] })}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          >
            {doorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Материал
          <select
            value={module.material.id}
            onChange={(event) => {
              const material = DEFAULT_MATERIALS.find((mat) => mat.id === event.target.value) ?? module.material;
              updateModule(module.id, { material });
            }}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          >
            {DEFAULT_MATERIALS.map((material) => (
              <option key={material.id} value={material.id}>
                {material.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Полки
          <input
            type="number"
            min={0}
            value={module.shelves}
            onChange={(event) => updateModule(module.id, { shelves: Number(event.target.value) })}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-400">
          Перегородки
          <input
            type="number"
            min={0}
            value={module.partitions}
            onChange={(event) => updateModule(module.id, { partitions: Number(event.target.value) })}
            className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={module.hasDrawers}
            onChange={(event) => updateModule(module.id, { hasDrawers: event.target.checked })}
            className="rounded border-white/20 bg-slate-900"
          />
          Ящики
        </label>
        {module.hasDrawers && (
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            Кол-во ящиков
            <input
              type="number"
              min={1}
              value={module.drawerCount}
              onChange={(event) =>
                updateModule(module.id, { drawerCount: Math.max(1, Number(event.target.value)) })
              }
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export const ModuleEditor = () => {
  const modules = useProjectStore((state) => state.modules);
  const addModule = useProjectStore((state) => state.addModule);
  const removeModule = useProjectStore((state) => state.removeModule);

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          canRemove={modules.length > 1}
          onRemove={() => removeModule(module.id)}
        />
      ))}
      <button
        type="button"
        onClick={addModule}
        className="w-full rounded-xl border border-dashed border-white/20 py-3 text-sm text-slate-200 transition hover:border-sky-300 hover:text-white"
      >
        Добавить модуль
      </button>
    </div>
  );
};
