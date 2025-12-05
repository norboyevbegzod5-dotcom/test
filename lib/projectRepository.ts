import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ProjectSpecification, SavedProjectRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

const supabaseAdmin: SupabaseClient | null =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

const ensureDataFile = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
};

const readLocal = async (): Promise<SavedProjectRecord[]> => {
  await ensureDataFile();
  const buffer = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(buffer) as SavedProjectRecord[];
};

const writeLocal = async (records: SavedProjectRecord[]) => {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2));
};

export const listProjects = async (): Promise<SavedProjectRecord[]> => {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("projects")
      .select("id, specification, updated_at")
      .order("updated_at", { ascending: false });
    if (error) {
      throw error;
    }
    return (data ?? []).map((row) => ({
      id: row.id,
      specification: row.specification as ProjectSpecification,
      updatedAt: row.updated_at,
    }));
  }

  return readLocal();
};

export const saveProject = async (
  specification: ProjectSpecification,
  id?: string,
): Promise<SavedProjectRecord> => {
  const record: SavedProjectRecord = {
    id: id ?? randomUUID(),
    specification,
    updatedAt: new Date().toISOString(),
  };

  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.from("projects").upsert(
      {
        id: record.id,
        specification: record.specification,
        updated_at: record.updatedAt,
      },
      { onConflict: "id" },
    );
    if (error) {
      throw error;
    }
    return record;
  }

  const existing = await readLocal();
  const index = existing.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    existing[index] = record;
  } else {
    existing.unshift(record);
  }
  await writeLocal(existing);
  return record;
};
