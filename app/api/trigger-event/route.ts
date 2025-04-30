import { NextResponse } from "next/server"

// Generate a simple ID without using crypto
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Add an ID if not provided
    if (!body.id) {
      body.id = generateId()
    }

    // In a real implementation, we would trigger the event on Pusher here
    // But for the demo/preview, we'll just return success
    // This avoids the crypto.createHash error

    // For demo purposes, we'll simulate a successful response
    return NextResponse.json({
      success: true,
      message: "Event triggered successfully (simulated in preview)",
      event: {
        ...body,
        timestamp: body.timestamp || Date.now(),
      },
    })
  } catch (error) {
    console.error("Error triggering event:", error)
    return NextResponse.json({ error: "Failed to trigger event" }, { status: 500 })
  }
}
