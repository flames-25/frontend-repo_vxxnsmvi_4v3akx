import { useMemo, useState } from 'react'
import HeaderBar from './components/HeaderBar'
import AirplaneSelector, { AIRCRAFTS } from './components/AirplaneSelector'
import RouteVisualizer from './components/RouteVisualizer'
import BookingPanel from './components/BookingPanel'
import Footer from './components/Footer'

const TEXTS = {
  en: {
    tagline: 'Visit the World — made with precision and passion',
    light: 'Light',
    dark: 'Dark',
    airplaneSelector: {
      title: 'Airplane Selector',
      cruise: 'Cruise Speed',
      range: 'Range',
      seats: 'Seats',
      fuel: 'Fuel Burn',
      note: 'Interactive 3D previews illustrate proportions only. Specs are approximate for demo purposes.'
    },
    route: {
      title: 'Route Visualization',
      distance: 'Distance',
      eta: 'Estimated Time',
      weather: 'Weather',
      weatherSample: 'Calm winds, scattered clouds'
    },
    booking: {
      title: 'Booking & Payment',
      operator: 'Choose Airline / Operator',
      livery: 'Livery',
      tripDetails: 'Trip Details',
      passengers: 'Passengers',
      class: 'Class',
      method: 'Payment Method',
      economy: 'Economy',
      business: 'Business',
      first: 'First',
      card: 'Credit / Debit Card',
      request: 'Flight Request',
      security: 'All payments are processed over secure, encrypted channels.',
      summary: 'Fare Summary',
      perPerson: 'per person',
      total: 'Total',
      payNow: 'Pay Now',
      requestFlight: 'Request This Flight',
      confirmation: 'You will receive a confirmation email/itinerary after checkout.'
    },
    ai: {
      title: 'AI Recommendations',
      hint: 'We suggest the best aircraft and route mix based on your preferences.'
    },
    common: {
      seats: 'seats',
      passengers: 'passengers'
    },
    footerTagline: 'Visit the World',
    footerMade: 'Made with precision and passion'
  },
  id: {
    tagline: 'Jelajahi Dunia — dibuat dengan presisi dan passion',
    light: 'Terang',
    dark: 'Gelap',
    airplaneSelector: {
      title: 'Pemilih Pesawat',
      cruise: 'Kecepatan Jelajah',
      range: 'Jarak Tempuh',
      seats: 'Kursi',
      fuel: 'Konsumsi Bahan Bakar',
      note: 'Pratinjau 3D interaktif hanya untuk ilustrasi. Spesifikasi mendekati untuk tujuan demo.'
    },
    route: {
      title: 'Visualisasi Rute',
      distance: 'Jarak',
      eta: 'Perkiraan Waktu',
      weather: 'Cuaca',
      weatherSample: 'Angin tenang, awan tersebar'
    },
    booking: {
      title: 'Pemesanan & Pembayaran',
      operator: 'Pilih Maskapai / Operator',
      livery: 'Livery',
      tripDetails: 'Detail Perjalanan',
      passengers: 'Penumpang',
      class: 'Kelas',
      method: 'Metode Pembayaran',
      economy: 'Ekonomi',
      business: 'Bisnis',
      first: 'Utama',
      card: 'Kartu Kredit / Debit',
      request: 'Permintaan Penerbangan',
      security: 'Semua pembayaran diproses melalui saluran aman dan terenkripsi.',
      summary: 'Ringkasan Tarif',
      perPerson: 'per orang',
      total: 'Total',
      payNow: 'Bayar Sekarang',
      requestFlight: 'Ajukan Penerbangan Ini',
      confirmation: 'Anda akan menerima email/itinerary konfirmasi setelah checkout.'
    },
    ai: {
      title: 'Rekomendasi AI',
      hint: 'Kami menyarankan kombinasi pesawat dan rute terbaik sesuai preferensi Anda.'
    },
    common: {
      seats: 'kursi',
      passengers: 'penumpang'
    },
    footerTagline: 'Kunjungi Dunia',
    footerMade: 'Dibuat dengan presisi dan passion'
  }
}

function useTexts(lang) {
  return TEXTS[lang]
}

export default function App() {
  const [theme, setTheme] = useState('light')
  const [lang, setLang] = useState('en')
  const t = useTexts(lang)
  const [selectedAircraft, setSelectedAircraft] = useState('boeing-777x')

  const aircraft = AIRCRAFTS[selectedAircraft]
  const cruiseSpeedKmh = aircraft.speedKmh

  const [routeMetrics, setRouteMetrics] = useState({ distanceKm: 800, etaText: lang==='en'? '~1h 30m' : '~1j 30m' })

  // naive AI suggestion based on preferences
  const aiTip = useMemo(() => {
    if (cruiseSpeedKmh > 930) return lang === 'en' ? 'Luxury flights — faster and roomier widebodies recommended.' : 'Penerbangan mewah — pesawat berbadan lebar yang lebih cepat dan lega direkomendasikan.'
    return lang === 'en' ? 'Standard flights — efficient long-range aircraft suggested.' : 'Penerbangan standar — pesawat jarak jauh yang efisien disarankan.'
  }, [cruiseSpeedKmh, lang])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100">
      <HeaderBar theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} t={{...t, light: t.light, dark: t.dark, tagline: t.tagline}} />

      <main className="py-6">
        <Hero t={t} />
        <AirplaneSelector selectedAircraft={selectedAircraft} setSelectedAircraft={setSelectedAircraft} t={t} />
        <RouteVisualizer cruiseSpeedKmh={cruiseSpeedKmh} t={t} onMetricsChange={setRouteMetrics} />
        <AISection title={t.ai.title} hint={t.ai.hint} tip={aiTip} />
        {/* Booking receives summary data; RouteVisualizer shows calc info visually */}
        <BookingPanel aircraftName={aircraft.name} distanceKm={routeMetrics.distanceKm} etaText={routeMetrics.etaText} t={t} />
      </main>

      <Footer t={t} />
    </div>
  )
}

function Hero({ t }) {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-900/40 mb-4">
            <span className="text-xs font-medium">HanzTravel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">HanzTravel — {t.footerTagline}</h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">{t.tagline}</p>
        </div>
      </div>
      <GradientBG />
    </section>
  )
}

function GradientBG() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[120%] bg-gradient-to-b from-blue-200/40 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent" />
    </div>
  )
}

function AISection({ title, hint, tip }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900">
        <div className="text-lg font-semibold mb-1">{title}</div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{hint}</p>
        <div className="text-sm font-medium text-blue-700 dark:text-blue-300">• {tip}</div>
      </div>
    </section>
  )
}
