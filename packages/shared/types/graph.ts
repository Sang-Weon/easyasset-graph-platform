// ═══════════════════════════════════════════════════════════════════════════
// EG Asset Pricing & Data Platform — 그래프 노드 타입 정의
// 설계서 v3.1 기준 9개 노드 타입
// ═══════════════════════════════════════════════════════════════════════════

// --- 공통 시스템 필드 ---

export interface SystemFields {
  created_at: string; // ISO datetime
  updated_at: string;
  created_by?: string;
  data_source?: string;
}

// --- 열거형 (Enum-like Union Types) ---

export type CompanyType =
  | "CONSTRUCTOR"
  | "TRUST"
  | "LENDER"
  | "BORROWER"
  | "GP"
  | "LP";

export type CreditOutlook = "POSITIVE" | "STABLE" | "NEGATIVE" | "WATCH";

export type ProjectType = "OFFICE" | "RESIDENTIAL" | "LOGISTICS" | "MIXED";

export type ProjectStatus =
  | "PLANNED"
  | "UNDER_CONSTRUCTION"
  | "COMPLETED"
  | "DISPOSED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type LoanType = "SENIOR" | "MEZZANINE" | "UNITRANCHE" | "BRIDGE";

export type InterestRateType = "FIXED" | "FLOATING";

export type AmortizationType = "BULLET" | "AMORTIZING";

export type LoanStatus = "PERFORMING" | "WATCHLIST" | "DEFAULT";

export type TrancheSeniority = "SENIOR" | "MEZZANINE" | "JUNIOR" | "EQUITY";

export type PaymentFrequency = "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL";

export type CovenantType =
  | "DSCR"
  | "LTV"
  | "ICR"
  | "EBITDA"
  | "NET_DEBT_EBITDA";

export type CovenantOperator = ">=" | "<=" | "==" | "!=" | ">" | "<";

export type CovenantStatus = "COMPLIANT" | "WARNING" | "BREACHED";

export type MeasurementPeriod = "QUARTERLY" | "SEMI_ANNUAL" | "ANNUAL";

export type FundType = "BLIND_POOL" | "DEAL_BY_DEAL" | "CLUB_DEAL";

export type FundStatus =
  | "FUNDRAISING"
  | "INVESTING"
  | "HARVESTING"
  | "LIQUIDATED";

export type InvestmentStage =
  | "SEED"
  | "SERIES_A"
  | "SERIES_B"
  | "SERIES_C"
  | "SERIES_D"
  | "GROWTH"
  | "BUYOUT";

export type PEStatus = "ACTIVE" | "EXITED" | "WRITTEN_OFF";

export type MacroEventType =
  | "RATE_CHANGE"
  | "POLICY_CHANGE"
  | "ECONOMIC"
  | "CREDIT_EVENT";

export type DocumentType =
  | "LOAN_AGREEMENT"
  | "IM"
  | "LPA"
  | "FINANCIAL"
  | "APPRAISAL";

export type ProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

// --- 노드 타입 정의 (9개) ---

/** 회사/기관 */
export interface Company extends SystemFields {
  company_id: string;
  name: string;
  name_en?: string;
  business_registration_no?: string;
  company_type: CompanyType;

  // 신용 정보
  credit_rating?: string;
  credit_rating_agency?: string;
  credit_rating_date?: string;
  credit_outlook?: CreditOutlook;

  // 재무 정보
  total_assets?: number;
  total_debt?: number;
  revenue?: number;
  ebitda?: number;

  // 메타데이터
  industry?: string;
  sub_industry?: string;
  headquarters?: string;
  employee_count?: number;

  // 벡터 임베딩 (1024차원)
  embedding?: number[];
}

/** 부동산 PF (Project Finance) */
export interface ProjectFinance extends SystemFields {
  project_id: string;

  // 사업장 정보
  project_name: string;
  project_type: ProjectType;

  // 위치
  address?: string;
  location_city?: string;
  location_district?: string;

  // 규모
  land_area?: number;
  gfa?: number; // 연면적 (㎡)
  floors_above?: number;
  floors_below?: number;

  // 사업 정보
  project_cost?: number;
  construction_start?: string;
  construction_end_planned?: string;
  completion_rate?: number; // 0.0 ~ 1.0

  // 금융 정보
  total_loan?: number;
  ltv?: number;

  // 상태
  status: ProjectStatus;
  risk_level?: RiskLevel;
  start_date?: string;
}

/** 사모대출 (Private Credit) */
export interface PrivateCredit extends SystemFields {
  loan_id: string;

  // 기본 정보
  loan_name: string;
  loan_type: LoanType;

  // 금액
  principal: number;
  outstanding?: number;

  // 금리
  interest_rate_type?: InterestRateType;
  base_rate?: string;
  spread?: number;
  all_in_rate?: number;

  // 기간
  origination_date?: string;
  maturity_date?: string;
  amortization_type?: AmortizationType;

  // 담보
  collateral_type?: string;
  collateral_value?: number;
  lien_position?: number;

  // 재무비율
  ltv_current?: number;
  dscr_current?: number;
  icr_current?: number;

  // 상태
  status: LoanStatus;
}

/** 트렌치 (담보구조) */
export interface Tranche extends SystemFields {
  tranche_id: string;

  tranche_name: string;
  seniority: TrancheSeniority;
  priority: number; // 1이 가장 높음

  // 금액
  principal: number;
  current_value?: number;

  // 금리
  coupon_rate?: number;
  payment_frequency?: PaymentFrequency;

  // 회수율
  recovery_rate_estimate?: number;
  lgd_estimate?: number;
}

/** 재무유지약정 (Covenant) */
export interface Covenant extends SystemFields {
  covenant_id: string;

