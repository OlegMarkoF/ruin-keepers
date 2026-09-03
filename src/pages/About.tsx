import { Link } from 'react-router-dom'
import { Heart, Landmark, Users, BookOpen, Map } from 'lucide-react'

export default function About() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <p className="text-ruin-gold text-sm uppercase tracking-[0.2em] mb-3">О нас</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-stone-50 mb-6 max-w-2xl">
            Кто такие «Хранители руин»
          </h1>
          <p className="text-lg text-stone-400 max-w-2xl leading-relaxed">
            Мы — крупнейшее в Калининградской области независимое волонтёрское движение,
            которое с 2020 года заботится об архитектурном наследии региона и популяризирует
            эстетику руин.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 mb-6">Как всё началось</h2>
            <div className="space-y-5 text-stone-400 leading-relaxed">
              <p>
                Осенью 2019 года Василий Плитин откликнулся на призыв помочь с расчисткой замка Рагнит.
                Из одного субботника родилась идея: а что, если делать это регулярно и системно?
              </p>
              <p>
                В 2020 году появилось название «Хранители руин» (раньше сообщество называлось Ostpreussen Fans).
                Тогда же начались регулярные выезды на кирхи и замки области.
              </p>
              <p>
                В 2022 году движение зарегистрировали как АНО «Хранители руин».
                Под штаб выделили Железнодорожные ворота — объект регионального значения.
                Получили первые субсидии от Правительства области.
              </p>
              <p>
                Сегодня за спиной — более 300 выездов, десятки объектов, тысячи волонтёров
                и понимание: руины — это не мусор истории, а её живая, выразительная часть.
              </p>
            </div>
          </div>
          <div className="card-ruin rounded-2xl p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-ruin-gold/30 flex items-center justify-center text-ruin-gold shrink-0">
                <Landmark size={18} />
              </div>
              <div>
                <div className="font-medium text-stone-200">Объекты</div>
                <div className="text-sm text-stone-500 mt-1">Кирхи, замки, форты, индустриальное наследие. Более 80 мест, где мы работали.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-ruin-gold/30 flex items-center justify-center text-ruin-gold shrink-0">
                <Users size={18} />
              </div>
              <div>
                <div className="font-medium text-stone-200">Люди</div>
                <div className="text-sm text-stone-500 mt-1">Волонтёры, шефы объектов, гиды, партнёры, спонсоры. Сообщество, которое растёт.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-ruin-gold/30 flex items-center justify-center text-ruin-gold shrink-0">
                <Map size={18} />
              </div>
              <div>
                <div className="font-medium text-stone-200">Маршруты</div>
                <div className="text-sm text-stone-500 mt-1">«Готическое кольцо» и «Полесское кольцо» — способы увидеть регион через призму наследия.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-ruin-gold/30 flex items-center justify-center text-ruin-gold shrink-0">
                <BookOpen size={18} />
              </div>
              <div>
                <div className="font-medium text-stone-200">Знание</div>
                <div className="text-sm text-stone-500 mt-1">Лекторий, прогулки с краеведами, публикации, интервью — чтобы понимать, что храним.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-stone-900/40 border-y border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 mb-8 text-center">Наша философия</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-stone-400 leading-relaxed text-center">
            <p className="text-lg text-stone-300">
              «Мы считаем, что экспрессивные руины — это изюминка региона.
              Мы стремимся сохранить их и подарить «вторую жизнь» в качестве эстетичных
              и благоустроенных исторических парков и площадок для мероприятий.»
            </p>
            <p>
              Мы не всегда за полную реставрацию. Часто важнее — убрать мусор, окосить траву,
              сделать безопасный доступ и позволить месту дышать. Руина может быть красивой
              и осмысленной сама по себе.
            </p>
            <p>
              Многие объекты принадлежат Русской православной церкви или частным лицам.
              Мы помогаем тем, кто готов взять ответственность, и сами становимся «шефами»
              там, где пока никого нет.
            </p>
          </div>
        </div>
      </section>

      {/* Key people */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 mb-8">Ключевые люди</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card-ruin rounded-2xl p-6">
            <div className="font-serif text-xl text-stone-100 mb-1">Василий Плитин</div>
            <div className="text-sm text-ruin-gold mb-3">Основатель</div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Инициатор движения. Именно его отклик на призыв помочь замку Рагнит в 2019 году
              стал точкой отсчёта.
            </p>
          </div>
          <div className="card-ruin rounded-2xl p-6">
            <div className="font-serif text-xl text-stone-100 mb-1">Светлана Назарова</div>
            <div className="text-sm text-ruin-gold mb-3">Координатор и шеф-редактор</div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Ведёт коммуникацию, медиа, организацию. Путь через археологию, пиар, диджитал
              и урбанистику к сохранению наследия.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Heart className="mx-auto text-ruin-gold mb-5" size={28} />
          <h2 className="font-serif text-2xl text-stone-100 mb-4">Станьте частью</h2>
          <p className="text-stone-400 mb-8">
            Следите за анонсами в Telegram и VK, приходите на субботники,
            становитесь шефом объекта или просто поддержите донатом.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events" className="px-5 py-2.5 border border-stone-600 rounded-full text-sm text-stone-300 hover:border-ruin-gold/50 hover:text-ruin-gold transition">
              Смотреть события
            </Link>
            <a href="https://ruin-keepers.ru/donate" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-ruin-gold text-stone-950 rounded-full text-sm font-medium hover:bg-[#d4b57a] transition">
              Поддержать
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
