type Event = {
  id: string
  type: string
  message: string
  timestamp: number
}

export default function EventsList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">No events received yet. Try sending a test event.</div>
    )
  }

  return (
    <div className="space-y-1 max-h-[400px] overflow-y-auto">
      {events.map((event) => (
        <div key={event.id} className="p-3 border rounded-md text-sm animate-fadeIn">
          <div className="flex justify-between items-start">
            <span className="font-medium">{event.type}</span>
            <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</span>
          </div>
          <p className="mt-1 text-muted-foreground">{event.message}</p>
        </div>
      ))}
    </div>
  )
}
