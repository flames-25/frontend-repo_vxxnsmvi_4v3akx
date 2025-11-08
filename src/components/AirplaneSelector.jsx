import { useMemo } from 'react'
import { Plane, Gauge, Ruler, Flame, Info } from 'lucide-react'
import { motion } from 'framer-motion'

const AIRCRAFTS = {
  'boeing-777x': {
    name: 'Boeing 777X',
    speedKmh: 905,
    rangeKm: 13650,
    seats: 426,
    fuelBurnLph: 7200,
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1600&auto=format&fit=crop',
  },
  'airbus-a380': {
    name: 'Airbus A380',
    speedKmh: 945,
    rangeKm: 15200,
    seats: 555,
    fuelBurnLph: 11700,
    image: 'https://images.unsplash.com/photo-1567446188601-95f43044f6dc?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBaXJidXMlMjBBMzgwfGVufDB8MHx8fDE3NjI2MjYzNjZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
  },
  'airbus-a350': {
    name: 'Airbus A350',
    speedKmh: 903,
    rangeKm: 15000,
    seats: 410,
    fuelBurnLph: 6200,
    image: 'https://images.unsplash.com/photo-1621560222298-0824faf9add5?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxBaXJidXMlMjBBMzUwfGVufDB8MHx8fDE3NjI2MjYzNjZ8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80',
  },
}

export default function AirplaneSelector({ selectedAircraft, setSelectedAircraft, t }) {
  const aircraft = useMemo(() => AIRCRAFTS[selectedAircraft], [selectedAircraft])

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 h-[420px]">
          <img
            src={aircraft.image}
            alt={aircraft.name}
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>

        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Plane className="text-blue-600" size={20} />
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{t.airplaneSelector.title}</h2>
            </div>
            <select
              value={selectedAircraft}
              onChange={(e) => setSelectedAircraft(e.target.value)}
              className="px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm"
            >
              {Object.entries(AIRCRAFTS).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <SpecCard icon={Gauge} label={t.airplaneSelector.cruise} value={`${aircraft.speedKmh} km/h`} />
            <SpecCard icon={Ruler} label={t.airplaneSelector.range} value={`${aircraft.rangeKm.toLocaleString()} km`} />
            <SpecCard icon={Info} label={t.airplaneSelector.seats} value={`${aircraft.seats} ${t.common.seats}`} />
            <SpecCard icon={Flame} label={t.airplaneSelector.fuel} value={`${aircraft.fuelBurnLph.toLocaleString()} L/h`} />
          </div>

          <p className="text-sm mt-4 text-neutral-600 dark:text-neutral-400">
            {t.airplaneSelector.note}
          </p>
        </div>
      </div>
    </section>
  )
}

function SpecCard({ icon: Icon, label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 bg-neutral-50/60 dark:bg-neutral-800/60"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-indigo-300 flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</div>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white">{value}</div>
        </div>
      </div>
    </motion.div>
  )
}

export { AIRCRAFTS }
