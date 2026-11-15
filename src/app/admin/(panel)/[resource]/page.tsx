import { notFound } from "next/navigation";
import { ResourceList } from "@/components/admin/ResourceList";
import { ADMIN_RESOURCES } from "@/lib/admin-config";

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const config = ADMIN_RESOURCES[(await params).resource];
  if (!config) notFound();
  return <ResourceList config={config} />;
}
