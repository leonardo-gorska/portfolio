import { useEffect, useRef } from 'react'

/**
 * Organic Dot-Wave ÔÇö "Jellyfish" style.
 * Large, flowing undulation with multiple wave frequencies.
 * Dots breathe and pulse organically even without mouse.
 */

const DOT_SPACING = 24
const DOT_BASE_RADIUS = 1.2
const DOT_MAX_RADIUS = 6
const MOUSE_RADIUS = 350
const WAVE_SPEED = 0.025
const WAVE_AMPLITUDE = 28

const COLORS = [
  { r: 96, g: 165, b: 250 },   // blue
  { r: 129, g: 140, b: 248 },  // indigo
  { r: 168, g: 139, b: 250 },  // purple
  { r: 56, g: 189, b: 248 },   // sky
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
    const ctx = canvas.getContext('2d')
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
            alpha: 0.08,
            colorIdx: (col + row) % COLORS.length,
          })
        }
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight
      )
      buildGrid()
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY,
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

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

        // Smooth cubic falloff for organic feel
        const raw = Math.max(0, 1 - dist / MOUSE_RADIUS)
        const influence = raw * raw * (3 - 2 * raw) // smoothstep

        // Ambient breathing wave (always active, subtle)
        const ambientX = Math.sin(dot.baseX * 0.008 + t * 1.2) * 1.5
        const ambientY = Math.cos(dot.baseY * 0.008 + t * 0.9) * 1.5

        // Multiple wave frequencies for organic "jellyfish" pulse
        const wave1 = Math.sin(dist * 0.025 - t * 3.5) * WAVE_AMPLITUDE
        const wave2 = Math.sin(dist * 0.045 - t * 5.0) * WAVE_AMPLITUDE * 0.4
        const wave3 = Math.cos(dist * 0.015 - t * 2.0) * WAVE_AMPLITUDE * 0.25
        const totalWave = (wave1 + wave2 + wave3) * influence

        const angle = Math.atan2(dy, dx)
        dot.x = dot.baseX + Math.cos(angle) * totalWave + ambientX
        dot.y = dot.baseY + Math.sin(angle) * totalWave + ambientY

        // Size: larger near cursor, organic pulse
        const sizePulse = 1 + Math.sin(t * 2 + dist * 0.02) * 0.15
        dot.radius = (DOT_BASE_RADIUS + (DOT_MAX_RADIUS - DOT_BASE_RADIUS) * influence) * sizePulse

        // Alpha
        dot.alpha = 0.06 + 0.94 * influence

        // Color from palette with subtle shift
        const ci = dot.colorIdx
        const nextCi = (ci + 1) % COLORS.length
        const blend = (Math.sin(t + dist * 0.01) + 1) * 0.5
        const c = COLORS[ci]
        const nc = COLORS[nextCi]
        const r = Math.round(c.r + (nc.r - c.r) * blend)
        const g = Math.round(c.g + (nc.g - c.g) * blend)
        const b = Math.round(c.b + (nc.b - c.b) * blend)

        // Main dot
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha})`
        ctx.fill()

        // Glow halo ÔÇö larger and softer
        if (influence > 0.15) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.radius * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${influence * 0.06})`
          ctx.fill()
        }

        // Inner bright core for close dots
        if (influence > 0.6) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.radius * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${influence * 0.5})`
          ctx.fill()
        }
      }

      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    const handleScroll = () => {
      const newH = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight
      )
      if (Math.abs(canvas.height - newH) > 100) {
        canvas.height = newH
        buildGrid()
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
