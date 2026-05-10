"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Gem, Radar, Send, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { RoleList } from "@/components/dashboard/role-list";
import { PipelineView } from "@/components/dashboard/pipeline-view";
import { CreateRoleDialog } from "@/components/dashboard/create-role-dialog";
import { GemAlert, type GemAlertPayload } from "@/components/gem-alert";
import { JourneySteps, defaultJourneySteps, type JourneyStep } from "@/components/journey-steps";
import { KpiStrip } from "@/components/kpi-strip";
import { type Candidate, type Role } from "@/lib/mock-data";
import { fetchRoles, fetchGems } from "@/lib/api";

export default function DashboardPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [gems, setGems] = useState<Candidate[]>([]);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [alert, setAlert] = useState<GemAlertPayload | null>(null);
  const [highlightCandidateId, setHighlightCandidateId] = useState<string | undefined>();

  useEffect(() => {
    fetchRoles().then(setRoles).catch(console.error);
    fetchGems().then(setGems).catch(console.error);
  }, []);

  const totalGems = useMemo(() => roles.reduce((sum, r) => sum + r.gemsFlagged, 0), [roles]);
  const totalCandidates = useMemo(
    () => roles.reduce((sum, r) => sum + r.candidatesInPipeline, 0),
    [roles],
  );
  const totalOAs = useMemo(() => roles.reduce((sum, r) => sum + r.oasOut, 0), [roles]);
  const [gemCount, setGemCount] = useState(0);

  useEffect(() => {
    setGemCount(totalGems);
  }, [totalGems]);

  const journey: JourneyStep[] = useMemo(
    () => [
      {
        ...defaultJourneySteps[0],
        status: "done",
      },
      {
        ...defaultJourneySteps[1],
        status: "active",
        cta: (
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer gap-1.5"
            onClick={() => roles[0] && setActiveRole(roles[0])}
          >
            <Radar className="size-3.5" />
            Open the pipeline
          </Button>
        ),
      },
      {
        ...defaultJourneySteps[2],
        status: "todo",
      },
    ],
    [roles],
  );

  const simulateGemAlert = () => {
    const next = gems[Math.floor(Math.random() * gems.length)];
    if (!next) return;
    const role = roles.find((r) => r.id === next.roleId);
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
    const c = gems.find((x) => alert.candidate === x.name);
    if (c) {
      const role = roles.find((r) => r.id === c.roleId) ?? null;
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
          <AnimatePresence mode="wait" initial={false}>
            {activeRole ? (
              <motion.section
                key={`role-${activeRole.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <PipelineView
                  role={activeRole}
                  initialCandidateId={highlightCandidateId}
                  onBack={() => {
                    setActiveRole(null);
                    setHighlightCandidateId(undefined);
                  }}
                />
              </motion.section>
            ) : (
              <motion.section
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Page header */}
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Welcome back, Maya
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Here&apos;s what your watcher caught while you were away.
                    </p>
                  </div>
                  <Button
                    onClick={() => setCreateOpen(true)}
                    className="cursor-pointer gap-2"
                  >
                    <Sparkles className="size-3.5" />
                    Create role
                  </Button>
                </div>

                <KpiStrip
                  items={[
                    {
                      label: "Candidates in pipeline",
                      value: totalCandidates,
                      icon: Users,
                      delta: { value: 6, period: "this week" },
                      trend: [12, 14, 17, 19, 22, 24, 26, totalCandidates],
                    },
                    {
                      label: "Gems flagged",
                      value: totalGems,
                      icon: Gem,
                      tone: "success",
                      delta: { value: 1, period: "today" },
                      trend: [0, 1, 1, 2, 2, 2, 3, totalGems],
                    },
                    {
                      label: "OAs sent",
                      value: totalOAs,
                      icon: Send,
                      tone: "info",
                      delta: { value: 4, period: "this week" },
                      trend: [4, 5, 7, 9, 10, 11, 12, totalOAs],
                    },
                    {
                      label: "Open roles",
                      value: roles.length,
                      icon: Briefcase,
                      delta: { value: 0, period: "no change" },
                      trend: [3, 3, 3, 3, 3, 3, 3, 3],
                    },
                  ]}
                />

                <JourneySteps steps={journey} />

                <RoleList
                  roles={roles}
                  onOpen={(r) => setActiveRole(r)}
                  onCreate={() => setCreateOpen(true)}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>

      <CreateRoleDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(title) =>
          toast.success(`Role "${title}" created`, {
            description: "Watcher is live. New matches will appear shortly.",
          })
        }
      />

      <GemAlert alert={alert} onDismiss={dismissAlert} onView={viewAlertCandidate} />

      {/* Demo trigger — flat, framed as utility */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 shadow-sm">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          demo
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={simulateGemAlert}
          className="cursor-pointer gap-1.5 h-7 px-2 text-xs"
        >
          <Gem className="size-3" />
          Simulate gem
        </Button>
      </div>
    </div>
  );
}
