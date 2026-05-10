"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateRoleDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (title: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [stack, setStack] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Sniper turns this into a weighted scoring rubric. You can tune weights from the
            pipeline view.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="role-title" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Role title
            </Label>
            <Input
              id="role-title"
              placeholder="Senior Frontend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-team" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Team
            </Label>
            <Input
              id="role-team"
              placeholder="Platform · Models · Design"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-stack" className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Stack signals (comma separated)
            </Label>
            <Input
              id="role-stack"
              placeholder="React, Next.js, TypeScript"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!title.trim()}
            className="cursor-pointer gap-1.5"
            onClick={() => {
              onCreated(title.trim());
              onOpenChange(false);
              setTitle("");
              setTeam("");
              setStack("");
            }}
          >
            <Sparkles className="size-3.5" />
            Create role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
