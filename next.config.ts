import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // To generuje statyczne pliki HTML
  basePath: '/DamianBogdanowiczSite', // TUTAJ wpisz dokładnie nazwę swojego repo na GitHubie
  images: {
    unoptimized: true, // GitHub Pages nie wspiera automatycznej optymalizacji zdjęć Next.js
  },
};

export default nextConfig;
