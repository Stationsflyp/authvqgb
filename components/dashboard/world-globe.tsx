"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { Loader2, MapPin, Users } from "lucide-react"

interface UserLocation {
  user_id: number
  username: string
  latitude: number
  longitude: number
  country: string
  city: string
  timestamp: string
}

export function WorldGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.Camera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Mesh | null>(null)
  const pointsRef = useRef<THREE.Points | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserLocation | null>(null)
  const [userCount, setUserCount] = useState(0)
  const [locations, setLocations] = useState<UserLocation[]>([])
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/location/users")
        const data = await response.json()
        if (data.status === "success") {
          setLocations(data.locations)
          setUserCount(data.locations.length)
        }
      } catch (error) {
        console.error("Error fetching locations:", error)
      }
    }

    fetchLocations()
    const interval = setInterval(fetchLocations, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 2.5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    const geometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      color: 0x1a4d7d,
      emissive: 0x0a2540,
      shininess: 5,
      wireframe: false,
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)
    globeRef.current = globe

    const light = new THREE.DirectionalLight(0xffffff, 0.8)
    light.position.set(5, 3, 5)
    scene.add(light)

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    let animationId: number

    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (globeRef.current) {
        globeRef.current.rotation.y += 0.001
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, camera)

      if (pointsRef.current) {
        const intersects = raycasterRef.current.intersectObject(pointsRef.current)
        if (intersects.length > 0) {
          const point = intersects[0]
          const index = point.index
          if (index !== undefined && locations[index]) {
            setSelectedUser(locations[index])
          }
        }
      }
    }

    const handleClick = () => {
      if (!pointsRef.current) return

      const intersects = raycasterRef.current.intersectObject(pointsRef.current)
      if (intersects.length > 0) {
        const point = intersects[0]
        const index = point.index
        if (index !== undefined && locations[index]) {
          setSelectedUser(locations[index])
        }
      }
    }

    containerRef.current.addEventListener("mousemove", handleMouseMove)
    containerRef.current.addEventListener("click", handleClick)

    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width
      const newHeight = containerRef.current?.clientHeight || height

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      containerRef.current?.removeEventListener("mousemove", handleMouseMove)
      containerRef.current?.removeEventListener("click", handleClick)
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [locations])

  useEffect(() => {
    if (!sceneRef.current || locations.length === 0) return

    if (pointsRef.current) {
      sceneRef.current.remove(pointsRef.current)
    }

    const positions = new Float32Array(locations.length * 3)
    const colors = new Float32Array(locations.length * 3)

    locations.forEach((loc, index) => {
      const lat = (loc.latitude * Math.PI) / 180
      const lon = (loc.longitude * Math.PI) / 180

      const x = Math.cos(lat) * Math.cos(lon)
      const y = Math.sin(lat)
      const z = Math.cos(lat) * Math.sin(lon)

      positions[index * 3] = x * 1.05
      positions[index * 3 + 1] = y * 1.05
      positions[index * 3 + 2] = z * 1.05

      const hue = Math.random()
      const color = new THREE.Color()
      color.setHSL(hue, 1, 0.5)

      colors[index * 3] = color.r
      colors[index * 3 + 1] = color.g
      colors[index * 3 + 2] = color.b
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geometry, material)
    sceneRef.current.add(points)
    pointsRef.current = points

    setLoading(false)
  }, [locations])

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="relative flex-1 flex flex-col">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        )}

        <div
          ref={containerRef}
          className="flex-1 w-full bg-gradient-to-b from-slate-950 to-slate-900"
        />

        <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur border border-cyan-500/30 rounded-xl p-4 z-20">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white">Live Users</h3>
          </div>
          <p className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
            {userCount}
          </p>
          <p className="text-xs text-slate-400 mt-1">Active locations</p>
        </div>

        {selectedUser && (
          <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur border border-cyan-500/50 rounded-xl p-4 z-20 max-w-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-white">{selectedUser.username}</h4>
                <p className="text-sm text-slate-300 mt-1">
                  📍 {selectedUser.city}, {selectedUser.country}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Lat: {selectedUser.latitude.toFixed(4)}°
                </p>
                <p className="text-xs text-slate-400">
                  Lon: {selectedUser.longitude.toFixed(4)}°
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {new Date(selectedUser.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur border border-cyan-500/30 rounded-xl p-4 z-20">
          <p className="text-sm text-slate-300 font-semibold">🌍 Global User Map</p>
          <p className="text-xs text-slate-400 mt-1">Hover/Click on points for details</p>
          <p className="text-xs text-slate-500 mt-2">Updates every 30 seconds</p>
        </div>
      </div>
    </div>
  )
}
