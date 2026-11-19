import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { Logo, LogoMark } from "../components/Logo";
import { Nav } from "../components/marketing/Nav";
import { Footer } from "../components/marketing/Footer";
import { assetUrl } from "../lib/assets";

const palette = [
  { name: "Ink", hex: "#05060A", swatch: "#05060A" },
  { name: "Signal Cyan", hex: "#38CFFF", swatch: "#38CFFF" },
  { name: "Bolt Blue", hex: "#1D7CF5", swatch: "#1D7CF5" },
  { name: "Harness Violet", hex: "#8B2BE8", swatch: "#8B2BE8" },
  { name: "Pulse Magenta", hex: "#D21BE0", swatch: "#D21BE0" },
  { name: "Cloud", hex: "#F4F4F5", swatch: "#F4F4F5" },
];

const assets = [
  {
    name: "Primary banner",
    file: "harness-banner.png",
    path: "/brand/harness-banner.png",
    meta: "PNG · 2560 × 1440",
  },
  {
    name: "Monogram",
    file: "harness-mark.png",
    path: "/brand/harness-mark.png",
    meta: "PNG · 512 × 458",
  },
  {
    name: "Favicon",
    file: "favicon.png",
    path: "/favicon.png",
    meta: "PNG · rounded tile",
  },
];

const rules = [
  "Keep clear space around the mark equal to the height of the letter H.",
  "Never place the mark on a busy photograph; use the ink panel behind it.",
  "Never stretch, rotate, outline or recolour the ribbon gradient.",
  "The wordmark is set in Inter ExtraBold: “Harness” in ink (white on dark), “Studio” in violet.",
  "Minimum size: 20 px for the monogram, 96 px wide for the full lockup.",
];

