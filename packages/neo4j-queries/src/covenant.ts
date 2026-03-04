// ═══════════════════════════════════════════════════════════════════════════
// Covenant (재무유지약정) 관련 Cypher 쿼리
// ═══════════════════════════════════════════════════════════════════════════

/** 위반 상태인 Covenant 조회 (WARNING + BREACHED) */
export const COVENANT_BREACHES_QUERY = `
  MATCH (loan:PrivateCredit)-[:HAS_COVENANT]->(cov:Covenant)
  WHERE cov.status IN ['WARNING', 'BREACHED']
  RETURN
    cov.covenant_id AS covenant_id,
    cov.covenant_type AS type,
    cov.covenant_name AS name,
    cov.operator AS operator,
    cov.threshold AS threshold,
    cov.current_value AS current_value,
    cov.status AS status,
    cov.measurement_date AS next_measurement,
    cov.cure_period_days AS cure_days,
    loan.loan_id AS loan_id,
    loan.loan_name AS loan_name,
    loan.outstanding AS loan_outstanding
  ORDER BY
    CASE cov.status WHEN 'BREACHED' THEN 0 ELSE 1 END,
    cov.measurement_date ASC
`;

/** 특정 대출의 Covenant 전체 조회 */
export const LOAN_COVENANTS_QUERY = `
  MATCH (loan:PrivateCredit {loan_id: $loanId})-[:HAS_COVENANT]->(cov:Covenant)
  RETURN
    cov.covenant_id AS covenant_id,
    cov.covenant_type AS type,
    cov.covenant_name AS name,
    cov.operator AS operator,
    cov.threshold AS threshold,
    cov.current_value AS current_value,
    cov.status AS status,
    cov.last_checked AS last_checked
  ORDER BY cov.covenant_type
`;

/** Covenant 상태별 통계 */
export const COVENANT_STATS_QUERY = `
  MATCH (cov:Covenant)
  RETURN
    cov.status AS status,
    COUNT(*) AS count,
    COLLECT(cov.covenant_type) AS types
  ORDER BY
    CASE cov.status
      WHEN 'BREACHED' THEN 0
      WHEN 'WARNING' THEN 1
      ELSE 2
    END
`;

/** Covenant 값 업데이트 */
export const UPDATE_COVENANT_VALUE = `
  MATCH (cov:Covenant {covenant_id: $covenantId})
  SET
    cov.current_value = $currentValue,
    cov.status = CASE
      WHEN cov.operator = '>=' AND $currentValue < cov.threshold THEN 'BREACHED'
      WHEN cov.operator = '>=' AND $currentValue < cov.threshold * 1.1 THEN 'WARNING'
      WHEN cov.operator = '<=' AND $currentValue > cov.threshold THEN 'BREACHED'
      WHEN cov.operator = '<=' AND $currentValue > cov.threshold * 0.9 THEN 'WARNING'
      ELSE 'COMPLIANT'
    END,
    cov.last_checked = datetime(),
    cov.updated_at = datetime()
  RETURN cov
`;
