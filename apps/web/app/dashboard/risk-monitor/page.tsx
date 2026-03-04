import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RISK_DATA = [
  {
    name: "태영건설",
    type: "시공사",
    rating: "BB+",
    outlook: "NEGATIVE",
    exposure: "₩ 3,200억",
    projects: 5,
    risk: "HIGH",
  },
  {
    name: "GS건설",
    type: "시공사",
    rating: "A-",
    outlook: "STABLE",
    exposure: "₩ 2,800억",
    projects: 4,
    risk: "LOW",
  },
  {
    name: "한화솔루션",
    type: "차주",
    rating: "A",
    outlook: "POSITIVE",
    exposure: "₩ 1,500억",
    projects: 2,
    risk: "LOW",
  },
  {
    name: "롯데건설",
    type: "시공사",
    rating: "BBB+",
    outlook: "NEGATIVE",
    exposure: "₩ 4,100억",
    projects: 7,
    risk: "MEDIUM",
  },
  {
    name: "대우건설",
    type: "시공사",
    rating: "BBB",
    outlook: "WATCH",
    exposure: "₩ 2,200억",
    projects: 3,
    risk: "MEDIUM",
  },
  {
    name: "현대건설",
    type: "시공사",
    rating: "AA-",
    outlook: "STABLE",
    exposure: "₩ 5,600억",
    projects: 8,
    risk: "LOW",
  },
];

function riskBadge(risk: string) {
  const map: Record<string, { label: string; className: string }> = {
    LOW: {
      label: "낮음",
      className:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    },
    MEDIUM: {
      label: "보통",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    },
    HIGH: {
      label: "높음",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
  };
  const { label, className } = map[risk] ?? map["MEDIUM"]!;
  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

export default function RiskMonitorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">리스크 모니터</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          주요 거래상대방(시공사/차주) 기준 익스포저 및 리스크 현황
        </p>
      </div>

      {/* 리스크 요약 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">23</p>
              <p className="text-sm text-[var(--muted-foreground)]">LOW 리스크</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">8</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                MEDIUM 리스크
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">3</p>
              <p className="text-sm text-[var(--muted-foreground)]">HIGH 리스크</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 거래상대방 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">주요 거래상대방 익스포저</CardTitle>
          <CardDescription>신용등급 및 리스크 수준 기준 정렬</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">
                    기관명
                  </th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">
                    유형
                  </th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">
                    신용등급
                  </th>
                  <th className="pb-3 text-left font-medium text-[var(--muted-foreground)]">
                    전망
                  </th>
                  <th className="pb-3 text-right font-medium text-[var(--muted-foreground)]">
                    익스포저
                  </th>
                  <th className="pb-3 text-center font-medium text-[var(--muted-foreground)]">
                    연관 PF
                  </th>
                  <th className="pb-3 text-center font-medium text-[var(--muted-foreground)]">
                    리스크
                  </th>
                </tr>
              </thead>
              <tbody>
                {RISK_DATA.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 font-medium">{row.name}</td>
                    <td className="py-3 text-[var(--muted-foreground)]">
                      {row.type}
                    </td>
                    <td className="py-3 font-mono">{row.rating}</td>
                    <td className="py-3 text-[var(--muted-foreground)]">
                      {row.outlook}
                    </td>
                    <td className="py-3 text-right font-mono">{row.exposure}</td>
                    <td className="py-3 text-center">{row.projects}</td>
                    <td className="py-3 text-center">{riskBadge(row.risk)}</td>
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
