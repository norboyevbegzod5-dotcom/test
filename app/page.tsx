import Link from "next/link";
import { DEFAULT_MATERIALS } from "@/lib/constants";

const features = [
  {
    title: "Геометрия",
    description: "Деталировка Базис уровня с автоматическим расчетом фасадов, перегородок и зазоров.",
  },
  {
    title: "Раскрой",
    description: "Оптимизация листов 2800×2070, учет отходов и статистика расхода материалов.",
  },
  {
    title: "Фурнитура",
    description: "Автоподбор петель, направляющих, крепежа, ручек и опор по правилам Сметы.",
  },
  {
    title: "Экспорт",
    description: "PDF карточка изделия, XLSX спецификация, выгрузка в учет и Supabase storage.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">BasisCraft</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
          Онлайн-комбайн для мебельщика: конструктор + раскрой + смета + рендер.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          Постройте модуль, рассчитайте деталировку, получите карту раскроя, спецификацию фурнитуры,
          точную себестоимость и AI-превью как в «Базис Мебельщик / Раскрой / Смета».
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/constructor"
            className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
          >
            Запустить конструктор
          </Link>
          <Link
            href="/projects"
            className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Мои проекты
          </Link>
        </div>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-white/5 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white">Поддерживаемые материалы</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {DEFAULT_MATERIALS.map((material) => (
            <div key={material.id} className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/10 to-white/5 p-4">
              <p className="text-sm uppercase tracking-wide text-slate-400">{material.materialType}</p>
              <p className="text-lg font-semibold text-white">{material.label}</p>
              <p className="text-sm text-slate-300">Толщина: {material.thickness} мм</p>
              <p className="text-sm text-slate-400">{material.pricePerSqM.toFixed(2)} $/м²</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
