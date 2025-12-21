"use client"

import { useEffect } from "react"

export function ClientProtection() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Allow copy/paste in input fields and code blocks
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      // Allow copying from input, textarea, and code elements
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "CODE" ||
        target.closest("code") ||
        target.closest("pre")
      ) {
        return true
      }
      e.preventDefault()
      return false
    }

    // Disable F12 and Ctrl+U but allow Ctrl+C/V in inputs
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputField =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.closest("code") || target.closest("pre")

      // Block F12 and Ctrl+U always
      if (e.key === "F12" || (e.ctrlKey && e.key === "u")) {
        e.preventDefault()
        return false
      }

      // Allow Ctrl+C/V/X in input fields and code blocks
      if (isInputField && e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) {
        return true
      }

      // Block Ctrl+C/V/X elsewhere
      if (e.ctrlKey && (e.key === "c" || e.key === "x" || e.key === "v")) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("copy", handleCopy)
    document.addEventListener("cut", handleCopy)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("copy", handleCopy)
      document.removeEventListener("cut", handleCopy)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return null
}
