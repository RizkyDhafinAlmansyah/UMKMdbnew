"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TambahWarga() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    noKK: "",
    alamat: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    pekerjaan: "",
    status: "",
    agama: "",
    pendidikan: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.nama || !formData.nik || !formData.noKK) {
      alert("Nama, NIK, dan No KK harus diisi!")
      return
    }

    // Generate ID and save to localStorage
    const newWarga = {
      ...formData,
      id: Date.now().toString(),
    }

    const existingWarga = JSON.parse(localStorage.getItem("warga") || "[]")
    const updatedWarga = [...existingWarga, newWarga]
    localStorage.setItem("warga", JSON.stringify(updatedWarga))

    alert("Data warga berhasil ditambahkan!")
    router.push("/warga")
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
                <Link href="/warga">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tambah Warga Baru</h1>
                <p className="text-sm text-gray-600">Masukkan data warga baru</p>
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
            <Link href="/warga" className="px-3 py-4 text-sm font-medium bg-blue-700">
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
            <Link href="/keuangan" className="px-3 py-4 text-sm font-medium hover:bg-blue-700">
              Keuangan
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Form Data Warga</CardTitle>
            <CardDescription>Lengkapi semua informasi warga dengan benar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nik">NIK *</Label>
                  <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) => handleChange("nik", e.target.value)}
                    placeholder="Masukkan NIK (16 digit)"
                    maxLength={16}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noKK">No Kartu Keluarga *</Label>
                  <Input
                    id="noKK"
                    value={formData.noKK}
                    onChange={(e) => handleChange("noKK", e.target.value)}
                    placeholder="Masukkan No KK"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                  <Select value={formData.jenisKelamin} onValueChange={(value) => handleChange("jenisKelamin", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                  <Input
                    id="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={(e) => handleChange("tempatLahir", e.target.value)}
                    placeholder="Masukkan tempat lahir"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => handleChange("tanggalLahir", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agama">Agama</Label>
                  <Select value={formData.agama} onValueChange={(value) => handleChange("agama", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Islam">Islam</SelectItem>
                      <SelectItem value="Kristen">Kristen</SelectItem>
                      <SelectItem value="Katolik">Katolik</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Buddha">Buddha</SelectItem>
                      <SelectItem value="Konghucu">Konghucu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status Perkawinan</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
                      <SelectItem value="Menikah">Menikah</SelectItem>
                      <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                      <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pekerjaan">Pekerjaan</Label>
                  <Input
                    id="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={(e) => handleChange("pekerjaan", e.target.value)}
                    placeholder="Masukkan pekerjaan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pendidikan">Pendidikan Terakhir</Label>
                  <Select value={formData.pendidikan} onValueChange={(value) => handleChange("pendidikan", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tidak Sekolah">Tidak Sekolah</SelectItem>
                      <SelectItem value="SD">SD</SelectItem>
                      <SelectItem value="SMP">SMP</SelectItem>
                      <SelectItem value="SMA">SMA</SelectItem>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Input
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/warga">Batal</Link>
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Data
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
