"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, TrendingUp, Users, DollarSign, BarChart3, PieChart, Loader2 } from "lucide-react"
import Link from "next/link"
import { umkmService, hasSupabase, type UMKM } from "@/lib/supabase"
import { MigrationBanner } from "@/components/migration-banner"
import { DebugPanel } from "@/components/debug-panel"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderWithAuth } from "@/components/header-with-auth"
import { NavigationWithAuth } from "@/components/navigation-with-auth"
import { useAuth } from "@/lib/auth"

const getRWFromUMKM = (umkm: UMKM): string | null => {
  // Jika ada user_id, coba ambil dari localStorage registered_users
  if (umkm.user_id) {
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]")
    const user = users.find((u: any) => u.id === umkm.user_id)
    return user?.rw || null
  }
  return null
}

function DashboardContent() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUMKM: 0,
    umkmAktif: 0,
    umkmTidakAktif: 0,
    totalRAB: 0,
    totalModal: 0,
    totalKaryawan: 0,
    jenisUsahaStats: {} as Record<string, number>,
    kategoriStats: {} as Record<string, number>,
    recentUMKM: [] as UMKM[],
  })
  const [umkmByRW, setUmkmByRW] = useState<Record<string, UMKM[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const umkm = await umkmService.getAll()

      const umkmAktif = umkm.filter((u) => u.status === "Aktif").length
      const umkmTidakAktif = umkm.filter((u) => u.status !== "Aktif").length
      const totalRAB = umkm.reduce((sum, u) => sum + (u.rab || 0), 0)
      const totalModal = umkm.reduce((sum, u) => sum + (u.modal_awal || 0), 0)
      const totalKaryawan = umkm.reduce((sum, u) => sum + (u.jumlah_karyawan || 0), 0)

      // Calculate business type distribution
      const jenisUsahaStats = umkm.reduce((acc: Record<string, number>, u) => {
        if (u.jenis_usaha) {
          acc[u.jenis_usaha] = (acc[u.jenis_usaha] || 0) + 1
        }
        return acc
      }, {})

      // Calculate category distribution
      const kategoriStats = umkm.reduce((acc: Record<string, number>, u) => {
        if (u.kategori_usaha) {
          acc[u.kategori_usaha] = (acc[u.kategori_usaha] || 0) + 1
        }
        return acc
      }, {})

      // Get recent UMKM (last 5)
      const recentUMKM = umkm.slice(0, 5)

      setStats({
        totalUMKM: umkm.length,
        umkmAktif,
        umkmTidakAktif,
        totalRAB,
        totalModal,
        totalKaryawan,
        jenisUsahaStats,
        kategoriStats,
        recentUMKM,
      })

      // Group UMKM by RW
      const umkmGroupedByRW = umkm.reduce((acc: Record<string, UMKM[]>, umkmItem) => {
        // Get RW from user_id or default to 'Tidak Diketahui'
        const rw = getRWFromUMKM(umkmItem) || "Tidak Diketahui"
        if (!acc[rw]) {
          acc[rw] = []
        }
        acc[rw].push(umkmItem)
        return acc
      }, {})

      setUmkmByRW(umkmGroupedByRW)
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data UMKM...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Migration Banner */}
      <MigrationBanner />

      {/* Debug Panel */}
      <DebugPanel />

      {/* Header */}
      <HeaderWithAuth
        title="Sistem Pendataan UMKM"
        description={`Dashboard ${user?.role === "admin" ? "Admin" : "User"} - Kelola UMKM Mikro di Wilayah Anda`}
      >
        <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/umkm/tambah">
            <Plus className="h-5 w-5 mr-2" />
            Daftarkan UMKM Baru
          </Link>
        </Button>
      </HeaderWithAuth>

      {/* Navigation */}
      <NavigationWithAuth />

      {/* Status Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Status:</span>
              {!hasSupabase ? (
                <span className="text-orange-600">⚠️ Mode offline - Data hanya tersimpan di device ini</span>
              ) : (
                <span className="text-green-600">✅ Mode online - Data tersinkron ke semua device</span>
              )}
            </div>
            <div className="text-gray-500">
              Login sebagai: <span className="font-medium">{user?.name}</span> ({user?.role})
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name}!</h2>
                <p className="text-blue-100 text-lg">
                  {user?.role === "admin"
                    ? "Kelola dan pantau perkembangan UMKM mikro di wilayah Anda dengan mudah"
                    : "Pantau dan kelola data UMKM di wilayah RT/RW Anda"}
                </p>
                {hasSupabase ? (
                  <p className="text-blue-200 text-sm mt-2">
                    💾 Data tersimpan secara online dan dapat diakses dari semua perangkat
                  </p>
                ) : (
                  <p className="text-orange-200 text-sm mt-2">
                    📱 Mode offline - Setup database untuk sinkronisasi multi-device
                  </p>
                )}
              </div>
              <div className="hidden md:block">
                <Building2 className="h-24 w-24 text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total UMKM</CardTitle>
              <Building2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUMKM}</div>
              <p className="text-sm text-gray-500 mt-1">Usaha terdaftar</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">UMKM Aktif</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.umkmAktif}</div>
              <p className="text-sm text-gray-500 mt-1">Beroperasi aktif</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Modal</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalModal > 0 ? `${(stats.totalModal / 1000000).toFixed(1)}M` : "0"}
              </div>
              <p className="text-sm text-gray-500 mt-1">Rupiah investasi</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Penyerapan Tenaga Kerja</CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalKaryawan}</div>
              <p className="text-sm text-gray-500 mt-1">Orang bekerja</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Business Type Distribution */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                Distribusi Jenis Usaha
              </CardTitle>
              <CardDescription>Sebaran UMKM berdasarkan jenis usaha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.jenisUsahaStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([jenis, jumlah]) => (
                    <div key={jenis} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{jenis}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalUMKM > 0 ? (jumlah / stats.totalUMKM) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-8">{jumlah}</span>
                      </div>
                    </div>
                  ))}
                {Object.keys(stats.jenisUsahaStats).length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada data UMKM</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent UMKM */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Building2 className="h-5 w-5 mr-2 text-green-600" />
                UMKM Terbaru Terdaftar
              </CardTitle>
              <CardDescription>5 UMKM yang baru saja didaftarkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentUMKM.length > 0 ? (
                  stats.recentUMKM.map((umkm) => (
                    <div
                      key={umkm.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{umkm.nama_usaha}</p>
                        <p className="text-sm text-gray-500">
                          {umkm.pemilik} • {umkm.jenis_usaha}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            umkm.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {umkm.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada UMKM terdaftar</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* UMKM by RW - Admin Only */}
        {user?.role === "admin" && Object.keys(umkmByRW).length > 0 && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Building2 className="h-5 w-5 mr-2 text-indigo-600" />
                  Distribusi UMKM per RW
                </CardTitle>
                <CardDescription>Sebaran UMKM berdasarkan wilayah RW</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(umkmByRW)
                    .sort(([rwA], [rwB]) => {
                      // Sort RW numerically, put "Tidak Diketahui" at the end
                      if (rwA === "Tidak Diketahui") return 1
                      if (rwB === "Tidak Diketahui") return -1
                      return Number.parseInt(rwA) - Number.parseInt(rwB)
                    })
                    .map(([rw, umkmList]) => (
                      <div
                        key={rw}
                        className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-indigo-900">
                            RW {rw === "Tidak Diketahui" ? rw : rw}
                          </h3>
                          <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {umkmList.length} UMKM
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Aktif:</span>
                            <span className="font-medium text-green-600">
                              {umkmList.filter((u) => u.status === "Aktif").length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tidak Aktif:</span>
                            <span className="font-medium text-red-600">
                              {umkmList.filter((u) => u.status !== "Aktif").length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Modal:</span>
                            <span className="font-medium text-purple-600">
                              Rp {(umkmList.reduce((sum, u) => sum + (u.modal_awal || 0), 0) / 1000000).toFixed(1)}M
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Karyawan:</span>
                            <span className="font-medium text-orange-600">
                              {umkmList.reduce((sum, u) => sum + (u.jumlah_karyawan || 0), 0)} orang
                            </span>
                          </div>
                        </div>

                        {/* Top Business Types in this RW */}
                        <div className="mt-4 pt-4 border-t border-indigo-200">
                          <h4 className="text-sm font-medium text-indigo-800 mb-2">Jenis Usaha Populer:</h4>
                          <div className="space-y-1">
                            {Object.entries(
                              umkmList.reduce((acc: Record<string, number>, u) => {
                                acc[u.jenis_usaha] = (acc[u.jenis_usaha] || 0) + 1
                                return acc
                              }, {}),
                            )
                              .sort(([, a], [, b]) => b - a)
                              .slice(0, 3)
                              .map(([jenis, count]) => (
                                <div key={jenis} className="flex justify-between text-xs">
                                  <span className="text-gray-600 truncate">{jenis}</span>
                                  <span className="font-medium text-indigo-700">{count}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {Object.keys(umkmByRW).filter((rw) => rw !== "Tidak Diketahui").length}
                      </div>
                      <div className="text-sm text-gray-600">RW Terdaftar</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Object.values(umkmByRW).reduce(
                          (sum, list) => sum + list.filter((u) => u.status === "Aktif").length,
                          0,
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Total Aktif</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        Rp{" "}
                        {(
                          Object.values(umkmByRW).reduce(
                            (sum, list) => sum + list.reduce((rwSum, u) => rwSum + (u.modal_awal || 0), 0),
                            0,
                          ) / 1000000
                        ).toFixed(1)}
                        M
                      </div>
                      <div className="text-sm text-gray-600">Total Modal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Object.values(umkmByRW).reduce(
                          (sum, list) => sum + list.reduce((rwSum, u) => rwSum + (u.jumlah_karyawan || 0), 0),
                          0,
                        )}
                      </div>
                      <div className="text-sm text-gray-600">Total Karyawan</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0">
            <Link href="/umkm/tambah">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Plus className="h-6 w-6 mr-3" />
                  Daftarkan UMKM Baru
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Tambahkan data UMKM mikro baru ke dalam sistem
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0">
            <Link href="/umkm">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  Kelola Data UMKM
                </CardTitle>
                <CardDescription className="text-green-100">Edit, update, dan kelola semua data UMKM</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-0">
            <Link href="/laporan">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <PieChart className="h-6 w-6 mr-3" />
                  Lihat Laporan
                </CardTitle>
                <CardDescription className="text-purple-100">Analisis dan statistik perkembangan UMKM</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Status Overview */}
        {stats.totalUMKM > 0 && (
          <div className="mt-8">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-gray-900">Ringkasan Status UMKM</CardTitle>
                <CardDescription>Gambaran umum kondisi UMKM di wilayah Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.umkmAktif}</div>
                    <div className="text-sm text-green-700 mt-1">UMKM Aktif</div>
                    <div className="text-xs text-green-600 mt-1">
                      {stats.totalUMKM > 0 ? Math.round((stats.umkmAktif / stats.totalUMKM) * 100) : 0}% dari total
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{stats.umkmTidakAktif}</div>
                    <div className="text-sm text-gray-700 mt-1">Tidak Aktif</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {stats.totalUMKM > 0 ? Math.round((stats.umkmTidakAktif / stats.totalUMKM) * 100) : 0}% dari total
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">Rp {(stats.totalRAB / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-blue-700 mt-1">Total RAB</div>
                    <div className="text-xs text-blue-600 mt-1">Rencana anggaran biaya</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
