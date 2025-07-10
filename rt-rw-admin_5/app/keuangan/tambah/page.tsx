"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TambahKeuangan() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "",
    kategori: "",
    keterangan: "",
    jumlah: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.jenis || !formData.kategori || !formData.keterangan || !formData.jumlah) {
      alert("Semua field harus diisi!")
      return
    }

    const newKeuangan = {
      id: Date.now().toString(),
      tanggal: formData.tanggal,
      jenis: formData.jenis as "pemasukan" | "pengeluaran",
      kategori: formData.kategori,
      keterangan: formData.keterangan,
      jumlah: Number.parseInt(formData.jumlah),
    }

    const existingKeuangan = JSON.parse(localStorage.getItem("keuangan") || "[]")
    const updatedKeuangan = [...existingKeuangan, newKeuangan]
    localStorage.setItem("keuangan", JSON.stringify(updatedKeuangan))

    alert("Transaksi berhasil ditambahkan!")
    router.push("/keuangan")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button variant="ghost" asChild className="mr-4">
                <Link href="/keuangan">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tambah Transaksi</h1>
                <p className="text-sm text-gray-600">Catat pemasukan atau pengeluaran baru</p>
              </div>
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
            <Link href="/surat" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Surat-Menyurat
            </Link>
            <Link href="/laporan" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Laporan
            </Link>
            <Link href="/keuangan" className="px-3 py-4 text-sm font-medium bg-blue-700">
              Keuangan
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Form Transaksi Keuangan</CardTitle>
            <CardDescription>Masukkan detail transaksi pemasukan atau pengeluaran</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal *</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => handleChange("tanggal", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis">Jenis Transaksi *</Label>
                  <Select value={formData.jenis} onValueChange={(value) => handleChange("jenis", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pemasukan">Pemasukan</SelectItem>
                      <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori *</Label>
                  <Select value={formData.kategori} onValueChange={(value) => handleChange("kategori", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.jenis === "pemasukan" ? (
                        <>
                          <SelectItem value="Iuran Bulanan">Iuran Bulanan</SelectItem>
                          <SelectItem value="Iuran Keamanan">Iuran Keamanan</SelectItem>
                          <SelectItem value="Iuran Kebersihan">Iuran Kebersihan</SelectItem>
                          <SelectItem value="Donasi">Donasi</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Keamanan">Keamanan</SelectItem>
                          <SelectItem value="Kebersihan">Kebersihan</SelectItem>
                          <SelectItem value="Pemeliharaan">Pemeliharaan</SelectItem>
                          <SelectItem value="Acara">Acara</SelectItem>
                          <SelectItem value="Administrasi">Administrasi</SelectItem>
                          <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jumlah">Jumlah (Rp) *</Label>
                  <Input
                    id="jumlah"
                    type="number"
                    value={formData.jumlah}
                    onChange={(e) => handleChange("jumlah", e.target.value)}
                    placeholder="Masukkan jumlah"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan *</Label>
                <Textarea
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={(e) => handleChange("keterangan", e.target.value)}
                  placeholder="Masukkan keterangan detail transaksi"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/keuangan">Batal</Link>
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Transaksi
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
