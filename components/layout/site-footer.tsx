import Link from "next/link";
import { Container } from "@/components/ui/container";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?category=CLOTHING", label: "Clothing" },
      { href: "/shop?category=ACCESSORIES", label: "Accessories" },
    ],
  },
  {
    title: "Browse",
    links: [
      { href: "/shop?sort=newest", label: "New arrivals" },
      { href: "/#editorial", label: "Editorial" },
      { href: "/#newsletter", label: "Newsletter" },
    ],
  },
] as const;

const STUDIO = [
  ["Studio", "Lagos · London"],
  ["Hours", "Mon–Fri, 9:00–18:00 GMT"],
  ["Enquiries", "studio@aurel-ash.com"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-stone bg-bone-deep">
      <Container width="wide" className="py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <p className="text-[14px] font-semibold tracking-[0.26em]">
              AUREL <span className="text-brass-ink">&amp;</span> ASH
            </p>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-ink-soft">
              Designed for the everyday. Considered essentials in heavyweight cotton and
              washed canvas, made in limited runs and built to outlast the season.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[11px] tracking-[0.2em] text-ash uppercase">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="underline-sweep text-[13px] text-ink transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-[11px] tracking-[0.2em] text-ash uppercase">Studio</h2>
            <dl className="mt-5 space-y-3">
              {STUDIO.map(([term, value]) => (
                <div key={term} className="flex flex-col gap-0.5">
                  <dt className="text-[10px] tracking-[0.16em] text-ash uppercase">{term}</dt>
                  <dd className="text-[13px] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-stone pt-8 text-[11px] tracking-[0.12em] text-ash uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Aurel &amp; Ash</p>
          <p>Fictional brand built as a demonstration project</p>
        </div>
      </Container>
    </footer>
  );
}