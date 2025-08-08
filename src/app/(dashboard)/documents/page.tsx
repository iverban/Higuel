import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

interface PropertyDocument {
  property_id: string;
  file_path: string;
  status: string | null;
}

export default async function DocumentsPage() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("v_property_documents")
    .select("property_id, file_path, status");

  if (error) {
    return <p className="text-red-500">Error loading documents: {error.message}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      {data && data.length > 0 ? (
        <ul className="space-y-2">
          {data.map((doc: PropertyDocument, idx: number) => (
            <li key={idx} className="bg-neutral-800 p-4 rounded">
              <p>Property ID: {doc.property_id}</p>
              <p>File: {doc.file_path}</p>
              <p>Status: {doc.status ?? "—"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found.</p>
      )}
    </div>
  );
}
