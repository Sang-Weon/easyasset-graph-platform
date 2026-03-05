"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Company {
  company_id: string;
  name: string;
  credit_rating: string;
}

interface ContagionPath {
  company: string;
  project: string;
  tranche_seniority: string;
  tranche_principal: number;
  recovery_rate: number;
  fund: string;
  fund_nav: number;
}

interface ContagionSummary {
  company: string;
  affected_projects: number;
  affected_tranches: number;
  affected_funds: number;
  total_exposure: number;
  estimated_loss: number;
}

interface SimulationResult {
  paths: ContagionPath[];
  exposure: Array<{
    fund: string;
    nav: number;
    loss_estimate: number;
    nav_impact_pct: number;
  }>;
  summary: ContagionSummary;
}

function seniorityBadge(seniority: string) {
  const map: Record<string, string> = {
    SENIOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    MEZZANINE:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    JUNIOR:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    EQUITY: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };
  return (
    <Badge variant="secondary" className={map[seniority] ?? ""}>
      {seniority}
    </Badge>
  );
}

function formatKRW(value: number): string {
  const eok = Math.round(value / 100000000);
  if (eok >= 10000) return `₩ ${(eok / 10000).toFixed(1)}조`;
  return `₩ ${eok.toLocaleString()}억`;
}

export default function ContagionSimPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // 시공사 목록 로드
  useEffect(() => {
    fetch("/api/contagion")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setCompanies(res.data);
          if (res.data.length > 0) setSelectedId(res.data[0].company_id);
          setIsDemo(res.demo ?? false);
        }
      })
      .catch(console.error);
  }, []);

  const runSimulation = async () => {
    if (!selectedId || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/contagion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: selectedId }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
        setIsDemo(json.demo ?? false);
      }
    } catch (e) {
      console.error("시뮬레이션 오류:", e);
    } finally {
      setLoading(false);
    }
  };

  // 경로를 프로젝트별로 그룹화
  const groupedPaths = result
    ? Object.values(
        result.paths.reduce(
          (acc, p) => {
            if (!acc[p.project])
              acc[p.project] = { project: p.project, tranches: [] };
            acc[p.project].tranches.push(p);
            return acc;
          },
          {} as Record<
            string,
            { project: string; tranches: ContagionPath[] }
          >
        )
      )
    : [];

  const selected = companies.find((c) => c.company_id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">연쇄부도 시뮬레이션</h1>
          {isDemo && (
            <Badge variant="outline" className="text-[10px]">
              Demo
            </Badge>
          )}
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          시공사 부도 시 PF → 트렌치 → 펀드로 전파되는 리스크 경로를 분석합니다
        </p>
      </div>

      {/* 시뮬레이션 컨트롤 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">시뮬레이션 설정</CardTitle>
          <CardDescription>
            부도 시나리오를 설정하고 영향을 분석합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium">부도 대상 시공사</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-1 flex h-10 w-full items-center rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm"
              >
                {companies.map((c) => (
                  <option key={c.company_id} value={c.company_id}>
                    {c.name} ({c.credit_rating})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label className="text-sm font-medium">회수율 가정</label>
              <div className="mt-1 flex h-10 items-center rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
                기본값
              </div>
            </div>
            <Button onClick={runSimulation} disabled={loading || !selectedId}>
              {loading ? "분석 중..." : "시뮬레이션 실행"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 결과 요약 */}
      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold">
                  {result.summary.affected_projects}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  영향 PF
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold">
                  {result.summary.affected_tranches}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  영향 트렌치
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold">
                  {result.summary.affected_funds}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  영향 펀드
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {formatKRW(result.summary.estimated_loss)}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  추정 손실
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 펀드별 영향 */}
          {result.exposure && result.exposure.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">펀드별 손실 영향</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-left text-xs text-[var(--muted-foreground)]">
                        <th className="pb-2 pr-4">펀드</th>
                        <th className="pb-2 pr-4">NAV</th>
                        <th className="pb-2 pr-4">추정 손실</th>
                        <th className="pb-2">NAV 영향</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.exposure.map((e, i) => (
                        <tr
                          key={i}
                          className="border-b border-[var(--border)] last:border-0"
                        >
                          <td className="py-2 pr-4 font-medium">{e.fund}</td>
                          <td className="py-2 pr-4 font-mono text-xs">
                            {formatKRW(e.nav)}
                          </td>
                          <td className="py-2 pr-4 font-mono text-xs text-red-600">
                            {formatKRW(e.loss_estimate)}
                          </td>
                          <td className="py-2">
                            <Badge
                              variant="secondary"
                              className={
                                e.nav_impact_pct > 5
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              -{e.nav_impact_pct}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 전파 경로 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                리스크 전파 경로: {selected?.name ?? result.summary.company} (
                {selected?.credit_rating ?? ""})
              </CardTitle>
              <CardDescription>
                시공사 → PF 사업장 → 트렌치 → 펀드 영향 분석
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedPaths.map((group, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--border)] p-4"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-base">🏗️</span>
                    <h4 className="font-medium">{group.project}</h4>
                    <Badge variant="outline" className="text-xs">
                      {group.tranches.length}개 트렌치
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {group.tranches.map((t, j) => (
                      <div
                        key={j}
                        className="ml-6 flex items-center gap-4 rounded border border-[var(--border)] bg-[var(--muted)]/30 p-2 text-sm"
                      >
                        <span className="text-[var(--muted-foreground)]">
                          ↳
                        </span>
                        {seniorityBadge(t.tranche_seniority)}
                        <span className="font-mono">
                          {formatKRW(t.tranche_principal)}
                        </span>
                        <span className="text-[var(--muted-foreground)]">
                          →
                        </span>
                        <span>{t.fund}</span>
                        <span className="ml-auto text-xs text-[var(--muted-foreground)]">
                          회수율:{" "}
                          {typeof t.recovery_rate === "number"
                            ? `${Math.round(t.recovery_rate * 100)}%`
                            : "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* 결과 없을 때 안내 */}
      {!result && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-[var(--muted-foreground)]">
              시공사를 선택하고 시뮬레이션을 실행하세요
            </p>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Company → PF → Tranche → Fund 전파 경로 및 손실 추정
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
