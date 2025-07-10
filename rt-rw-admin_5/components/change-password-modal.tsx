"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Eye, EyeOff, Loader2, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  isRequired?: boolean
}

export function ChangePasswordModal({ isOpen, onClose, isRequired = false }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { changePassword, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Semua field harus diisi")
      return
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok")
      return
    }

    if (oldPassword === newPassword) {
      setError("Password baru harus berbeda dari password lama")
      return
    }

    setIsLoading(true)

    try {
      const result = await changePassword(oldPassword, newPassword)
      if (result.success) {
        setSuccess(result.message)
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")

        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("Terjadi kesalahan saat mengubah password")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className={`${isRequired ? "bg-red-600" : "bg-blue-600"} text-white rounded-t-lg`}>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              {isRequired ? "Wajib Ganti Password" : "Ubah Password"}
            </CardTitle>
            <CardDescription className={isRequired ? "text-red-100" : "text-blue-100"}>
              {isRequired ? "Untuk keamanan, Anda harus mengganti password default" : "Ubah password akun Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {isRequired && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <Shield className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Perhatian:</strong> Anda menggunakan password default. Untuk keamanan sistem, silakan ganti
                  password Anda sekarang.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Password Lama</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder={user?.role === "admin" ? "Password default: admin" : "Masukkan password lama"}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-3 pt-4">
                {!isRequired && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 bg-transparent"
                  >
                    Batal
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`${isRequired ? "w-full" : "flex-1"} ${isRequired ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Mengubah...
                    </>
                  ) : (
                    "Ubah Password"
                  )}
                </Button>
              </div>
            </form>

            {/* Password Requirements */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Persyaratan Password:</h4>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Minimal 6 karakter</li>
                <li>• Harus berbeda dari password lama</li>
                <li>• Disarankan menggunakan kombinasi huruf dan angka</li>
                <li>• Jangan gunakan password yang mudah ditebak</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
