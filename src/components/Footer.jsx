export default function Footer({ t }) {
  return (
    <footer className="mt-10 py-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-600 dark:text-neutral-400">
        <div>© 2025 HanzTravel — {t.footerTagline}</div>
        <div className="opacity-80">{t.footerMade}</div>
      </div>
    </footer>
  )
}
