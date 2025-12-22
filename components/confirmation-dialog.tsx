"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isDangerous?: boolean
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
        <div className="flex gap-4 mb-4">
          <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
            isDangerous ? "bg-red-500/20" : "bg-yellow-500/20"
          }`}>
            <AlertCircle className={`h-6 w-6 ${isDangerous ? "text-red-400" : "text-yellow-400"}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>

        <p className="text-slate-300 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onCancel}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onCancel()
            }}
            className={`px-4 py-2 text-white ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