export default function Brand() {
  useEffect(() => {
    document.title = "Brand — Harness Studio";
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />

      <main className="pb-20 pt-28 lg:pt-32">
        <div className="container-site">
          <header className="max-w-[820px] border-b border-line pb-10">
            <span className="eyebrow">Official brand &amp; press kit</span>
            <h1 className="mt-6 text-[46px] font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-[62px]">
              Harness Studio <span className="display-serif text-accent">identity.</span>
            </h1>
            <p className="mt-6 max-w-[650px] text-[16.5px] leading-[1.8] text-muted">
              The folded ribbon forms an H: two uprights moving in opposite directions, joined by
              one continuous path. Use the files below as-is. Do not redraw or recolour the mark.
            </p>
          </header>

          <section className="mt-10" aria-labelledby="brand-banner">
            <h2 id="brand-banner" className="sr-only">
              Primary banner
            </h2>
            <div className="overflow-hidden rounded-xl border border-[#2a281f] bg-[#05060a]">
              <img
                src={assetUrl("/brand/harness-banner.png")}
                alt="Official Harness Studio banner with the ribbon monogram, wordmark and Create, Build, Innovate tagline"
                className="h-auto w-full"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <a
                href={assetUrl("/brand/harness-banner.png")}
                download="harness-studio-banner.png"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-muted transition hover:text-ink"
              >
                <Download className="h-3.5 w-3.5" />
                Download banner PNG
              </a>
            </div>
          </section>

          <section className="mt-14 border-t border-line pt-10" aria-labelledby="logo-usage">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="eyebrow">01 / The mark</span>
                <h2
                  id="logo-usage"
                  className="mt-5 text-[28px] font-semibold tracking-[-0.035em] text-ink"
                >
                  One mark. Two tones.
                </h2>
                <p className="mt-3 max-w-[330px] text-[14px] leading-[1.75] text-muted">
                  The ribbon gradient is part of the mark. Use the supplied artwork rather than
                  recreating it with type or CSS.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                <div className="rounded-xl border border-line bg-surface p-7 sm:p-9">
                  <Logo markClassName="h-12 w-12" textClassName="text-[22px]" />
                  <div className="mt-9 flex items-end gap-6">
                    <LogoMark className="h-12 w-12" />
                    <LogoMark className="h-8 w-8" />
                    <LogoMark className="h-5 w-5" />
                  </div>
                  <p className="mt-7 text-[12px] text-muted">On light backgrounds</p>
                </div>

                <div className="rounded-xl border border-[#1e293b] bg-[#0f172a] p-7 sm:p-9">
                  <Logo
                    markClassName="h-12 w-12"
                    textClassName="text-[22px]"
                    tone="dark"
                  />
                  <div className="mt-9 flex items-end gap-6">
                    <LogoMark className="h-12 w-12" />
                    <LogoMark className="h-8 w-8" />
                    <LogoMark className="h-5 w-5" />
                  </div>
                  <p className="mt-7 text-[12px] text-[#b9b2a5]">On ink backgrounds</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 border-t border-line pt-10" aria-labelledby="brand-downloads">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="eyebrow">02 / Downloads</span>
                <h2
                  id="brand-downloads"
                  className="mt-5 text-[28px] font-semibold tracking-[-0.035em] text-ink"
                >
                  Press-ready files.
                </h2>
                <p className="mt-3 max-w-[320px] text-[14px] leading-[1.75] text-muted">
                  Use these files without modification for editorial, product and partnership
                  coverage.
                </p>
              </div>

              <div className="divide-y divide-line border-y border-line lg:col-span-8">
                {assets.map((asset) => (
                  <div
                    key={asset.name}
                    className="flex flex-wrap items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <div className="text-[14px] font-semibold text-ink">{asset.name}</div>
                      <div className="mt-1 font-mono text-[11.5px] text-muted">
                        {asset.file} · {asset.meta}
                      </div>
                    </div>
                    <a
                      href={assetUrl(asset.path)}
                      download={asset.file}
                      className="btn-ghost h-9 px-3.5 text-[12.5px]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 border-t border-line pt-10" aria-labelledby="brand-colour">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="eyebrow">03 / Colour</span>
                <h2
                  id="brand-colour"
                  className="mt-5 text-[28px] font-semibold tracking-[-0.035em] text-ink"
                >
                  The core palette.
                </h2>
                <p className="mt-3 max-w-[320px] text-[14px] leading-[1.75] text-muted">
                  Ink and Cloud carry the interface. The four spectrum colours belong to the ribbon
                  and appear sparingly elsewhere.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:col-span-8">
                {palette.map((color) => (
                  <div
                    key={color.name}
                    className="overflow-hidden rounded-lg border border-line bg-surface"
                  >
                    <div className="h-20" style={{ background: color.swatch }} />
                    <div className="px-3 py-2.5">
                      <div className="text-[12px] font-semibold text-ink">{color.name}</div>
                      <div className="mt-0.5 font-mono text-[11px] uppercase text-muted">
                        {color.hex}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 border-t border-line pt-10" aria-labelledby="brand-rules">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="eyebrow">04 / Use</span>
                <h2
                  id="brand-rules"
                  className="mt-5 text-[28px] font-semibold tracking-[-0.035em] text-ink"
                >
                  Keep it intact.
                </h2>
              </div>

              <div className="lg:col-span-8">
                <ul className="divide-y divide-line border-y border-line">
                  {rules.map((rule, index) => (
                    <li key={rule} className="flex gap-5 py-4 text-[14px] leading-[1.7] text-ink-soft">
                      <span className="mt-0.5 shrink-0 font-mono text-[11px] text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {rule}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-col justify-between gap-4 rounded-lg border border-line bg-surface p-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-[14px] font-semibold text-ink">
                      Need something custom?
                    </div>
                    <p className="mt-1 max-w-[480px] text-[13px] leading-[1.7] text-muted">
                      For co-marketing, screenshots or a talk, tell us the context and we will help
                      with the right asset.
                    </p>
                  </div>
                  <a
                    href="mailto:message.harness.studio@outlook.com?subject=Harness%20Studio%20brand%20request"
                    className="btn-primary h-10 shrink-0 px-4 text-[12.5px]"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Contact the company
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-[12px] text-muted">
            <span>Harness Studio brand resources</span>
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-ink">
              Back to the company
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
