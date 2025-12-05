'use client';

import { useState } from "react";
import { ProjectSpecification } from "@/lib/types";

interface Props {
  specification?: ProjectSpecification;
}

export const ExportButtons = ({ specification }: Props) => {
  const [downloading, setDownloading] = useState<"pdf" | "excel" | null>(null);

  const handleExport = async (type: "pdf" | "excel") => {
    if (!specification) return;
    setDownloading(type);
    try {
      const response = await fetch(`/api/export/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specification }),
      });
      if (!response.ok) throw new Error("Не удалось сформировать файл");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${specification.project.name}.${type === "pdf" ? "pdf" : "xlsx"}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => handleExport("pdf")}
        disabled={!specification || downloading === "pdf"}
        className="flex-1 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading === "pdf" ? "Формируется..." : "PDF отчёт"}
      </button>
      <button
        type="button"
        onClick={() => handleExport("excel")}
        disabled={!specification || downloading === "excel"}
        className="flex-1 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading === "excel" ? "Формируется..." : "Excel"}
      </button>
    </div>
  );
};
