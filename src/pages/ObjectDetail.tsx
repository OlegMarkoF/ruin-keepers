import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react'
import { objects, objectTypes, statusLabels } from '../data/objects'

export default function ObjectDetail() {
  const { id } = useParams()
  const obj = objects.find(o => o.id === id)

  if (!obj) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-400 mb-4">Объект не найден</p>
        <Link to="/objects" className="text-ruin-gold hover:underline">← К каталогу</Link>
      </div>
    )
  }

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Link to="/objects" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-ruin-gold transition mb-8">
            <ArrowLeft size={16} /> Все объекты
          </Link>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs uppercase tracking-wider text-stone-500">{objectTypes[obj.type]}</span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              obj.status === 'active' ? 'border-green-800 text-green-500' :
              obj.status === 'cared' ? 'border-ruin-gold/40 text-ruin-gold' :
              'border-stone-600 text-stone-500'
            }`}>
              {statusLabels[obj.status]}
            </span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-2">{obj.name}</h1>
          <p className="text-stone-500 italic mb-4">{obj.historicalName}</p>
          <div className="flex items-center gap-2 text-stone-400">
            <MapPin size={16} /> {obj.location}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-serif text-2xl text-stone-100 mb-4">Описание</h2>
              <p className="text-stone-400 leading-relaxed">{obj.description}</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-stone-100 mb-4">История</h2>
              <p className="text-stone-400 leading-relaxed">{obj.history}</p>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-stone-100 mb-4">Что сделано</h2>
              <ul className="space-y-2">
                {obj.worksDone.map((w, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-400">
                    <span className="text-ruin-gold mt-1.5">·</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-ruin rounded-2xl p-6">
              <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Информация</h3>
              <dl className="space-y-4 text-sm">
                {obj.yearStarted && (
                  <div className="flex justify-between">
                    <dt className="text-stone-500 flex items-center gap-2"><Calendar size={14} /> Начали</dt>
                    <dd className="text-stone-300">{obj.yearStarted}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-stone-500">Фото</dt>
                  <dd className="text-stone-300">{obj.photoCount}+</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-stone-500">Тип</dt>
                  <dd className="text-stone-300">{objectTypes[obj.type]}</dd>
                </div>
              </dl>
            </div>

            {obj.tags.length > 0 && (
              <div className="card-ruin rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2">
                  <Tag size={14} /> Теги
                </h3>
                <div className="flex flex-wrap gap-2">
                  {obj.tags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-full border border-stone-700 text-stone-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
