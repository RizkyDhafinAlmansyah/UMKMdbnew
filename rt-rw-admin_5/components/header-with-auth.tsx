"use client"

import type React from "react"
import { useState } from "react" // Import useState

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, LogOut, Settings, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ChangePasswordModal } from "./change-password-modal" // Import ChangePasswordModal

interface HeaderWithAuthProps {
  title: string
  description: string
  children?: React.ReactNode
}

export function HeaderWithAuth({ title, description, children }: HeaderWithAuthProps) {
  const { user, logout } = useAuth()

  // Add state untuk modal
  const [showChangePassword, setShowChangePassword] = useState(false)

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      logout()
    }
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-lg text-gray-600 mt-1">{description}</p>
          </div>

          <div className="flex items-center space-x-4">
            {children}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">@{user?.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="text-xs">
                        {user?.role === "admin" ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            User
                          </>
                        )}
                      </Badge>
                      {user?.rt && (
                        <Badge variant="outline" className="text-xs">
                          RT {user.rt}
                        </Badge>
                      )}
                      {user?.rw && (
                        <Badge variant="outline" className="text-xs">
                          RW {user.rw}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {/* Add menu item untuk change password di DropdownMenuContent */}
                <DropdownMenuItem onClick={() => setShowChangePassword(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Ubah Password</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Add modal component sebelum closing tag */}
      <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} />
    </header>
  )
}
