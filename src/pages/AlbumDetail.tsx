import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { api, Album, mediaUrl } from '../lib/api'

export default function AlbumDetail() {
  const { id } = useParams()
  const [album, setAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.getAlbum(id)
      .then(setAlbum)
      .catch((e) => setError(e.message || 'Альбом не найден'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-20 text-stone-500">Загрузка…</div>
  }

  if (error || !album) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-400 mb-4">{error || 'Альбом не найден'}</p>
        <Link to="/archive" className="text-ruin-gold hover:underline">← К архиву</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <Link to="/archive" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-ruin-gold mb-6">
            <ArrowLeft size={16} /> Все альбомы
          </Link>
          <h1 className="font-serif text-4xl text-stone-50 mb-2">{album.title}</h1>
          <p className="text-stone-500 text-sm flex items-center gap-2">
            {album.date && new Date(album.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            <span>·</span>
            <Camera size={14} /> {album.photos?.length || 0} фото
          </p>
          {album.description && (
            <p className="text-stone-400 mt-4 max-w-2xl">{album.description}</p>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {(album.photos || []).length === 0 ? (
          <p className="text-stone-500">В этом альбоме пока нет фотографий.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {album.photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setLightbox(mediaUrl(photo.url))}
                className="aspect-square rounded-xl overflow-hidden bg-stone-800"
              >
                <img src={mediaUrl(photo.url)!} alt={photo.originalName} className="w-full h-full object-cover hover:scale-[1.03] transition duration-500" />
              </button>
            ))}
          </div>
        )}
      </section>

      {lightbox && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
        </button>
      )}
    </div>
  )
}
