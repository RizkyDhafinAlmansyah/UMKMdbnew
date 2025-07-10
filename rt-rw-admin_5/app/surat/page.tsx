"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Download, Eye } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Surat {
  id: string
  nomor: string
  jenis: string
  nama: string
  tanggal: string
  keperluan: string
  status: string
}

export default function SuratMenyurat() {
  const [surat, setSurat] = useState<Surat[]>([])
  const [filteredSurat, setFilteredSurat] = useState<Surat[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterJenis, setFilterJenis] = useState("semua")

  useEffect(() => {
    // Load data from localStorage
    const savedSurat = JSON.parse(localStorage.getItem("surat") || "[]")
    setSurat(savedSurat)
    setFilteredSurat(savedSurat)
  }, [])

  useEffect(() => {
    // Filter data based on search and filters
    let filtered = surat.filter(
      (s) =>
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nomor.includes(searchTerm) ||
        s.keperluan.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterJenis !== "semua") {
      filtered = filtered.filter((s) => s.jenis === filterJenis)
    }

    setFilteredSurat(filtered)
  }, [surat, searchTerm, filterJenis])

  const generatePDF = (suratData: Surat) => {
    // Simple PDF generation simulation
    const content = `
SURAT ${suratData.jenis.toUpperCase()}
No: ${suratData.nomor}

Yang bertanda tangan di bawah ini, Ketua RT/RW menerangkan bahwa:

Nama: ${suratData.nama}
Keperluan: ${suratData.keperluan}
Tanggal: ${new Date(suratData.tanggal).toLocaleDateString("id-ID")}

Demikian surat ini dibuat untuk dapat dipergunakan sebagaimana mestinya.

Hormat kami,
Ketua RT/RW
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `surat-${suratData.nomor}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Surat-Menyurat</h1>
              <p className="text-sm text-gray-600">Kelola surat pengantar dan dokumen</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild>
                <Link href="/surat/buat">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Surat Baru
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link href="/" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Dashboard
            </Link>
            <Link href="/warga" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Data Warga
            </Link>
            <Link href="/umkm" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Data UMKM
            </Link>
            <Link href="/surat" className="px-3 py-4 text-sm font-medium bg-blue-700">
              Surat-Menyurat
            </Link>
            <Link href="/laporan" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Laporan
            </Link>
            <Link href="/keuangan" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Keuangan
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/surat/buat?jenis=domisili">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Surat Domisili
                </CardTitle>
                <CardDescription>Buat surat keterangan domisili</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/surat/buat?jenis=skck">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Pengantar SKCK
                </CardTitle>
                <CardDescription>Buat surat pengantar SKCK</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/surat/buat?jenis=nikah">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Pengantar Nikah
                </CardTitle>
                <CardDescription>Buat surat pengantar nikah</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Arsip Surat</CardTitle>
            <CardDescription>Total {filteredSurat.length} surat tercatat</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari nomor surat, nama, atau keperluan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterJenis} onValueChange={setFilterJenis}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter Jenis Surat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Jenis</SelectItem>
                  <SelectItem value="domisili">Surat Domisili</SelectItem>
                  <SelectItem value="skck">Pengantar SKCK</SelectItem>
                  <SelectItem value="nikah">Pengantar Nikah</SelectItem>
                  <SelectItem value="usaha">Pengantar Usaha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No Surat</TableHead>
                    <TableHead>Jenis Surat</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Keperluan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSurat.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Belum ada surat yang dibuat
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSurat.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.nomor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{s.jenis}</Badge>
                        </TableCell>
                        <TableCell>{s.nama}</TableCell>
                        <TableCell>{s.keperluan}</TableCell>
                        <TableCell>{new Date(s.tanggal).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>
                          <Badge variant={s.status === "selesai" ? "default" : "secondary"}>{s.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => generatePDF(s)}>
                              <Download className="h-4 w-4" />
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
