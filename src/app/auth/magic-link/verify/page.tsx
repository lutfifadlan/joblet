"use client";
import { Suspense } from "react";
import MagicLinkVerifyClient from "./MagicLinkVerifyClient";

export default function MagicLinkVerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MagicLinkVerifyClient />
    </Suspense>
  );
}
