// ═══════════════════════════════════════════════════════════════════════════
// Neo4j 검색 인덱스 — 성능 최적화
// 실행 순서: 2/3
// ═══════════════════════════════════════════════════════════════════════════

// --- 회사 검색 ---
CREATE INDEX company_name_idx IF NOT EXISTS
FOR (c:Company) ON (c.name);

CREATE INDEX company_credit_rating_idx IF NOT EXISTS
FOR (c:Company) ON (c.credit_rating);

// --- 프로젝트 검색 ---
CREATE INDEX project_status_idx IF NOT EXISTS
FOR (p:ProjectFinance) ON (p.status);

CREATE INDEX project_location_idx IF NOT EXISTS
FOR (p:ProjectFinance) ON (p.location_city);

CREATE INDEX project_start_date_idx IF NOT EXISTS
FOR (p:ProjectFinance) ON (p.start_date);

// --- 대출 검색 ---
CREATE INDEX loan_type_idx IF NOT EXISTS
FOR (l:PrivateCredit) ON (l.loan_type);

CREATE INDEX loan_maturity_idx IF NOT EXISTS
FOR (l:PrivateCredit) ON (l.maturity_date);

// --- Covenant 검색 ---
CREATE INDEX covenant_type_idx IF NOT EXISTS
FOR (c:Covenant) ON (c.covenant_type);

CREATE INDEX covenant_status_idx IF NOT EXISTS
FOR (c:Covenant) ON (c.status);

// --- 문서 검색 ---
CREATE INDEX document_type_idx IF NOT EXISTS
FOR (d:Document) ON (d.document_type);

CREATE INDEX document_upload_date_idx IF NOT EXISTS
FOR (d:Document) ON (d.upload_date);

// --- Full-Text 인덱스 (텍스트 검색) ---
CREATE FULLTEXT INDEX company_fulltext IF NOT EXISTS
FOR (c:Company) ON EACH [c.name, c.description];

CREATE FULLTEXT INDEX document_fulltext IF NOT EXISTS
FOR (d:Document) ON EACH [d.title, d.summary];
