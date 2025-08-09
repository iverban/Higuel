"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NewPropertyPage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [listingPrice, setListingPrice] = useState<string>("");
  const [acquisitionPrice, setAcquisitionPrice] = useState<string>("");
  const [currencyCode, setCurrencyCode] = useState<string>("USD");
  const [status, setStatus] = useState<string>("");
  const [plotNumber, setPlotNumber] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 🔹 TEMPORARY: check if user is authenticated when loading the page
  useEffect(() => {
    (async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("🔍 [NewPropertyPage] User from Supabase:", user, "Error:", userError);

      if (!user) {
        console.warn("⚠️ No user found — redirecting to /login");
        router.push("/login");
      }
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

  // ... rest of your handleSubmit and JSX stays the same
}
