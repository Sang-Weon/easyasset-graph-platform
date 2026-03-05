"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
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
  "LTV 위반 가능성 높은 PF 프로젝트 알려줘",
  "신규 Covenant 설정 시 ICR threshold 권고값은?",
  "KB부동산대출펀드의 포트폴리오 구성은?",
  "신용등급 BBB 이하 시공사의 책임준공 현황은?",
];

const TOOL_LABELS: Record<string, string> = {
  query_neo4j: "그래프 쿼리",
  run_contagion_simulation: "연쇄부도 시뮬레이션",
  check_covenants: "Covenant 조회",
  recommend_graph_settings: "설정 추천",
  generate_report: "리포트 생성",
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/agent" }), []);
  const { messages, sendMessage, status } = useChat({
    transport,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

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
              Claude Sonnet 4 · Neo4j Graph
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[calc(100%-8rem)] flex-col p-0">
          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-[var(--muted-foreground)]">
                  위 추천 질문을 클릭하거나 자유롭게 질문을 입력하세요
                </p>
              </div>
            )}

            {(messages as UIMessage[]).map((m) => {
              const textParts =
                m.parts?.filter((p: { type: string }) => p.type === "text") ??
                [];
              const toolParts =
                m.parts?.filter(
                  (p: { type: string }) => p.type === "tool-invocation"
                ) ?? [];

              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* 아바타 */}
                  {m.role !== "user" && (
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-medium">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--muted)]"
                    }`}
                  >
                    {/* 도구 호출 표시 */}
                    {toolParts.map(
                      (part: Record<string, unknown>, i: number) => {
                        const toolName = String(
                          (
                            part as {
                              toolInvocation?: { toolName?: string };
                            }
                          )?.toolInvocation?.toolName ?? "도구"
                        );
                        return (
                          <div
                            key={i}
                            className="mb-2 rounded border border-[var(--border)] bg-[var(--background)] p-2 text-xs font-mono"
                          >
                            <Badge
                              variant="secondary"
                              className="text-[10px] mb-1"
                            >
                              {TOOL_LABELS[toolName] ?? toolName}
                            </Badge>
                          </div>
                        );
                      }
                    )}

                    {/* 텍스트 파트 */}
                    {textParts.map(
                      (p: { type: string; text?: string }, i: number) => (
                        <div key={i} className="whitespace-pre-wrap text-sm">
                          {(p as { text: string }).text}
                        </div>
                      )
                    )}
                  </div>

                  {/* 유저 아바타 */}
                  {m.role === "user" && (
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium">
                      나
                    </div>
                  )}
                </div>
              );
            })}

            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-medium">
                  AI
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-[var(--muted)] px-4 py-3">
                  {[0, 200, 400].map((delay) => (
                    <span
                      key={delay}
                      className="h-2 w-2 rounded-full bg-[var(--muted-foreground)] animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <form
            onSubmit={onSubmit}
            className="border-t border-[var(--border)] p-4"
          >
            <div className="flex gap-2">
              <Textarea
                placeholder="질문을 입력하세요... (예: 태영건설 관련 PF 현황)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                className="min-h-[2.5rem] max-h-32 resize-none text-sm"
                rows={1}
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? "분석 중..." : "전송"}
              </Button>
            </div>
            <p className="mt-2 text-[10px] text-[var(--muted-foreground)]">
              Claude Sonnet 4 + Neo4j Cypher · 도구: 그래프 쿼리, 연쇄부도
              시뮬레이션, Covenant 조회, 설정 추천, 리포트 생성
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
