"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_QUERIES = [
  "태영건설이 부도나면 어떤 펀드가 영향받아?",
  "현재 Covenant 위반 상태인 대출은?",
  "LTV 0.7 이상인 PF 프로젝트 리스트 보여줘",
  "KB부동산대출펀드의 포트폴리오 구성은?",
  "신용등급 BBB 이하 시공사의 책임준공 현황은?",
];

const DEMO_MESSAGES = [
  {
    role: "user" as const,
    content: "태영건설이 부도나면 어떤 펀드가 영향받아?",
  },
  {
    role: "assistant" as const,
    content: `태영건설(BB+, NEGATIVE) 부도 시나리오를 분석했습니다.

**영향받는 PF 사업장 3건:**
1. 강남 센터프라임 타워 — 총 ₩1,200억 (3개 트렌치)
2. 판교 물류센터 — 총 ₩800억 (2개 트렌치)
3. 인천 오피스텔 — 총 ₩400억 (1개 트렌치)

**영향받는 펀드 5개:**
| 펀드 | NAV | 추정 손실 | NAV 영향 |
|------|-----|---------|----------|
| KB부동산대출1호 | ₩5,000억 | ₩40억 | -0.8% |
| 신한메자닌펀드 | ₩2,000억 | ₩180억 | -9.0% |
| 하나에쿼티펀드 | ₩800억 | ₩95억 | -11.9% |
| NH물류투자1호 | ₩3,000억 | ₩130억 | -4.3% |
| KB메자닌2호 | ₩1,500억 | ₩130억 | -8.7% |

**총 추정 손실: ₩575억** (회수율 가정: Senior 95%, Mezzanine 40%, Junior 5%)

⚠️ 특히 하나에쿼티펀드(Junior 트렌치)와 신한메자닌펀드의 NAV 영향이 크므로 주의가 필요합니다.`,
    tool: "query_graph → simulate_contagion",
  },
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(DEMO_MESSAGES);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI 챗봇</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          자연어로 그래프 데이터를 쿼리하고 리스크 분석을 수행합니다
        </p>
      </div>

      {/* 추천 질문 */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted-foreground)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 채팅 메시지 */}
      <Card className="flex-1 overflow-hidden">
        <CardHeader className="border-b border-[var(--border)] py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <span>💬</span>
            대체자산 분석 에이전트
            <Badge variant="outline" className="text-[10px]">
              Claude Sonnet 4
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-8rem)] flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-[var(--muted)]"
                  }`}
                >
                  {"tool" in msg && msg.tool && (
                    <div className="mb-2 flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 text-[10px] dark:bg-blue-900 dark:text-blue-300"
                      >
                        🔧 {msg.tool}
                      </Badge>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 입력 */}
          <div className="border-t border-[var(--border)] p-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="질문을 입력하세요... (예: 태영건설 관련 PF 현황)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[2.5rem] max-h-32 resize-none"
                rows={1}
              />
              <Button
                onClick={() => {
                  if (!input.trim()) return;
                  setMessages((prev) => [
                    ...prev,
                    { role: "user", content: input },
                  ]);
                  setInput("");
                }}
              >
                전송
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-[var(--muted-foreground)]">
              Claude API + Neo4j Cypher 자동 생성 · Tool Use: query_graph,
              check_covenants, simulate_contagion, generate_report
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
