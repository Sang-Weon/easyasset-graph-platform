// ═══════════════════════════════════════════════════════════════════════════
// Neo4j 벡터 인덱스 — 시맨틱 검색 / Peer Matching
// 실행 순서: 3/3
// 요구사항: Neo4j Aura Professional 이상
// 임베딩 모델: BGE-M3 (1024차원, cosine similarity)
// ═══════════════════════════════════════════════════════════════════════════

// 회사 비즈니스 모델 임베딩
CREATE VECTOR INDEX company_embedding_idx IF NOT EXISTS
FOR (c:Company) ON (c.embedding)
OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1024,
    `vector.similarity_function`: 'cosine'
  }
};

// PE 비즈니스 모델 임베딩 (Peer Matching용)
CREATE VECTOR INDEX pe_business_model_idx IF NOT EXISTS
FOR (pe:PrivateEquity) ON (pe.business_model_embedding)
OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1024,
    `vector.similarity_function`: 'cosine'
  }
};

// 문서 내용 임베딩 (시맨틱 검색용)
CREATE VECTOR INDEX document_content_idx IF NOT EXISTS
FOR (d:Document) ON (d.content_embedding)
OPTIONS {
  indexConfig: {
    `vector.dimensions`: 1024,
    `vector.similarity_function`: 'cosine'
  }
};
