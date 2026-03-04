// ═══════════════════════════════════════════════════════════════════════════
// API 응답 타입 — 모든 API는 이 포맷을 따름
// ═══════════════════════════════════════════════════════════════════════════

/** 표준 API 응답 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** 그래프 쿼리 요청 */
export interface GraphQueryRequest {
  action: "query" | "contagion" | "covenant-check" | "peer-match" | "schema";
  cypher?: string;
  params?: Record<string, unknown>;
  companyId?: string;
  peId?: string;
}

/** 그래프 쿼리 응답 */
export interface GraphQueryResponse {
  records: Record<string, unknown>[];
  summary?: {
    nodesCreated?: number;
    relationshipsCreated?: number;
    propertiesSet?: number;
  };
}

/** 연쇄 부도 시뮬레이션 결과 */
export interface ContagionResult {
  sourceCompany: string;
  affectedPaths: ContagionPath[];
  totalExposure: number;
  affectedFundCount: number;
}

export interface ContagionPath {
  path: string[]; // [Company → PF → Tranche → Fund]
  exposure: number;
  recoveryRate: number;
  lossEstimate: number;
}

/** Covenant 위반 조회 결과 */
export interface CovenantBreachResult {
  covenantId: string;
  covenantType: string;
  threshold: number;
  currentValue: number;
  status: "COMPLIANT" | "WARNING" | "BREACHED";
  loanId: string;
  loanName: string;
}
