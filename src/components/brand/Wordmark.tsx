import { cn } from "@/lib/utils";

const LETTERS = "Zylo".split("");

/**
 * Live-text version of the Zylo logo: bold "Zylo" with the yellow dot.
 * Colour follows the theme (black on light, white inside .theme-dark). All sizing is em-based,
 * so the header logo and the intro overlay are exact scaled copies (the intro flies one onto the other).
 */
export function Wordmark({ className, as: Tag = "span" }: { className?: string; as?: "span" | "div" }) {
  return (
    <Tag
      className={cn("inline-flex select-none items-baseline font-display font-bold leading-none tracking-[-0.035em] text-ink", className)}
      aria-label="Zylo Solution"
      role="img"
    >
      {LETTERS.map((ch, i) => (
        <span key={i} data-wm-letter aria-hidden className="inline-block" style={{ "--i": i } as React.CSSProperties}>
          {ch}
        </span>
      ))}
      <span
        data-wm-letter
        data-wm-dot
        aria-hidden
        className="ml-[0.05em] inline-block h-[0.25em] w-[0.25em] rounded-full bg-accent"
      />
    </Tag>
  );
}
