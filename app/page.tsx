"use client";

import { useEffect } from "react";
import NearbyMasterList from "./components/NearbyMasterList";

export default function NearbyPage() {
  useEffect(() => {
    document.title = "Nearby | BRT Lagos Demo";
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-10">
      {/* Left Column (Master List) */}
      <div className="w-full lg:w-[380px] lg:flex-shrink-0">
        <NearbyMasterList />
      </div>

      {/* Right Column (Desktop Quiet Prompt) */}
      <div className="hidden lg:flex flex-1 items-center justify-center border-l border-cowry-hairline pl-10 min-h-[420px]">
        <div className="max-w-xs text-center space-y-2">
          <p className="font-serif text-xl font-bold text-cowry-ink">
            Select a stop to see departures.
          </p>
          <p className="text-xs text-cowry-muted leading-relaxed">
            Choose a terminal or bus stop from the list to view outbound routes, flat fares, and buses waiting.
          </p>
        </div>
      </div>
    </div>
  );
}
