"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { RoleList } from "@/components/dashboard/role-list";
import { PipelineView } from "@/components/dashboard/pipeline-view";
import { CreateRoleDialog } from "@/components/dashboard/create-role-dialog";
import { GemAlert, type GemAlertPayload } from "@/components/gem-alert";
import { mockCandidates, mockRoles, type Role } from "@/lib/mock-data";

const FLAGGED_GEMS = mockCandidates.filter((c) => c.isGem);

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [alert, setAlert] = useState<GemAlertPayload | null>(null);
  const [gemCount, setGemCount] = useState(
    mockRoles.reduce((sum, r) => sum + r.gemsFlagged, 0),
  );
  const [highlightCandidateId, setHighlightCandidateId] = useState<string | undefined>();

  const simulateGemAlert = () => {
    const next = FLAGGED_GEMS[Math.floor(Math.random() * FLAGGED_GEMS.length)];
    if (!next) return;
    const role = mockRoles.find((r) => r.id === next.roleId);
    setAlert({
      id: `${next.id}-${Date.now()}`,
      candidate: next.name,
      role: role?.title ?? next.roleId,
      reason: `composite ${(((next.oaScore + next.devpostScore + next.githubScore) / 3) * 100).toFixed(0)} · ${next.signals.wins} wins`,
    });
    setGemCount((g) => g + 1);
  };

  const dismissAlert = () => setAlert(null);
  const viewAlertCandidate = () => {
    if (!alert) return;
    const c = FLAGGED_GEMS.find((x) => alert.candidate === x.name);
    if (c) {
      const role = mockRoles.find((r) => r.id === c.roleId) ?? null;
      setActiveRole(role);
      setHighlightCandidateId(c.id);
    }
    setAlert(null);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          gemCount={gemCount}
          onBellClick={() =>
            toast(`${gemCount} gem alerts`, {
              description: "Inbox view coming next pass.",
            })
          }
        />

        <main className="flex-1 px-5 py-6 md:px-7">
          {activeRole ? (
            <PipelineView
              key={activeRole.id}
              role={activeRole}
              initialCandidateId={highlightCandidateId}
              onBack={() => {
                setActiveRole(null);
                setHighlightCandidateId(undefined);
              }}
            />
          ) : (
            <RoleList
              onOpen={(r) => setActiveRole(r)}
              onCreate={() => setCreateOpen(true)}
            />
          )}
        </main>
      </div>

      <CreateRoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(title) =>
          toast.success(`Role "${title}" created`, {
            description: "Devpost watcher is live. New matches will appear in your pipeline.",
          })
        }
      />

      <GemAlert alert={alert} onDismiss={dismissAlert} onView={viewAlertCandidate} />

      {/* Debug: simulate gem alert */}
      <Button
        size="sm"
        onClick={simulateGemAlert}
        className="fixed bottom-5 right-5 z-40 cursor-pointer shadow-lg"
      >
        <Sparkles className="size-3.5" />
        Simulate gem alert
      </Button>
    </div>
  );
}
