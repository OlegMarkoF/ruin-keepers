export interface Event {
  id: string;
  title: string;
  date: string;
  type: 'subbotnik' | 'tour' | 'lecture' | 'festival' | 'other';
  location: string;
  objectId?: string;
  description: string;
  status: 'upcoming' | 'past';
  volunteers?: number;
}

export const events: Event[] = [
  {
    id: 'e1',
    title: 'Субботник на кирхе Тарау — открытие сезона 2026',
    date: '2026-03-28',
    type: 'subbotnik',
    location: 'пос. Владимирово',
    objectId: 'tharau',
    description: 'Масштабное открытие волонтёрского сезона на легендарной кирхе с сердечком.',
    status: 'past',
    volunteers: 120,
  },
  {
    id: 'e2',
    title: '300-й выезд: субботник в Алленберге',
    date: '2026-08-29',
    type: 'subbotnik',
    location: 'Алленберг',
    description: 'Юбилейный 300-й выезд движения. 140 волонтёров помогали новому собственнику комплекса.',
    status: 'past',
    volunteers: 140,
  },
  {
    id: 'e3',
    title: 'Прогулка по «Готическому кольцу» с Игорем Ляшуком',
    date: '2026-01-24',
    type: 'tour',
    location: 'Готическое кольцо',
    description: 'Большое путешествие по достопримечательностям Готического кольца: Чехово, Домново, Правдинск, городище Ушкуй.',
    status: 'past',
  },
  {
    id: 'e4',
    title: 'Субботник на кирхе Петерсдорфа — закрытие сезона 2024',
    date: '2024-11-24',
    type: 'subbotnik',
    location: 'пос. Куйбышевское',
    objectId: 'petersdorf',
    description: 'Финальный волонтёрский выезд 2024 года на новом объекте Полесского кольца.',
    status: 'past',
    volunteers: 85,
  },
  {
    id: 'e5',
    title: 'Круглый стол с 10 замками',
    date: '2024-12-14',
    type: 'lecture',
    location: 'Калининград',
    description: 'Историческое событие на отчётной конференции: представители почти всех развивающихся замков области на одной сцене.',
    status: 'past',
  },
];

export const eventTypeLabels = {
  subbotnik: 'Субботник',
  tour: 'Прогулка',
  lecture: 'Лекторий',
  festival: 'Фестиваль',
  other: 'Другое',
};
