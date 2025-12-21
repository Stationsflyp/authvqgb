"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Copy, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface License {
  id: number
  key: string
  hwid: string | null
  expiresAt: string
  status: "active" | "expired" | "used"
  createdAt: string
  notes?: string
}

export function LicensesTable() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [days, setDays] = useState<number>(30)
  const [isLifetime, setIsLifetime] = useState(false)
  const [notes, setNotes] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchLicenses()
  }, [])

  const fetchLicenses = async () => {
    try {
      const owner_id = localStorage.getItem("owner_id")
      const secret = localStorage.getItem("secret")
      
      if (!owner_id || !secret) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/admin/licenses?owner_id=${owner_id}&secret=${secret}`)
      const data = await response.json()
      setLicenses(data.licenses || [])
    } catch (error) {
      console.error("Failed to fetch licenses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateClick = () => {
    setShowGenerateModal(true)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const owner_id = localStorage.getItem("owner_id")
      const secret = localStorage.getItem("secret")
      
      if (!owner_id || !secret) {
        toast({ title: "Error", description: "Not authenticated", variant: "destructive" })
        return
      }

      const response = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id,
          secret,
          days: isLifetime ? 36500 : days,
          is_lifetime: isLifetime,
          notes,
        }),
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `License generated: ${data.key}`,
        })
        setShowGenerateModal(false)
        setDays(30)
        setIsLifetime(false)
        setNotes("")
        fetchLicenses()
      } else {
        toast({ title: "Error", description: data.message || "Failed to generate license", variant: "destructive" })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Failed to generate license", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: "License key copied to clipboard" })
  }

  return (
    <>
      <div className="space-y-6 animate-scale-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Licenses</h1>
            <p className="text-muted-foreground mt-2">Manage your license keys</p>
          </div>
          <Button onClick={handleGenerateClick} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Generate License
          </Button>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>All Licenses</CardTitle>
            <CardDescription>View and manage license keys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">License Key</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">HWID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expires</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Notes</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  ) : licenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        No licenses found
                      </td>
                    </tr>
                  ) : (
                    licenses.map((license) => (
                      <tr key={license.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4">
                          <code className="text-xs bg-secondary px-2 py-1 rounded font-mono">{license.key}</code>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-secondary px-2 py-1 rounded">{license.hwid || "Not bound"}</code>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(license.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(license.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                          {license.notes || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              license.status === "active"
                                ? "default"
                                : license.status === "used"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {license.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(license.key)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive bg-transparent"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generate License</CardTitle>
                  <CardDescription>Create a new license key</CardDescription>
                </div>
                <button onClick={() => setShowGenerateModal(false)} className="p-1 hover:bg-secondary rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  disabled={isLifetime}
                  className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-md">
                <input
                  type="checkbox"
                  id="lifetime"
                  checked={isLifetime}
                  onChange={(e) => setIsLifetime(e.target.checked)}
                  className="w-4 h-4 rounded border-border cursor-pointer"
                />
                <label htmlFor="lifetime" className="text-sm font-medium cursor-pointer">
                  Lifetime (No expiration)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this license..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground text-sm h-20"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowGenerateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating} className="bg-primary hover:bg-primary/90">
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
