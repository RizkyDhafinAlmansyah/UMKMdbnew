"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, CheckCircle, Loader2 } from "lucide-react"
import { umkmService, hasSupabase } from "@/lib/supabase"

export function MigrationBanner() {
  const [localData, setLocalData] = useState<any[]>([])
  const [showBanner, setShowBanner] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrated, setMigrated] = useState(false)

  useEffect(() => {
    // Check if we have local data and Supabase is available
    if (typeof window !== "undefined" && hasSupabase) {
      const stored = JSON.parse(localStorage.getItem("umkm") || "[]")
      if (stored.length > 0) {
        setLocalData(stored)
        setShowBanner(true)
      }
    }
  }, [])

  const handleMigrate = async () => {
    try {
      setMigrating(true)

      // Upload each UMKM to Supabase
      for (const umkm of localData) {
        const { id, ...data } = umkm // Remove local ID
        await umkmService.create(data)
      }

      // Clear local storage after successful migration
      localStorage.removeItem("umkm")
      setMigrated(true)

      // Hide banner after 3 seconds
      setTimeout(() => {
        setShowBanner(false)
      }, 3000)
    } catch (error) {
      console.error("Migration error:", error)
      alert("Gagal migrasi data. Silakan coba lagi.")
    } finally {
      setMigrating(false)
    }
  }

  if (!showBanner || !hasSupabase) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-4xl mx-auto">
      <Alert className="bg-blue-50 border-blue-200">
        <Upload className="h-4 w-4 text-blue-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            {migrated ? (
              <div className="flex items-center text-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="font-medium">Migrasi berhasil!</span>
                <span className="ml-2">Data UMKM sudah tersimpan di cloud dan dapat diakses dari semua device.</span>
              </div>
            ) : (
              <div>
                <span className="font-medium text-blue-800">
                  Ditemukan {localData.length} data UMKM di penyimpanan lokal.
                </span>
                <span className="text-blue-700 ml-2">
                  Migrasi ke database cloud agar data dapat diakses dari semua device?
                </span>
              </div>
            )}
          </div>

          {!migrated && (
            <div className="flex items-center space-x-2 ml-4">
              <Button size="sm" onClick={handleMigrate} disabled={migrating} className="bg-blue-600 hover:bg-blue-700">
                {migrating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Migrasi...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Migrasi Sekarang
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBanner(false)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}
