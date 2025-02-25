"use client";

import { useEffect, useState } from "react";
import ArtworkItem from "../artwork/ArtworkItem";
import { InitialArtworks } from "@/app/(tabs)/artworks/page";

interface SearchListProps {
  initialArtworks: InitialArtworks;
  keyword: string;
}

export default function SearchResult({
  initialArtworks,
  keyword,
}: SearchListProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  useEffect(() => {
    if (keyword) {
      setArtworks(initialArtworks);
    }
  }, [keyword]);
  return (
    <div className="grid grid-cols-5 space-x-2 ">
      {artworks.map((artwork) => (
        <ArtworkItem key={artwork.id} {...artwork} />
      ))}
    </div>
  );
}
