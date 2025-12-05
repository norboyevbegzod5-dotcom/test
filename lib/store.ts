import { create } from "zustand";
import { DEFAULT_MATERIALS } from "./constants";
import { ProjectInput, ProjectSpecification, ModuleConfig } from "./types";

const baseMaterial = DEFAULT_MATERIALS[0];

const buildModule = (index: number, material = baseMaterial): ModuleConfig => ({
  id: `module-${index}-${Date.now()}`,
  name: `Модуль ${index + 1}`,
  type: "base",
  width: 800,
  height: 720,
  depth: 560,
  shelves: 2,
  partitions: 0,
  hasDrawers: false,
  drawerCount: 2,
  doorType: "swing",
  material,
  backPanel: true,
  toeKick: 80,
});

interface ProjectState {
  projectName: string;
  clientName: string;
  currency: string;
  modules: ModuleConfig[];
  specification?: ProjectSpecification;
  loading: boolean;
  error?: string;
  lastUpdated?: string;
  recalculate: () => Promise<void>;
  setProjectName: (name: string) => void;
  setClientName: (name: string) => void;
  updateModule: (id: string, patch: Partial<ModuleConfig>) => void;
  addModule: () => void;
  removeModule: (id: string) => void;
  setSpecification: (spec: ProjectSpecification) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: "Новый проект",
  clientName: "",
  currency: "₽",
  modules: [buildModule(0)],
  specification: undefined,
  loading: false,
  error: undefined,
  lastUpdated: undefined,
  setProjectName: (projectName) => set({ projectName }),
  setClientName: (clientName) => set({ clientName }),
  updateModule: (id, patch) =>
    set(({ modules }) => ({
      modules: modules.map((module) => (module.id === id ? { ...module, ...patch } : module)),
    })),
  addModule: () =>
    set(({ modules }) => ({
      modules: [...modules, buildModule(modules.length)],
    })),
  removeModule: (id) =>
    set(({ modules }) => ({
      modules: modules.length > 1 ? modules.filter((module) => module.id !== id) : modules,
    })),
  setSpecification: (specification) =>
    set({ specification, lastUpdated: new Date().toISOString(), loading: false }),
  recalculate: async () => {
    const state = get();
    const payload: ProjectInput = {
      name: state.projectName,
      client: state.clientName,
      currency: state.currency,
      modules: state.modules,
      material: state.modules[0]?.material ?? baseMaterial,
      edgeBanding: { thin: 0, thick: 0 },
    };

    set({ loading: true, error: undefined });

    try {
      const response = await fetch("/api/specification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Не удалось рассчитать спецификацию");
      }
      const spec = (await response.json()) as ProjectSpecification;
      set({ specification: spec, loading: false, lastUpdated: new Date().toISOString() });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Ошибка", loading: false });
    }
  },
}));
