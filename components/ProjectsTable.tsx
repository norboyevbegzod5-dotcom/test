import { SavedProjectRecord } from "@/lib/types";

interface Props {
  projects: SavedProjectRecord[];
}

export const ProjectsTable = ({ projects }: Props) => {
  if (!projects.length) {
    return <p className="text-sm text-slate-400">Проекты пока не сохранены.</p>;
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Проект</th>
            <th className="px-4 py-3">Клиент</th>
            <th className="px-4 py-3">Модулей</th>
            <th className="px-4 py-3">Стоимость</th>
            <th className="px-4 py-3">Обновлено</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((record) => (
            <tr key={record.id} className="border-t border-white/5 text-slate-200">
              <td className="px-4 py-3 font-semibold text-white">
                {record.specification.project.name}
              </td>
              <td className="px-4 py-3 text-slate-400">{record.specification.project.client ?? "—"}</td>
              <td className="px-4 py-3">{record.specification.project.totalModules}</td>
              <td className="px-4 py-3">
                {record.specification.cost.total.toFixed(2)} {record.specification.cost.currency}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {new Date(record.updatedAt).toLocaleString("ru-RU")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
