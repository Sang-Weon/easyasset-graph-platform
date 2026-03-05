// ═══════════════════════════════════════════════════════════════════════════
// 데모 모드 목업 데이터 — Neo4j 미연결 시 API 라우트 폴백
// 기존 정적 대시보드 페이지의 한국어 데이터와 동일한 값 유지
// ═══════════════════════════════════════════════════════════════════════════

// --- 시공사 목록 (시뮬레이션 드롭다운용) ---

export const MOCK_COMPANIES = [
  { company_id: "C-001", name: "태영건설", credit_rating: "BB+", company_type: "CONSTRUCTOR" },
  { company_id: "C-002", name: "GS건설", credit_rating: "A-", company_type: "CONSTRUCTOR" },
  { company_id: "C-003", name: "롯데건설", credit_rating: "BBB+", company_type: "CONSTRUCTOR" },
  { company_id: "C-004", name: "대우건설", credit_rating: "BBB", company_type: "CONSTRUCTOR" },
  { company_id: "C-005", name: "현대건설", credit_rating: "AA-", company_type: "CONSTRUCTOR" },
  { company_id: "C-006", name: "한화솔루션", credit_rating: "A", company_type: "CONSTRUCTOR" },
];

// --- 연쇄부도 시뮬레이션 ---

export const MOCK_CONTAGION_PATHS = [
  {
    company: "태영건설",
    project: "강남 센터프라임 타워",
    tranche_seniority: "SENIOR",
    tranche_principal: 80000000000,
    recovery_rate: 0.95,
    fund: "KB부동산대출1호",
    fund_nav: 500000000000,
  },
  {
    company: "태영건설",
    project: "강남 센터프라임 타워",
    tranche_seniority: "MEZZANINE",
    tranche_principal: 30000000000,
    recovery_rate: 0.4,
    fund: "신한메자닌펀드",
    fund_nav: 200000000000,
  },
  {
    company: "태영건설",
    project: "강남 센터프라임 타워",
    tranche_seniority: "JUNIOR",
    tranche_principal: 10000000000,
    recovery_rate: 0.05,
    fund: "하나에쿼티펀드",
    fund_nav: 80000000000,
  },
  {
    company: "태영건설",
    project: "판교 물류센터",
    tranche_seniority: "SENIOR",
    tranche_principal: 60000000000,
    recovery_rate: 0.9,
    fund: "NH물류투자1호",
    fund_nav: 300000000000,
  },
  {
    company: "태영건설",
    project: "판교 물류센터",
    tranche_seniority: "MEZZANINE",
    tranche_principal: 20000000000,
    recovery_rate: 0.35,
    fund: "KB메자닌2호",
    fund_nav: 150000000000,
  },
  {
    company: "태영건설",
    project: "인천 오피스텔",
    tranche_seniority: "SENIOR",
    tranche_principal: 40000000000,
    recovery_rate: 0.85,
    fund: "삼성부동산신탁",
    fund_nav: 400000000000,
  },
];

export const MOCK_CONTAGION_SUMMARY = {
  company: "태영건설",
  affected_projects: 3,
  affected_tranches: 6,
  affected_funds: 5,
  total_exposure: 240000000000,
  estimated_loss: 112000000000,
};

export const MOCK_CONTAGION_EXPOSURE = [
  { fund: "KB부동산대출1호", nav: 500000000000, loss_estimate: 4000000000, nav_impact_pct: 0.8 },
  { fund: "신한메자닌펀드", nav: 200000000000, loss_estimate: 18000000000, nav_impact_pct: 9.0 },
  { fund: "하나에쿼티펀드", nav: 80000000000, loss_estimate: 9500000000, nav_impact_pct: 11.9 },
  { fund: "NH물류투자1호", nav: 300000000000, loss_estimate: 6000000000, nav_impact_pct: 2.0 },
  { fund: "KB메자닌2호", nav: 150000000000, loss_estimate: 13000000000, nav_impact_pct: 8.7 },
];

// --- Covenant 데이터 ---

export const MOCK_COVENANTS = [
  { covenant_id: "COV-001", type: "DSCR", name: "강남타워 DSCR", operator: ">=", threshold: 1.2, current_value: 0.95, status: "BREACHED", measurement: "2024-Q4", loan: "강남타워 시니어론", cure_period: 30 },
  { covenant_id: "COV-002", type: "LTV", name: "판교물류 LTV", operator: "<=", threshold: 0.7, current_value: 0.73, status: "WARNING", measurement: "2024-Q4", loan: "판교물류 대출", cure_period: 60 },
  { covenant_id: "COV-003", type: "ICR", name: "인천오피스텔 ICR", operator: ">=", threshold: 1.5, current_value: 1.55, status: "WARNING", measurement: "2024-Q4", loan: "인천 PF대출", cure_period: 30 },
  { covenant_id: "COV-004", type: "DSCR", name: "송도PF DSCR", operator: ">=", threshold: 1.3, current_value: 1.42, status: "WARNING", measurement: "2024-Q4", loan: "송도 시니어론", cure_period: 45 },
  { covenant_id: "COV-005", type: "LTV", name: "강남타워 LTV", operator: "<=", threshold: 0.65, current_value: 0.58, status: "COMPLIANT", measurement: "2024-Q4", loan: "강남타워 시니어론", cure_period: 60 },
  { covenant_id: "COV-006", type: "EBITDA", name: "테크스타트업A EBITDA", operator: ">=", threshold: 50, current_value: 62, status: "COMPLIANT", measurement: "2024-Q4", loan: "PE 성장대출", cure_period: 90 },
  { covenant_id: "COV-007", type: "ICR", name: "분당오피스 ICR", operator: ">=", threshold: 2.0, current_value: 2.8, status: "COMPLIANT", measurement: "2024-Q4", loan: "분당 메자닌론", cure_period: 30 },
];

export const MOCK_COVENANT_STATS = {
  breached: 1,
  warning: 3,
  compliant: 3,
};

// --- 포트폴리오 요약 ---

export const MOCK_PORTFOLIO_SUMMARY = {
  total_aum: "₩ 2.8조",
  pf_count: 18,
  pc_count: 24,
  pe_count: 15,
  fund_count: 12,
  document_count: 127,
};
