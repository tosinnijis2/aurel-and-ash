const ITEMS = [
  "Heavyweight cotton",
  "Limited runs",
  "Made to outlast",
  "Free shipping over $150",
  "Designed for the everyday",
] as const;

export function Marquee() {
  // Rendered twice so the -50% translation loops without a visible seam.
  const strip = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-b border-stone bg-bone-deep py-4 select-none"
    >
      <div className="marquee-track flex w-max">
        {strip.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-8 pr-8 text-[11px] tracking-[0.24em] whitespace-nowrap text-ink-soft uppercase"
          >
            {item}
            <span className="text-[8px] text-brass">&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}