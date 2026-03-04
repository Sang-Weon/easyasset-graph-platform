"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "대시보드",
    href: "/dashboard",
    icon: "📊",
    description: "포트폴리오 현황",
  },
  {
    label: "리스크 모니터",
    href: "/dashboard/risk-monitor",
    icon: "🔍",
    description: "실시간 리스크 분석",
  },
  {
    label: "Covenant EWS",
    href: "/dashboard/covenant-ews",
    icon: "⚠️",
    description: "약정 조기경보",
  },
  {
    label: "연쇄부도 시뮬레이션",
    href: "/dashboard/contagion-sim",
    icon: "🔗",
    description: "Contagion 분석",
  },
  {
    label: "PE Peer 매칭",
    href: "/dashboard/peer-matching",
    icon: "🎯",
    description: "동종업체 비교",
  },
  {
    label: "문서 관리",
    href: "/dashboard/documents",
    icon: "📄",
    description: "문서 업로드 & NER",
  },
  {
    label: "AI 챗봇",
    href: "/dashboard/chat",
    icon: "💬",
    description: "자연어 그래프 쿼리",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--card)]">
      {/* 로고 */}
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-sm text-[var(--primary-foreground)]">
          EG
        </div>
        <div>
          <p className="text-sm font-semibold">EG Asset Pricing</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">
            Data Platform
          </p>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
                  )}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 정보 */}
      <div className="border-t border-[var(--border)] p-4">
        <div className="rounded-lg bg-[var(--muted)] p-3">
          <p className="text-xs font-medium">EG Asset Pricing</p>
          <p className="text-[10px] text-[var(--muted-foreground)]">
            대체자산 AI 데이터 플랫폼 v0.1
          </p>
        </div>
      </div>
    </aside>
  );
}
