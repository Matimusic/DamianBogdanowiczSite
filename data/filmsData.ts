// @/data/filmsData.ts

export interface FilmDetails {
  slug: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  description: string;
  credits: { label: string; value: string }[];
  category: string;
  year: string;
}

export const FILMS_DETAILS: Record<string, FilmDetails> = {
  "run-karolina-lozowska": {
    slug: "run-karolina-lozowska",
    title: "RUN - Karolina Łozowska",
    subtitle: "(Cinematic Short Film | SONY FX3)",
    videoUrl: "https://www.youtube.com/watch?v=KEsNuO4F-A4&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=12", 
    category: "Short Film / Sports",
    year: "2024",
    description: "Intymne spojrzenie na determinację i proces treningowy jednej z najbardziej obiecujących polskich lekkoatletyk. Film skupia się na emocjach towarzyszących przekraczaniu własnych granic.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "muzyczny-bialystok-ii": {
    slug: "muzyczny-bialystok-ii",
    title: "Muzyczny Białystok II",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=KD-6SkynrA4&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=8",
    category: "Documentary / Music",
    year: "2023",
    description: "Druga odsłona projektu prezentującego lokalną scenę muzyczną. Dynamiczne ujęcia, surowy klimat i prawda o artystach z Podlasia.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "brzydkie-kaczatko": {
    slug: "brzydkie-kaczatko",
    title: "BRZYDKIE KACZĄTKO",
    subtitle: "(Cinematic Music Trailer) | SONY FX3 | 4K",
    videoUrl: "https://www.youtube.com/watch?v=9xK1DNXeObg&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=4",
    category: "Music Video / Trailer",
    year: "2024",
    description: "Mroczny i nastrojowy trailer muzyczny. Eksperymentalne podejście do światła i narracji wizualnej, zrealizowane w technologii 4K.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "mount-everest": {
    slug: "mount-everest",
    title: "MOUNT EVEREST",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=GQ99a9DOu1A&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=7",
    category: "Nature / Travel",
    year: "2022",
    description: "Zapierająca dech w piersiach podróż przez najwyższe góry świata. Dokumentacja wyprawy, w której natura gra główną rolę.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "vox-mentis": {
    slug: "vox-mentis",
    title: "VOX MENTIS",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=r8FEYoJAZfc&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak",
    category: "Narrative / Art",
    year: "2023",
    description: "Głos umysłu. Krótkometrażowa forma artystyczna badająca relację między dźwiękiem a obrazem wewnątrz ludzkiej psychiki.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "brzydkie-kaczatko-trailer": { // Unikalny slug dla drugiego filmu o podobnym tytule
    slug: "brzydkie-kaczatko-trailer",
    title: "Brzydkie Kaczątko",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=QJ8_oREjEtU&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=2",
    category: "Music Video",
    year: "2024",
    description: "Pełna wersja projektu Brzydkie Kaczątko. Cinematic music video skupiający się na transformacji i odrodzeniu.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
    ],
  },
  "testy": {
    slug: "testy",
    title: "TESTY",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=_qO2aMBhYow&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=6",
    category: "Experimental / Tech",
    year: "2024",
    description: "Zbiór testów produkcyjnych i technicznych. Sprawdzanie możliwości nowych obiektywów anamorficznych w trudnych warunkach oświetleniowych.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "night-call": {
    slug: "night-call",
    title: "NIGHT CALL",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=2ZRR7USEbp8&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=5",
    category: "Cinematic / Automotive",
    year: "2023",
    description: "Nocna jazda przez miasto. Neonowe światła, szybkie samochody i klimat lat 80. w nowoczesnym wydaniu.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "latac-jak": {
    slug: "latac-jak",
    title: "Latać Jak",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=HYTZLTTnTRA&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=9",
    category: "Music Video",
    year: "2024",
    description: "Teledysk do utworu 'Latać Jak'. Wizualna metafora wolności i ucieczki od codzienności.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "echo": {
    slug: "echo",
    title: "ECHO",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=XfXSbUkjFs8&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=3",
    category: "Short Film / Thriller",
    year: "2023",
    description: "Dźwięki przeszłości, których nie da się uciszyć. Krótka forma z pogranicza thrillera psychologicznego.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "niebieski-mikrofon": {
    slug: "niebieski-mikrofon",
    title: "Niebieski Mikrofon",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=saPFbU3-IYs&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=10",
    category: "Event / Gala",
    year: "2023",
    description: "Relacja z gali Niebieski Mikrofon. Dokumentacja najważniejszych momentów wydarzenia i występy na żywo.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
  "nieme-kino": {
    slug: "nieme-kino",
    title: "Nieme Kino",
    subtitle: "Directed by: Damian Bogdanowicz",
    videoUrl: "https://www.youtube.com/watch?v=OhoQArU59tk&list=PLaphEhZnDpJ89OGEE1lufrBlTvAbvweak&index=11",
    category: "Art / Retro",
    year: "2022",
    description: "Hołd dla klasyki kina niemego. Czarno-białe ujęcia, ziarno i ekspresyjna gra aktorska bez ani jednego słowa.",
    credits: [
      { label: "Directed by", value: "Damian Bogdanowicz" },
      { label: "Cinematography", value: "Damian Bogdanowicz" },
      { label: "Edit & Color", value: "Damian Bogdanowicz" },
      { label: "Gear", value: "Sony FX3 + Cine Lenses" },
    ],
  },
};