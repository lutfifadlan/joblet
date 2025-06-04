"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MagicLinkVerifyClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setError("No token found in the URL.");
      return;
    }

    // Verify magic link
    fetch("/api/auth/magic-link-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.token) {
          setStatus("success");
          router.push("/dashboard");
        } else {
          setStatus("error");
          setError(data.error || "Verification failed");
        }
      })
      .catch((err) => {
        setStatus("error");
        setError("Verification failed: " + err.message);
      });
  }, [router, searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      {status === "verifying" && <p>Verifying magic link...</p>}
      {status === "success" && <p>Magic link verified! Redirecting...</p>}
      {status === "error" && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
