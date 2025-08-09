import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const runtime = "nodejs";

interface Property {
  id: string;
  name: string;
  status: string | null;
  created_at: string;
}

export default async function PropertiesPage() {
  const supabase = await createClient(); // ✅ added await

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return <p className="text-red-500">Error fetching user: {userError.message}</p>;
  }

  if (!user) {
    return <p className="text-red-500">You must be logged in to see properties.</p>;
  }

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, name, status, created_at")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-red-500">Error loading properties: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link
          href="/properties/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Property
        </Link>
      </div>

      {properties && properties.length > 0 ? (
        <table className="w-full bg-neutral-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-neutral-700 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property: Property) => (
              <tr key={property.id} className="border-b border-neutral-700">
                <td className="p-3">{property.name}</td>
                <td className="p-3">{property.status ?? "—"}</td>
                <td className="p-3">
                  {new Date(property.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No properties found. Click “New Property” to add one.</p>
      )}
    </div>
  );
}
