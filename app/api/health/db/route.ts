import { NextResponse } from "next/server"
import { checkDbConnection } from "@/lib/db-utils"

export async function GET() {
  try {
    const isHealthy = await checkDbConnection()
    
    if (isHealthy) {
      return NextResponse.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        database: "connected"
      })
    } else {
      return NextResponse.json({ 
        status: "unhealthy", 
        timestamp: new Date().toISOString(),
        database: "disconnected"
      }, { status: 503 })
    }
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json({ 
      status: "error", 
      timestamp: new Date().toISOString(),
      error: "Health check failed"
    }, { status: 500 })
  }
} 