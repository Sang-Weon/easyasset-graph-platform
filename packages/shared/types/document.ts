// ═══════════════════════════════════════════════════════════════════════════
// 문서 처리 파이프라인 타입
// ═══════════════════════════════════════════════════════════════════════════

import type { ProcessingStatus, DocumentType } from "./graph";

/** Firestore 문서 메타데이터 (실시간 상태 추적) */
export interface DocumentMetadata {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;

  documentType?: DocumentType;
  status: ProcessingStatus;

  // 처리 단계별 상태
  steps: {
    upload: StepStatus;
    parse: StepStatus;
    extract: StepStatus;
    save: StepStatus;
  };

  // 결과
  pageCount?: number;
  entityCount?: number;
  relationCount?: number;
  covenantCount?: number;
  confidence?: number;

  // 에러
  error?: string;
  retryCount: number;

  createdAt: string;
  updatedAt: string;
}

export interface StepStatus {
  status: "pending" | "running" | "completed" | "failed";
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

/** Upstage Document Parse 결과 */
export interface ParseResult {
  markdown: string;
  tables: TableData[];
  metadata: {
    page_count: number;
    has_tables: boolean;
    ocr_applied: boolean;
  };
}

export interface TableData {
  page: number;
  index: number;
  headers: string[];
  rows: string[][];
}

/** Claude NER/RE 추출 결과 */
export interface ExtractionResult {
  entities: ExtractedEntity[];
  relations: ExtractedRelation[];
  covenants: ExtractedCovenant[];
}

export interface ExtractedEntity {
  type: string; // COMPANY, PROJECT, LOAN, TRANCHE, AMOUNT, DATE, COVENANT
  id: string;
  name: string;
  properties: Record<string, unknown>;
  confidence: number;
  evidence: string; // 원문 인용
}

export interface ExtractedRelation {
  subject: string; // entity id
  relation: string; // RESPONSIBLE_FOR, SECURED_BY, etc.
  object: string; // entity id
  properties: Record<string, unknown>;
  evidence: string;
}

export interface ExtractedCovenant {
  type: string; // DSCR, LTV, ICR
  operator: string;
  threshold: number;
  source_text: string;
}
