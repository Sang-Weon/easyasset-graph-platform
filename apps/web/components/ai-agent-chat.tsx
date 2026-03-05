"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_QUERIES = [
  "태영건설이 부도나면 어떤 펀드가 영향받아?",
  "현재 Covenant 위반 상태인 대출은?",
  "LTV 위반 가능성 높은 PF 프로젝트 알려줘",
  "신규 Covenant 설정 시 ICR threshold 권고값은?",
  "KB부동산대출펀드의 포트폴리오 구성은?",
];

const TOOL_LABELS: Record<string, string> = {
  query_neo4j: "그래프 쿼리",
  run_contagion_simulation: "연쇄부도 시뮬레이션",
  check_covenants: "Covenant 조회",
  recommend_graph_settings: "설정 추천",
  generate_report: "리포트 생성",
};

export function AIAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-2xl transition-transform hover:scale-110"
      >
        <span className="text-xl">✨</span>
      </button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden shadow-2xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-[var(--border)] p-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <div>
            <p className="text-sm font-semibold">대체자산 분석 에이전트</p>
            <p className="text-[10px] text-[var(--muted-foreground)]">
              Claude Sonnet 4 · Neo4j Graph
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
        >
          ✕
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="space-y-2 pt-4">
            <p className="text-center text-xs text-[var(--muted-foreground)]">
              추천 질문을 눌러 시작하세요
            </p>
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="w-full text-left rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {(messages as UIMessage[]).map((m) => {
          const textParts = m.parts?.filter(
            (p: { type: string }) => p.type === "text"
          ) ?? [];
          const toolParts = m.parts?.filter(
            (p: { type: string }) =>
              p.type === "tool-invocation"
          ) ?? [];

          return (
            <div
              key={m.id}
              className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  m.role === "user"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)]"
                }`}
              >
                {m.role === "user" ? "나" : "AI"}
              </div>
              <div
                className={`max-w-[82%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)]"
                }`}
              >
                {toolParts.map((part: Record<string, unknown>, i: number) => {
                  const toolName = String(
                    (part as { toolInvocation?: { toolName?: string } })
                      ?.toolInvocation?.toolName ?? "도구"
                  );
                  return (
                    <div
                      key={i}
                      className="mb-1.5 rounded border border-[var(--border)] bg-[var(--background)] p-1.5 text-[10px] font-mono"
                    >
                      <Badge variant="secondary" className="text-[10px] mb-1">
                        {TOOL_LABELS[toolName] ?? toolName}
                      </Badge>
                    </div>
                  );
                })}
                {textParts.map(
                  (p: { type: string; text?: string }, i: number) => (
                    <div key={i} className="whitespace-pre-wrap">
                      {(p as { text: string }).text}
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2">
            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--muted)] text-xs">
              AI
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-[var(--muted)] px-3 py-2">
              {[0, 200, 400].map((delay) => (
                <span
                  key={delay}
                  className="h-1.5 w-1.5 rounded-full bg-[var(--muted-foreground)] animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <form onSubmit={onSubmit} className="border-t border-[var(--border)] p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
            placeholder="질문을 입력하세요..."
            className="min-h-[2.5rem] max-h-28 resize-none text-sm"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            <span className="text-sm">→</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
