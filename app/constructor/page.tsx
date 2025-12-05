'use client';

import { ModuleEditor } from "@/components/ModuleEditor";
import { MaterialsTable } from "@/components/MaterialsTable";
import { HardwareList } from "@/components/HardwareList";
import { CostBreakdownCard } from "@/components/CostBreakdown";
import { RenderViewer } from "@/components/RenderViewer";
import { ExportButtons } from "@/components/ExportButtons";
import { ProjectSaver } from "@/components/ProjectSaver";
import { SpecificationSummary } from "@/components/SpecificationSummary";
import { useProjectStore } from "@/lib/store";

export default function ConstructorPage() {
  const modules = useProjectStore((state) => state.modules);
  const specification = useProjectStore((state) => state.specification);
  const recalculate = useProjectStore((state) => state.recalculate);
  const loading = useProjectStore((state) => state.loading);
  const error = useProjectStore((state) => state.error);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Конструктор</p>
              <h1 className="text-2xl font-semibold text-white">Модули и габариты</h1>
            </div>
            <button
              type="button"
              onClick={recalculate}
              disabled={loading}
              className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Расчёт..." : "Рассчитать"}
            </button>
          </div>
          {error && <p className="mt-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}
          <div className="mt-6">
            <ModuleEditor />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white">3D предпросмотр</h2>
          <p className="text-sm text-slate-400">Изометрическая визуализация для быстрых согласований.</p>
          <div className="mt-4">
            <RenderViewer modules={modules} />
          </div>
          <div className="mt-4">
            <SpecificationSummary specification={specification} />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-white">Деталировка панелей</h2>
          <p className="text-sm text-slate-400">Габариты, материал и площадь каждой детали.</p>
          <div className="mt-4">
            <MaterialsTable panels={specification?.panels} />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white">Фурнитура и смета</h2>
          <div className="mt-4 grid gap-4">
            <HardwareList hardware={specification?.hardware} />
            <CostBreakdownCard cost={specification?.cost} />
            <ExportButtons specification={specification} />
            <ProjectSaver specification={specification} />
          </div>
        </section>
      </div>
    </div>
  );
}
