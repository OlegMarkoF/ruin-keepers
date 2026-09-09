import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import {
  LayoutDashboard, Newspaper, Calendar, Images, Video, LogOut, ExternalLink, Loader2
} from 'lucide-react'

const nav = [
  { to: '/admin', label: 'Обзор', icon: LayoutDashboard, end: true },
  { to: '/admin/news', label: 'Новости', icon: Newspaper },
  { to: '/admin/events', label: 'События', icon: Calendar },
  { to: '/admin/albums', label: 'Фотоальбомы', icon: Images },
  { to: '/admin/videos', label: 'Видео', icon: Video },
]

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-ruin-gold" size={32} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen bg-stone-950 flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-stone-800 flex flex-col shrink-0">
        <div className="p-5 border-b border-stone-800">
          <div className="font-serif text-lg text-stone-100">Хранители</div>
          <div className="text-[10px] uppercase tracking-widest text-stone-500">Админка</div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map((item) => {
            const active = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
                  active
                    ? 'bg-ruin-gold/15 text-ruin-gold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-stone-800 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-300"
          >
            <ExternalLink size={16} /> Сайт
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-red-400"
          >
            <LogOut size={16} /> Выйти
          </button>
          <div className="px-3 pt-2 text-xs text-stone-600 truncate">{user.name}</div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
