import { useEffect } from "react";
import { ArrowLeft, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo, LogoMark } from "../components/Logo";
import { LegalLinks } from "../components/LegalLinks";
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
  { name: "Primary banner", file: "harness-banner.svg", path: "/brand/harness-banner.svg", meta: "SVG · 1600 × 520" },
  { name: "Monogram", file: "harness-mark.svg", path: "/brand/harness-mark.svg", meta: "SVG · 256 × 256" },
  { name: "Favicon", file: "favicon.svg", path: "/favicon.svg", meta: "SVG · rounded tile" },
];

export default function Brand() {
  useEffect(() => {
    document.title = "Brand — Harness Studio";
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f6]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-[#f8f8f6]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link to="/" aria-label="Harness Studio home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
            <Link to="/console" className="btn-primary h-8 px-3.5 text-[12px]">
              Try the demo
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10.5px] text-slate-600">
            <Sparkles className="h-3 w-3 text-violet-600" />
            Official brand &amp; press kit
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Harness Studio identity.
          </h1>
          <p className="mt-4 text-[14px] leading-[1.8] text-slate-600">
            The folded ribbon forms an H — two uprights moving in opposite directions, joined by one
            continuous path. Use the files below as-is; don&apos;t redraw or recolor the mark.
          </p>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
          <img
            src={assetUrl("/brand/harness-banner.svg")}
            alt="Harness Studio banner with monogram and Create, Build, Innovate tagline"
            className="h-auto w-full"
          />
        </section>
        <div className="mt-2 flex justify-end">
          <a
            href={assetUrl("/brand/harness-banner.svg")}
            download="harness-studio-banner.svg"
            className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-600 hover:text-slate-900"
          >
            <Download className="h-3 w-3" />
            Download banner SVG
          </a>
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <Logo markClassName="h-12 w-12" />
            <div className="mt-7 flex items-center gap-5">
              <LogoMark className="h-12 w-12" />
              <LogoMark className="h-8 w-8" />
              <LogoMark className="h-5 w-5" />
            </div>
            <p className="mt-6 text-[11px] text-slate-500">On light backgrounds</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-8 shadow-sm">
            <Logo markClassName="h-12 w-12" tone="dark" />
            <div className="mt-7 flex items-center gap-5">
              <LogoMark className="h-12 w-12" />
              <LogoMark className="h-8 w-8" />
              <LogoMark className="h-5 w-5" />
            </div>
            <p className="mt-6 text-[11px] text-slate-400">On ink backgrounds</p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">Downloads</h2>
          <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
            {assets.map((asset) => (
              <div key={asset.name} className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3">
                <div>
                  <div className="text-[12.5px] font-medium text-slate-800">{asset.name}</div>
                  <div className="font-mono text-[10px] text-slate-400">
                    {asset.file} · {asset.meta}
                  </div>
                </div>
                <a
                  href={assetUrl(asset.path)}
                  download={asset.file}
                  className="btn-ghost h-8 px-3 text-[11.5px]"
                >
                  <Download className="h-3 w-3" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Colour</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {palette.map((color) => (
                <div key={color.name} className="overflow-hidden rounded-lg border border-slate-200">
                  <div className="h-16" style={{ background: color.swatch }} />
                  <div className="bg-white px-2.5 py-2">
                    <div className="text-[10.5px] font-medium text-slate-700">{color.name}</div>
                    <div className="font-mono text-[9.5px] uppercase text-slate-400">{color.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Rules of use</h2>
            <ul className="mt-4 space-y-3 text-[12px] leading-relaxed text-slate-600">
              {[
                "Keep clear space around the mark equal to the height of the letter H.",
                "Never place the mark on a busy photograph; use the ink panel behind it.",
                "Never stretch, rotate, outline or recolor the ribbon gradient.",
                "The wordmark is set in Inter ExtraBold: “Harness” in ink (white on dark), “Studio” in violet.",
                "Minimum size: 20 px for the monogram, 96 px wide for the full lockup.",
              ].map((rule) => (
                <li key={rule} className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="text-[11px] font-medium text-slate-700">Need something custom?</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                For co-marketing, screenshots or a talk, write to HarnessStudio@Outlook.com and tell
                us the context.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} Harness Studio, Inc.</span>
          <div className="flex flex-wrap items-center gap-4">
            <LegalLinks />
            <span className="hidden h-3 w-px bg-slate-200 sm:block" />
            <span className="font-mono">Create · Build · Innovate</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
