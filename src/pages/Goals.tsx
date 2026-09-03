import { goals, stats } from '../data/goals'
import { Target, CheckCircle2, Compass } from 'lucide-react'

export default function Goals() {
  return (
    <div>
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-ruin-gold text-sm uppercase tracking-[0.2em] mb-3">Направление</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-4">Цели и прогресс</h1>
          <p className="text-stone-400 max-w-xl">
            Мы не просто «делаем субботники». У движения есть ясное видение
            и конкретные ориентиры.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-stone-900/40 border-b border-stone-800">
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

      {/* Goals list */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-6">
          {goals.map((g) => (
            <div key={g.id} className="card-ruin rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="shrink-0">
                  {g.status === 'completed' ? (
                    <CheckCircle2 className="text-green-500" size={28} />
                  ) : g.status === 'longterm' ? (
                    <Compass className="text-stone-500" size={28} />
                  ) : (
                    <Target className="text-ruin-gold" size={28} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-serif text-xl text-stone-100">{g.title}</h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      g.status === 'completed' ? 'border-green-800 text-green-500' :
                      g.status === 'active' ? 'border-ruin-gold/40 text-ruin-gold' :
                      'border-stone-600 text-stone-500'
                    }`}>
                      {g.status === 'completed' ? 'Достигнуто' : g.status === 'active' ? 'В работе' : 'Долгосрочно'}
                    </span>
                  </div>
                  <p className="text-sm text-stone-400 mb-5 leading-relaxed">{g.description}</p>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          g.status === 'completed' ? 'bg-green-600' : 'bg-ruin-gold'
                        }`}
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-stone-400 tabular-nums w-12 text-right">
                      {g.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="border-t border-stone-800 bg-stone-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 mb-5">Видение</h2>
          <p className="text-stone-400 leading-relaxed">
            Калининградская область, где руины кирх и замков — не забытые остовы,
            а осмысленные, ухоженные пространства. Где люди приходят не только «посмотреть
            на разруху», а почувствовать связь времён. Где каждый ценный объект имеет
            своего хранителя.
          </p>
        </div>
      </section>
    </div>
  )
}
