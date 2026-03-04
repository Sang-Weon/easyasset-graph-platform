// ═══════════════════════════════════════════════════════════════════════════
// PE Peer Matching — 벡터 유사도 기반 동종업체 비교
// ═══════════════════════════════════════════════════════════════════════════

/** 벡터 유사도 기반 PE Peer 검색 */
export const PEER_VECTOR_SEARCH_QUERY = `
  MATCH (target:PrivateEquity {pe_id: $peId})
  CALL db.index.vector.queryNodes(
    'pe_business_model_idx',
    $topK,
    target.business_model_embedding
  ) YIELD node AS peer, score
  WHERE peer.pe_id <> $peId
  RETURN
    peer.pe_id AS pe_id,
    peer.company_name AS company_name,
    peer.industry_l1 AS industry,
    peer.industry_l2 AS sub_industry,
    peer.investment_stage AS stage,
    peer.revenue AS revenue,
    peer.ebitda_margin AS ebitda_margin,
    peer.revenue_growth_yoy AS growth,
    peer.current_valuation AS valuation,
    ROUND(score * 100, 2) AS similarity_pct
  ORDER BY score DESC
`;

/** 산업 + 스테이지 기반 Peer 필터 검색 */
export const PEER_FILTER_QUERY = `
  MATCH (pe:PrivateEquity)
  WHERE pe.pe_id <> $peId
    AND pe.industry_l1 = $industry
    AND pe.status = 'ACTIVE'
    AND ($stage IS NULL OR pe.investment_stage = $stage)
  RETURN
    pe.pe_id AS pe_id,
    pe.company_name AS company_name,
    pe.industry_l2 AS sub_industry,
    pe.investment_stage AS stage,
    pe.revenue AS revenue,
    pe.ebitda_margin AS ebitda_margin,
    pe.revenue_growth_yoy AS growth,
    pe.current_valuation AS valuation,
    pe.entry_multiple_revenue AS entry_multiple
  ORDER BY pe.revenue DESC
  LIMIT $limit
`;

/** Peer 그룹 통계 (벤치마크) */
export const PEER_BENCHMARK_QUERY = `
  MATCH (pe:PrivateEquity)
  WHERE pe.industry_l1 = $industry AND pe.status = 'ACTIVE'
  RETURN
    COUNT(pe) AS peer_count,
    AVG(pe.revenue) AS avg_revenue,
    AVG(pe.ebitda_margin) AS avg_ebitda_margin,
    AVG(pe.revenue_growth_yoy) AS avg_growth,
    AVG(pe.entry_multiple_revenue) AS avg_entry_multiple,
    PERCENTILE_CONT(pe.ebitda_margin, 0.25) AS ebitda_margin_q1,
    PERCENTILE_CONT(pe.ebitda_margin, 0.5) AS ebitda_margin_median,
    PERCENTILE_CONT(pe.ebitda_margin, 0.75) AS ebitda_margin_q3
`;
