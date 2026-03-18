"use client";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface PortfolioReelItem {
  title: string;
  subtitle: string;
  placeholderLabel: string;
  link: string;
  thumbnail: string;
}

const REELS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQufNlimDGUQNPj9B0duzZrTtdkTxNzuHTK-D4Gi0HJMS8b2Yl9Bd3WqpQk55ruA3z9obUwO5YdutjU/pub?output=csv";

export function usePortfolioReels() {
  const [reels, setReels] = useState<PortfolioReelItem[]>([]);
  const [isReelsLoading, setIsReelsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(REELS_CSV_URL);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true, // Pierwsza warstwa ochrony przed pustymi liniami
          complete: (results) => {
            const rawData = results.data as any[];

            // --- FILTROWANIE I CZYSZCZENIE ---
            const cleanData = rawData
              .filter(item => {
                // Sprawdzamy czy wiersz ma chociaż tytuł i link, żeby nie renderować pustych kart
                const hasTitle = item.title && item.title.toString().trim() !== "";
                const hasLink = item.link && item.link.toString().trim() !== "";
                return hasTitle && hasLink;
              })
              .map(item => ({
                title: item.title?.toString().trim() || "",
                subtitle: item.subtitle?.toString().trim() || "",
                placeholderLabel: item.placeholderLabel?.toString().trim() || "REEL",
                link: item.link?.toString().trim() || "",
                thumbnail: item.thumbnail?.toString().trim() || ""
              }));
            
            setReels(cleanData);
            setIsReelsLoading(false);
          },
          error: (err: any) => {
            console.error("Błąd PapaParse (Reels):", err);
            setError(err.message);
            setIsReelsLoading(false);
          }
        });
      } catch (err) {
        console.error("Błąd Fetch (Reels):", err);
        setError("Błąd podczas pobierania danych rolek");
        setIsReelsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { reels, isReelsLoading, error };
}