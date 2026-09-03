import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users } from 'lucide-react'
import { eventTypeLabels } from '../data/events'
import { api, EventItem } from '../lib/api'

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getEvents()
      .then(setEvents)
      .catch((e) => setError(e.message || 'Не удалось загрузить события'))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = events.filter((e) => e.status === 'upcoming')
  const past = events.filter((e) => e.status === 'past')

  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-ruin-gold text-sm uppercase tracking-[0.2em] mb-3">Календарь</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-4">События</h1>
          <p className="text-stone-400 max-w-xl">
            Субботники, прогулки, лекторий и другие встречи.
            Присоединяйтесь — регистрация обычно через TimePad или Telegram.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {loading && <p className="text-stone-500">Загрузка…</p>}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && !error && upcoming.length === 0 && past.length === 0 && (
          <p className="text-stone-500">Пока нет опубликованных событий.</p>
        )}

        {upcoming.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-stone-100 mb-6">Предстоящие</h2>
            <div className="space-y-4">
              {upcoming.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-stone-100 mb-6">Прошедшие</h2>
            <div className="space-y-4">
              {past.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="card-ruin rounded-xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="sm:w-36 shrink-0">
          <div className="flex items-center gap-2 text-sm text-ruin-gold">
            <Calendar size={16} />
            {new Date(event.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
          <div className="mt-2 text-xs uppercase tracking-wider text-stone-500">
            {eventTypeLabels[event.type as keyof typeof eventTypeLabels] || event.type}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-stone-100 text-lg mb-1">{event.title}</h3>
          <div className="flex items-center gap-1.5 text-sm text-stone-500 mb-3">
            <MapPin size={14} /> {event.location}
          </div>
          <p className="text-sm text-stone-400 leading-relaxed">{event.description}</p>
          {event.volunteers ? (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-stone-500">
              <Users size={14} /> {event.volunteers} волонтёров
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
