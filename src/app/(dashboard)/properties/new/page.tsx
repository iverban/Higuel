"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PROPERTY_TYPES = [
  "Land",
  "House",
  "Apartment",
  "Apartment Building",
  "Condo",
  "Commercial",
  "Industrial",
  "Mixed-Use",
  "Hotel/Resort",
  "Warehouse",
  "Office Space",
];

export default function NewPropertyPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [acquisitionPrice, setAcquisitionPrice] = useState("");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [propertyType, setPropertyType] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
    })();
  }, [router, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError("Only JPG and PNG files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File must be less than 5MB.");
        return;
      }
      setError("");
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      let imageUrl: string | null = null;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("property-pictures")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("property-pictures")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("properties").insert([
        {
          owner_user_id: user.id,
          title,
          description,
          listing_price: listingPrice ? parseFloat(listingPrice) : null,
          acquisition_price: acquisitionPrice ? parseFloat(acquisitionPrice) : null,
          currency_code: currencyCode,
          property_type: propertyType, // PRD enum column
          plot_number: plotNumber,
          image_url: imageUrl,
        },
      ]);
      if (insertError) throw insertError;

      router.push("/properties");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-neutral-900 text-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Listing Price</label>
            <input
              type="number"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
            />
          </div>
          <div>
            <label className="block mb-1">Acquisition Price</label>
            <input
              type="number"
              value={acquisitionPrice}
              onChange={(e) => setAcquisitionPrice(e.target.value)}
              className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Currency</label>
          <select
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          >
            <option value="USD">USD</option>
            <option value="DOP">DOP</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Property Type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
            required
          >
            <option value="">Select type</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Plot Number</label>
          <input
            type="text"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 border border-neutral-700"
          />
        </div>

        <div>
          <label className="block mb-1">Property Picture</label>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/properties")}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
