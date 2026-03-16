interface FilmPageProps {
  params: Promise<{ slug: string }>;
}

const prettyTitle = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default async function FilmPage({ params }: FilmPageProps) {
  const { slug } = await params;
  const title = prettyTitle(slug);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#e8e4df",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ letterSpacing: "6px", textTransform: "uppercase", color: "#8b1a1a", marginBottom: "16px" }}>
          Film Detail
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "HelveticaCustom",
            fontSize: "clamp(36px, 7vw, 86px)",
            lineHeight: 0.95,
            textTransform: "uppercase",
          }}
        >
          {title}
        </h1>
      </div>
    </main>
  );
}
