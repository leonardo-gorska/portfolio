import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
  maxLife: number
}

const COLORS = ['#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#38bdf8']
const MAX_PARTICLES = 80

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: -1000, y: -1000 })
  const animationId = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY + window.scrollY }
      // Spawn particles on mouse move
      for (let i = 0; i < 2; i++) {
        if (particles.current.length < MAX_PARTICLES) {
          const angle = Math.random() * Math.PI * 2
          const speed = Math.random() * 1.5 + 0.5
          particles.current.push({
            x: mouse.current.x + (Math.random() - 0.5) * 10,
            y: mouse.current.y + (Math.random() - 0.5) * 10,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 0,
            maxLife: Math.random() * 40 + 20,
          })
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.filter(p => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        p.alpha = 1 - p.life / p.maxLife

        if (p.life >= p.maxLife) return false

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * 0.6
        ctx.fill()

        // Glow effect
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.alpha * 3, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * 0.1
        ctx.fill()

        return true
      })

      ctx.globalAlpha = 1
      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    // Update canvas height on scroll
    const handleScroll = () => {
      canvas.height = document.documentElement.scrollHeight
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
