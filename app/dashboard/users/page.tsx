import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UsersTable } from "@/components/dashboard/users-table"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Users - AuthGuard Dashboard",
  description: "Manage your users",
}

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersTable />
    </DashboardLayout>
  )
}
