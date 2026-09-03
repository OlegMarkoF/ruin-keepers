import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Landmark, ArrowRight } from 'lucide-react'
import { objects, objectTypes, statusLabels } from '../data/objects'

type FilterType = 'all' | 'kirche' | 'castle' | 'fort' | 'other'

export default function Objects() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filter === 'all' ? objects : objects.filter(o => o.type === filter)

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-ruin-gold text-sm uppercase tracking-[0.2em] mb-3">Каталог</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-4">Объекты</h1>
          <p className="text-stone-400 max-w-xl mb-4">
            Кирхи, замки и другие памятники, за которыми мы ухаживаем.
            Каждый объект — отдельная история.
          </p>

          <a className="flex items-center text-stone-50 max-w-xl" href="https://www.google.com/maps/d/u/0/viewer?mid=1sQtrS6jgVlrJXlNqV1rpjdbtcYFYXjCv&ll=54.68711886386738%2C20.804140543856192&z=9" target="_blank" rel="noopener noreferrer">
            Карта объектов&nbsp;<ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {(['all', 'kirche', 'castle', 'fort', 'other'] as FilterType[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                filter === t
                  ? 'bg-ruin-gold/20 text-ruin-gold border border-ruin-gold/40'
                  : 'border border-stone-700 text-stone-400 hover:border-stone-500'
              }`}
            >
              {t === 'all' ? 'Все' : objectTypes[t]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((obj) => (
            <Link
              key={obj.id}
              to={`/objects/${obj.id}`}
              className="card-ruin rounded-2xl overflow-hidden group"
            >
              <div className="aspect-[16/10] bg-stone-800/80 relative flex items-center justify-center">
                <Landmark size={40} className="text-stone-600 group-hover:text-stone-500 transition" strokeWidth={1} />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    obj.status === 'active' ? 'border-green-800 text-green-500' :
                    obj.status === 'cared' ? 'border-ruin-gold/40 text-ruin-gold' :
                    'border-stone-600 text-stone-500'
                  }`}>
                    {statusLabels[obj.status]}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs text-stone-500 mb-1">{objectTypes[obj.type]}</div>
                <h3 className="font-serif text-xl text-stone-100 group-hover:text-ruin-gold transition mb-1">
                  {obj.name}
                </h3>
                <div className="text-sm text-stone-500 flex items-center gap-1 mb-3">
                  <MapPin size={13} /> {obj.location}
                </div>
                <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-stone-500">
            Пока нет объектов в этой категории
          </div>
        )}
      </section>
    </div>
  )
}
