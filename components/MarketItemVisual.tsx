type Props = {
  name: string;
  imageUrl?: string | null;
  compact?: boolean;
};

function initials(name: string) {
  const cleaned = name
    .replace(/^\+\d+\s+/, "")
    .replace(/\([^)]*\)/g, "")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "OF";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function MarketItemVisual({ name, imageUrl, compact = false }: Props) {
  return (
    <span
      className={compact ? "itemVisual itemVisualCompact" : "itemVisual"}
      aria-label={imageUrl ? `Imagem de ${name}` : `Imagem indisponível para ${name}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} loading="lazy" />
      ) : (
        <>
          <span className="itemVisualRune">{initials(name)}</span>
          <span className="itemVisualGlow" />
        </>
      )}
    </span>
  );
}
