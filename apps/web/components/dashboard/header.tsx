"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">대체자산 포트폴리오</h2>
        <Badge variant="outline" className="text-xs">
          Demo
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {/* 알림 */}
        <Button variant="ghost" size="sm" className="relative">
          <span className="text-base">🔔</span>
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--destructive)] text-[9px] text-[var(--destructive-foreground)]">
            3
          </span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* 사용자 */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-medium">
            관
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">관리자</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">
              admin@egasset.com
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
