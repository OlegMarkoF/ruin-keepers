import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { api, VideoItem, mediaUrl } from '../lib/api'
import { videoCategoryLabels, videoProviderLabels } from '../lib/embed'

const filters = [
  { id: 'all', label: 'Все' },
  { id: 'archive', label: 'Архив' },
  { id: 'trip', label: 'С выездов' },
  { id: 'announce', label: 'Анонсы' },
  { id: 'lecture', label: 'Лекторий' },
]

export default function Videos() {
  const [items, setItems] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.getVideos('published')
      .then(setItems)
      .catch((e) => setError(e.message || 'Не удалось загрузить видео'))
      .finally(() => setLoading(false))
  }, [])

  const visible = filter === 'all' ? items : items.filter((v) => v.category === filter)

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-ruin-gold text-sm uppercase tracking-[0.2em] mb-3">Смотреть</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-4">Видео</h1>
          <p className="text-stone-400 max-w-xl">
            Архив старых роликов, съёмки с выездов и анонсы. Можно смотреть здесь — с YouTube, VK, Rutube или с нашего сервера.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                filter === f.id
                  ? 'border-ruin-gold text-ruin-gold bg-ruin-gold/10'
                  : 'border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-stone-500">Загрузка…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && visible.length === 0 && (
          <p className="text-stone-500">Пока нет видео в этом разделе.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((video) => (
            <Link key={video.id} to={`/videos/${video.id}`} className="card-ruin rounded-2xl overflow-hidden group">
              <div className="aspect-video bg-stone-800 relative">
                {video.thumbnail ? (
                  <img src={mediaUrl(video.thumbnail)!} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                ) : (
                  <div className="w-full h-full bg-stone-800" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 border border-ruin-gold/50 flex items-center justify-center text-ruin-gold group-hover:bg-ruin-gold group-hover:text-stone-950 transition">
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] uppercase tracking-wider bg-black/70 text-stone-300 px-2 py-0.5 rounded-full">
                  {videoProviderLabels[video.provider] || video.provider}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-stone-500 mb-1">
                  {video.date && new Date(video.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {video.category ? ` · ${videoCategoryLabels[video.category] || video.category}` : ''}
                </div>
                <h2 className="font-serif text-lg text-stone-100 group-hover:text-ruin-gold transition">
                  {video.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
