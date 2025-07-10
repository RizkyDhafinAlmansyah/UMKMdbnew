import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/* ---------- CONFIG & FALLBACK ---------- */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const hasSupabase = Boolean(url && anon)

/** Singleton Supabase client (hanya dibuat kalau env-vars tersedia) */
let _supabase: SupabaseClient | null = null
function supabase(): SupabaseClient {
  if (!hasSupabase) {
    throw new Error(
      "Supabase tidak dikonfigurasi. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY di pengaturan Environment Vercel.",
    )
  }
  return (_supabase ??= createClient(url!, anon!))
}

/* ---------- TYPE ---------- */
export interface UMKM {
  id?: string
  nama_usaha: string
  pemilik: string
  nik_pemilik?: string
  alamat_usaha?: string
  jenis_usaha: string
  kategori_usaha?: string
  deskripsi_usaha?: string
  kapasitas_produksi?: number
  satuan_produksi?: string
  periode_operasi?: number
  satuan_periode?: string
  hari_kerja_per_minggu?: number
  total_produksi?: number
  rab?: number
  biaya_tetap?: number
  biaya_variabel?: number
  modal_awal?: number
  target_pendapatan?: number
  jumlah_karyawan?: number
  status: string
  tanggal_daftar?: string
  created_at?: string
  updated_at?: string
  user_id?: string // Tambahan untuk ownership
}

/* ---------- LOCAL STORAGE FALLBACK ---------- */
const LS_KEY = "umkm"

/** pakai LocalStorage kalau Supabase off */
const ls = {
  all(): UMKM[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]")
  },
  save(list: UMKM[]) {
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(list))
  },
}

/* ---------- PUBLIC SERVICE ---------- */
export const umkmService = {
  /** GET ALL - dengan filter berdasarkan user */
  async getAll(userId?: string): Promise<UMKM[]> {
    if (!hasSupabase) {
      const allData = ls.all()
      // Jika userId diberikan, filter berdasarkan user_id
      return userId ? allData.filter((item) => item.user_id === userId) : allData
    }

    let query = supabase().from("umkm").select("*").order("created_at", { ascending: false })

    // Jika userId diberikan, filter berdasarkan user_id
    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query
    if (error) {
      console.error("Supabase error:", error)
      return []
    }
    return data ?? []
  },

  /** CREATE */
  async create(payload: Omit<UMKM, "id" | "created_at" | "updated_at">, userId: string): Promise<UMKM | null> {
    const dataWithUser = { ...payload, user_id: userId }

    if (!hasSupabase) {
      const list = ls.all()
      const newItem: UMKM = { ...dataWithUser, id: Date.now().toString() }
      ls.save([newItem, ...list])
      return newItem
    }

    const { data, error } = await supabase()
      .from("umkm")
      .insert([{ ...dataWithUser, tanggal_daftar: dataWithUser.tanggal_daftar || new Date().toISOString() }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  /** UPDATE - hanya bisa update data milik sendiri */
  async update(id: string, payload: Partial<UMKM>, userId: string): Promise<UMKM | null> {
    if (!hasSupabase) {
      const list = ls.all()
      const itemIndex = list.findIndex((u) => u.id === id && u.user_id === userId)
      if (itemIndex === -1) throw new Error("Data tidak ditemukan atau tidak memiliki akses")

      list[itemIndex] = { ...list[itemIndex], ...payload }
      ls.save(list)
      return list[itemIndex]
    }

    const { data, error } = await supabase()
      .from("umkm")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId) // Pastikan hanya bisa update data sendiri
      .select()
      .single()

    if (error) throw error
    return data
  },

  /** DELETE - hanya bisa delete data milik sendiri */
  async delete(id: string, userId: string): Promise<boolean> {
    if (!hasSupabase) {
      const list = ls.all()
      const filteredList = list.filter((u) => !(u.id === id && u.user_id === userId))
      if (filteredList.length === list.length) {
        throw new Error("Data tidak ditemukan atau tidak memiliki akses")
      }
      ls.save(filteredList)
      return true
    }

    const { error } = await supabase().from("umkm").delete().eq("id", id).eq("user_id", userId) // Pastikan hanya bisa delete data sendiri

    if (error) throw error
    return true
  },

  /** GET BY ID - dengan validasi ownership untuk non-admin */
  async getById(id: string, userId?: string): Promise<UMKM | null> {
    if (!hasSupabase) {
      const item = ls.all().find((u) => u.id === id)
      // Jika userId diberikan, validasi ownership
      if (userId && item && item.user_id !== userId) {
        return null
      }
      return item || null
    }

    let query = supabase().from("umkm").select("*").eq("id", id)

    // Jika userId diberikan, validasi ownership
    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.single()
    if (error) throw error
    return data
  },
}
