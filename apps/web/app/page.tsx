export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          EasyAsset Graph Platform
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          대체자산 AI 평가 플랫폼 — PF, Private Credit, PE 포트폴리오의
          리스크를 그래프 기반으로 분석합니다.
        </p>
        <div className="flex gap-4">
          <a
            href="/dashboard"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            대시보드 시작
          </a>
        </div>
      </main>
    </div>
  );
}
