import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart } from 'lucide-react'
import { useState } from 'react'

const nav = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О движении' },
  { to: '/objects', label: 'Объекты' },
  { to: '/news', label: 'Новости' },
  { to: '/events', label: 'События' },
  { to: '/goals', label: 'Цели' },
  { to: '/archive', label: 'Фотоархив' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col relative grain">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full border-ruin-gold/40 flex items-center justify-center text-ruin-gold group-hover:bg-ruin-gold/10 transition">
                {/* <span className="font-serif text-lg font-semibold">Х</span> */}
                <img src="../../src/images/images.png" alt="logo" />
              </div>
              <div className="hidden sm:block">
                <div className="font-serif text-lg tracking-wide text-stone-100">Хранители руин</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-stone-500 -mt-0.5">Ruin Keepers</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 text-sm transition rounded-md ${
                    location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
                      ? 'text-ruin-gold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://ruin-keepers.ru/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-ruin-gold/50 text-ruin-gold rounded-full hover:bg-ruin-gold/10 transition"
              >
                <Heart size={14} />
                Поддержать
              </a>
              <button
                className="md:hidden p-2 text-stone-400 hover:text-stone-200"
                onClick={() => setOpen(!open)}
                aria-label="Меню"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-stone-800 bg-stone-950">
            <div className="px-4 py-3 space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm ${
                    location.pathname === item.to ? 'text-ruin-gold bg-stone-900' : 'text-stone-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://ruin-keepers.ru/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 text-ruin-gold"
              >
                <Heart size={16} /> Поддержать движение
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="font-serif text-xl text-stone-100 mb-2">Хранители руин</div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Независимое волонтёрское движение, которое с 2020 года заботится об архитектурном наследии
                Калининградской области и популяризирует эстетику руин.
              </p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Разделы</div>
              <div className="space-y-2">
                {nav.map((item) => (
                  <Link key={item.to} to={item.to} className="block text-sm text-stone-400 hover:text-ruin-gold transition">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {/* Контакты */}
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mb-3">Связь</div>
              <div className="space-y-2 text-sm text-stone-400">
                <a href="https://t.me/ruin_keepers" target="_blank" rel="noopener noreferrer" className="block hover:text-ruin-gold">
                  Telegram
                </a>
                <a href="https://vk.com/ruin.keepers" target="_blank" rel="noopener noreferrer" className="block hover:text-ruin-gold">
                  ВКонтакте
                </a>
                <a href="mailto:ruin.keepers@gmail.com" className="block hover:text-ruin-gold">
                  ruin.keepers@gmail.com
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-600">
            <span>© 2020–2026 Хранители руин / Ruin Keepers</span>
            <span>Дарим прошлому будущее</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
