import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, NewsItem, EventItem, Album } from '../lib/api'
import { Newspaper, Calendar, Images, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [events, setEvents] = useState<EventItem[]>([])
  const [albums, setAlbums] = useState<Album[]>([])

  useEffect(() => {
    Promise.all([api.getNews(), api.getEvents(), api.getAlbums()]).then(
      ([n, e, a]) => {
        setNews(n)
        setEvents(e)
        setAlbums(a)
      }
    )
  }, [])

  const cards = [
    { label: 'Новости', count: news.length, to: '/admin/news', icon: Newspaper, sub: `${news.filter(n => n.status === 'published').length} опубликовано` },
    { label: 'События', count: events.length, to: '/admin/events', icon: Calendar, sub: `${events.filter(e => e.status === 'upcoming').length} предстоящих` },
    { label: 'Альбомы', count: albums.length, to: '/admin/albums', icon: Images, sub: `${albums.reduce((s, a) => s + (a.photos?.length || 0), 0)} фото` },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-100 mb-2">Обзор</h1>
      <p className="text-stone-500 text-sm mb-8">Управление контентом движения</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card-ruin rounded-xl p-5 group">
            <div className="flex items-center justify-between mb-3">
              <c.icon size={20} className="text-ruin-gold" />
              <ArrowRight size={16} className="text-stone-600 group-hover:text-ruin-gold transition" />
            </div>
            <div className="font-serif text-3xl text-stone-100 mb-1">{c.count}</div>
            <div className="text-sm text-stone-300">{c.label}</div>
            <div className="text-xs text-stone-600 mt-1">{c.sub}</div>
          </Link>
        ))}
      </div>

      <div className="card-ruin rounded-xl p-5">
        <h2 className="font-medium text-stone-200 mb-3">Последние новости</h2>
        {news.slice(0, 5).length === 0 ? (
          <p className="text-sm text-stone-500">Пока нет новостей</p>
        ) : (
          <ul className="space-y-2">
            {news.slice(0, 5).map((n) => (
              <li key={n.id} className="flex items-center justify-between text-sm">
                <span className="text-stone-300 truncate">{n.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  n.status === 'published' ? 'border-green-800 text-green-500' : 'border-stone-600 text-stone-500'
                }`}>
                  {n.status === 'published' ? 'опубл.' : 'черновик'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
