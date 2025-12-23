const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://questions-segment-mortgages-duncan.trycloudflare.com/api"

export interface SessionData {
  owner_id: string
  app_name: string
  display_name?: string
  secret: string
  avatar?: string
  email?: string
  is_owner?: boolean
  subscription_tier?: string
  subscription_status?: string
}

export interface User {
  id: number
  username: string
  hwid?: string
  ip?: string
  last_login?: string
  blocked?: boolean
}

export interface BannedItem {
  id: number
  ip?: string
  hwid?: string
  reason: string
  date: string
}

export interface HWIDReset {
  id: number
  username: string
  old_hwid?: string
}

export const apiClient = {
  // Dashboard profile creation (login simulation)
  async createProfile(
    appName: string,
  ): Promise<{ success: boolean; owner_id: string; app_name: string; secret: string; message?: string }> {
    const response = await fetch(`${API_BASE}/dashboard/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_name: appName, owner_id: "", secret: "" }),
    })
    return response.json()
  },

  // Get users list
  async getUsers(ownerId: string, secret: string): Promise<{ users: User[] }> {
    const response = await fetch(`${API_BASE}/client/users/${ownerId}?secret=${secret}`)
    return response.json()
  },

  // Create user
  async createUser(
    username: string,
    password: string,
    ownerId: string,
    secret: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/create_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, owner_id: ownerId, secret }),
    })
    return response.json()
  },

  // Delete user
  async deleteUser(userId: number, ownerId: string, secret: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/delete_user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret }),
    })
    return response.json()
  },

  // Update user password
  async updateUserPassword(
    userId: number,
    password: string,
    ownerId: string,
    secret: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/update_user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret, password }),
    })
    return response.json()
  },

  // Block user (kill session)
  async blockUser(userId: number, ownerId: string, secret: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/block_user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret }),
    })
    return response.json()
  },

  // Ban IP
  async banIP(
    ip: string,
    reason: string,
    ownerId: string,
    secret: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/ban_ip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret, ip, reason }),
    })
    return response.json()
  },

  // Ban HWID
  async banHWID(
    hwid: string,
    reason: string,
    ownerId: string,
    secret: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/ban_hwid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret, hwid, reason }),
    })
    return response.json()
  },

  // Get banned list
  async getBannedList(ownerId: string, secret: string): Promise<{ banned_ips: BannedItem[] }> {
    const response = await fetch(`${API_BASE}/client/list_banned_ips/${ownerId}?secret=${secret}`)
    return response.json()
  },

  // Unban item
  async unbanItem(banId: number, ownerId: string, secret: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/unban_ip/${banId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret }),
    })
    return response.json()
  },

  // Get version
  async getVersion(ownerId: string, secret: string): Promise<{ success: boolean; version: string }> {
    const response = await fetch(`${API_BASE}/client/get_version/${ownerId}?secret=${secret}`)
    return response.json()
  },

  // Set version
  async setVersion(version: string, ownerId: string, secret: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/client/set_version`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version, owner_id: ownerId, secret }),
    })
    return response.json()
  },

  // Get HWID resets
  async getHWIDResets(ownerId: string, secret: string): Promise<{ resets: HWIDReset[] }> {
    const response = await fetch(`${API_BASE}/admin/hwid_resets?owner_id=${ownerId}&secret=${secret}`)
    return response.json()
  },

  // Approve HWID reset
  async approveHWIDReset(
    userId: number,
    ownerId: string,
    secret: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/admin/approve_hwid_reset/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret }),
    })
    return response.json()
  },

  // Deny HWID reset
  async denyHWIDReset(userId: number, ownerId: string, secret: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE}/admin/deny_hwid_reset/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner_id: ownerId, secret }),
    })
    return response.json()
  },
}
