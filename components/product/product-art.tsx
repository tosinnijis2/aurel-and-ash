import type { ReactNode } from "react";
import type { ProductSilhouette, ProductTone } from "@/lib/products";

/**
 * Technical flats stand in for photography until a real shoot exists.
 *
 * Each garment is drawn once and reused at two crops, so a card can cross-fade
 * between a "front" and a "detail" view the way a photo set would. When real
 * imagery arrives this component is replaced by next/image and nothing that
 * consumes it changes shape.
 */

interface Palette {
  readonly background: string;
  readonly fill: string;
  readonly line: string;
}

const TONES: Record<ProductTone, Palette> = {
  bone: { background: "#f6f3ee", fill: "#e3ddd2", line: "#bfb6a4" },
  chalk: { background: "#eeeae3", fill: "#dad3c6", line: "#b6ab98" },
  sand: { background: "#e9e2d6", fill: "#d4c9ba", line: "#ab9c85" },
  stone: { background: "#e0dad0", fill: "#c9c0b2", line: "#a1957f" },
  ash: { background: "#d2cabc", fill: "#b7ad9c", line: "#948872" },
};

interface Garment {
  readonly body: string;
  /** Secondary filled shape (cap brim, tote handles) drawn behind the body. */
  readonly behind?: string;
  /** Stroked construction lines: seams, ribbing, hardware. */
  readonly details: ReactNode;
  /** Transform that crops and magnifies the area of interest for the detail view. */
  readonly detailTransform: string;
}

const strokeProps = {
  fill: "none",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const GARMENTS: Record<ProductSilhouette, Garment> = {
  hoodie: {
    behind:
      "M200 30C154 30 130 66 132 106c1 18 11 26 15 35 21 11 85 11 106 0 4-9 14-17 15-35 2-40-22-76-68-76Z",
    body:
      "M150 118c-12 6-30 14-44 24l-50 66 40 98 44-44v190c0 12 10 22 22 22h76c12 0 22-10 22-22V262l44 44 40-98-50-66c-14-10-32-18-44-24-6 20-24 30-50 30s-44-10-50-30Z",
    details: (
      <>
        <path d="M150 118c6 20 24 30 50 30s44-10 50-30" {...strokeProps} />
        <path d="M186 150l-4 72M214 150l4 72" {...strokeProps} />
        <path d="M158 336h84l-2 68q-40 16-80 0Z" {...strokeProps} />
        <path d="M158 336l16 32M242 336l-16 32" {...strokeProps} />
        <path d="M143 459h114M144 450h112" {...strokeProps} />
        <path d="M66 214l40 98M334 214l-40 98" {...strokeProps} />
        <path d="M132 106c1 18 11 26 15 35M268 106c-1 18-11 26-15 35" {...strokeProps} />
      </>
    ),
    detailTransform: "translate(-264 -132) scale(2.2)",
  },

  tee: {
    body:
      "M152 104c-12 4-30 10-44 18l-50 44 38 68 44-32v232c0 12 10 22 22 22h76c12 0 22-10 22-22V202l44 32 38-68-50-44c-14-8-32-14-44-18-8 24-32 36-48 36s-40-12-48-36Z",
    details: (
      <>
        <path d="M152 104c8 24 32 36 48 36s40-12 48-36" {...strokeProps} />
        <path d="M162 110c6 16 24 24 38 24s32-8 38-24" {...strokeProps} />
        <path d="M143 441h114" {...strokeProps} />
        <path d="M72 180l36 62M328 180l-36 62" {...strokeProps} />
      </>
    ),
    detailTransform: "translate(-286 -198) scale(2.2)",
  },

  cap: {
    behind:
      "M114 264c-12 24-16 48 0 62 28 26 144 26 172 0 16-14 12-38 0-62Z",
    body: "M114 264c-2-100 36-154 86-154s88 54 86 154Z",
    details: (
      <>
        <path d="M200 110v154" {...strokeProps} />
        <path d="M152 122c-16 46-20 96-18 140M248 122c16 46 20 96 18 140" {...strokeProps} />
        <path d="M117 250h168" {...strokeProps} />
        <path d="M117 268c43 12 123 12 166 0" {...strokeProps} />
        <circle cx="168" cy="200" r="4" fill="currentColor" stroke="none" opacity="0.45" />
        <circle cx="232" cy="200" r="4" fill="currentColor" stroke="none" opacity="0.45" />
        <circle cx="200" cy="104" r="9" fill="currentColor" stroke="none" opacity="0.45" />
      </>
    ),
    detailTransform: "translate(-242 -209) scale(2.2)",
  },

  tote: {
    behind:
      "M148 178c0-78 46-78 46 0M206 178c0-78 46-78 46 0",
    body: "M96 170h208l14 276H82Z",
    details: (
      <>
        <path d="M92 192h216" {...strokeProps} />
        <path d="M88 436h224M90 426h220" {...strokeProps} />
        <path d="M104 202l-12 216M296 202l12 216" {...strokeProps} />
        <path d="M174 268h52v28h-52Z" {...strokeProps} />
        <path d="M188 282h24" {...strokeProps} />
      </>
    ),
    detailTransform: "translate(-242 -198) scale(2.2)",
  },

  crewneck: {
    body:
      "M150 122c-12 6-30 14-44 24l-50 66 40 98 44-44v182c0 12 10 22 22 22h76c12 0 22-10 22-22V266l44 44 40-98-50-66c-14-10-32-18-44-24-4 24-24 36-50 36s-46-12-50-36Z",
    details: (
      <>
        <path d="M150 122c4 26 24 38 50 38s46-12 50-38" {...strokeProps} />
        <path d="M159 126c4 18 20 26 41 26s37-8 41-26" {...strokeProps} />
        <path d="M153 128l43 72M247 128l-43 72" {...strokeProps} />
        <path d="M143 456h114M144 446h112" {...strokeProps} />
        <path d="M66 218l40 98M334 218l-40 98" {...strokeProps} />
      </>
    ),
    detailTransform: "translate(-310 -241) scale(2.3)",
  },
};

export function ProductArt({
  silhouette,
  tone,
  view = "front",
  className,
}: {
  silhouette: ProductSilhouette;
  tone: ProductTone;
  view?: "front" | "detail";
  className?: string;
}) {
  const garment = GARMENTS[silhouette];
  const palette = TONES[tone];

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect width="400" height="500" fill={palette.background} />
      <g
        transform={view === "detail" ? garment.detailTransform : undefined}
        stroke={palette.line}
      >
        {garment.behind ? (
          <path d={garment.behind} fill={palette.fill} strokeWidth={2} strokeLinejoin="round" />
        ) : null}
        <path d={garment.body} fill={palette.fill} strokeWidth={2} strokeLinejoin="round" />
        <g opacity={0.8}>{garment.details}</g>
      </g>
    </svg>
  );
}