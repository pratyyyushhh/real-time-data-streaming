"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Send } from "lucide-react"
import MetricsChart from "@/components/metrics-chart"
import EventsList from "@/components/events-list"
import StatusIndicator from "@/components/status-indicator"
import PusherConnection from "@/components/pusher-connection"

// Types for our metrics data
type Metric = {
  timestamp: number
  value: number
}

type Event = {
  id: string
  type: string
  message: string
  timestamp: number
}

export default function Dashboard() {
  const [cpuMetrics, setCpuMetrics] = useState<Metric[]>([])
  const [memoryMetrics, setMemoryMetrics] = useState<Metric[]>([])
  const [networkMetrics, setNetworkMetrics] = useState<Metric[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Function to simulate sending a test event
  const sendTestEvent = async () => {
    try {
      const response = await fetch("/api/trigger-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "test-event",
          message: "This is a test event triggered manually",
          timestamp: Date.now(),
        }),
      })

      const data = await response.json()

      // If we're in preview/demo mode, manually add the event to our state
      // This simulates what would happen if Pusher delivered the event
      if (data.success && data.event) {
        setEvents((prev) => [data.event, ...prev].slice(0, 100))
      }
    } catch (error) {
      console.error("Failed to send test event:", error)
    }
  }

  // Update the last updated timestamp whenever we receive new data
  useEffect(() => {
    if (cpuMetrics.length > 0 || memoryMetrics.length > 0 || networkMetrics.length > 0 || events.length > 0) {
      setLastUpdated(new Date())
    }
  }, [cpuMetrics, memoryMetrics, networkMetrics, events])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <StatusIndicator connected={isConnected} />
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={sendTestEvent}>
            <Send className="h-4 w-4 mr-2" />
            Send Test Event
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <PusherConnection
        onConnect={() => setIsConnected(true)}
        onDisconnect={() => setIsConnected(false)}
        onCpuMetric={(data) => setCpuMetrics((prev) => [...prev, data].slice(-20))}
        onMemoryMetric={(data) => setMemoryMetrics((prev) => [...prev, data].slice(-20))}
        onNetworkMetric={(data) => setNetworkMetrics((prev) => [...prev, data].slice(-20))}
        onEvent={(data) => setEvents((prev) => [data, ...prev].slice(0, 100))}
      />

      <Tabs defaultValue="metrics">
        <TabsList>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>CPU Usage</CardTitle>
                <CardDescription>Real-time CPU utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsChart data={cpuMetrics} color="#0ea5e9" label="CPU %" maxValue={100} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Memory Usage</CardTitle>
                <CardDescription>Real-time memory consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsChart data={memoryMetrics} color="#10b981" label="Memory (MB)" maxValue={1024} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Network Traffic</CardTitle>
                <CardDescription>Real-time network throughput</CardDescription>
              </CardHeader>
              <CardContent>
                <MetricsChart data={networkMetrics} color="#8b5cf6" label="Network (Mbps)" maxValue={100} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Stream</CardTitle>
              <CardDescription>Real-time events from the system</CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList events={events} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
