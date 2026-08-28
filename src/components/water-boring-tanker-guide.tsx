import { useState } from "react";
import { Droplet } from "lucide-react";

export function WaterBoringTankerGuide() {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-card md:p-10 space-y-6">
      <h2 className="font-display text-2xl font-black text-primary">Water Boring Depth & Official Tanker Directory</h2>
      <p className="text-xs text-muted">Official helplines: KWSB Karachi (9119), WASA Lahore (1334), CDA Islamabad (1818).</p>
    </div>
  );
}
