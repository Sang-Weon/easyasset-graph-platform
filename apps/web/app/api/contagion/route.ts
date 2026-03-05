// ═══════════════════════════════════════════════════════════════════════════
// 연쇄부도 시뮬레이션 API
// POST /api/contagion — { companyId: string }
// ═══════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { Neo4jService } from "@/lib/neo4j";
import {
  CONTAGION_PATH_QUERY,
  CONTAGION_EXPOSURE_QUERY,
  CONTAGION_SUMMARY_QUERY,
} from "@easyasset/neo4j-queries";
import {
  MOCK_CONTAGION_PATHS,
  MOCK_CONTAGION_EXPOSURE,
  MOCK_CONTAGION_SUMMARY,
  MOCK_COMPANIES,
} from "@/lib/mock-data";

export const dynamic = "force-dynamic";

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

/** GET: 시뮬레이션 가능한 시공사 목록 */
export async function GET() {
  try {
    await ensureNeo4j();

    if (!Neo4jService.isConnected()) {
      return NextResponse.json({
        success: true,
        demo: true,
        data: MOCK_COMPANIES,
      });
    }

    const companies = await Neo4jService.runReadQuery(
      `MATCH (c:Company) WHERE c.company_type = 'CONSTRUCTOR' RETURN c.company_id AS company_id, c.name AS name, c.credit_rating AS credit_rating ORDER BY c.name`
    );
    return NextResponse.json({ success: true, demo: false, data: companies });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "시공사 목록 조회 오류";
    console.error("[/api/contagion GET]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/** POST: 연쇄부도 시뮬레이션 실행 */
export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "companyId 필수" },
        { status: 400 }
      );
    }

    await ensureNeo4j();

    // 데모 모드
    if (!Neo4jService.isConnected()) {
      return NextResponse.json({
        success: true,
        demo: true,
        data: {
          paths: MOCK_CONTAGION_PATHS,
          exposure: MOCK_CONTAGION_EXPOSURE,
          summary: MOCK_CONTAGION_SUMMARY,
        },
      });
    }

    // 실제 모드: 3개 쿼리 병렬 실행
    const [paths, exposure, summaryRows] = await Promise.all([
      Neo4jService.runReadQuery(CONTAGION_PATH_QUERY, { companyId }),
      Neo4jService.runReadQuery(CONTAGION_EXPOSURE_QUERY, { companyId }),
      Neo4jService.runReadQuery(CONTAGION_SUMMARY_QUERY, { companyId }),
    ]);

    return NextResponse.json({
      success: true,
      demo: false,
      data: {
        paths,
        exposure,
        summary: summaryRows[0] ?? null,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "시뮬레이션 오류";
    console.error("[/api/contagion POST]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
