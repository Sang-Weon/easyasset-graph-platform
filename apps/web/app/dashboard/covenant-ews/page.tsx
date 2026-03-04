import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COVENANTS = [
  {
    id: "COV-001",
    type: "DSCR",
    name: "부채상환비율 유지",
    loan: "강남 센터프라임 선순위 대출",
    threshold: 1.2,
    operator: ">=",
    current: 1.35,
    status: "COMPLIANT",
    measurement: "2026-03-31",
    cure: 30,
  },
  {
    id: "COV-002",
    type: "LTV",
    name: "담보인정비율 유지",
    loan: "판교 물류센터 PF",
    threshold: 0.7,
    operator: "<=",
    current: 0.68,
    status: "WARNING",
    measurement: "2026-03-31",
    cure: 30,
  },
  {
    id: "COV-003",
    type: "ICR",
    name: "이자보상비율 유지",
    loan: "부산 주상복합 메자닌",
    threshold: 1.5,
    operator: ">=",
    current: 1.12,
    status: "BREACHED",
    measurement: "2026-02-28",
    cure: 30,
  },
  {
    id: "COV-004",
    type: "DSCR",
    name: "부채상환비율 유지",
    loan: "인천 오피스텔 PF 선순위",
    threshold: 1.3,
    operator: ">=",
    current: 1.41,
    status: "COMPLIANT",
    measurement: "2026-06-30",
    cure: 45,
  },
  {
    id: "COV-005",
    type: "LTV",
    name: "담보인정비율 유지",
    loan: "대전 데이터센터 PF",
    threshold: 0.65,
    operator: "<=",
    current: 0.63,
    status: "WARNING",
    measurement: "2026-03-31",
    cure: 30,
  },
  {
    id: "COV-006",
    type: "EBITDA",
    name: "EBITDA 기준 유지",
    loan: "세종 오피스 시니어론",
    threshold: 5.0,
    operator: ">=",
    current: 6.2,
    status: "COMPLIANT",
    measurement: "2026-06-30",
    cure: 30,
  },
  {
    id: "COV-007",
    type: "ICR",
    name: "이자보상비율 유지",
    loan: "화성 물류단지 PF",
    threshold: 1.8,
    operator: ">=",
    current: 1.75,
    status: "WARNING",
    measurement: "2026-03-31",
    cure: 30,
  },
];

function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
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
  const { label, className } = map[status] ?? map["COMPLIANT"]!;
  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

function gaugeBar(threshold: number, current: number, operator: string) {
  const isGood =
    operator === ">=" ? current >= threshold : current <= threshold;
  const ratio =
    operator === ">="
      ? Math.min(current / (threshold * 1.5), 1)
      : Math.min(1 - current / (threshold * 1.5), 1);

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded-full bg-[var(--muted)]">
        <div
          className={`h-2 rounded-full ${isGood ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ width: `${Math.max(ratio * 100, 10)}%` }}
        />
      </div>
      <span className="text-xs font-mono">
        {current.toFixed(2)} / {operator} {threshold.toFixed(2)}
      </span>
    </div>
  );
}

export default function CovenantEWSPage() {
  const breached = COVENANTS.filter((c) => c.status === "BREACHED").length;
  const warning = COVENANTS.filter((c) => c.status === "WARNING").length;
  const compliant = COVENANTS.filter((c) => c.status === "COMPLIANT").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Covenant EWS</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          재무유지약정 조기경보 시스템 — 실시간 모니터링
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-red-200 dark:border-red-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">위반 (BREACHED)</p>
                <p className="text-3xl font-bold text-red-600">{breached}</p>
              </div>
              <span className="text-4xl">🚨</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">주의 (WARNING)</p>
                <p className="text-3xl font-bold text-amber-600">{warning}</p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">정상 (COMPLIANT)</p>
                <p className="text-3xl font-bold text-emerald-600">{compliant}</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Covenant 상세 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Covenant 상세 현황</CardTitle>
          <CardDescription>위반 → 주의 → 정상 순으로 정렬</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">ID</th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">유형</th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">관련 대출</th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">현재값 / 기준</th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">다음 측정</th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">치유기간</th>
                  <th className="pb-3 text-center font-medium text-[var(--muted-foreground)]">상태</th>
                </tr>
              </thead>
              <tbody>
                {[...COVENANTS]
                  .sort((a, b) => {
                    const order = { BREACHED: 0, WARNING: 1, COMPLIANT: 2 };
                    return (
                      (order[a.status as keyof typeof order] ?? 2) -
                      (order[b.status as keyof typeof order] ?? 2)
                    );
                  })
                  .map((cov) => (
                    <tr
                      key={cov.id}
                      className="border-b border-[var(--border)] last:border-0"
                    >
                      <td className="py-3 font-mono text-xs text-[var(--muted-foreground)]">
                        {cov.id}
                      </td>
                      <td className="py-3">
                        <Badge variant="outline">{cov.type}</Badge>
                      </td>
                      <td className="py-3 max-w-48 truncate">{cov.loan}</td>
                      <td className="py-3">
                        {gaugeBar(cov.threshold, cov.current, cov.operator)}
                      </td>
                      <td className="py-3 font-mono text-xs">{cov.measurement}</td>
                      <td className="py-3 text-xs">{cov.cure}일</td>
                      <td className="py-3 text-center">{statusBadge(cov.status)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
