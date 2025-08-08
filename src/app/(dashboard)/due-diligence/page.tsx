import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface DueDiligenceTask {
  section_label: string;
  task_label: string;
  status: string | null;
  eta_days: number | null;
}

export default async function DueDiligencePage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("due_diligence_tasks")
    .select("section_label, task_label, status, eta_days")
    .order("section_label")
    .order("task_label");

  if (error) {
    return <p className="text-red-500">Error loading due diligence: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Due Diligence</h1>
      {data && data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((task: DueDiligenceTask, idx: number) => (
            <li key={idx} className="bg-neutral-800 p-4 rounded">
              <p><strong>{task.section_label}</strong> – {task.task_label}</p>
              <p>Status: {task.status ?? "—"}</p>
              <p>ETA: {task.eta_days ?? "—"} days</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
}
