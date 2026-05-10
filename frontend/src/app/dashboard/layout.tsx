import type { ReactNode } from "react";
import { DemoBanner } from "@/components/editorial/demo-banner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
