"use client"

import { useEffect } from "react"

type PusherConnectionProps = {
  onConnect: () => void
  onDisconnect: () => void
  onCpuMetric: (data: { timestamp: number; value: number }) => void
  onMemoryMetric: (data: { timestamp: number; value: number }) => void
  onNetworkMetric: (data: { timestamp: number; value: number }) => void
  onEvent: (data: { id: string; type: string; message: string; timestamp: number }) => void
}

export default function PusherConnection({
  onConnect,
  onDisconnect,
  onCpuMetric,
  onMemoryMetric,
  onNetworkMetric,
  onEvent,
}: PusherConnectionProps) {
  useEffect(() => {
    let metricsInterval: NodeJS.Timeout | null = null
    let eventInterval: NodeJS.Timeout | null = null
    let isConnected = false

    // Load Pusher script dynamically
    const script = document.createElement("script")
    script.src = "https://js.pusher.com/8.2.0/pusher.min.js"
    script.async = true

    script.onload = () => {
      // If we're already connected, don't reconnect
      if (isConnected) return

      // If no Pusher key is provided, simulate data for demo purposes
      if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
        console.log("No Pusher key provided, simulating data for demo")

        // Only call onConnect once
        if (!isConnected) {
          onConnect()
          isConnected = true
        }

        // Simulate metrics data
        const simulateMetrics = () => {
          onCpuMetric({
            timestamp: Date.now(),
            value: Math.random() * 100,
          })

          onMemoryMetric({
            timestamp: Date.now(),
            value: 200 + Math.random() * 800,
          })

          onNetworkMetric({
            timestamp: Date.now(),
            value: Math.random() * 100,
          })
        }

        // Simulate events occasionally
        const simulateEvent = () => {
          const eventTypes = ["system", "user", "error", "warning", "info"]
          const messages = [
            "User logged in",
            "System update completed",
            "Database connection error",
            "High CPU usage detected",
            "New data source connected",
            "API rate limit reached",
            "Backup completed successfully",
          ]

          onEvent({
            id: crypto.randomUUID(),
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
            timestamp: Date.now(),
          })
        }

        // Initial data
        simulateMetrics()
        simulateEvent()

        // Set up intervals for simulation
        metricsInterval = setInterval(simulateMetrics, 2000)
        eventInterval = setInterval(simulateEvent, 5000)

        return
      }

      // Initialize Pusher client
      const pusher = new (window as any).Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
        forceTLS: true,
      })

      // Subscribe to the data channel
      const channel = pusher.subscribe("data-stream")

      // Bind to connection events
      pusher.connection.bind("connected", () => {
        console.log("Connected to Pusher")
        if (!isConnected) {
          onConnect()
          isConnected = true
        }
      })

      pusher.connection.bind("disconnected", () => {
        console.log("Disconnected from Pusher")
        onDisconnect()
        isConnected = false
      })

      // Bind to metric events
      channel.bind("cpu-metric", (data: any) => {
        onCpuMetric({
          timestamp: data.timestamp || Date.now(),
          value: data.value,
        })
      })

      channel.bind("memory-metric", (data: any) => {
        onMemoryMetric({
          timestamp: data.timestamp || Date.now(),
          value: data.value,
        })
      })

      channel.bind("network-metric", (data: any) => {
        onNetworkMetric({
          timestamp: data.timestamp || Date.now(),
          value: data.value,
        })
      })

      // Bind to general events
      channel.bind("event", (data: any) => {
        onEvent({
          id: data.id || crypto.randomUUID(),
          type: data.type,
          message: data.message,
          timestamp: data.timestamp || Date.now(),
        })
      })

      // Clean up function for Pusher
      return () => {
        channel.unbind_all()
        pusher.unsubscribe("data-stream")
        pusher.disconnect()
      }
    }

    document.body.appendChild(script)

    // Clean up function
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }

      if (metricsInterval) clearInterval(metricsInterval)
      if (eventInterval) clearInterval(eventInterval)

      if (isConnected) {
        onDisconnect()
      }
    }
  }, []) // Empty dependency array to ensure this only runs once

  return null
}
