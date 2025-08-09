import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function TimelinePage() {
  const supabase = await createClient(); // ✅ added await

  const { data, error } = await supabase
    .from("v_property_progress")
    .select("property_id, progress_percent");

  if (error) {
    return (
      <p className="text-red-500">
        Error loading property progress: {error.message}
      </p>
    );
  }

  return (
    <div>
      {data && data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item.property_id} — {item.progress_percent}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No progress data found.</p>
      )}
    </div>
  );
}
