"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Download, Building2, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { umkmService, type UMKM } from "@/lib/supabase"
import { ProtectedRoute } from "@/components/protected-route"
import { HeaderWithAuth } from "@/components/header-with-auth"
import { NavigationWithAuth } from "@/components/navigation-with-auth"

function DataUMKMContent() {
  const [umkm, setUmkm] = useState<UMKM[]>([])
  const [filteredUmkm, setFilteredUmkm] = useState<UMKM[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJenis, setFilterJenis] = useState("semua")
  const [filterStatus, setFilterStatus] = useState("semua")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUMKM()
  }, [])

  useEffect(() => {
    // Filter data based on search and filters
    let filtered = umkm.filter(
      (u) =>
        u.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.alamat_usaha && u.alamat_usaha.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.jenis_usaha.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterJenis !== "semua") {
      filtered = filtered.filter((u) => u.jenis_usaha === filterJenis)
    }

    if (filterStatus !== "semua") {
      filtered = filtered.filter((u) => u.status === filterStatus)
    }

    setFilteredUmkm(filtered)
  }, [umkm, searchTerm, filterJenis, filterStatus])

  const loadUMKM = async () => {
    try {
      setLoading(true)
      const data = await umkmService.getAll()
      setUmkm(data)
      setFilteredUmkm(data)
    } catch (error) {
      console.error("Error loading UMKM:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data UMKM ini?")) {
      try {
        await umkmService.delete(id)
        await loadUMKM() // Reload data
        alert("Data UMKM berhasil dihapus!")
      } catch (error) {
        console.error("Error deleting UMKM:", error)
        alert("Gagal menghapus data UMKM. Silakan coba lagi.")
      }
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Nama Usaha",
      "Pemilik",
      "NIK Pemilik",
      "Alamat Usaha",
      "Jenis Usaha",
      "Kategori",
      "Kapasitas Produksi",
      "Satuan",
      "Periode Operasi",
      "Hari Kerja/Minggu",
      "Total Produksi",
      "RAB",
      "Biaya Tetap",
      "Biaya Variabel",
      "Status",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredUmkm.map((u) =>
        [
          u.nama_usaha,
          u.pemilik,
          u.nik_pemilik || "",
          u.alamat_usaha || "",
          u.jenis_usaha,
          u.kategori_usaha || "",
          u.kapasitas_produksi || 0,
          u.satuan_produksi || "",
          `${u.periode_operasi || 0} ${u.satuan_periode || ""}`,
          u.hari_kerja_per_minggu || 0,
          u.total_produksi || 0,
          u.rab || 0,
          u.biaya_tetap || 0,
          u.biaya_variabel || 0,
          u.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data-umkm.csv"
    a.click()
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
      {/* Header */}
      <HeaderWithAuth title="Kelola Data UMKM" description="Manajemen lengkap data UMKM mikro di wilayah Anda">
        <Button variant="outline" onClick={exportToCSV} className="border-gray-300 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/umkm/tambah">
            <Plus className="h-5 w-5 mr-2" />
            Tambah UMKM
          </Link>
        </Button>
      </HeaderWithAuth>

      {/* Navigation */}
      <NavigationWithAuth />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total UMKM</CardTitle>
              <Building2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{filteredUmkm.length}</div>
              <p className="text-xs text-gray-500 mt-1">Usaha terdaftar</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">UMKM Aktif</CardTitle>
              <Building2 className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredUmkm.filter((u) => u.status === "Aktif").length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Beroperasi</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total RAB</CardTitle>
              <MapPin className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {filteredUmkm.reduce((sum, u) => sum + (u.rab || 0), 0) > 0
                  ? `${(filteredUmkm.reduce((sum, u) => sum + (u.rab || 0), 0) / 1000000).toFixed(1)}M`
                  : "0"}
              </div>
              <p className="text-xs text-gray-500 mt-1">Rencana anggaran</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Kapasitas Total</CardTitle>
              <Building2 className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {filteredUmkm.reduce((sum, u) => sum + (u.total_produksi || 0), 0).toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-gray-500 mt-1">Unit produksi</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Daftar UMKM Terdaftar</CardTitle>
            <CardDescription className="text-gray-600">
              Kelola dan pantau semua UMKM mikro di wilayah Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama usaha, pemilik, atau alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Select value={filterJenis} onValueChange={setFilterJenis}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue placeholder="Filter Jenis Usaha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Jenis</SelectItem>
                  <SelectItem value="Kuliner">Kuliner</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                  <SelectItem value="Jasa">Jasa</SelectItem>
                  <SelectItem value="Perdagangan">Perdagangan</SelectItem>
                  <SelectItem value="Teknologi">Teknologi</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                  <SelectItem value="Tutup Sementara">Tutup Sementara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-900">Nama Usaha</TableHead>
                    <TableHead className="font-semibold text-gray-900">Pemilik</TableHead>
                    <TableHead className="font-semibold text-gray-900">Jenis Usaha</TableHead>
                    <TableHead className="font-semibold text-gray-900">Alamat</TableHead>
                    <TableHead className="font-semibold text-gray-900">Kapasitas</TableHead>
                    <TableHead className="font-semibold text-gray-900">RAB</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="font-semibold text-gray-900">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUmkm.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Tidak ada data UMKM</p>
                        <p className="text-gray-400 text-sm mt-1">Mulai dengan mendaftarkan UMKM pertama</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUmkm.map((u) => (
                      <TableRow key={u.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">{u.nama_usaha}</TableCell>
                        <TableCell className="text-gray-700">{u.pemilik}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                            {u.jenis_usaha}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">{u.alamat_usaha || "-"}</TableCell>
                        <TableCell className="text-gray-700">
                          {u.kapasitas_produksi || 0} {u.satuan_produksi || ""}
                        </TableCell>
                        <TableCell className="text-gray-700">Rp {(u.rab || 0).toLocaleString("id-ID")}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.status === "Aktif"
                                ? "default"
                                : u.status === "Tidak Aktif"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              u.status === "Aktif"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : u.status === "Tidak Aktif"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="border-gray-300 hover:bg-gray-50 bg-transparent"
                            >
                              <Link href={`/umkm/edit/${u.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(u.id!)}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function DataUMKM() {
  return (
    <ProtectedRoute>
      <DataUMKMContent />
    </ProtectedRoute>
  )
}