  covenant_type: CovenantType;
  covenant_name: string;

  // 조건
  operator: CovenantOperator;
  threshold: number;

  // 측정
  measurement_period?: MeasurementPeriod;
  measurement_date?: string;

  // 치유 조건
  cure_period_days?: number;
  cure_right?: boolean;

  // 현재 상태
  current_value?: number;
  status: CovenantStatus;
  last_checked?: string;

  // 근거 문서
  source_document_id?: string;
  source_page?: number;
  source_text?: string;
}

/** 펀드 */
export interface Fund extends SystemFields {
  fund_id: string;

  fund_name: string;
  fund_type: FundType;

  // 규모
  fund_size?: number;
  committed_capital?: number;
  called_capital?: number;

  // 수수료
  management_fee?: number;
  carried_interest?: number;
  hurdle_rate?: number;

  // 기간
  vintage_year?: number;
  fund_term_years?: number;
  investment_period_years?: number;

  // GP 정보
  gp_id?: string;
  gp_name?: string;

  // 상태
  status: FundStatus;

  // 성과 지표
  nav?: number;
  irr?: number;
  moic?: number;
}

/** PE (비상장주식 / Private Equity) */
export interface PrivateEquity extends SystemFields {
  pe_id: string;

  // 대상 회사
  company_name: string;
  company_name_en?: string;

  // 산업 분류
  industry_l1?: string;
  industry_l2?: string;
  industry_l3?: string;

  // 투자
  investment_stage: InvestmentStage;
  ownership_pct?: number;
  investment_date?: string;
  investment_amount?: number;

  // 밸류에이션
  entry_valuation?: number;
  entry_multiple_revenue?: number;
  current_valuation?: number;

  // 재무
  revenue?: number;
  revenue_growth_yoy?: number;
  ebitda?: number;
  ebitda_margin?: number;

  // KPI (SaaS)
  arr?: number;
  mrr?: number;
  nrr?: number;
  cac?: number;
  ltv?: number;

  // 벡터 임베딩
  business_model_embedding?: number[];

  status: PEStatus;
}

/** 거시 이벤트 */
export interface MacroEvent {
  event_id: string;

  event_type: MacroEventType;
  event_name: string;
  description?: string;

  magnitude?: number;
  effective_date?: string;

  source?: string;
  source_url?: string;

  created_at: string;
}

/** 문서 */
export interface Document extends SystemFields {
  document_id: string;

  title: string;
  document_type: DocumentType;
  file_name: string;

  // 저장
  storage_path: string;
  file_size?: number;
  page_count?: number;

  // 처리 상태
  processing_status: ProcessingStatus;
  extraction_confidence?: number;

  // 요약
  summary?: string;

  // 벡터 임베딩
  content_embedding?: number[];

  // 메타데이터
  upload_date?: string;
  uploaded_by?: string;
  last_accessed?: string;
}

// --- 관계 타입 정의 ---

/** 책임준공 (Company → ProjectFinance) */
export interface ResponsibleForCompletion {
  start_date?: string;
  end_date?: string;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED";
  guarantee_type: "FULL" | "PARTIAL" | "CONDITIONAL";
  guarantee_amount?: number;
  created_at: string;
}

/** 트렌치 구조 (ProjectFinance → Tranche) */
export interface HasTranche {
  creation_date?: string;
  tranche_order: number;
}

/** 보유 (Tranche → Fund) */
export interface HeldBy {
  acquisition_date?: string;
  principal_held?: number;
  current_value?: number;
  ownership_pct?: number;
  expected_recovery?: number;
}

/** 약정 (PrivateCredit → Covenant) */
export interface HasCovenant {
  effective_date?: string;
  priority: number;
}

/** 대출 차주 (PrivateCredit → Company) */
export interface BorrowedBy {
  origination_date?: string;
}

/** 담보 (PrivateCredit → ProjectFinance) */
export interface SecuredBy {
  collateral_type: string;
  collateral_value?: number;
  lien_position?: number;
  perfection_date?: string;
}

/** 투자 (Fund → PrivateEquity) */
export interface InvestsIn {
  investment_date?: string;
  investment_amount?: number;
  ownership_pct?: number;
  board_seats?: number;
}

/** 영향 (MacroEvent → any asset) */
export interface Impacts {
  weight: number;
  target_property?: string;
  direction: "INCREASE" | "DECREASE";
  propagation: "DIRECT" | "INDIRECT" | "CASCADING";
  lag_days?: number;
  formula?: string;
}

/** 문서 언급 (Document → any node) */
export interface Mentions {
  page_number?: number;
  confidence?: number;
  context?: string;
}

/** Covenant 포함 (Document → Covenant) */
export interface ContainsCovenant {
  page_number?: number;
  section?: string;
  source_text?: string;
}

// --- 그래프 노드 유니온 타입 ---

export type GraphNode =
  | Company
  | ProjectFinance
  | PrivateCredit
  | Tranche
  | Covenant
  | Fund
  | PrivateEquity
  | MacroEvent
  | Document;

export type GraphNodeLabel =
  | "Company"
  | "ProjectFinance"
  | "PrivateCredit"
  | "Tranche"
  | "Covenant"
  | "Fund"
  | "PrivateEquity"
  | "MacroEvent"
  | "Document";

export type RelationshipType =
  | "RESPONSIBLE_FOR_COMPLETION"
  | "HAS_TRANCHE"
  | "HELD_BY"
  | "HAS_COVENANT"
  | "BORROWED_BY"
  | "SECURED_BY"
  | "INVESTS_IN"
  | "IMPACTS"
  | "MENTIONS"
  | "CONTAINS_COVENANT";
