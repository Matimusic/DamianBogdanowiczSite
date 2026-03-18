"use client";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface PortfolioFilmItem {
  title: string;
  subtitle: string;
  youtubeUrl: string;
  thumbnailUrl: string;
}

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTr8S5aoG5AYFc8zn_5W9oBNSUUT7SXL_bE7oD_qDnw-89F2dbG3I7ato3HtHWf0UEQ0s379ZeZujAM/pub?output=csv";

export function usePortfolioFilms() {
  const [films, setFilms] = useState<PortfolioFilmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true, // Pomija całkowicie puste linie w pliku
          complete: (results) => {
            const rawData = results.data as any[];

            // --- FILTROWANIE ŚMIECI ---
            // Sprawdzamy, czy wiersz ma faktycznie tytuł i link. 
            // Jeśli ktoś usunął tekst w Excelu, ale wiersz został, to go tu odrzucimy.
            const cleanData = rawData
              .filter(item => {
                const hasTitle = item.title && item.title.toString().trim() !== "";
                const hasUrl = item.youtubeUrl && item.youtubeUrl.toString().trim() !== "";
                return hasTitle && hasUrl; // Zostawiamy tylko wiersze, które mają obie te rzeczy
              })
              .map(item => ({
                title: item.title?.toString().trim() || "",
                subtitle: item.subtitle?.toString().trim() || "",
                youtubeUrl: item.youtubeUrl?.toString().trim() || "",
                thumbnailUrl: item.thumbnailUrl?.toString().trim() || ""
              }));
            
            setFilms(cleanData);
            setIsLoading(false);
          },
          error: (err: any) => {
            console.error("Błąd PapaParse:", err);
            setError(err.message);
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error("Błąd Fetch:", err);
        setError("Błąd podczas pobierania danych");
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { films, isLoading, error };
}