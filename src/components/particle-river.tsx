"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
  depth: number
}

export function ParticleRiver() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const createParticle = (): Particle => {
      const canvasWidth = canvas.width / window.devicePixelRatio
      const canvasHeight = canvas.height / window.devicePixelRatio
      const centerX = canvasWidth / 2
      const spawnWidth = canvasWidth * 0.8

      // Spawn particles randomly across the entire canvas area
      const depth = Math.random()
      const maxTravelDistance = depth * canvasHeight * (0.15 + Math.random() * 0.25)
      const maxLife = Math.floor(maxTravelDistance / (0.05 + Math.random() * 0.1))

      return {
        x: centerX + (Math.random() - 0.5) * spawnWidth,
        y: Math.random() * canvasHeight, // Random Y position across entire height
        vx: (Math.random() - 0.5) * 0.05,
        vy: 0.05 + Math.random() * 0.1,
        size: 0.42 + Math.random() * 0.84, // Increased from 0.4 + 0.8 to make 5% larger
        opacity: 0.16 + Math.random() * 0.37, // Increased from 0.15 + 0.35 to make 5% bolder
        life: Math.floor(Math.random() * maxLife * 0.7), // Random starting life
        maxLife,
        depth,
      }
    }

    // Initialize with more particles already on screen (increased from 28 to 31)
    for (let i = 0; i < 31; i++) {
      particlesRef.current.push(createParticle())
    }

    const updateParticles = () => {
      // Increased spawn rate from 0.07 to 0.075 for 7% more particles
      if (Math.random() < 0.075) {
        particlesRef.current.push(createParticle())
      }

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Add subtle sine wave motion for smoothness
        const waveOffset = Math.sin(particle.life * 0.02) * 0.3
        particle.x += particle.vx + waveOffset * 0.1
        particle.y += particle.vy
        particle.life++

        // Fade based on depth - but all particles fade relatively early
        const lifeRatio = particle.life / particle.maxLife
        const fadeStart = 0.5 + particle.depth * 0.2 // Start fading earlier

        if (lifeRatio > fadeStart) {
          const fadeRatio = (lifeRatio - fadeStart) / (1 - fadeStart)
          // Increased base opacity for bolder particles
          particle.opacity = (1 - fadeRatio) * (0.16 + particle.depth * 0.16)
        }

        // Remove particles based on their individual lifespan
        return particle.life < particle.maxLife
      })
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Sort particles by depth for proper layering
      const sortedParticles = [...particlesRef.current].sort((a, b) => a.depth - b.depth)

      sortedParticles.forEach((particle) => {
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = "#ffffff"

        // Add slight blur for smoother appearance
        ctx.shadowColor = "#ffffff"
        ctx.shadowBlur = particle.size * 0.5

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
