import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/** Server-rendered markdown (raw HTML is not allowed, so admin content can't inject scripts). */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-zylo", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, ...props }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...props} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
          // demote stray h1s – the page already has one
          h1: ({ children }) => <h2>{children}</h2>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
