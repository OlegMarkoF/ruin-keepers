import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, NewsItem, mediaUrl } from '../lib/api'

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getNews('published')
      .then(setItems)
      .catch((e) => setError(e.message || 'Не удалось загрузить новости'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-ruin-gold text-sm uppercase tracking-[0.2em] mb-3">Лента</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-4">Новости</h1>
          <p className="text-stone-400 max-w-xl">
            Анонсы выездов, итоги субботников и истории объектов.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {loading && <p className="text-stone-500">Загрузка…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-stone-500">Пока нет опубликованных новостей.</p>
        )}

        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <Link key={item.id} to={`/news/${item.id}`} className="card-ruin rounded-2xl overflow-hidden group">
              <div className="aspect-[16/9] bg-stone-800">
                {item.cover ? (
                  <img src={mediaUrl(item.cover)!} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500" />
                ) : null}
              </div>
              <div className="p-5">
                <div className="text-xs text-stone-500 mb-2">
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                    : ''}
                </div>
                <h2 className="font-serif text-xl text-stone-100 group-hover:text-ruin-gold transition mb-2">
                  {item.title}
                </h2>
                {item.excerpt && <p className="text-sm text-stone-500 line-clamp-3">{item.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
