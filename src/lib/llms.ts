import "server-only";
import { getPosts, getProducts, getProjects, getServices, getSettings } from "@/lib/content";
import { SITE, absoluteUrl } from "@/lib/site";
import { stripMarkdown } from "@/lib/utils";
import { homeFaqs } from "@/data/home";

/** Builds /llms.txt (summary) and /llms-full.txt (full content) for generative engines. */
export async function buildLlms(full: boolean) {
  const [services, products, projects, posts, s] = await Promise.all([
    getServices(),
    getProducts(),
    getProjects(),
    getPosts(),
    getSettings(),
  ]);

  const out: string[] = [];
  out.push(`# ${SITE.name}`);
  out.push("");
  out.push(
    `> ${SITE.name} is an ERP and software company headquartered in Manama, Bahrain, serving businesses across the GCC (Bahrain, United Arab Emirates, Saudi Arabia, Kuwait, Qatar and Oman). It specialises in Odoo ERP implementation, barcode inventory systems, offline van sales software, custom accounting software, website development and mobile application development. ${s.stats.years}+ years of experience, ${s.stats.projects}+ projects delivered.`,
  );
  out.push("");
  out.push("## Contact (NAP)");
  out.push(`- Name: ${SITE.name}`);
  out.push(`- Address: ${s.address}`);
  out.push(`- Phone / WhatsApp: ${s.phone}`);
  out.push(`- Email: ${s.email}`);
  out.push(`- Hours: ${s.hours}`);
  out.push(`- Website: ${SITE.url}`);
  out.push(`- Book a demo: ${absoluteUrl("/book-demo")}`);
  out.push("");

  out.push("## Services");
  for (const x of services) {
    out.push(`- [${x.title}](${absoluteUrl(`/services/${x.slug}`)}): ${x.summary || x.shortDescription}`);
  }
  out.push("");
  out.push("## Products");
  for (const x of products) {
    out.push(`- [${x.title}](${absoluteUrl(`/products/${x.slug}`)}): ${x.summary || x.shortDescription} Key features: ${x.chips.join(", ")}.`);
  }
  out.push("");
  out.push("## Key pages");
  out.push(`- [Home](${absoluteUrl("/")})`);
  out.push(`- [About](${absoluteUrl("/about")})`);
  out.push(`- [Our Work / case studies](${absoluteUrl("/work")})`);
  out.push(`- [Blog](${absoluteUrl("/blog")})`);
  out.push(`- [Contact](${absoluteUrl("/contact")})`);
  out.push(`- [Full content for LLMs](${absoluteUrl("/llms-full.txt")})`);
  out.push("");
  out.push("## Articles");
  for (const p of posts) out.push(`- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`);
  out.push("");

  if (!full) return out.join("\n");

  out.push("---");
  out.push("");
  out.push("## Frequently asked questions");
  for (const f of homeFaqs) out.push(`Q: ${f.q}\nA: ${f.a}\n`);

  for (const x of [...services, ...products]) {
    const kind = "chips" in x ? "products" : "services";
    out.push(`## ${x.title}`);
    out.push(`URL: ${absoluteUrl(`/${kind}/${x.slug}`)}`);
    out.push("");
    out.push(x.summary);
    out.push("");
    if (x.audience.length) out.push(`Who it is for: ${x.audience.join("; ")}.`);
    if (x.features.length) out.push(`Features: ${x.features.join("; ")}.`);
    if (x.benefits.length) out.push(`Benefits: ${x.benefits.join("; ")}.`);
    out.push("");
    out.push(stripMarkdown(x.longDescription));
    out.push("");
    for (const f of x.faqs) out.push(`Q: ${f.q}\nA: ${f.a}\n`);
  }

  out.push("## Case studies");
  for (const p of projects) {
    out.push(`### ${p.title}${p.sample ? " (sample)" : ""}`);
    out.push(`URL: ${absoluteUrl(`/work/${p.slug}`)} | Industry: ${p.industry} | Country: ${p.country} | Year: ${p.year}`);
    out.push(`Challenge: ${p.challenge}`);
    out.push(`Solution: ${p.solution}`);
    out.push(`Results: ${p.results.join("; ")}`);
    out.push("");
  }

  out.push("## Articles (full text)");
  for (const p of posts) {
    out.push(`### ${p.title}`);
    out.push(`URL: ${absoluteUrl(`/blog/${p.slug}`)} | Published: ${new Date(p.publishedAt).toISOString().slice(0, 10)}`);
    out.push("");
    out.push(stripMarkdown(p.content));
    out.push("");
    for (const f of p.faqs) out.push(`Q: ${f.q}\nA: ${f.a}\n`);
  }

  return out.join("\n");
}
