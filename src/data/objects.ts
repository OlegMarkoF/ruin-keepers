export interface RuinObject {
  id: string;
  name: string;
  historicalName: string;
  type: 'kirche' | 'castle' | 'fort' | 'other';
  location: string;
  status: 'active' | 'cared' | 'planned' | 'shelved';
  description: string;
  history: string;
  worksDone: string[];
  coordinates?: [number, number];
  tags: string[];
  photoCount: number;
  yearStarted?: number;
}

export const objects: RuinObject[] = [
  {
    id: 'tharau',
    name: 'Кирха Тарау',
    historicalName: 'Kirche Tharau',
    type: 'kirche',
    location: 'пос. Владимирово',
    status: 'active',
    description: 'Знаменитая кирха с «сердечком» — один из символов движения. Средневековый храм XIV века с уникальной историей.',
    history: 'Построена в XIV веке в период колонизации прусских земель. После войны долго стояла заброшенной. Хранители вернули ей жизнь через регулярные субботники и благоустройство.',
    worksDone: ['Расчистка территории', 'Окос', 'Благоустройство', 'Открытие сезона 2026'],
    tags: ['#rk_tharau', 'средневековье', 'символ'],
    photoCount: 48,
    yearStarted: 2021,
  },
  {
    id: 'domnau',
    name: 'Кирха Домнау',
    historicalName: 'Kirche Domnau',
    type: 'kirche',
    location: 'пос. Домново',
    status: 'cared',
    description: 'Кирха с уникальными средневековыми росписями. Теперь здесь культурная площадка и музей.',
    history: 'Одна из древнейших кирх региона. Сохранила средневековые фрески. В 2023 году нашла арендаторов, которые вместе с Хранителями продолжают работу.',
    worksDone: ['Расчистка', 'Удаление советских конструкций', 'Противоаварийные работы', 'Реставрационная школа'],
    tags: ['#rk_domnau', 'росписи', 'готическое кольцо'],
    photoCount: 36,
    yearStarted: 2022,
  },
  {
    id: 'ragnit',
    name: 'Замок Рагнит',
    historicalName: 'Burg Ragnit',
    type: 'castle',
    location: 'г. Неман',
    status: 'cared',
    description: 'Один из ключевых объектов, с которого начиналась история движения. Сегодня активно возрождается.',
    history: 'Тевтонский замок. С субботников здесь в 2019–2020 годах фактически родились «Хранители руин».',
    worksDone: ['Первые субботники', 'Расчистка', 'Поддержка команды замка'],
    tags: ['#rk_ragnit', 'тевтонский', 'истоки'],
    photoCount: 52,
    yearStarted: 2019,
  },
  {
    id: 'borchersdorf',
    name: 'Кирха Борхерсдорфа',
    historicalName: 'Kirche Borchersdorf',
    type: 'kirche',
    location: 'пос. Зеленополье',
    status: 'cared',
    description: 'Объект, с которого всё начиналось. Известна уникальной мозаикой «Сеятель».',
    history: 'До официального основания движения. Мозаика межвоенного периода — памятник погибшим жителям.',
    worksDone: ['Первые работы', 'Благоустройство', 'Поиск шефа'],
    tags: ['#rk_borchersdorf', 'мозаика', 'истоки'],
    photoCount: 28,
    yearStarted: 2020,
  },
  {
    id: 'petersdorf',
    name: 'Кирха Петерсдорфа',
    historicalName: 'Kirche Petersdorf',
    type: 'kirche',
    location: 'пос. Куйбышевское',
    status: 'active',
    description: 'Объект на «Полесском кольце». Закрытие волонтёрского сезона 2024 проходило именно здесь.',
    history: 'Руины кирхи в Полесском районе. Стала одним из новых объектов маршрута.',
    worksDone: ['Первый большой субботник', 'Расчистка'],
    tags: ['#rk_petersdorf', 'полесское кольцо'],
    photoCount: 22,
    yearStarted: 2024,
  },
  {
    id: 'allenburg',
    name: 'Алленбургская кирха',
    historicalName: 'Kirche Allenburg',
    type: 'kirche',
    location: 'пос. Дружба',
    status: 'cared',
    description: 'Достояние мировой культуры и архитектуры. Взята в аренду в 2022 году.',
    history: 'Новая история началась в 2022 году с арендатором Геннадием Кострицей. Хранители активно поддерживают объект.',
    worksDone: ['Поддержка арендатора', 'Субботники', 'Популяризация'],
    tags: ['#rk_allenburg', 'архитектура'],
    photoCount: 31,
    yearStarted: 2022,
  },
];

export const objectTypes = {
  kirche: 'Кирха',
  castle: 'Замок',
  fort: 'Форт',
  other: 'Другое',
};

export const statusLabels = {
  active: 'В работе',
  cared: 'Под опекой',
  planned: 'В планах',
  shelved: 'На паузе',
};
