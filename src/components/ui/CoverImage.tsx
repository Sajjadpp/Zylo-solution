import Image from "next/image";
import { cn } from "@/lib/utils";

/** next/image wrapper for local (/images/*) and Cloudinary URLs; falls back to a branded gradient. */
export function CoverImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const ok = src && (src.startsWith("/") || src.startsWith("https://res.cloudinary.com/"));
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br from-primary/30 via-surface to-accent/10", className)}>
      {ok ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={src.endsWith(".svg")}
          className="object-cover"
        />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL pasted in admin
        <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
      )}
    </div>
  );
}
