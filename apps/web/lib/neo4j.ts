// ═══════════════════════════════════════════════════════════════════════════
// Neo4j 서버 전용 싱글턴 서비스
// 브라우저에서 import 금지 — API Route / Server Component 전용
// ═══════════════════════════════════════════════════════════════════════════

import neo4j, { type Driver, type Session, type Integer } from "neo4j-driver";

interface Neo4jConfig {
  uri: string;
  user: string;
  pass: string;
}

// 모듈 레벨 싱글턴 — Next.js 서버 환경에서 요청 간 재사용
let driver: Driver | null = null;

/** Neo4j Integer → JS number 변환 (neo4j-driver 반환값 후처리) */
function toNative(val: unknown): unknown {
  if (val === null || val === undefined) return val;
  if (neo4j.isInt(val)) return (val as Integer).toNumber();
  if (Array.isArray(val)) return val.map(toNative);
  if (typeof val === "object") {
    return Object.fromEntries(
      Object.entries(val as Record<string, unknown>).map(([k, v]) => [
        k,
        toNative(v),
      ])
    );
  }
  return val;
}

export const Neo4jService = {
  async connect(config: Neo4jConfig): Promise<void> {
    if (driver) {
      try {
        await driver.close();
      } catch (_) {
        /* ignore */
      }
    }
    driver = neo4j.driver(
      config.uri,
      neo4j.auth.basic(config.user, config.pass),
      { connectionTimeout: 10000, maxConnectionPoolSize: 10 }
    );
    // 연결 테스트
    await driver.getServerInfo();
  },

  /** 읽기 전용 쿼리 — 실제 행 데이터를 Record[] 로 반환 */
  async runReadQuery(
    cypher: string,
    params: Record<string, unknown> = {}
  ): Promise<Record<string, unknown>[]> {
    if (!driver) throw new Error("Neo4j가 연결되지 않았습니다");
    const session: Session = driver.session({
      defaultAccessMode: neo4j.session.READ,
    });
    try {
      const result = await session.run(cypher, params);
      return result.records.map((r) =>
        Object.fromEntries(r.keys.map((k) => [k, toNative(r.get(k))]))
      );
    } finally {
      await session.close();
    }
  },

  async disconnect(): Promise<void> {
    if (driver) {
      await driver.close();
      driver = null;
    }
  },

  isConnected(): boolean {
    return driver !== null;
  },
};
