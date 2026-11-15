/** Renders one or more JSON-LD blocks. `<` is escaped so content can never break out of the script tag. */
export function JsonLd({ data }: { data: unknown | unknown[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
