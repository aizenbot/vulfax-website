import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  align?: "start" | "center";
  className?: string;
}

export function Eyebrow({ children, className }: { children: string; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.22em] text-cyan/90 uppercase rtl:tracking-normal",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-gradient-to-r from-cyan to-primary rtl:bg-gradient-to-l" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, description, id, align = "start", className }: SectionHeadingProps) {
  return (
    <Reveal
      as="header"
      className={cn(
        "flex max-w-2xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="font-display text-headline font-semibold text-fg">
        {title}
      </h2>
      {description ? <p className="max-w-xl text-base text-muted sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}
