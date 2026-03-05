// ═══════════════════════════════════════════════════════════════════════════
// Claude AI 에이전트 스트리밍 API
// POST /api/agent — Vercel AI SDK UIMessageStreamResponse
// 5개 도구: query_neo4j, run_contagion_simulation, check_covenants,
//           recommend_graph_settings, generate_report
// ═══════════════════════════════════════════════════════════════════════════

export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool, convertToModelMessages, stepCountIs } from "ai";
import { z } from "zod";
import { Neo4jService } from "@/lib/neo4j";
import {
  CONTAGION_PATH_QUERY,
  CONTAGION_SUMMARY_QUERY,
  COVENANT_BREACHES_QUERY,
} from "@easyasset/neo4j-queries";
import {
  MOCK_CONTAGION_PATHS,
  MOCK_CONTAGION_SUMMARY,
  MOCK_COVENANTS,
  MOCK_COMPANIES,
} from "@/lib/mock-data";
import { readFileSync } from "fs";
import { join } from "path";

const systemPrompt = readFileSync(
  join(process.cwd(), "prompts", "system.md"),
  "utf-8"
);

async function ensureNeo4j() {
  if (Neo4jService.isConnected()) return;
  const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;
  if (NEO4J_URI && NEO4J_USER && NEO4J_PASSWORD) {
    await Neo4jService.connect({
      uri: NEO4J_URI,
      user: NEO4J_USER,
      pass: NEO4J_PASSWORD,
    });
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  await ensureNeo4j();
  const isDemo = !Neo4jService.isConnected();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: systemPrompt + (isDemo ? "\n\n[현재 데모 모드입니다. 목업 데이터로 응답합니다.]" : ""),
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),

    tools: {
      // ── 도구 1: Neo4j 자유 쿼리 (Text2Cypher) ──
      query_neo4j: tool({
        description:
          "자연어 질문을 Cypher 쿼리로 변환하여 Neo4j 그래프 데이터베이스를 조회합니다. 회사, PF, 펀드, 트렌치, 약정 정보를 검색할 때 사용하세요.",
        inputSchema: z.object({
          cypher: z.string().describe("실행할 Cypher 쿼리"),
          explanation: z.string().describe("쿼리 목적 설명 (한국어)"),
        }),
        execute: async ({ cypher }) => {
          if (isDemo) {
            if (/company/i.test(cypher))
              return JSON.stringify(MOCK_COMPANIES.slice(0, 5));
            return JSON.stringify([
              { message: "데모 모드 — 실제 Neo4j 연결 시 결과를 반환합니다" },
            ]);
          }
          try {
            const rows = await Neo4jService.runReadQuery(cypher);
            return JSON.stringify(rows.slice(0, 50));
          } catch (e: unknown) {
            return `쿼리 오류: ${e instanceof Error ? e.message : "알 수 없는 오류"}`;
          }
        },
      }),

      // ── 도구 2: 연쇄부도 시뮬레이션 ──
      run_contagion_simulation: tool({
        description:
          "특정 시공사 부도 시 PF → 트렌치 → 펀드로 전파되는 연쇄 손실을 시뮬레이션합니다. '부도', '충격', 'contagion' 요청 시 사용하세요.",
        inputSchema: z.object({
          companyId: z.string().describe("부도 대상 시공사 ID (예: C-001)"),
          companyName: z.string().describe("시공사 이름"),
        }),
        execute: async ({ companyId }) => {
          if (isDemo) {
            return JSON.stringify({
              demo: true,
              summary: MOCK_CONTAGION_SUMMARY,
              paths: MOCK_CONTAGION_PATHS,
            });
          }
          try {
            const [paths, summary] = await Promise.all([
              Neo4jService.runReadQuery(CONTAGION_PATH_QUERY, { companyId }),
              Neo4jService.runReadQuery(CONTAGION_SUMMARY_QUERY, { companyId }),
            ]);
            return JSON.stringify({ summary: summary[0], paths });
          } catch (e: unknown) {
            return `시뮬레이션 오류: ${e instanceof Error ? e.message : "알 수 없는 오류"}`;
          }
        },
      }),

      // ── 도구 3: Covenant 상태 조회 ──
      check_covenants: tool({
        description:
          "재무유지약정(Covenant) 위반 및 주의 현황을 조회합니다. DSCR, LTV, ICR 약정 위반 여부를 확인할 때 사용하세요.",
        inputSchema: z.object({
          filter: z
            .enum(["ALL", "BREACHED", "WARNING"])
            .describe("조회 범위: ALL=전체, BREACHED=위반만, WARNING=주의만"),
        }),
        execute: async ({ filter }) => {
          if (isDemo) {
            const filtered =
              filter === "ALL"
                ? MOCK_COVENANTS
                : MOCK_COVENANTS.filter((c) => c.status === filter);
            return JSON.stringify({ demo: true, covenants: filtered });
          }
          try {
            const rows = await Neo4jService.runReadQuery(
              COVENANT_BREACHES_QUERY
            );
            const filtered =
              filter === "ALL"
                ? rows
                : rows.filter((r) => r.status === filter);
            return JSON.stringify({ covenants: filtered });
          } catch (e: unknown) {
            return `Covenant 조회 오류: ${e instanceof Error ? e.message : "알 수 없는 오류"}`;
          }
        },
      }),

      // ── 도구 4: 그래프 설정 추천 ──
      recommend_graph_settings: tool({
        description:
          "사용자가 그래프 노드/속성/관계를 수동으로 설정할 때 최적 값을 추천합니다. 새 Covenant 추가 시 threshold 권고값, Tranche seniority별 recovery_rate 기본값, Company credit_rating 설정 시 리스크 안내 등.",
        inputSchema: z.object({
          nodeType: z
            .enum(["Company", "ProjectFinance", "Tranche", "Covenant", "PrivateCredit", "Fund", "PrivateEquity"])
            .describe("설정 중인 노드 유형"),
          propertyName: z
            .string()
            .describe("설정하려는 속성 이름 (예: threshold, recovery_rate_estimate)"),
          currentContext: z
            .string()
            .optional()
            .describe("이미 입력된 다른 속성 컨텍스트 (JSON 문자열, 선택사항)"),
        }),
        execute: async ({ nodeType, propertyName, currentContext }) => {
          // 규칙 기반 컨텍스트 제공 — Claude가 시스템 프롬프트의 도메인 지식으로 추천 생성
          const context = currentContext
            ? JSON.parse(currentContext)
            : {};
          return JSON.stringify({
            nodeType,
            propertyName,
            context,
            instruction:
              "시스템 프롬프트의 '핵심 지표 기준' 및 '추천 기능 가이드' 섹션을 참조하여 한국 금융 실무 관행에 맞는 권고값과 근거를 제시하세요.",
          });
        },
      }),

      // ── 도구 5: 리포트 생성 ──
      generate_report: tool({
        description:
          "분석 결과를 구조화된 한국어 리포트로 생성합니다. '리포트', '요약', '보고서' 요청 시 사용하세요.",
        inputSchema: z.object({
          reportType: z
            .enum(["contagion", "covenant", "portfolio", "pe_peer"])
            .describe("리포트 유형"),
          title: z.string().describe("리포트 제목"),
          dataJson: z
            .string()
            .describe("포함할 데이터 (JSON 문자열)"),
        }),
        execute: async ({ reportType, title, dataJson }) => {
          return JSON.stringify({
            reportType,
            title,
            data: JSON.parse(dataJson),
            instruction:
              "위 데이터를 바탕으로 한국어 리스크 분석 리포트를 작성하세요. 임원 요약 → 주요 발견 → 리스크 등급 → 권고사항 순서로 구성하세요.",
          });
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
