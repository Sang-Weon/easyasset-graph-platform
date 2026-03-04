// ═══════════════════════════════════════════════════════════════════════════
// Neo4j 제약조건 — 9개 노드 UNIQUE 제약
// 실행 순서: 1/3 (constraints → indexes → vector-indexes)
// ═══════════════════════════════════════════════════════════════════════════

// 핵심 엔티티 고유 ID 제약
CREATE CONSTRAINT company_id IF NOT EXISTS
FOR (c:Company) REQUIRE c.company_id IS UNIQUE;

CREATE CONSTRAINT project_id IF NOT EXISTS
FOR (p:ProjectFinance) REQUIRE p.project_id IS UNIQUE;

CREATE CONSTRAINT loan_id IF NOT EXISTS
FOR (l:PrivateCredit) REQUIRE l.loan_id IS UNIQUE;

CREATE CONSTRAINT fund_id IF NOT EXISTS
FOR (f:Fund) REQUIRE f.fund_id IS UNIQUE;

CREATE CONSTRAINT tranche_id IF NOT EXISTS
FOR (t:Tranche) REQUIRE t.tranche_id IS UNIQUE;

CREATE CONSTRAINT covenant_id IF NOT EXISTS
FOR (c:Covenant) REQUIRE c.covenant_id IS UNIQUE;

CREATE CONSTRAINT document_id IF NOT EXISTS
FOR (d:Document) REQUIRE d.document_id IS UNIQUE;

CREATE CONSTRAINT pe_id IF NOT EXISTS
FOR (pe:PrivateEquity) REQUIRE pe.pe_id IS UNIQUE;

CREATE CONSTRAINT event_id IF NOT EXISTS
FOR (e:MacroEvent) REQUIRE e.event_id IS UNIQUE;
