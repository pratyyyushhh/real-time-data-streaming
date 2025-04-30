import { NextResponse } from "next/server"

// Function to generate random metrics
function generateMetrics() {
  const timestamp = Date.now()

  return {
    cpu: {
      timestamp,
      value: Math.random() * 100, // 0-100%
    },
    memory: {
      timestamp,
      value: 200 + Math.random() * 800, // 200-1000 MB
    },
    network: {
      timestamp,
      value: Math.random() * 100, // 0-100 Mbps
    },
  }
}

export async function GET() {
  try {
    const metrics = generateMetrics()

    // In a real implementation, we would trigger events on Pusher here
    // But for the demo/preview, we'll just return the metrics
    // This avoids the crypto.createHash error

    return NextResponse.json({
      success: true,
      message: "Data simulated successfully (preview mode)",
      metrics,
    })
  } catch (error) {
    console.error("Error simulating data:", error)
    return NextResponse.json({ error: "Failed to simulate data" }, { status: 500 })
  }
}
