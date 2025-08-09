import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function FinancialsPage() {
  const supabase = await createClient(); // ✅ await for server version

  const { data, error } = await supabase
    .from("v_financial_stat_cards")
    .select("property_id, category, total_amount");

  if (error) {
    return (
      <p className="text-red-500">
        Error loading financial stats: {error.message}
      </p>
    );
  }

  return (
    <div>
      {data && data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item.property_id} — {item.category} — {item.total_amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No financial data found.</p>
      )}
    </div>
  );
}
