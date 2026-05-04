import { useEffect, useRef } from 'react'

/**
 * Flow Field Particles — Antigravity-inspired.
 * 
 * Thousands of tiny particles flow through a Perlin noise vector field.
 * The cursor warps the flow field, creating organic disturbances.
 * Particles leave soft trails as they move.
 */

// ---- Simplex-like 2D noise ----
const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

const perm = new Uint8Array(512)
const grad2 = [
  [1,1],[-1,1],[1,-1],[-1,-1],
  [1,0],[-1,0],[0,1],[0,-1],
]
;(() => {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
})()

function noise2D(x: number, y: number): number {
  const s = (x + y) * F2
  const i = Math.floor(x + s)
  const j = Math.floor(y + s)
  const t = (i + j) * G2
  const x0 = x - (i - t)
  const y0 = y - (j - t)
  const i1 = x0 > y0 ? 1 : 0
  const j1 = x0 > y0 ? 0 : 1
  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2
  const ii = i & 255
  const jj = j & 255
  let n0 = 0, n1 = 0, n2 = 0
  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 > 0) {
    t0 *= t0
    const gi = perm[ii + perm[jj]] % 8
    n0 = t0 * t0 * (grad2[gi][0] * x0 + grad2[gi][1] * y0)
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 > 0) {
    t1 *= t1
    const gi = perm[ii + i1 + perm[jj + j1]] % 8
    n1 = t1 * t1 * (grad2[gi][0] * x1 + grad2[gi][1] * y1)
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 > 0) {
    t2 *= t2
    const gi = perm[ii + 1 + perm[jj + 1]] % 8
    n2 = t2 * t2 * (grad2[gi][0] * x2 + grad2[gi][1] * y2)
  }
  return 70 * (n0 + n1 + n2) // -1 to 1
}

// ---- Particle system ----
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  hue: number
}

const PARTICLE_COUNT = 1800
const NOISE_SCALE = 0.003
const NOISE_SPEED = 0.0008
const PARTICLE_SPEED = 0.8
const CURSOR_RADIUS = 200
const CURSOR_FORCE = 0.4
const TRAIL_ALPHA = 0.03

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const smoothMouse = useRef({ x: -1000, y: -1000 })
  const particles = useRef<Particle[]>([])
  const animationId = useRef<number>(0)
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight
      )
      // Reinit particles on resize
      initParticles()
    }

    const initParticles = () => {
      particles.current = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.current.push(createParticle())
      }
    }

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0,
      vy: 0,
      life: Math.random() * 300,
      maxLife: 300 + Math.random() * 200,
      hue: 220 + Math.random() * 60, // blue to purple range
    })

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY,
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Fill background once
    ctx.fillStyle = 'rgba(10, 10, 20, 1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const animate = () => {
      time.current += NOISE_SPEED

      // Smooth mouse follow (LERP)
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.05
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.05

      // Trail effect: semi-transparent overlay instead of full clear
      ctx.fillStyle = `rgba(10, 10, 20, ${TRAIL_ALPHA})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const mx = smoothMouse.current.x
      const my = smoothMouse.current.y
      const t = time.current

      for (const p of particles.current) {
        // Flow field angle from noise
        const noiseVal = noise2D(p.x * NOISE_SCALE + t, p.y * NOISE_SCALE + t)
        const angle = noiseVal * Math.PI * 4

        // Base velocity from flow field
        p.vx += Math.cos(angle) * PARTICLE_SPEED * 0.1
        p.vy += Math.sin(angle) * PARTICLE_SPEED * 0.1

        // Cursor influence — gentle warp
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CURSOR_RADIUS && dist > 1) {
          const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE
          // Swirl around cursor instead of push away
          const swirlAngle = Math.atan2(dy, dx) + Math.PI * 0.5
          p.vx += Math.cos(swirlAngle) * force
          p.vy += Math.sin(swirlAngle) * force
        }

        // Damping
        p.vx *= 0.92
        p.vy *= 0.92

        // Speed limit
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 2.5) {
          p.vx = (p.vx / speed) * 2.5
          p.vy = (p.vy / speed) * 2.5
        }

        // Move
        p.x += p.vx
        p.y += p.vy
        p.life++

        // Lifecycle fade
        const lifeRatio = p.life / p.maxLife
        const alpha = lifeRatio < 0.1
          ? lifeRatio * 10 // fade in
          : lifeRatio > 0.9
            ? (1 - lifeRatio) * 10 // fade out
            : 1

        // Size based on proximity to cursor
        const cursorInfluence = dist < CURSOR_RADIUS ? (1 - dist / CURSOR_RADIUS) : 0
        const size = 1 + cursorInfluence * 2

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha * (0.3 + cursorInfluence * 0.5)})`
        ctx.fill()

        // Respawn if dead or off-screen
        if (p.life > p.maxLife || p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
          Object.assign(p, createParticle())
        }
      }

      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    const handleScroll = () => {
      const newH = Math.max(document.documentElement.scrollHeight, window.innerHeight)
      if (Math.abs(canvas.height - newH) > 100) {
        canvas.height = newH
        ctx.fillStyle = 'rgba(10, 10, 20, 1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
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
        zIndex: 0,
      }}
    />
  )
}
