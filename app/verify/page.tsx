'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield } from 'lucide-react'
import { Suspense } from 'react'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Verifying your browser...')

  useEffect(() => {
    let interval: NodeJS.Timeout

    const verify = async () => {
      try {
        interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 85) return prev
            return prev + Math.random() * 30
          })
        }, 200)

        await new Promise(resolve => setTimeout(resolve, 2500))

        setProgress(95)
        setStatus('Completing security check...')

        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          setProgress(100)
          setStatus('Access granted')
          
          const redirect = searchParams.get('redirect') || '/auth/login'
          setTimeout(() => {
            router.push(redirect)
          }, 500)
        }
      } catch (error) {
        console.error('Verification failed:', error)
        setStatus('Verification failed. Retrying...')
        setTimeout(() => location.reload(), 3000)
      } finally {
        clearInterval(interval)
      }
    }

    verify()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-500/10 rounded-full">
          <Shield className="h-8 w-8 text-blue-500 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Verifying Browser</h1>
          <p className="text-slate-400">{status}</p>
        </div>

        <div className="space-y-3">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500">{Math.round(progress)}%</p>
        </div>

        <div className="pt-4 border-t border-slate-700 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            <span>Checking your browser security</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            <span>Validating connection</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function VerifyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-500/10 rounded-full">
          <Shield className="h-8 w-8 text-blue-500 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Verifying Browser</h1>
          <p className="text-slate-400">Loading verification...</p>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  )
}
