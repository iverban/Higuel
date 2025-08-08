import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface FinancialStat {
  property_id: string;
  category: string;
  total_amount: number;
}

export default async function FinancialsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_financial_stat_cards")
    .select("property_id, category, total_amount");

  if (error) {
    return <p className="text-red-500">Error loading financials: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Financial Overview</h1>
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((item: FinancialStat, idx: number) => (
            <div key={idx} className="bg-neutral-800 p-4 rounded">
              <p className="text-sm text-neutral-400">{item.category}</p>
              <p className="text-xl font-bold">
                {item.total_amount.toLocaleString(undefined, { style: "currency", currency: "USD" })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No financial data available.</p>
      )}
    </div>
  );
}
