import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SIMULATION_RESULT = {
  source: "태영건설",
  sourceRating: "BB+",
  paths: [
    {
      project: "강남 센터프라임 타워",
      tranches: [
        { seniority: "SENIOR", principal: "₩ 800억", fund: "KB부동산대출1호", recovery: "95%" },
        { seniority: "MEZZANINE", principal: "₩ 300억", fund: "신한메자닌펀드", recovery: "40%" },
        { seniority: "JUNIOR", principal: "₩ 100억", fund: "하나에쿼티펀드", recovery: "5%" },
      ],
    },
    {
      project: "판교 물류센터",
      tranches: [
        { seniority: "SENIOR", principal: "₩ 600억", fund: "NH물류투자1호", recovery: "90%" },
        { seniority: "MEZZANINE", principal: "₩ 200억", fund: "KB메자닌2호", recovery: "35%" },
      ],
    },
    {
      project: "인천 오피스텔",
      tranches: [
        { seniority: "SENIOR", principal: "₩ 400억", fund: "삼성부동산신탁", recovery: "85%" },
      ],
    },
  ],
};

function seniorityBadge(seniority: string) {
  const map: Record<string, string> = {
    SENIOR: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    MEZZANINE:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    JUNIOR:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };
  return (
    <Badge variant="secondary" className={map[seniority] ?? ""}>
      {seniority}
    </Badge>
  );
}

export default function ContagionSimPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">연쇄부도 시뮬레이션</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          시공사 부도 시 PF → 트렌치 → 펀드로 전파되는 리스크 경로를 분석합니다
        </p>
      </div>

      {/* 시뮬레이션 컨트롤 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">시뮬레이션 설정</CardTitle>
          <CardDescription>부도 시나리오를 설정하고 영향을 분석합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-48">
              <label className="text-sm font-medium">부도 대상 시공사</label>
              <div className="mt-1 flex h-10 items-center rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
                태영건설 (BB+)
              </div>
            </div>
            <div className="w-32">
              <label className="text-sm font-medium">회수율 가정</label>
              <div className="mt-1 flex h-10 items-center rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm">
                기본값
              </div>
            </div>
            <Button>시뮬레이션 실행</Button>
          </div>
        </CardContent>
      </Card>

      {/* 결과 요약 */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-[var(--muted-foreground)]">영향 PF</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">6</p>
            <p className="text-xs text-[var(--muted-foreground)]">영향 트렌치</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-[var(--muted-foreground)]">영향 펀드</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-red-600">₩ 1,120억</p>
            <p className="text-xs text-[var(--muted-foreground)]">추정 손실</p>
          </CardContent>
        </Card>
      </div>

      {/* 전파 경로 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            리스크 전파 경로: {SIMULATION_RESULT.source} ({SIMULATION_RESULT.sourceRating})
          </CardTitle>
          <CardDescription>
            시공사 → PF 사업장 → 트렌치 → 펀드 영향 분석
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {SIMULATION_RESULT.paths.map((path, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-base">🏗️</span>
                <h4 className="font-medium">{path.project}</h4>
                <Badge variant="outline" className="text-xs">
                  {path.tranches.length}개 트렌치
                </Badge>
              </div>
              <div className="space-y-2">
                {path.tranches.map((t, j) => (
                  <div
                    key={j}
                    className="ml-6 flex items-center gap-4 rounded border border-[var(--border)] bg-[var(--muted)]/30 p-2 text-sm"
                  >
                    <span className="text-[var(--muted-foreground)]">↳</span>
                    {seniorityBadge(t.seniority)}
                    <span className="font-mono">{t.principal}</span>
                    <span className="text-[var(--muted-foreground)]">→</span>
                    <span>{t.fund}</span>
                    <span className="ml-auto text-xs text-[var(--muted-foreground)]">
                      회수율: {t.recovery}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
