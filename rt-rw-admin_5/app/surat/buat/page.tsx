"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function BuatSurat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jenisFromUrl = searchParams.get("jenis") || ""

  const [warga, setWarga] = useState([])
  const [formData, setFormData] = useState({
    jenis: jenisFromUrl,
    nama: "",
    nik: "",
    alamat: "",
    keperluan: "",
    keterangan: "",
  })

  useEffect(() => {
    // Load warga data for selection
    const savedWarga = JSON.parse(localStorage.getItem("warga") || "[]")
    setWarga(savedWarga)
  }, [])

  const generateNomorSurat = (jenis: string) => {
    const existingSurat = JSON.parse(localStorage.getItem("surat") || "[]")
    const count = existingSurat.filter((s: any) => s.jenis === jenis).length + 1
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, "0")

    const jenisCode =
      {
        domisili: "DOM",
        skck: "SKCK",
        nikah: "NIK",
        usaha: "USH",
        "izin-usaha": "IU",
      }[jenis] || "SRT"

    return `${String(count).padStart(3, "0")}/${jenisCode}/${month}/${year}`
  }

  const handleWargaSelect = (selectedNik: string) => {
    const selectedWarga = warga.find((w: any) => w.nik === selectedNik)
    if (selectedWarga) {
      setFormData((prev) => ({
        ...prev,
        nama: (selectedWarga as any).nama,
        nik: (selectedWarga as any).nik,
        alamat: (selectedWarga as any).alamat,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.jenis || !formData.nama || !formData.keperluan) {
      alert("Jenis surat, nama, dan keperluan harus diisi!")
      return
    }

    const nomorSurat = generateNomorSurat(formData.jenis)
    const newSurat = {
      id: Date.now().toString(),
      nomor: nomorSurat,
      jenis: formData.jenis,
      nama: formData.nama,
      nik: formData.nik,
      alamat: formData.alamat,
      keperluan: formData.keperluan,
      keterangan: formData.keterangan,
      tanggal: new Date().toISOString(),
      status: "selesai",
    }

    const existingSurat = JSON.parse(localStorage.getItem("surat") || "[]")
    const updatedSurat = [...existingSurat, newSurat]
    localStorage.setItem("surat", JSON.stringify(updatedSurat))

    alert(`Surat berhasil dibuat dengan nomor: ${nomorSurat}`)
    router.push("/surat")
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
                <Link href="/surat">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Buat Surat Baru</h1>
                <p className="text-sm text-gray-600">Buat surat pengantar atau keterangan</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Form Pembuatan Surat
            </CardTitle>
            <CardDescription>Lengkapi informasi untuk membuat surat</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jenis">Jenis Surat *</Label>
                  <Select value={formData.jenis} onValueChange={(value) => handleChange("jenis", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis surat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="domisili">Surat Keterangan Domisili</SelectItem>
                      <SelectItem value="skck">Surat Pengantar SKCK</SelectItem>
                      <SelectItem value="nikah">Surat Pengantar Nikah</SelectItem>
                      <SelectItem value="usaha">Surat Pengantar Usaha</SelectItem>
                      <SelectItem value="izin-usaha">Surat Keterangan Izin Usaha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warga">Pilih Warga (Opsional)</Label>
                  <Select onValueChange={handleWargaSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dari data warga" />
                    </SelectTrigger>
                    <SelectContent>
                      {warga.map((w: any) => (
                        <SelectItem key={w.id} value={w.nik}>
                          {w.nama} - {w.nik}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="nik">NIK</Label>
                  <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) => handleChange("nik", e.target.value)}
                    placeholder="Masukkan NIK"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleChange("alamat", e.target.value)}
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keperluan">Keperluan *</Label>
                <Input
                  id="keperluan"
                  value={formData.keperluan}
                  onChange={(e) => handleChange("keperluan", e.target.value)}
                  placeholder="Masukkan keperluan surat"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keterangan">Keterangan Tambahan</Label>
                <Textarea
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={(e) => handleChange("keterangan", e.target.value)}
                  placeholder="Masukkan keterangan tambahan jika diperlukan"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" asChild>
                  <Link href="/surat">Batal</Link>
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Buat Surat
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
