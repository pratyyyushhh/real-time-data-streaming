import Dashboard from "@/components/dashboard"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Data Streaming Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor live data streams with real-time updates via WebSockets</p>
        </div>
        <Dashboard />
      </div>
    </main>
  )
}
