// ═══════════════════════════════════════════════════════════════════════════
// Covenant 상태 조회 API
// GET /api/covenants
// ═══════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { Neo4jService } from "@/lib/neo4j";
import {
  COVENANT_BREACHES_QUERY,
  COVENANT_STATS_QUERY,
} from "@easyasset/neo4j-queries";
import { MOCK_COVENANTS, MOCK_COVENANT_STATS } from "@/lib/mock-data";

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

export async function GET() {
  try {
    await ensureNeo4j();

    // 데모 모드
    if (!Neo4jService.isConnected()) {
      return NextResponse.json({
        success: true,
        demo: true,
        data: {
          covenants: MOCK_COVENANTS,
          stats: MOCK_COVENANT_STATS,
        },
      });
    }

    // 실제 모드
    const [breaches, statsRows] = await Promise.all([
      Neo4jService.runReadQuery(COVENANT_BREACHES_QUERY),
      Neo4jService.runReadQuery(COVENANT_STATS_QUERY),
    ]);

    const stats = {
      breached: 0,
      warning: 0,
      compliant: 0,
    };
    for (const row of statsRows) {
      const s = String(row.status).toLowerCase() as keyof typeof stats;
      if (s in stats) stats[s] = Number(row.count) || 0;
    }

    return NextResponse.json({
      success: true,
      demo: false,
      data: { covenants: breaches, stats },
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Covenant 조회 오류";
    console.error("[/api/covenants]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
