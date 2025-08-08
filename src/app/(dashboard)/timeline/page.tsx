import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface ProgressItem {
  property_id: string;
  progress_percent: number;
}

export default async function TimelinePage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_property_progress")
    .select("property_id, progress_percent");

  if (error) {
    return <p className="text-red-500">Error loading timeline: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Property Progress</h1>
      {data && data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((item: ProgressItem) => (
            <li key={item.property_id} className="bg-neutral-800 p-4 rounded">
              <p>Property ID: {item.property_id}</p>
              <p>Progress: {item.progress_percent.toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No progress data available.</p>
      )}
    </div>
  );
}
