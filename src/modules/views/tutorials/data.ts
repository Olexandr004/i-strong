// types.ts
export interface Technique {
  id: number
  title: string
  type: 'photo' | 'video'
  array?: string[] // Массив слайдов для техник с типом 'photo'
}

export interface Category {
  id: number
  title: string
  techniques: Technique[]
}

export const categories: Category[] = [
  {
    id: 1,
    title: 'Стрес',
    techniques: [
      {
        id: 1,
        title: 'Дихальні вправи з рухом',
        type: 'photo',
        array: ['/image/img.png', '/image/Breath-1.png', '/image/img.png'],
      },
      {
        id: 2,
        title: 'Дихання 4-7-8',
        type: 'photo',
        array: [
          // Массив слайдов для техники "Дихання 4-7-8"
          '/image/Breath-1.png', // Предположим, что путь к изображениям корректен
          '/image/img.png',
        ],
      },
      {
        id: 3,
        title: 'Прогулянка',
        type: 'video',
      },
      {
        id: 4,
        title: 'Йога',
        type: 'video',
      },
    ],
  },
  {
    id: 2,
    title: 'Панічні атаки',
    techniques: [
      {
        id: 5,
        title: 'Дихання з затримкою',
        type: 'photo',
        array: ['/image/slide1.jpg', '/image/slide2.jpg'],
      },
      {
        id: 6,
        title: 'Релаксація мязів',
        type: 'video',
      },
    ],
  },
  {
    id: 3,
    title: 'Шоковий стан',
    techniques: [
      {
        id: 7,
        title: 'Заземлення',
        type: 'photo',
        array: ['/image/slide1.jpg', '/image/slide2.jpg'],
      },
      {
        id: 8,
        title: 'Контроль дихання',
        type: 'photo',
        array: ['/image/slide1.jpg', '/image/slide2.jpg'],
      },
    ],
  },
]
