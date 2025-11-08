import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin, Timer, Route, Wind } from 'lucide-react'
import { motion } from 'framer-motion'

const EARTH_RADIUS_KM = 6371

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

const PRESETS = {
  'jakarta-bali': {
    name: 'Jakarta → Bali',
    from: { name: 'CGK • Jakarta', coords: [-6.1256, 106.6559] },
    to: { name: 'DPS • Bali', coords: [-8.7482, 115.1675] },
  },
  'london-dubai': {
    name: 'London → Dubai',
    from: { name: 'LHR • London', coords: [51.4700, -0.4543] },
    to: { name: 'DXB • Dubai', coords: [25.2532, 55.3657] },
  },
}

export default function RouteVisualizer({ cruiseSpeedKmh, t }) {
  const [preset, setPreset] = useState('jakarta-bali')
  const data = PRESETS[preset]

  const distanceKm = useMemo(() => {
    return Math.round(haversineDistance(data.from.coords, data.to.coords))
  }, [preset])

  const hours = useMemo(() => distanceKm / cruiseSpeedKmh, [distanceKm, cruiseSpeedKmh])
  const timeText = useMemo(() => {
    const h = Math.floor(hours)
    const m = Math.round((hours - h) * 60)
    return `${h}h ${m}m`
  }, [hours])

  // Simple canvas world map with animated arc
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg'

    let frame = 0
    let raf

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // background
      ctx.fillStyle = '#0B1220'
      ctx.fillRect(0, 0, width, height)

      // map
      if (img.complete) {
        const ratio = Math.min(width / img.width, height / img.height)
        const w = img.width * ratio
        const h = img.height * ratio
        const x = (width - w) / 2
        const y = (height - h) / 2
        ctx.globalAlpha = 0.9
        ctx.drawImage(img, x, y, w, h)
        ctx.globalAlpha = 1
      }

      // convert lat/lon to canvas (equirectangular)
      const project = ([lat, lon]) => {
        const x = ((lon + 180) / 360) * canvas.width
        const y = ((90 - lat) / 180) * canvas.height
        return [x, y]
      }

      const [x1, y1] = project(data.from.coords)
      const [x2, y2] = project(data.to.coords)

      // arc path
      ctx.strokeStyle = '#60A5FA'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 8])
      ctx.beginPath()
      // simple quadratic curve mid control point raised
      const cx = (x1 + x2) / 2
      const cy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.15
      ctx.moveTo(x1, y1)
      ctx.quadraticCurveTo(cx, cy, x2, y2)
      ctx.stroke()
      ctx.setLineDash([])

      // plane dot moving along curve
      const t = (frame % 300) / 300
      const qx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2
      const qy = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2
      ctx.fillStyle = '#22D3EE'
      ctx.beginPath()
      ctx.arc(qx, qy, 4, 0, Math.PI * 2)
      ctx.fill()

      frame++
      raf = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = 320
    }

    handleResize()
    draw()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
    }
  }, [preset])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Route className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{t.route.title}</h3>
          </div>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value)}
            className="px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm"
          >
            {Object.entries(PRESETS).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>

        <div className="px-4">
          <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
            <canvas ref={canvasRef} className="w-full block" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 p-4">
          <InfoChip icon={MapPin} label={t.route.distance} value={`${distanceKm.toLocaleString()} km`} />
          <InfoChip icon={Timer} label={t.route.eta} value={timeText} />
          <InfoChip icon={Wind} label={t.route.weather} value={t.route.weatherSample} />
        </div>
      </div>
    </section>
  )
}

function InfoChip({ icon: Icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50/60 dark:bg-neutral-800/60"
    >
      <div className="h-9 w-9 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</div>
        <div className="text-sm font-semibold text-neutral-900 dark:text-white">{value}</div>
      </div>
    </motion.div>
  )
}
