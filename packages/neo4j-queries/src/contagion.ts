// ═══════════════════════════════════════════════════════════════════════════
// 연쇄 부도 시뮬레이션 Cypher 쿼리
// 시공사 부도 → PF → 트렌치 → 펀드 영향 경로 분석
// ═══════════════════════════════════════════════════════════════════════════

/** 특정 시공사에서 시작하는 연쇄 부도 경로 조회 */
export const CONTAGION_PATH_QUERY = `
  MATCH path = (c:Company {company_id: $companyId})
    -[:RESPONSIBLE_FOR_COMPLETION]->(pf:ProjectFinance)
    -[:HAS_TRANCHE]->(t:Tranche)
    -[:HELD_BY]->(f:Fund)
  RETURN
    c.name AS company,
    pf.project_name AS project,
    t.seniority AS tranche_seniority,
    t.principal AS tranche_principal,
    t.recovery_rate_estimate AS recovery_rate,
    f.fund_name AS fund,
    f.nav AS fund_nav,
    path
  ORDER BY t.priority ASC
`;

/** 연쇄 부도 총 익스포저 계산 */
export const CONTAGION_EXPOSURE_QUERY = `
  MATCH (c:Company {company_id: $companyId})
    -[:RESPONSIBLE_FOR_COMPLETION]->(pf:ProjectFinance)
    -[:HAS_TRANCHE]->(t:Tranche)
    -[:HELD_BY]->(f:Fund)
  WITH f, SUM(t.principal * (1 - COALESCE(t.recovery_rate_estimate, 0.3))) AS loss_estimate
  RETURN
    f.fund_name AS fund,
    f.nav AS nav,
    loss_estimate,
    ROUND(loss_estimate / f.nav * 100, 2) AS nav_impact_pct
  ORDER BY nav_impact_pct DESC
`;

/** 영향받는 펀드 수 및 총 손실 추정 */
export const CONTAGION_SUMMARY_QUERY = `
  MATCH (c:Company {company_id: $companyId})
    -[:RESPONSIBLE_FOR_COMPLETION]->(pf:ProjectFinance)
    -[:HAS_TRANCHE]->(t:Tranche)
    -[:HELD_BY]->(f:Fund)
  RETURN
    c.name AS company,
    COUNT(DISTINCT pf) AS affected_projects,
    COUNT(DISTINCT t) AS affected_tranches,
    COUNT(DISTINCT f) AS affected_funds,
    SUM(t.principal) AS total_exposure,
    SUM(t.principal * (1 - COALESCE(t.recovery_rate_estimate, 0.3))) AS estimated_loss
`;
