import Link from "next/link";
import { listProjects } from "@/lib/projectRepository";
import { ProjectsTable } from "@/components/ProjectsTable";
import { AuthPanel } from "@/components/AuthPanel";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Проекты</p>
            <h1 className="text-2xl font-semibold text-white">Сохраненные изделия</h1>
          </div>
          <Link
            href="/constructor"
            className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Новый проект
          </Link>
        </div>
      </section>

      <section>
        <ProjectsTable projects={projects} />
      </section>

      <section>
        <AuthPanel />
      </section>
    </div>
  );
}
