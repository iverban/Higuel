import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function DueDiligencePage() {
  const supabase = await createClient(); // ✅ Await server version

  const { data, error } = await supabase
    .from("due_diligence_tasks")
    .select("section_label, task_label, status, eta_days")
    .order("section_label")
    .order("task_label");

  if (error) {
    return (
      <p className="text-red-500">
        Error loading due diligence tasks: {error.message}
      </p>
    );
  }

  return (
    <div>
      {data && data.length > 0 ? (
        <ul>
          {data.map((task, index) => (
            <li key={index}>
              {task.section_label} — {task.task_label} — {task.status} — ETA: {task.eta_days} days
            </li>
          ))}
        </ul>
      ) : (
        <p>No due diligence tasks found.</p>
      )}
    </div>
  );
}
