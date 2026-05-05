"use client"

import { useEffect, useRef } from "react"

/**
 * Organic Dot-Wave ÔÇö DevBlog version.
 * On light backgrounds: dots are INVISIBLE by default,
 * only appearing near the cursor for a clean, ghost-like reveal.
 */

const DOT_SPACING = 24
const DOT_BASE_RADIUS = 1.2
const DOT_MAX_RADIUS = 5.5
const MOUSE_RADIUS = 320
const WAVE_SPEED = 0.025
const WAVE_AMPLITUDE = 24

const COLORS = [
  { r: 59, g: 130, b: 246 },   // blue-500
  { r: 99, g: 102, b: 241 },   // indigo-500
  { r: 139, g: 92, b: 246 },   // violet-500
  { r: 14, g: 165, b: 233 },   // sky-500
]

interface Dot {
  baseX: number
  baseY: number
  x: number
  y: number
  radius: number
  alpha: number
  colorIdx: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const dots = useRef<Dot[]>([])
  const animationId = useRef<number>(0)
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const buildGrid = () => {
      dots.current = []
      const cols = Math.ceil(canvas.width / DOT_SPACING) + 1
      const rows = Math.ceil(canvas.height / DOT_SPACING) + 1
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.current.push({
            baseX: col * DOT_SPACING,
            baseY: row * DOT_SPACING,
            x: col * DOT_SPACING,
            y: row * DOT_SPACING,
            radius: DOT_BASE_RADIUS,
            alpha: 0,
            colorIdx: (col + row) % COLORS.length,
          })
        }
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildGrid()
    }

    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      time.current += WAVE_SPEED
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouse.current.x
      const my = mouse.current.y
      const t = time.current

      for (const dot of dots.current) {
        const dx = dot.baseX - mx
        const dy = dot.baseY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        const raw = Math.max(0, 1 - dist / MOUSE_RADIUS)
        const influence = raw * raw * (3 - 2 * raw)

        // Skip dots with zero influence for performance
        if (influence < 0.01) continue

        const wave1 = Math.sin(dist * 0.025 - t * 3.5) * WAVE_AMPLITUDE
        const wave2 = Math.sin(dist * 0.045 - t * 5.0) * WAVE_AMPLITUDE * 0.4
        const wave3 = Math.cos(dist * 0.015 - t * 2.0) * WAVE_AMPLITUDE * 0.25
        const totalWave = (wave1 + wave2 + wave3) * influence

        const angle = Math.atan2(dy, dx)
        dot.x = dot.baseX + Math.cos(angle) * totalWave
        dot.y = dot.baseY + Math.sin(angle) * totalWave

        const sizePulse = 1 + Math.sin(t * 2 + dist * 0.02) * 0.15
        dot.radius = (DOT_BASE_RADIUS + (DOT_MAX_RADIUS - DOT_BASE_RADIUS) * influence) * sizePulse

        // Alpha: fully transparent at edge, visible near cursor
        dot.alpha = influence * 0.85

        const ci = dot.colorIdx
        const nextCi = (ci + 1) % COLORS.length
        const blend = (Math.sin(t + dist * 0.01) + 1) * 0.5
        const c = COLORS[ci]
        const nc = COLORS[nextCi]
        const r = Math.round(c.r + (nc.r - c.r) * blend)
        const g = Math.round(c.g + (nc.g - c.g) * blend)
        const b = Math.round(c.b + (nc.b - c.b) * blend)

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha})`
        ctx.fill()

        if (influence > 0.2) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.radius * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${influence * 0.05})`
          ctx.fill()
        }

        if (influence > 0.65) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.radius * 0.35, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${influence * 0.7})`
          ctx.fill()
        }
      }

      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  )
}
