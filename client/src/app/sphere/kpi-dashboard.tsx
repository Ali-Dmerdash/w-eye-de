"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html, Environment } from "@react-three/drei"
import * as THREE from "three"
import type { KPIData } from "./page"
import { useTheme } from "@/context/ThemeContext"

interface KPIDashboardProps {
  kpis: KPIData[]
  overallStatus: string
  resetTrigger: number
  envPreset?: EnvPreset
  styleMode?: "wireframe" | "minimal" | "neon" | "glass"
}

interface KPISphereProps {
  kpi: KPIData
  position: [number, number, number]
  onHover: (kpi: KPIData | null) => void
  distance: number
  styleMode?: "wireframe" | "minimal" | "neon" | "glass"
}

function KPISphere({ kpi, position, onHover, distance, styleMode = "wireframe" }: KPISphereProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lineRef = useRef<THREE.BufferGeometry>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { theme } = useTheme()

  // Calculate size based on importance (make range more dramatic, e.g., 0.2 to 2.0, exponential mapping)
  const size = 0.2 + Math.pow(kpi.importance / 10, 2) * 1.8

  // Enhanced color system
  const getColor = () => {
    const colors: Record<"good" | "warning" | "critical", string> = {
      good: theme === "dark" ? "#8b5cf6" : "#7c3aed",
      warning: theme === "dark" ? "#8b5cf6" : "#7c3aed",
      critical: theme === "dark" ? "#8b5cf6" : "#7c3aed",
    }
    return colors[kpi.status as keyof typeof colors] || (theme === "dark" ? "#64748b" : "#475569")
  }

  const getAccentColor = () => {
    const colors: Record<"good" | "warning" | "critical", string> = {
      good: "#4CA64C",
      warning: "#ffcd03",
      critical: "#ff0000",
    }
    return colors[kpi.status as keyof typeof colors] || "#94a3b8"
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (meshRef.current) {
      // Smooth floating animation
      meshRef.current.position.y = position[1] + Math.sin(time * 0.8 + kpi.id) * 0.1

      // Gentle rotation based on importance
      meshRef.current.rotation.x += 0.001 * (kpi.importance / 10)
      meshRef.current.rotation.y += 0.002 * (kpi.importance / 10)

      // Scale animation on hover - enhanced with more dramatic scaling
      const targetScale = hovered ? size * 1.5 : size
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15)
    }

    // Animated connecting line
    if (lineRef.current) {
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(position[0], position[1] + Math.sin(time * 0.8 + kpi.id) * 0.1, position[2]),
      ]
      lineRef.current.setFromPoints(points)
    }

    // Glow effect for neon mode - enhanced with pulsing when hovered
    if (glowRef.current && styleMode === "neon") {
      const pulseIntensity = hovered ? 0.3 : 0.1
      const pulseSpeed = hovered ? 4 : 2
      const glowScale = (hovered ? 1.8 : 1.2) + Math.sin(time * pulseSpeed + kpi.id) * pulseIntensity
      glowRef.current.scale.setScalar(glowScale)
    }
  })

  const renderMaterial = () => {
    const color = getColor()
    const accentColor = getAccentColor()

    switch (styleMode) {
      case "wireframe":
        return (
          <meshStandardMaterial
            color={hovered ? accentColor : color}
            metalness={0.1}
            roughness={0.8}
            emissive={color}
            emissiveIntensity={hovered ? 0.15 : 0.05}
          />
        )

      case "minimal":
        return <meshLambertMaterial color={color} transparent opacity={hovered ? 1 : 0.9} />

      case "neon":
        return (
          <meshStandardMaterial
            color={color}
            emissive={hovered ? accentColor : color}
            emissiveIntensity={hovered ? 2.5 : 0.8}
            transparent
            opacity={0.9}
          />
        )

      case "glass":
        return (
          <meshPhysicalMaterial
            color={color}
            metalness={0.1}
            roughness={0.05}
            transmission={0.9}
            transparent
            opacity={hovered ? 0.6 : 0.3}
            ior={1.5}
            thickness={0.5}
            emissive={color}
            emissiveIntensity={hovered ? 1.0 : 0.2}
          />
        )

      default:
        return <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} emissive={color} emissiveIntensity={0.05} />
    }
  }

  return (
    <group>
      {/* Connecting line with enhanced styling */}
      <line>
        <bufferGeometry ref={lineRef} />
        <lineBasicMaterial
          color={hovered ? getAccentColor() : getColor()}
          transparent
          opacity={hovered ? 0.9 : 0.5}
          linewidth={hovered ? 8 : 4}
        />
      </line>

      {/* Glow effect for neon mode */}
      {styleMode === "neon" && (
        <mesh ref={glowRef} position={position}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color={getColor()} transparent opacity={0.1} />
        </mesh>
      )}

      {/* Main KPI Sphere */}
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          onHover(kpi)
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          setHovered(false)
          onHover(null)
          document.body.style.cursor = "default"
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        {renderMaterial()}
      </mesh>

      {/* Status Indicator Dot */}
      <mesh position={[position[0], position[1] + size + 0.15, position[2]]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={getAccentColor()}
          emissive={getAccentColor()}
          emissiveIntensity={0.5}
          metalness={0}
          roughness={0.3}
        />
      </mesh>

      {/* Tooltip */}
      {hovered && (
        <Html 
          distanceFactor={24} 
          position={[position[0], position[1] + 1.5, position[2] + 1]} 
          center
        >
          <div
            className={`${theme === "dark" ? "bg-gray-900/90" : "bg-white/90"} backdrop-blur-sm text-${theme === "dark" ? "white" : "gray-900"} p-3 rounded-lg shadow-lg min-w-[200px] border ${theme === "dark" ? "border-gray-700" : "border-gray-200"} transform transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">{kpi.name}</h4>
              <span
                className={`text-xs px-2 py-1 rounded-full capitalize ${
                  kpi.status === "good"
                    ? theme === "dark"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-green-500/20 text-green-700"
                    : kpi.status === "warning"
                      ? theme === "dark"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-yellow-500/20 text-yellow-700"
                      : theme === "dark"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-red-500/20 text-red-700"
                }`}
              >
                {kpi.status}
              </span>
            </div>

            <div className="text-xl font-bold mb-2 text-center" style={{ color: hovered ? getAccentColor() : getColor() }}>
              {kpi.value}
            </div>

            <p className={`text-xs mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {kpi.description}
            </p>

            <div className="text-xs">
              <div className="flex justify-between">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Importance:</span>
                <span className="font-medium">{kpi.importance}/10</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Distance:</span>
                <span className="font-medium">{distance.toFixed(1)} units</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function CentralSphere({
  status,
  styleMode = "wireframe",
}: { status: string; styleMode?: "wireframe" | "minimal" | "neon" | "glass" }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const { theme } = useTheme()

  const getColor = () => {
    const colors: Record<"good" | "warning" | "critical", string> = {
      good: theme === "dark" ? "#8b5cf6" : "#7c3aed",
      warning: theme === "dark" ? "#8b5cf6" : "#7c3aed",
      critical: theme === "dark" ? "#8b5cf6" : "#7c3aed",
    }
    return colors[status as keyof typeof colors] || (theme === "dark" ? "#64748b" : "#475569")
  }

  useFrame((state) => {
    const time = state.clock.elapsedTime

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.002

      // Breathing effect
      const scale = 1 + Math.sin(time * 1.5) * 0.05
      meshRef.current.scale.setScalar(scale)
    }

    if (outerRef.current) {
      outerRef.current.rotation.y -= 0.003
      outerRef.current.rotation.z += 0.001

      const outerScale = 1 + Math.sin(time * 1.2) * 0.08
      outerRef.current.scale.setScalar(outerScale)
    }

    if (coreRef.current) {
      coreRef.current.rotation.x += 0.008
      coreRef.current.rotation.y += 0.012
    }
  })

  const renderMaterial = (isCore = false, isOuter = false) => {
    const color = getColor()
    const intensity = isCore ? 2.0 : isOuter ? 0.3 : 1.0

    switch (styleMode) {
      case "wireframe":
        return (
          <meshStandardMaterial
            color={color}
            wireframe
            wireframeLinewidth={isOuter ? 1 : 2}
            emissive={color}
            emissiveIntensity={intensity * 0.5}
            transparent={isOuter}
            opacity={isOuter ? 0.6 : 1}
          />
        )

      case "minimal":
        return (
          <meshLambertMaterial
            color={isCore ? "#ffffff" : color}
            transparent={isOuter}
            opacity={isOuter ? 0.3 : isCore ? 1 : 0.8}
          />
        )

      case "neon":
        return (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={intensity}
            transparent={isOuter}
            opacity={isOuter ? 0.2 : 0.9}
          />
        )

      case "glass":
        return (
          <meshPhysicalMaterial
            color={isCore ? "#ffffff" : color}
            metalness={0.1}
            roughness={0.05}
            transmission={isOuter ? 0.95 : isCore ? 0.3 : 0.7}
            transparent
            opacity={isOuter ? 0.2 : isCore ? 0.9 : 0.5}
            ior={1.5}
            thickness={isOuter ? 0.1 : 0.5}
            emissive={color}
            emissiveIntensity={intensity * 0.3}
          />
        )

      default:
        return <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.5} />
    }
  }

  return (
    <group>
      {/* Outer atmosphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[4.5, styleMode === "wireframe" ? 16 : 32, styleMode === "wireframe" ? 16 : 32]} />
        {renderMaterial(false, true)}
      </mesh>

      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.8, styleMode === "wireframe" ? 20 : 32, styleMode === "wireframe" ? 20 : 32]} />
        {renderMaterial()}
      </mesh>

      {/* Inner core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.8, styleMode === "wireframe" ? 12 : 24, styleMode === "wireframe" ? 12 : 24]} />
        {renderMaterial(true)}
      </mesh>

      {/* Ultra-bright center (only for neon/glass modes) */}
      {(styleMode === "neon" || styleMode === "glass") && (
        <mesh>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  )
}

type EnvPreset =
  | "night"
  | "apartment"
  | "city"
  | "dawn"
  | "forest"
  | "lobby"
  | "park"
  | "studio"
  | "sunset"
  | "warehouse"

function Scene({ kpis, overallStatus, resetTrigger, envPreset = "city", styleMode = "wireframe" }: KPIDashboardProps) {
  const [hoveredKPI, setHoveredKPI] = useState<KPIData | null>(null)
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [resetTrigger])

  const getKPIPositions = () => {
    const positions: [number, number, number][] = []
    const distances: number[] = []

    kpis.forEach((kpi, index) => {
      const baseRadius = 7
      const relevanceFactor = (11 - kpi.relevanceToOverall) / 10
      const radius = baseRadius + relevanceFactor * 4

      const phi = Math.acos(-1 + (2 * index) / kpis.length)
      const theta = Math.sqrt(kpis.length * Math.PI) * phi

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      positions.push([x, y, z])
      distances.push(radius)
    })

    return { positions, distances }
  }

  const { positions, distances } = getKPIPositions()

  return (
    <>
      <ambientLight intensity={styleMode === "neon" ? 0.3 : 0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={styleMode === "neon" ? 0.5 : 1.0}
        castShadow={styleMode === "glass"}
      />
      {styleMode === "neon" && (
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          color={overallStatus === "good" ? "#8b5cf6" : overallStatus === "warning" ? "#8b5cf6" : "#8b5cf6"}
        />
      )}

      <CentralSphere status={overallStatus} styleMode={styleMode} />

      {kpis.map((kpi, index) => (
        <KPISphere
          key={kpi.id}
          kpi={kpi}
          position={positions[index]}
          onHover={setHoveredKPI}
          distance={distances[index]}
          styleMode={styleMode}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={!hoveredKPI}
        autoRotateSpeed={styleMode === "neon" ? 0.5 : 0.3}
        minDistance={8}
        maxDistance={45}
        dampingFactor={0.05}
        enableDamping
      />

      {styleMode !== "neon" && <Environment preset={envPreset} />}
    </>
  )
}

export function KPIDashboard({
  kpis,
  overallStatus,
  resetTrigger,
  envPreset = "night",
  styleMode = "wireframe",
}: KPIDashboardProps) {
  const { theme } = useTheme()

  return (
    <div className="w-full h-full relative bg-transparent">
      <Canvas
        camera={{ position: [30, 30, 30], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{
          background: "transparent",
        }}
      >
        <Scene
          kpis={kpis}
          overallStatus={overallStatus}
          resetTrigger={resetTrigger}
          envPreset={envPreset}
          styleMode={styleMode}
        />
      </Canvas>

      
    </div>
  )
}
