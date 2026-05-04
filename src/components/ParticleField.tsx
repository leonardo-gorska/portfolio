"use client"

import { useEffect, useRef } from "react"

// Default Antigravity-like colors: Royal Blue, Vibrant Purple/Magenta, Deep Red, Warm Orange, Teal
const DEFAULT_COLORS = ["#3b82f6", "#8b5cf6", "#e11d48", "#f97316", "#10b981"]

interface ParticleFieldProps {
  colors?: string[]
}

export default function ParticleField({ colors = DEFAULT_COLORS }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = window.innerWidth
    let height = window.innerHeight

    // Track mouse position (default to center)
    let mouseX = width / 2
    let mouseY = height / 2
    let isMouseMoving = false

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    window.addEventListener("resize", resize)
    resize()

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      isMouseMoving = true
    }

    const handleMouseLeave = () => {
      isMouseMoving = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    class Star {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 1.2
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.opacity = Math.random() * 0.5 + 0.1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0) this.x = width
        if (this.x > width) this.x = 0
        if (this.y < 0) this.y = height
        if (this.y > height) this.y = 0
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(150, 150, 150, ${this.opacity})`
        ctx.fill()
      }
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      baseVx: number
      baseVy: number
      size: number
      color: string
      friction: number

      constructor() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        // Base drift direction (diagonal up-right, radiating out slightly)
        this.baseVx = (Math.random() - 0.2) * 1.5 // Mostly right
        this.baseVy = (Math.random() - 0.8) * 1.5 // Mostly up
        this.vx = this.baseVx
        this.vy = this.baseVy
        this.size = Math.random() * 2 + 1 // Streak thickness
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.friction = Math.random() * 0.02 + 0.94 // 0.94 to 0.96
      }

      update() {
        // Continuous flow / drift
        let ax = (this.baseVx - this.vx) * 0.02
        let ay = (this.baseVy - this.vy) * 0.02

        // Mouse gravity / vortex effect
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1

        if (dist < 400 && isMouseMoving) {
          const force = (400 - dist) / 400 // 0 to 1 intensity based on proximity

          const dirX = dx / dist
          const dirY = dy / dist

          // Attraction (pulls towards mouse)
          ax += dirX * force * 0.6
          ay += dirY * force * 0.6

          // Tangent (creates the vortex/orbit effect)
          ax += -dirY * force * 0.4
          ay += dirX * force * 0.4
        }

        // Apply acceleration & friction
        this.vx += ax
        this.vy += ay
        this.vx *= this.friction
        this.vy *= this.friction

        this.x += this.vx
        this.y += this.vy

        // Wrap around seamlessly
        if (this.x > width + 50) this.x = -50
        if (this.x < -50) this.x = width + 50
        if (this.y > height + 50) this.y = -50
        if (this.y < -50) this.y = height + 50
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()

        // Elongated streak proportional to velocity
        const streakMultiplier = 3.5
        const startX = this.x - this.vx * streakMultiplier
        const startY = this.y - this.vy * streakMultiplier

        ctx.moveTo(startX, startY)
        ctx.lineTo(this.x, this.y)

        ctx.strokeStyle = this.color
        ctx.lineWidth = this.size
        ctx.lineCap = "round"
        ctx.stroke()
      }
    }

    const particles: Particle[] = []
    const stars: Star[] = []
    
    // Scale particle count based on screen width for performance
    const particleCount = Math.min(Math.floor(window.innerWidth / 4), 300)
    const starCount = Math.min(Math.floor(window.innerWidth / 6), 150)

    for (let i = 0; i < particleCount; i++) particles.push(new Particle())
    for (let i = 0; i < starCount; i++) stars.push(new Star())

    const render = () => {
      if (!ctx) return
      // Clear entirely for sharp streaks
      ctx.clearRect(0, 0, width, height)

      // Draw background stars
      stars.forEach(star => {
        star.update()
        star.draw()
      })

      // Draw active swarm particles
      particles.forEach(p => {
        p.update()
        p.draw()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colors])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0, // Behind everything
      }}
    />
  )
}
