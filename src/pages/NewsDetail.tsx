import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api, NewsItem, mediaUrl } from '../lib/api'

export default function NewsDetail() {
  const { id } = useParams()
  const [item, setItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.getNewsItem(id)
      .then((n) => {
        if (n.status !== 'published') throw new Error('Новость не опубликована')
        setItem(n)
      })
      .catch((e) => setError(e.message || 'Новость не найдена'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-stone-500">Загрузка…</div>
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-400 mb-4">{error || 'Новость не найдена'}</p>
        <Link to="/news" className="text-ruin-gold hover:underline">← Ко всем новостям</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-ruin-gold mb-6">
            <ArrowLeft size={16} /> Все новости
          </Link>
          <p className="text-xs text-stone-500 mb-3">
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
              : ''}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-4">{item.title}</h1>
          {item.excerpt && <p className="text-lg text-stone-400">{item.excerpt}</p>}
        </div>
      </section>

      {item.cover && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <img src={mediaUrl(item.cover)!} alt="" className="w-full rounded-2xl object-cover max-h-[480px]" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-stone-300 leading-relaxed whitespace-pre-wrap">{item.content}</div>
      </article>
    </div>
  )
}
