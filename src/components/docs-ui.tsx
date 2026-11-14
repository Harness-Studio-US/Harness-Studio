import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

type Section = { id: string; label: string };

export function DocsSidebar({ sections, active }: { sections: Section[]; active: string }) {
  return (
    <nav className="space-y-0.5">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={cn(
            "block rounded-md border-l-2 px-3 py-1.5 text-[13px] transition",
            active === s.id
              ? "border-violet-500 bg-slate-100 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}

export function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-8% 0px -78% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
