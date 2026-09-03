export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  target?: string;
  status: 'active' | 'completed' | 'longterm';
}

export const goals: Goal[] = [
  {
    id: 'g1',
    title: 'Более 80 объектов под опекой',
    description: 'Систематическая работа на руинах кирх, замков и фортов по всей области.',
    progress: 75,
    target: '80+',
    status: 'active',
  },
  {
    id: 'g2',
    title: '300+ волонтёрских выездов',
    description: 'Регулярные субботники и воскресники — основа нашей деятельности.',
    progress: 100,
    target: '300',
    status: 'completed',
  },
  {
    id: 'g3',
    title: 'Развитие туристических маршрутов',
    description: '«Готическое кольцо» и «Полесское кольцо» как полноценные культурно-туристические продукты.',
    progress: 60,
    status: 'active',
  },
  {
    id: 'g4',
    title: 'Поиск шефов для всех ключевых объектов',
    description: 'Каждый ценный объект должен обрести человека или команду, готовых взять ответственность.',
    progress: 40,
    status: 'longterm',
  },
  {
    id: 'g5',
    title: 'Популяризация эстетики руин',
    description: 'Сделать бережное отношение к руинированному наследию нормой, а не исключением.',
    progress: 55,
    status: 'longterm',
  },
];

export const stats = [
  { label: 'Объектов', value: '80+', sub: 'под опекой' },
  { label: 'Выездов', value: '300+', sub: 'с 2020 года' },
  { label: 'Волонтёров', value: '3000+', sub: 'участвовали' },
  { label: 'Лет', value: '6', sub: 'движения' },
];
