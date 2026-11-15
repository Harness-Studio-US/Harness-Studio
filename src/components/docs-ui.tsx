import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

type Section = { id: string; label: string };

export function DocsSidebar({ sections, active }: { sections: Section[]; active: string }) {
  return (
    <nav aria-label="On this page" className="space-y-0.5">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            "block border-l-2 py-1.5 pl-3 pr-2 text-[13px] leading-snug transition",
            active === section.id
              ? "border-accent bg-[#eae5dc] font-medium text-ink"
              : "border-transparent text-muted hover:border-[#c8c1b4] hover:text-ink"
          )}
        >
          {section.label}
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
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-8% 0px -78% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [ids.join(",")]);

  return active;
}
