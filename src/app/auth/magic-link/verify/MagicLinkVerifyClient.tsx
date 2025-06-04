"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MagicLinkVerifyClient() {
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleSupabaseSession = async () => {
      try {
        const supabase = createClient();
        
        // Check if we have a session (the magic link would have created one)
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (data?.session) {
          setStatus("success");
          // Wait a moment before redirecting to show the success message
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          setStatus("error");
          setError("No valid session found. The magic link may have expired.");
        }
      } catch (err) {
        setStatus("error");
        setError(typeof err === 'object' && err !== null && 'message' in err 
          ? String(err.message) 
          : "Verification failed");
      }
    };

    handleSupabaseSession();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      {status === "verifying" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Verifying your magic link...</p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <p className="text-lg font-medium">Successfully signed in!</p>
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      )}
      {status === "error" && (
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">✗</div>
          <p className="text-lg font-medium">Verification failed</p>
          <p className="text-sm text-red-500">{error}</p>
          <button 
            onClick={() => router.push('/auth/signin')} 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Return to Sign In
          </button>
        </div>
      )}
    </div>
  );
}
