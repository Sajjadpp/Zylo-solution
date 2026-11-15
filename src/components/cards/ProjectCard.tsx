import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import type { ProjectDoc } from "@/types";

export function ProjectCard({ project, priority }: { project: ProjectDoc; priority?: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-card/60 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
    >
      <div className="relative">
        <CoverImage
          src={project.coverImage}
          alt={`${project.title} – ${project.industry} project in ${project.country}`}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="aspect-[16/10] transition duration-500 group-hover:scale-[1.02]"
        />
        {project.sample && (
          <span className="absolute left-4 top-4 rounded-full border border-ink/15 bg-bg/70 px-2.5 py-1 text-[11px] font-semibold text-ink/90 backdrop-blur">
            Sample case study
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs font-medium text-hl">
          {project.industry}
          <span className="text-muted">·</span>
          <span className="inline-flex items-center gap-1 text-muted">
            <MapPin className="h-3 w-3" aria-hidden /> {project.country}
          </span>
        </p>
        <h3 className="mt-3 text-lg font-semibold leading-snug">{project.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/90 group-hover:text-hl">
          Read case study <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
