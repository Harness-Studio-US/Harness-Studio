import { Link } from "react-router-dom";
import { cn } from "../lib/cn";

const EMAIL = "message.harness.studio@outlook.com";

export function LegalLinks({
  className,
  showContact = true,
  tone = "light",
}: {
  className?: string;
  showContact?: boolean;
  tone?: "light" | "dark";
}) {
  const onDark = tone === "dark";
  return (
    <nav
      aria-label="Legal"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]",
        onDark ? "text-[#b9b2a5]" : "text-muted",
        className
      )}
    >
      <Link to="/privacy" className={cn("transition", onDark ? "hover:text-white" : "hover:text-ink")}>
        Privacy Policy
      </Link>
      <span
        className={cn("hidden h-2.5 w-px sm:block", onDark ? "bg-white/20" : "bg-[#c8c1b4]")}
        aria-hidden
      />
      <Link to="/terms" className={cn("transition", onDark ? "hover:text-white" : "hover:text-ink")}>
        Terms &amp; Conditions
      </Link>
      {showContact && (
        <>
          <span
            className={cn("hidden h-2.5 w-px sm:block", onDark ? "bg-white/20" : "bg-[#c8c1b4]")}
            aria-hidden
          />
          <a
            href={`mailto:${EMAIL}`}
            className={cn("transition", onDark ? "hover:text-white" : "hover:text-ink")}
            title={`Email ${EMAIL}`}
          >
            Contact
          </a>
        </>
      )}
    </nav>
  );
}
