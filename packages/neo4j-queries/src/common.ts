// ═══════════════════════════════════════════════════════════════════════════
// 공통 Cypher 쿼리 — 스키마/통계/기본 CRUD
// ═══════════════════════════════════════════════════════════════════════════

/** 그래프 스키마 조회 (노드 레이블 + 관계 타입) */
export const SCHEMA_QUERY = `
  CALL db.schema.visualization()
`;

/** 그래프 통계 — 노드/관계 수 */
export const STATS_QUERY = `
  CALL {
    MATCH (n) RETURN labels(n)[0] AS label, COUNT(n) AS count
  }
  RETURN label, count
  ORDER BY count DESC
`;

/** 관계 통계 */
export const RELATIONSHIP_STATS_QUERY = `
  CALL {
    MATCH ()-[r]->() RETURN type(r) AS type, COUNT(r) AS count
  }
  RETURN type, count
  ORDER BY count DESC
`;

/** 대시보드 요약 — 포트폴리오 현황 */
export const PORTFOLIO_SUMMARY_QUERY = `
  OPTIONAL MATCH (pf:ProjectFinance)
  WITH COUNT(pf) AS pf_count, SUM(pf.total_loan) AS pf_total
  OPTIONAL MATCH (loan:PrivateCredit)
  WITH pf_count, pf_total, COUNT(loan) AS loan_count, SUM(loan.outstanding) AS loan_total
  OPTIONAL MATCH (pe:PrivateEquity {status: 'ACTIVE'})
  WITH pf_count, pf_total, loan_count, loan_total, COUNT(pe) AS pe_count, SUM(pe.current_valuation) AS pe_total
  OPTIONAL MATCH (f:Fund)
  WITH pf_count, pf_total, loan_count, loan_total, pe_count, pe_total, COUNT(f) AS fund_count, SUM(f.nav) AS total_nav
  RETURN
    pf_count, pf_total,
    loan_count, loan_total,
    pe_count, pe_total,
    fund_count, total_nav
`;

/** 회사 검색 (이름 기반) */
export const SEARCH_COMPANY_QUERY = `
  MATCH (c:Company)
  WHERE c.name CONTAINS $query OR c.name_en CONTAINS $query
  RETURN c
  LIMIT $limit
`;

/** 연결 테스트 */
export const CONNECTION_TEST_QUERY = `
  RETURN 'Connection successful!' AS message, datetime() AS timestamp
`;
