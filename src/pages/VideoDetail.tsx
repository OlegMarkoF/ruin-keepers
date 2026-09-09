import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api, VideoItem } from '../lib/api'
import { videoCategoryLabels, videoProviderLabels } from '../lib/embed'
import VideoPlayer from '../components/VideoPlayer'

export default function VideoDetail() {
  const { id } = useParams()
  const [video, setVideo] = useState<VideoItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.getVideo(id)
      .then((v) => {
        if (v.status !== 'published') throw new Error('Видео не опубликовано')
        setVideo(v)
      })
      .catch((e) => setError(e.message || 'Видео не найдено'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-stone-500">Загрузка…</div>
  }

  if (error || !video) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-400 mb-4">{error || 'Видео не найдено'}</p>
        <Link to="/videos" className="text-ruin-gold hover:underline">← К видеоархиву</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/videos" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-ruin-gold mb-6">
            <ArrowLeft size={16} /> Все видео
          </Link>
          <p className="text-xs text-stone-500 mb-3">
            {video.date && new Date(video.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            {video.category ? ` · ${videoCategoryLabels[video.category]}` : ''}
            {` · ${videoProviderLabels[video.provider] || video.provider}`}
          </p>
          <h1 className="font-serif text-4xl text-stone-50 mb-4">{video.title}</h1>
          {video.description && <p className="text-stone-400 max-w-2xl">{video.description}</p>}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-stone-800">
          <VideoPlayer video={video} />
        </div>
      </section>
    </div>
  )
}
