import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DOCUMENTS = [
  {
    id: "DOC-001",
    title: "A프로젝트 대출약정서 v2",
    type: "LOAN_AGREEMENT",
    pages: 120,
    status: "COMPLETED",
    entities: 23,
    relations: 15,
    covenants: 4,
    confidence: 0.92,
    date: "2026-03-03",
  },
  {
    id: "DOC-002",
    title: "KB부동산대출펀드 IM",
    type: "IM",
    pages: 85,
    status: "COMPLETED",
    entities: 18,
    relations: 12,
    covenants: 2,
    confidence: 0.88,
    date: "2026-03-02",
  },
  {
    id: "DOC-003",
    title: "베트남 물류센터 감정평가서",
    type: "APPRAISAL",
    pages: 45,
    status: "PROCESSING",
    entities: null,
    relations: null,
    covenants: null,
    confidence: null,
    date: "2026-03-04",
  },
  {
    id: "DOC-004",
    title: "삼성SRA PE투자보고서",
    type: "FINANCIAL",
    pages: 60,
    status: "COMPLETED",
    entities: 31,
    relations: 22,
    covenants: 0,
    confidence: 0.95,
    date: "2026-03-01",
  },
  {
    id: "DOC-005",
    title: "판교 물류센터 PF 약정서",
    type: "LOAN_AGREEMENT",
    pages: 98,
    status: "COMPLETED",
    entities: 27,
    relations: 19,
    covenants: 5,
    confidence: 0.91,
    date: "2026-02-28",
  },
  {
    id: "DOC-006",
    title: "한화에너지 회사채 투자설명서",
    type: "IM",
    pages: 150,
    status: "PENDING",
    entities: null,
    relations: null,
    covenants: null,
    confidence: null,
    date: "2026-03-04",
  },
];

function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    COMPLETED: {
      label: "완료",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
    },
    PROCESSING: {
      label: "처리중",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    PENDING: {
      label: "대기",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    },
    FAILED: {
      label: "실패",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
  };
  const { label, className } = map[status] ?? map["PENDING"]!;
  return (
    <Badge variant="secondary" className={className}>
      {label}
    </Badge>
  );
}

function typeBadge(type: string) {
  const labels: Record<string, string> = {
    LOAN_AGREEMENT: "대출약정서",
    IM: "투자설명서",
    LPA: "LPA",
    FINANCIAL: "재무보고서",
    APPRAISAL: "감정평가서",
  };
  return <Badge variant="outline">{labels[type] ?? type}</Badge>;
}

export default function DocumentsPage() {
  const completed = DOCUMENTS.filter((d) => d.status === "COMPLETED").length;
  const totalEntities = DOCUMENTS.reduce(
    (sum, d) => sum + (d.entities ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">문서 관리</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            PDF 업로드 → Upstage 파싱 → Claude NER → Neo4j 그래프 저장
          </p>
        </div>
        <Button>
          <span className="mr-2">📄</span>
          문서 업로드
        </Button>
      </div>

      {/* 통계 */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{DOCUMENTS.length}</p>
            <p className="text-xs text-[var(--muted-foreground)]">전체 문서</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-emerald-600">{completed}</p>
            <p className="text-xs text-[var(--muted-foreground)]">처리 완료</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">{totalEntities}</p>
            <p className="text-xs text-[var(--muted-foreground)]">추출 엔티티</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold">91.5%</p>
            <p className="text-xs text-[var(--muted-foreground)]">평균 신뢰도</p>
          </CardContent>
        </Card>
      </div>

      {/* 문서 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">문서 목록</CardTitle>
          <CardDescription>
            업로드된 문서와 AI 추출 결과를 확인합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DOCUMENTS.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 rounded-lg border border-[var(--border)] p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[var(--muted)] text-lg">
                  📄
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{doc.title}</p>
                    {typeBadge(doc.type)}
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {doc.pages}페이지 · {doc.date}
                    {doc.entities !== null &&
                      ` · ${doc.entities}개 엔티티 · ${doc.relations}개 관계 · ${doc.covenants}개 Covenant`}
                    {doc.confidence !== null &&
                      ` · 신뢰도 ${(doc.confidence * 100).toFixed(0)}%`}
                  </p>
                </div>
                {statusBadge(doc.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
