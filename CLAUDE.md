# EasyAsset Graph Platform

## 프로젝트 개요
대체자산(PF, Private Credit, PE) 평가를 위한 Graph Intelligence Platform.
금융 문서에서 엔티티/관계를 자동 추출, Neo4j 그래프로 리스크 분석.
금융기관, 연기금, GP에게 실시간 리스크 분석 서비스 제공.

## 기술 스택
- Frontend: Next.js 15, React 19, Tailwind CSS, shadcn/ui (new-york)
- Backend: Firebase Functions (2nd gen, Node.js 20, TypeScript)
- Graph DB: Neo4j Aura Professional (neo4j+s://)
- 문서 파싱: Upstage Document Parse ($0.02/page)
- AI: Claude API (claude-sonnet-4-20250514) + Vercel AI SDK
- 배포: Vercel (Frontend), Firebase (Backend)
- 패키지 매니저: pnpm
- 모노레포: Turborepo

## 핵심 도메인 용어
- PF (Project Finance): 부동산 프로젝트 파이낸싱
- Tranche: 선순위/중순위/후순위 대출 구조
- Covenant: 재무유지약정 (DSCR, LTV, ICR 등)
- Contagion Risk: 연쇄 부도 리스크 (시공사 부도 → PF → 펀드)
- 책임준공 (Responsible For Completion): 시공사의 사업장 완공 책임
- LGD (Loss Given Default): 부도시 손실률
- EWS (Early Warning System): 조기 경보 시스템

## Neo4j 스키마
### 노드 (9개)
- Company: company_id, name, credit_rating, company_type
- ProjectFinance: project_id, name, status, ltv, completion_rate
- PrivateCredit: loan_id, principal, interest_rate, maturity_date
- Tranche: tranche_id, seniority (SENIOR/MEZZANINE/JUNIOR), principal
- Fund: fund_id, fund_name, nav
- Covenant: covenant_id, type (DSCR/LTV/ICR), threshold, status
- PrivateEquity: pe_id, company_name, investment_amount, sector
- MacroEvent: event_id, event_type, magnitude, effective_date
- Document: document_id, title, document_type, processing_status

### 관계
- RESPONSIBLE_FOR: 책임준공 (Company → ProjectFinance)
- HAS_TRANCHE: 트렌치 구조 (ProjectFinance → Tranche)
- HELD_BY: 보유 (Tranche → Fund)
- HAS_COVENANT: 약정 (PrivateCredit → Covenant)
- SECURED_BY: 담보 (PrivateCredit → ProjectFinance)
- BORROWED_BY: 차입 (PrivateCredit → Company)
- INVESTS_IN: 투자 (Fund → PrivateEquity)
- IMPACTS: 영향 (MacroEvent → ProjectFinance)
- MENTIONS: 언급 (Document → Company)
- CONTAINS_COVENANT: 약정포함 (Document → Covenant)

## 코딩 규칙
1. TypeScript strict mode 필수
2. API 응답 형식: { success: boolean, data?: T, error?: string }
3. Neo4j 쿼리는 반드시 파라미터화 ($param) — SQL Injection 방지
4. Firebase Functions는 asia-northeast3 리전 사용
5. 에러는 try-catch로 감싸고 console.error 로깅
6. 컴포넌트: React Server Components 우선, 'use client'는 인터랙티브만
7. 한국어: 비즈니스 로직 주석, 사용자 에러 메시지
8. 영어: 기술 인터페이스, 로그, 변수명
9. Neo4j 접근: 서버사이드 전용 (Firebase Functions 또는 API Routes)

## 주요 명령어
```bash
pnpm dev                           # 전체 개발 서버
pnpm dev --filter=web              # Frontend만
pnpm build                         # 전체 빌드
pnpm firebase:emulators            # Firebase 에뮬레이터
pnpm neo4j:seed                    # 테스트 데이터 생성
```

## 환경 변수
```
NEO4J_URI=neo4j+s://xxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxx
ANTHROPIC_API_KEY=sk-ant-xxx
UPSTAGE_API_KEY=up-xxx
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
```

## 주요 파일 위치
- Neo4j 서비스: functions/src/services/neo4j.ts
- Upstage 서비스: functions/src/services/upstage.ts
- Claude NER: functions/src/services/claude.ts
- 추출 파이프라인: functions/src/services/extraction.ts
- 그래프 API: functions/src/api/graph.ts
- 문서 트리거: functions/src/triggers/onDocumentUpload.ts
- 대시보드: apps/web/app/(dashboard)/page.tsx
- AI 에이전트: apps/web/app/api/agent/route.ts
- 공유 타입: packages/shared/types/
- Neo4j 쿼리: packages/neo4j-queries/
