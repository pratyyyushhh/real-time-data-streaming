export default function StatusIndicator({ connected }: { connected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
      <span className="text-sm font-medium">{connected ? "Connected" : "Disconnected"}</span>
    </div>
  )
}
