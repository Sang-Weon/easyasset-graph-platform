import { StatsCard } from "@/components/dashboard/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 데모용 더미 데이터
const COVENANT_DATA = [
  {
    id: "COV-001",
    type: "DSCR",
    loan: "강남 센터프라임 선순위",
    threshold: "≥ 1.20",
    current: "1.35",
    status: "COMPLIANT" as const,
  },
  {
    id: "COV-002",
    type: "LTV",
    loan: "판교 물류센터 PF",
    threshold: "≤ 0.70",
    current: "0.68",
    status: "WARNING" as const,
  },
  {
    id: "COV-003",
    type: "ICR",
    loan: "부산 주상복합 메자닌",
    threshold: "≥ 1.50",
    current: "1.12",
    status: "BREACHED" as const,
  },
  {
    id: "COV-004",
    type: "DSCR",
    loan: "인천 오피스텔 PF",
    threshold: "≥ 1.30",
    current: "1.41",
    status: "COMPLIANT" as const,
  },
  {
    id: "COV-005",
    type: "LTV",
    loan: "대전 데이터센터 PF",
    threshold: "≤ 0.65",
    current: "0.63",
    status: "WARNING" as const,
  },
];

const RECENT_DOCS = [
  {
    name: "A프로젝트 대출약정서 v2.pdf",
    status: "COMPLETED",
    entities: 23,
    date: "2026-03-03",
  },
  {
    name: "KB부동산펀드 IM.pdf",
    status: "COMPLETED",
    entities: 18,
    date: "2026-03-02",
  },
  {
    name: "베트남 물류센터 감정평가서.pdf",
    status: "PROCESSING",
    entities: null,
    date: "2026-03-04",
  },
  {
    name: "삼성SRA PE투자보고서.pdf",
    status: "COMPLETED",
    entities: 31,
    date: "2026-03-01",
  },
];

function covenantBadge(status: "COMPLIANT" | "WARNING" | "BREACHED") {
  const map = {
    COMPLIANT: {
      label: "정상",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    },
    WARNING: {
      label: "주의",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    },
    BREACHED: {
      label: "위반",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

function docStatusBadge(status: string) {
  if (status === "COMPLETED")
    return (
      <Badge
        variant="secondary"
        className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
      >
        완료
      </Badge>
    );
  if (status === "PROCESSING")
    return (
      <Badge
        variant="secondary"
        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      >
        처리중
      </Badge>
    );
  return <Badge variant="secondary">대기</Badge>;
}

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">포트폴리오 현황</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          대체자산 포트폴리오의 리스크 현황을 한눈에 확인합니다
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="총 포트폴리오 규모"
          value="₩ 2.8조"
          description="전월 대비"
          icon="💰"
          trend={{ value: "3.2%", positive: true }}
        />
        <StatsCard
          title="PF / Private Credit"
          value="42건"
          description="진행중 30 · 완료 12"
          icon="🏗️"
        />
        <StatsCard
          title="Covenant 위반"
          value="1건"
          description="주의 2건"
          icon="⚠️"
          trend={{ value: "WARNING 2", positive: false }}
        />
        <StatsCard
          title="처리된 문서"
          value="127건"
          description="엔티티 1,842개 추출"
          icon="📄"
          trend={{ value: "12건", positive: true }}
        />
      </div>

      {/* 하단 2열 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Covenant 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Covenant 현황</CardTitle>
            <CardDescription>
              재무유지약정 모니터링 (최근 5건)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {COVENANT_DATA.map((cov) => (
                <div
                  key={cov.id}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-[var(--muted-foreground)]">
                        {cov.type}
                      </span>
                      <span className="truncate text-sm">{cov.loan}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      기준: {cov.threshold} · 현재: {cov.current}
                    </p>
                  </div>
                  {covenantBadge(cov.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 최근 문서 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 처리 문서</CardTitle>
            <CardDescription>
              AI 기반 엔티티 자동 추출 현황
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_DOCS.map((doc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{doc.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {doc.date}
                      {doc.entities !== null && ` · ${doc.entities}개 엔티티`}
                    </p>
                  </div>
                  {docStatusBadge(doc.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 리스크 분포 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">자산 유형별 리스크 분포</CardTitle>
          <CardDescription>
            PF, Private Credit, PE 포트폴리오 비중 및 리스크 수준
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                type: "Project Finance",
                count: 25,
                total: "₩ 1.2조",
                risk: { low: 15, medium: 7, high: 2, critical: 1 },
              },
              {
                type: "Private Credit",
                count: 12,
                total: "₩ 0.9조",
                risk: { low: 8, medium: 3, high: 1, critical: 0 },
              },
              {
                type: "Private Equity",
                count: 18,
                total: "₩ 0.7조",
                risk: { low: 12, medium: 5, high: 1, critical: 0 },
              },
            ].map((asset) => (
              <div
                key={asset.type}
                className="rounded-lg border border-[var(--border)] p-4"
              >
                <h4 className="text-sm font-medium">{asset.type}</h4>
                <p className="mt-1 text-xl font-bold">{asset.total}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {asset.count}건
                </p>
                <div className="mt-3 flex gap-1">
                  {asset.risk.low > 0 && (
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{
                        width: `${(asset.risk.low / asset.count) * 100}%`,
                      }}
                    />
                  )}
                  {asset.risk.medium > 0 && (
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{
                        width: `${(asset.risk.medium / asset.count) * 100}%`,
                      }}
                    />
                  )}
                  {asset.risk.high > 0 && (
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{
                        width: `${(asset.risk.high / asset.count) * 100}%`,
                      }}
                    />
                  )}
                  {asset.risk.critical > 0 && (
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{
                        width: `${(asset.risk.critical / asset.count) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="mt-2 flex gap-3 text-[10px] text-[var(--muted-foreground)]">
                  <span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                    LOW {asset.risk.low}
                  </span>
                  <span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />{" "}
                    MED {asset.risk.medium}
                  </span>
                  <span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />{" "}
                    HIGH {asset.risk.high}
                  </span>
                  {asset.risk.critical > 0 && (
                    <span>
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />{" "}
                      CRIT {asset.risk.critical}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
