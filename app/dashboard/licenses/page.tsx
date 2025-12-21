import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LicensesTable } from "@/components/dashboard/licenses-table"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Licenses - AuthGuard Dashboard",
  description: "Manage your licenses",
}

export default function LicensesPage() {
  return (
    <DashboardLayout>
      <LicensesTable />
    </DashboardLayout>
  )
}
