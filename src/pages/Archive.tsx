import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Image } from 'lucide-react'
import { api, Album, mediaUrl } from '../lib/api'

export default function Archive() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getAlbums()
      .then(setAlbums)
      .catch((e) => setError(e.message || 'Не удалось загрузить архив'))
      .finally(() => setLoading(false))
  }, [])

  const totalPhotos = albums.reduce((sum, a) => sum + (a.photos?.length || 0), 0)

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-ruin-gold text-sm uppercase tracking-[0.2em] mb-3">Память</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-4">Фотоархив</h1>
          <p className="text-stone-400 max-w-xl">
            {totalPhotos > 0
              ? `${totalPhotos} фотографий с выездов, прогулок и встреч.`
              : 'Альбомы с выездов, прогулок и встреч.'}{' '}
            Эстетика руин — в кадрах.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {loading && <p className="text-stone-500">Загрузка…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && !error && albums.length === 0 && (
          <p className="text-stone-500">Пока нет альбомов. Они появятся, как только команда загрузит фото в админке.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/archive/${album.id}`}
              className="card-ruin rounded-2xl overflow-hidden group"
            >
              <div className="aspect-[4/3] bg-stone-800/80 relative flex items-center justify-center overflow-hidden">
                {album.cover ? (
                  <img
                    src={mediaUrl(album.cover)!}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                  />
                ) : (
                  <Image size={40} className="text-stone-600 group-hover:text-stone-500 transition" strokeWidth={1} />
                )}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-stone-300 bg-stone-950/70 px-2 py-1 rounded-full">
                  <Camera size={12} /> {album.photos?.length || 0}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-stone-500 mb-1">
                  {album.date
                    ? new Date(album.date).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
                    : ''}
                </div>
                <h3 className="font-serif text-lg text-stone-100 group-hover:text-ruin-gold transition mb-1">
                  {album.title}
                </h3>
                {album.description && (
                  <div className="text-sm text-stone-500 line-clamp-2">{album.description}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
