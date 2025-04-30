"use client"

import { useEffect, useRef } from "react"

type MetricsChartProps = {
  data: Array<{ timestamp: number; value: number }>
  color: string
  label: string
  maxValue: number
}

export default function MetricsChart({ data, color, label, maxValue }: MetricsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (data.length === 0) {
      // Draw "No data" message
      ctx.fillStyle = "#9ca3af"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("No data available", canvas.width / 2, canvas.height / 2)
      return
    }

    // Draw the line chart
    const padding = 20
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Draw the axes
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, canvas.height - padding)
    ctx.lineTo(canvas.width - padding, canvas.height - padding)
    ctx.stroke()

    // Draw the data line
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth
      const y = canvas.height - padding - (point.value / maxValue) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    data.forEach((point, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth
      const y = canvas.height - padding - (point.value / maxValue) * chartHeight

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw the latest value
    if (data.length > 0) {
      const latestValue = data[data.length - 1].value
      ctx.fillStyle = "#374151"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${latestValue.toFixed(1)} ${label}`, canvas.width - padding, padding + 16)
    }
  }, [data, color, label, maxValue])

  return (
    <div className="w-full h-[200px]">
      <canvas ref={canvasRef} width={400} height={200} className="w-full h-full" />
    </div>
  )
}
