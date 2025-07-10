"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { hasSupabase } from "@/lib/supabase"
import { Eye, EyeOff, RefreshCw } from "lucide-react"

export function DebugPanel() {
  const [showDebug, setShowDebug] = useState(false)
  const [envVars, setEnvVars] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Tidak ada",
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "❌ Tidak ada",
  })

  const refreshEnv = () => {
    setEnvVars({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ Tidak ada",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "❌ Tidak ada",
    })
  }

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button variant="outline" size="sm" onClick={() => setShowDebug(true)} className="bg-white shadow-lg">
          <Eye className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-80">
      <Card className="bg-white shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Panel</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={refreshEnv}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Supabase Status:</span>
              <Badge variant={hasSupabase ? "default" : "destructive"}>
                {hasSupabase ? "✅ Connected" : "❌ Offline"}
              </Badge>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium mb-1">Environment Variables:</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span>SUPABASE_URL:</span>
                <Badge variant={envVars.url.includes("supabase.co") ? "default" : "destructive"}>
                  {envVars.url.includes("supabase.co") ? "✅ Set" : "❌ Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>SUPABASE_ANON_KEY:</span>
                <Badge variant={envVars.key.startsWith("eyJ") ? "default" : "destructive"}>
                  {envVars.key.startsWith("eyJ") ? "✅ Set" : "❌ Missing"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <div>
              <strong>URL:</strong> {envVars.url}
            </div>
            <div>
              <strong>Key:</strong> {envVars.key.substring(0, 20)}...
            </div>
          </div>

          {!hasSupabase && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              <strong>Setup Required:</strong>
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Add env vars in Netlify</li>
                <li>Redeploy site</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
