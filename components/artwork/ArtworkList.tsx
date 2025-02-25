"use client";

import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import ArtworkItem from "./ArtworkItem";
import { InitialArtworks } from "@/app/(tabs)/artworks/page";
import { getMoreArtworks } from "@/app/(tabs)/artworks/actions";

interface ArtworkListProps {
  initialArtworks: InitialArtworks;
}

const breakpoints = {
  default: 5,
  1100: 4,
  700: 3,
  500: 2,
  300: 1,
};

export default function ArtworkList({ initialArtworks }: ArtworkListProps) {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreArtworks(page + 1);
          if (newProducts.length !== 0) {
            setArtworks((prev) => [...prev, ...newProducts]);
            setPage((prev) => prev + 1);
          } else {
            setIsLastPage(true);
          }

          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="p-5">
      <Masonry
        breakpointCols={breakpoints}
        className="flex space-x-2 overflow-hidden"
        columnClassName="masonry-column"
      >
        {artworks.map((artwork) => (
          <ArtworkItem key={artwork.id} {...artwork} />
        ))}
      </Masonry>
    </div>
  );
}
