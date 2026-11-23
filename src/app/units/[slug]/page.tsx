import { UnitDetail } from "@/components/unit-detail";
import { Suspense } from "react";
export const instant = false;
export default function UnitDetailPage() { return <Suspense fallback={<main className="inner-page" />}><UnitDetail /></Suspense>; }
