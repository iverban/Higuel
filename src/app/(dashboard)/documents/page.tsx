import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function DocumentsPage() {
  const supabase = await createClient(); // ✅ Await server version

  const { data, error } = await supabase
    .from("v_property_documents")
    .select("property_id, file_path, status");

  if (error) {
    return (
      <p className="text-red-500">
        Error loading documents: {error.message}
      </p>
    );
  }

  return (
    <div>
      {data && data.length > 0 ? (
        <ul>
          {data.map((doc) => (
            <li key={doc.file_path}>
              {doc.property_id} — {doc.file_path} — {doc.status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found.</p>
      )}
    </div>
  );
}
