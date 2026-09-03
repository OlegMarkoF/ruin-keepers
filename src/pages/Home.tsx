import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Users, Calendar, Landmark } from 'lucide-react'
import { stats } from '../data/goals'
import { objects } from '../data/objects'
import { api, EventItem, NewsItem, mediaUrl } from '../lib/api'

export default function Home() {
  const featured = objects.slice(0, 3)
  const [events, setEvents] = useState<EventItem[]>([])
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    api.getEvents().then(setEvents).catch(() => {})
    api.getNews('published').then(setNews).catch(() => {})
  }, [])

  const recentEvents = events.slice(0, 3)
  const latestNews = news.slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-950 to-stone-950" />
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a66b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl">
            <p className="text-ruin-gold text-sm uppercase tracking-[0.25em] mb-4">Калининградская область · с 2020</p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.1] text-stone-50 mb-6">
              Мы храним руины,<br />
              <span className="text-stone-400">чтобы они хранили нас</span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-400 leading-relaxed mb-10 max-w-2xl">
              Независимое волонтёрское движение, которое заботится о кирхах, замках и фортах.
              Мы не всегда восстанавливаем — мы возвращаем руинам достоинство, чистоту и смысл.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ruin-gold text-stone-950 font-medium rounded-full hover:bg-[#d4b57a] transition"
              >
                Узнать о движении
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/objects"
                className="inline-flex items-center gap-2 px-6 py-3 border border-stone-600 text-stone-200 rounded-full hover:border-ruin-gold/50 hover:text-ruin-gold transition"
              >
                Смотреть объекты
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-stone-800/80 bg-stone-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-3xl sm:text-4xl text-ruin-gold mb-1">{s.value}</div>
                <div className="text-sm text-stone-300">{s.label}</div>
                <div className="text-xs text-stone-600 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 mb-4">Что мы делаем</h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            Эстетика руин — это не про разрушение. Это про бережное присутствие рядом с историей.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Landmark,
              title: 'Благоустраиваем руины',
              text: 'Расчищаем, окосим, убираем мусор. Делаем пространства, куда хочется прийти и остаться.',
            },
            {
              icon: Users,
              title: 'Объединяем людей',
              text: 'Тысячи волонтёров, шефы объектов, партнёры и просто неравнодушные. Вместе сильнее.',
            },
            {
              icon: MapPin,
              title: 'Создаём маршруты',
              text: '«Готическое кольцо», «Полесское кольцо» — пути, по которым можно путешествовать и чувствовать историю.',
            },
          ].map((item) => (
            <div key={item.title} className="card-ruin rounded-2xl p-7">
              <div className="w-11 h-11 rounded-full border border-ruin-gold/30 flex items-center justify-center text-ruin-gold mb-5">
                <item.icon size={20} />
              </div>
              <h3 className="font-serif text-xl text-stone-100 mb-3">{item.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured objects */}
      <section className="bg-stone-900/30 border-y border-stone-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl text-stone-100 mb-2">Объекты</h2>
              <p className="text-stone-500 text-sm">Места, которые мы храним</p>
            </div>
            <Link to="/objects" className="text-sm text-ruin-gold hover:underline flex items-center gap-1">
              Все объекты <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((obj) => (
              <Link
                key={obj.id}
                to={`/objects/${obj.id}`}
                className="card-ruin rounded-2xl overflow-hidden group"
              >
                <div className="aspect-[4/3] bg-stone-800 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-stone-600">
                    <Landmark size={48} strokeWidth={1} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stone-950/90 to-transparent">
                    <div className="text-xs text-ruin-gold uppercase tracking-wider mb-1">{obj.type === 'kirche' ? 'Кирха' : 'Замок'}</div>
                    <div className="font-serif text-lg text-stone-100">{obj.name}</div>
                    <div className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {obj.location}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* News from admin */}
      {latestNews.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl text-stone-100 mb-2">Новости</h2>
              <p className="text-stone-500 text-sm">Публикации из админки</p>
            </div>
            <Link to="/news" className="text-sm text-ruin-gold hover:underline flex items-center gap-1">
              Все новости <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {latestNews.map((item) => (
              <Link key={item.id} to={`/news/${item.id}`} className="card-ruin rounded-2xl overflow-hidden group">
                {item.cover && (
                  <div className="aspect-[16/9] bg-stone-800">
                    <img src={mediaUrl(item.cover)!} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  <div className="text-xs text-stone-500 mb-2">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
                      : ''}
                  </div>
                  <h3 className="font-serif text-lg text-stone-100 group-hover:text-ruin-gold transition">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent events from admin */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl text-stone-100 mb-2">События</h2>
            <p className="text-stone-500 text-sm">Последние выезды и встречи</p>
          </div>
          <Link to="/events" className="text-sm text-ruin-gold hover:underline flex items-center gap-1">
            Все события <ArrowRight size={14} />
          </Link>
        </div>
        {recentEvents.length === 0 ? (
          <p className="text-stone-500 text-sm">События появятся, когда их опубликуют в админке.</p>
        ) : (
          <div className="space-y-4">
            {recentEvents.map((ev) => (
              <div key={ev.id} className="card-ruin rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 min-w-[140px]">
                  <Calendar size={18} className="text-ruin-gold shrink-0" />
                  <span className="text-sm text-stone-400">
                    {new Date(ev.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-stone-200">{ev.title}</div>
                  <div className="text-sm text-stone-500 mt-0.5">{ev.location}</div>
                </div>
                {ev.volunteers ? (
                  <div className="text-sm text-stone-500 flex items-center gap-1.5">
                    <Users size={14} /> {ev.volunteers} чел.
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-stone-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-100 mb-5">
            Присоединяйтесь
          </h2>
          <p className="text-stone-400 mb-8 leading-relaxed">
            Каждый субботник — это возможность прикоснуться к истории руками.
            Не нужно специального опыта. Нужно только желание.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://t.me/ruin_keepers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ruin-gold text-stone-950 font-medium rounded-full hover:bg-[#d4b57a] transition"
            >
              Telegram-канал
            </a>
            <a
              href="https://ruin-keepers.ru/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-stone-600 text-stone-200 rounded-full hover:border-ruin-gold/50 hover:text-ruin-gold transition"
            >
              Поддержать донатом
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
