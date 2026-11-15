import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ADMIN_RESOURCES } from "@/lib/admin-config";

export default async function ResourceEditPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  const config = ADMIN_RESOURCES[resource];
  if (!config) notFound();
  return <ResourceForm key={id} config={config} id={id} />;
}
