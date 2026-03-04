import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PEERS = [
  {
    name: "테크스타트업A",
    industry: "B2B SaaS",
    stage: "Series C",
    revenue: "₩ 300억",
    growth: "+45%",
    ebitda: "16.7%",
    valuation: "₩ 4,000억",
    similarity: 94,
  },
  {
    name: "데이터플랫폼B",
    industry: "Data Analytics",
    stage: "Series C",
    revenue: "₩ 250억",
    growth: "+38%",
    ebitda: "12.3%",
    valuation: "₩ 3,200억",
    similarity: 87,
  },
  {
    name: "클라우드솔루션C",
    industry: "Cloud Infrastructure",
    stage: "Series B",
    revenue: "₩ 180억",
    growth: "+62%",
    ebitda: "8.5%",
    valuation: "₩ 2,800억",
    similarity: 82,
  },
  {
    name: "핀테크스타트업D",
    industry: "Fintech SaaS",
    stage: "Series C",
    revenue: "₩ 420억",
    growth: "+28%",
    ebitda: "21.0%",
    valuation: "₩ 5,100억",
    similarity: 78,
  },
  {
    name: "AI솔루션E",
    industry: "AI/ML Platform",
    stage: "Growth",
    revenue: "₩ 150억",
    growth: "+85%",
    ebitda: "-5.2%",
    valuation: "₩ 3,500억",
    similarity: 71,
  },
];

export default function PeerMatchingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">PE Peer 매칭</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          벡터 유사도 기반 동종업체 비교 분석 (1024차원 비즈니스 모델 임베딩)
        </p>
      </div>

      {/* 검색 대상 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">검색 대상</CardTitle>
          <CardDescription>투자대상 기업의 Peer 그룹을 분석합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 rounded-lg border border-[var(--border)] p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)] text-lg text-[var(--primary-foreground)]">
              PE
            </div>
            <div className="flex-1">
              <h3 className="font-medium">테크스타트업A (PE-001)</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                B2B SaaS · Series C · ARR ₩ 280억 · NRR 115%
              </p>
            </div>
            <Badge>ACTIVE</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Peer 벤치마크 */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-[var(--muted-foreground)]">매칭 Peer 수</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">₩ 260억</p>
            <p className="text-xs text-[var(--muted-foreground)]">Peer 평균 매출</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">10.7%</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Peer 평균 EBITDA 마진
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">+51.6%</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Peer 평균 성장률
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Peer 결과 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">유사도 순위 결과</CardTitle>
          <CardDescription>코사인 유사도 기반 정렬</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">기업명</th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">산업</th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">스테이지</th>
                  <th className="pb-3 text-right font-medium text-[var(--muted-foreground)]">매출</th>
                  <th className="pb-3 text-right font-medium text-[var(--muted-foreground)]">성장률</th>
                  <th className="pb-3 text-right font-medium text-[var(--muted-foreground)]">EBITDA</th>
                  <th className="pb-3 text-right font-medium text-[var(--muted-foreground)]">밸류에이션</th>
                  <th className="pb-3 text-right font-medium text-[var(--muted-foreground)]">유사도</th>
                </tr>
              </thead>
              <tbody>
                {PEERS.map((peer) => (
                  <tr
                    key={peer.name}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 font-medium">{peer.name}</td>
                    <td className="py-3 text-[var(--muted-foreground)]">
                      {peer.industry}
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">
                        {peer.stage}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-mono">{peer.revenue}</td>
                    <td className="py-3 text-right font-mono text-emerald-600">
                      {peer.growth}
                    </td>
                    <td className="py-3 text-right font-mono">{peer.ebitda}</td>
                    <td className="py-3 text-right font-mono">
                      {peer.valuation}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-16 rounded-full bg-[var(--muted)]">
                          <div
                            className="h-2 rounded-full bg-[var(--primary)]"
                            style={{ width: `${peer.similarity}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs">{peer.similarity}%</span>
                      </div>
                    </td>
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
