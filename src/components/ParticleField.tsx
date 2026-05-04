import { useEffect, useRef } from 'react'

/**
 * Interactive Dot Wave Grid
 * Inspired by the Antigravity-style ripple/pulse effect.
 * A grid of dots that react to mouse proximity with wave-like displacement and glow.
 */

const DOT_SPACING = 28
const DOT_BASE_RADIUS = 1.5
const DOT_MAX_RADIUS = 4
const MOUSE_RADIUS = 200
const WAVE_SPEED = 0.03
const WAVE_AMPLITUDE = 12
const BASE_COLOR = { r: 96, g: 165, b: 250 }   // #60a5fa
const GLOW_COLOR = { r: 168, g: 139, b: 250 }   // #a88bfa

interface Dot {
  baseX: number
  baseY: number
  x: number
  y: number
  radius: number
  alpha: number
  wave: number
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
            alpha: 0.15,
            wave: 0,
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

      for (const dot of dots.current) {
        const dx = dot.baseX - mx
        const dy = dot.baseY - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Influence factor (1 at center, 0 at edge of MOUSE_RADIUS)
        const influence = Math.max(0, 1 - dist / MOUSE_RADIUS)

        // Wave displacement — ripple outward from cursor
        const waveOffset = Math.sin(dist * 0.04 - time.current * 4) * WAVE_AMPLITUDE * influence
        const angle = Math.atan2(dy, dx)

        dot.x = dot.baseX + Math.cos(angle) * waveOffset
        dot.y = dot.baseY + Math.sin(angle) * waveOffset

        // Size pulse
        dot.radius = DOT_BASE_RADIUS + (DOT_MAX_RADIUS - DOT_BASE_RADIUS) * influence

        // Alpha pulse  
        dot.alpha = 0.12 + 0.88 * influence

        // Color interpolation (base → glow based on influence)
        const r = Math.round(BASE_COLOR.r + (GLOW_COLOR.r - BASE_COLOR.r) * influence)
        const g = Math.round(BASE_COLOR.g + (GLOW_COLOR.g - BASE_COLOR.g) * influence)
        const b = Math.round(BASE_COLOR.b + (GLOW_COLOR.b - BASE_COLOR.b) * influence)

        // Draw dot
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${dot.alpha})`
        ctx.fill()

        // Glow halo for close dots
        if (influence > 0.3) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, dot.radius * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${influence * 0.08})`
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
