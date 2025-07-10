"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, PieChart, Building2, TrendingUp, Users, DollarSign, Loader2 } from "lucide-react"
import Link from "next/link"
import { umkmService } from "@/lib/supabase"

export default function Laporan() {
  const [stats, setStats] = useState({
    totalUMKM: 0,
    umkmAktif: 0,
    umkmTidakAktif: 0,
    totalRAB: 0,
    totalModal: 0,
    totalKaryawan: 0,
    umkmJenisStats: {} as Record<string, number>,
    kategoriStats: {} as Record<string, number>,
    statusStats: {} as Record<string, number>,
    avgRAB: 0,
    avgModal: 0,
    avgKaryawan: 0,
  })
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
      const umkmJenisStats = umkm.reduce((acc: Record<string, number>, u) => {
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

      // Calculate status distribution
      const statusStats = umkm.reduce((acc: Record<string, number>, u) => {
        if (u.status) {
          acc[u.status] = (acc[u.status] || 0) + 1
        }
        return acc
      }, {})

      setStats({
        totalUMKM: umkm.length,
        umkmAktif,
        umkmTidakAktif,
        totalRAB,
        totalModal,
        totalKaryawan,
        umkmJenisStats,
        kategoriStats,
        statusStats,
        avgRAB: umkm.length > 0 ? totalRAB / umkm.length : 0,
        avgModal: umkm.length > 0 ? totalModal / umkm.length : 0,
        avgKaryawan: umkm.length > 0 ? totalKaryawan / umkm.length : 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    const reportData = `
LAPORAN STATISTIK UMKM MIKRO
============================
Tanggal: ${new Date().toLocaleDateString("id-ID")}

RINGKASAN UMKM:
- Total UMKM: ${stats.totalUMKM} usaha
- UMKM Aktif: ${stats.umkmAktif} usaha (${stats.totalUMKM > 0 ? Math.round((stats.umkmAktif / stats.totalUMKM) * 100) : 0}%)
- UMKM Tidak Aktif: ${stats.umkmTidakAktif} usaha (${stats.totalUMKM > 0 ? Math.round((stats.umkmTidakAktif / stats.totalUMKM) * 100) : 0}%)

STATISTIK KEUANGAN:
- Total RAB: Rp ${stats.totalRAB.toLocaleString("id-ID")}
- Total Modal: Rp ${stats.totalModal.toLocaleString("id-ID")}
- Rata-rata RAB per UMKM: Rp ${Math.round(stats.avgRAB).toLocaleString("id-ID")}
- Rata-rata Modal per UMKM: Rp ${Math.round(stats.avgModal).toLocaleString("id-ID")}

PENYERAPAN TENAGA KERJA:
- Total Karyawan: ${stats.totalKaryawan} orang
- Rata-rata Karyawan per UMKM: ${stats.avgKaryawan.toFixed(1)} orang

DISTRIBUSI JENIS USAHA:
${Object.entries(stats.umkmJenisStats)
  .map(
    ([jenis, jumlah]) =>
      `- ${jenis}: ${jumlah} usaha (${stats.totalUMKM > 0 ? Math.round((jumlah / stats.totalUMKM) * 100) : 0}%)`,
  )
  .join("\n")}

DISTRIBUSI KATEGORI USAHA:
${Object.entries(stats.kategoriStats)
  .map(
    ([kategori, jumlah]) =>
      `- ${kategori}: ${jumlah} usaha (${stats.totalUMKM > 0 ? Math.round((jumlah / stats.totalUMKM) * 100) : 0}%)`,
  )
  .join("\n")}

DISTRIBUSI STATUS OPERASIONAL:
${Object.entries(stats.statusStats)
  .map(
    ([status, jumlah]) =>
      `- ${status}: ${jumlah} usaha (${stats.totalUMKM > 0 ? Math.round((jumlah / stats.totalUMKM) * 100) : 0}%)`,
  )
  .join("\n")}

---
Laporan ini dibuat oleh Sistem Pendataan UMKM RT/RW
    `

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `laporan-umkm-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat laporan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan & Statistik UMKM</h1>
              <p className="text-lg text-gray-600 mt-1">Analisis dan insight perkembangan UMKM di wilayah Anda</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={exportReport} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export Laporan
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="px-4 py-4 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700 rounded-t-lg transition-colors"
            >
              <Building2 className="inline h-4 w-4 mr-2" />
              Dashboard
            </Link>
            <Link
              href="/umkm"
              className="px-4 py-4 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700 rounded-t-lg transition-colors"
            >
              <BarChart3 className="inline h-4 w-4 mr-2" />
              Kelola UMKM
            </Link>
            <Link href="/laporan" className="px-4 py-4 text-sm font-medium text-white bg-blue-700 rounded-t-lg">
              <PieChart className="inline h-4 w-4 mr-2" />
              Laporan & Statistik
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total UMKM</CardTitle>
              <Building2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUMKM}</div>
              <p className="text-xs text-gray-500 mt-1">Usaha terdaftar</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">UMKM Aktif</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.umkmAktif}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalUMKM > 0 ? Math.round((stats.umkmAktif / stats.totalUMKM) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Investasi</CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalModal > 0 ? `${(stats.totalModal / 1000000).toFixed(1)}M` : "0"}
              </div>
              <p className="text-xs text-gray-500 mt-1">Rupiah modal</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tenaga Kerja</CardTitle>
              <Users className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.totalKaryawan}</div>
              <p className="text-xs text-gray-500 mt-1">Orang bekerja</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Business Type Distribution */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                Distribusi Jenis Usaha
              </CardTitle>
              <CardDescription>Sebaran UMKM berdasarkan sektor usaha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.umkmJenisStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([jenis, jumlah]) => (
                    <div key={jenis} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{jenis}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stats.totalUMKM > 0 ? (jumlah / stats.totalUMKM) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900 w-12">
                          {jumlah} ({stats.totalUMKM > 0 ? Math.round((jumlah / stats.totalUMKM) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                {Object.keys(stats.umkmJenisStats).length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada data UMKM</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Status Operasional UMKM
              </CardTitle>
              <CardDescription>Kondisi operasional usaha saat ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.statusStats).map(([status, jumlah]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            status === "Aktif"
                              ? "bg-gradient-to-r from-green-500 to-green-600"
                              : status === "Tidak Aktif"
                                ? "bg-gradient-to-r from-red-500 to-red-600"
                                : "bg-gradient-to-r from-gray-500 to-gray-600"
                          }`}
                          style={{ width: `${stats.totalUMKM > 0 ? (jumlah / stats.totalUMKM) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12">
                        {jumlah} ({stats.totalUMKM > 0 ? Math.round((jumlah / stats.totalUMKM) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))}
                {Object.keys(stats.statusStats).length === 0 && (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Belum ada data status</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-white">Analisis Keuangan</CardTitle>
              <CardDescription className="text-blue-100">Ringkasan investasi dan anggaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm">Total RAB</p>
                  <p className="text-2xl font-bold">Rp {(stats.totalRAB / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Rata-rata RAB per UMKM</p>
                  <p className="text-lg font-semibold">Rp {(stats.avgRAB / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-white">Modal Usaha</CardTitle>
              <CardDescription className="text-green-100">Investasi modal awal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-green-100 text-sm">Total Modal</p>
                  <p className="text-2xl font-bold">Rp {(stats.totalModal / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-green-100 text-sm">Rata-rata Modal per UMKM</p>
                  <p className="text-lg font-semibold">Rp {(stats.avgModal / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-white">Tenaga Kerja</CardTitle>
              <CardDescription className="text-orange-100">Penyerapan tenaga kerja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-orange-100 text-sm">Total Karyawan</p>
                  <p className="text-2xl font-bold">{stats.totalKaryawan} Orang</p>
                </div>
                <div>
                  <p className="text-orange-100 text-sm">Rata-rata per UMKM</p>
                  <p className="text-lg font-semibold">{stats.avgKaryawan.toFixed(1)} Orang</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Analysis */}
        {Object.keys(stats.kategoriStats).length > 0 && (
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                Distribusi Kategori UMKM
              </CardTitle>
              <CardDescription>Klasifikasi berdasarkan skala usaha</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(stats.kategoriStats).map(([kategori, jumlah]) => (
                  <div key={kategori} className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{jumlah}</div>
                    <div className="text-sm text-gray-700 mt-1">{kategori}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {stats.totalUMKM > 0 ? Math.round((jumlah / stats.totalUMKM) * 100) : 0}% dari total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
