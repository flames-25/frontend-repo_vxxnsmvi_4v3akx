import { useMemo, useState } from 'react'
import { CreditCard, Building2, Check, Shield } from 'lucide-react'

const AIRLINES = [
  { id: 'ga', name: 'Garuda Indonesia', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Garuda_Indonesia_logo_2010.svg', livery: 'Emerald Sky', crew: '4 Cabin, 2 Cockpit', amenities: ['Wi‑Fi', 'IFE', 'Premium Meal'] },
  { id: 'sq', name: 'Singapore Airlines', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Singapore_Airlines_Logo.svg', livery: 'Golden Ribbon', crew: '5 Cabin, 2 Cockpit', amenities: ['Wi‑Fi', 'IFE', 'Book the Cook'] },
  { id: 'ek', name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Emirates_logo.svg', livery: 'Expo 2025', crew: '6 Cabin, 2 Cockpit', amenities: ['Wi‑Fi', 'IFE', 'Shower Spa*'] },
]

export default function BookingPanel({ aircraftName, distanceKm, etaText, t }) {
  const [airline, setAirline] = useState('ga')
  const [passengers, setPassengers] = useState(1)
  const [classType, setClassType] = useState('economy')
  const [method, setMethod] = useState('card')

  const selected = useMemo(() => AIRLINES.find(a => a.id === airline), [airline])
  const basePrice = useMemo(() => {
    const perKm = classType === 'economy' ? 0.12 : classType === 'business' ? 0.35 : 0.6
    return Math.max(75, Math.round(distanceKm * perKm))
  }, [distanceKm, classType])
  const total = useMemo(() => basePrice * passengers, [basePrice, passengers])

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="font-semibold text-neutral-900 dark:text-white">{t.booking.title}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">{aircraftName} • {etaText}</div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 p-4">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="text-blue-600" size={18} />
                <div className="font-medium">{t.booking.operator}</div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {AIRLINES.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAirline(a.id)}
                    className={`flex items-center gap-3 p-3 rounded-md border transition ${airline === a.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}
                  >
                    <img src={a.logo} alt={a.name} className="h-6 object-contain" />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white">{a.name}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{t.booking.livery}: {a.livery}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="font-medium">{t.booking.tripDetails}</div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-neutral-500 dark:text-neutral-400">{t.booking.passengers}</label>
                  <input type="number" min={1} value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value)||1)} className="mt-1 w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 dark:text-neutral-400">{t.booking.class}</label>
                  <select value={classType} onChange={(e)=>setClassType(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <option value="economy">{t.booking.economy}</option>
                    <option value="business">{t.booking.business}</option>
                    <option value="first">{t.booking.first}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-neutral-500 dark:text-neutral-400">{t.booking.method}</label>
                  <select value={method} onChange={(e)=>setMethod(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <option value="card">{t.booking.card}</option>
                    <option value="request">{t.booking.request}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Shield size={16} /> {t.booking.security}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{t.booking.summary}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{t.booking.perPerson}</div>
              </div>
              <div className="text-3xl font-bold">${basePrice.toLocaleString()}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{passengers} {t.common.passengers} • {classType}</div>
              <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-4" />
              <div className="flex items-center justify-between font-semibold">
                <div>{t.booking.total}</div>
                <div>${total.toLocaleString()}</div>
              </div>
              <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90">
                <CreditCard size={18} /> {method === 'card' ? t.booking.payNow : t.booking.requestFlight}
              </button>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1"><Check size={14} /> {t.booking.confirmation}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
