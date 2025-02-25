"use client";

import { useState } from "react";
import BoardList from "./BoardList";
import { InitialArtworks } from "@/app/(tabs)/artworks/page";

interface ArtworkListProps {
  initialArtworks: InitialArtworks;
}

export default function Board({ initialArtworks }: ArtworkListProps) {
  const [artworks, setArtworks] = useState(initialArtworks.slice(0, 7));

  return (
    <div className="mt-6 grid grid-cols-6 gap-4">
      {artworks.map((artwork, index) => {
        const colSpanClass =
          index === 0
            ? "col-span-2" // 첫 번째 트윗은 4열 차지
            : index % 3 === 0
            ? "col-span-1" // 3번째마다 3열 차지
            : "col-span-2"; // 나머지는 2열 차지
        return (
          <BoardList key={artwork.id} {...artwork} colSpan={colSpanClass} />
        );
      })}
    </div>
  );
}
