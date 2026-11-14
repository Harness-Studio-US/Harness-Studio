import { Link } from "react-router-dom";
import { cn } from "../lib/cn";

const EMAIL = "HarnessStudio@Outlook.com";

export function LegalLinks({
  className,
  showContact = true,
}: {
  className?: string;
  showContact?: boolean;
}) {
  return (
    <nav
      aria-label="Legal"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-slate-400",
        className
      )}
    >
      <Link to="/privacy" className="transition hover:text-slate-700">
        Privacy Policy
      </Link>
      <span className="hidden h-2.5 w-px bg-slate-200 sm:block" aria-hidden />
      <Link to="/terms" className="transition hover:text-slate-700">
        Terms &amp; Conditions
      </Link>
      {showContact && (
        <>
          <span className="hidden h-2.5 w-px bg-slate-200 sm:block" aria-hidden />
          <a
            href={`mailto:${EMAIL}`}
            className="transition hover:text-slate-700"
            title={`Email ${EMAIL}`}
          >
            Contact
          </a>
        </>
      )}
    </nav>
  );
}
