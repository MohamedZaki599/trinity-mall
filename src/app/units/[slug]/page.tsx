import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { UnitDetail } from "@/components/unit-detail";
import { units } from "@/content/project";

// Unknown slugs must return a real 404, so this route blocks instead of streaming a shell.
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const unit = units.find((item) => item.slug === slug);
  if (!unit) return { title: "Space" };

  return {
    title: unit.title,
    description: unit.description,
    alternates: { canonical: `/units/${unit.slug}` },
  };
}

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Rendered on demand so an unknown slug returns a real 404 status.
  await connection();

  const { slug } = await params;
  const unit = units.find((item) => item.slug === slug);
  if (!unit) notFound();

  return <UnitDetail unit={unit} />;
}
