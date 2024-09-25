import { LocalNotifications } from '@capacitor/local-notifications'

import { IconArrow } from '@/shared/icons'
import { ImageCapybaraDeletion } from '@/shared/images'
const BASE_URL = `https://i-strong-app.vercel.app`
interface NotificationConfig {
  id: number
  title: string
  body: string
  url: string
  schedule: { at?: Date; every?: 'minute'; count?: number; repeats?: boolean }
  attachments: { id: string; url: string }[]
  smallIcon: 'ic_stat_icon1'
}

const notifications: NotificationConfig[] = [
  {
    id: 1,
    title: 'Нові челенджі',
    body: 'Прийшли нові челенджі. Перейдіть за посиланням для перегляду.',
    url: `${BASE_URL}/challenges?path=new`,
    schedule: { at: new Date(new Date().setHours(10, 0, 0)) }, // В 10:00
    attachments: [
      { id: 'challenges-image', url: `${BASE_URL}/path_to_your_image/challenges_image.png` },
    ],
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 2,
    title: 'Запис в щоденник',
    body: 'Зробіть запис в щоденник. Перейдіть за посиланням.',
    url: `${BASE_URL}/diary`,
    schedule: { at: new Date(new Date().setHours(18, 0, 0)) }, // В 18:00
    attachments: [{ id: 'diary-image', url: `${BASE_URL}/path_to_your_image/diary_image.png` }],
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 3,
    title: 'Тест',
    body: 'Як ти себе почуваеш?',
    url: `${BASE_URL}/diary`,
    schedule: { every: 'minute', count: 1, repeats: true }, // Каждые 1 минуты
    attachments: [{ id: 'test-image', url: `${BASE_URL}/images/icon-arrow.svg` }], // Используйте URL вашего SVG-файла
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 4,
    title: 'IconArrow',
    body: 'Как вы себя чувствуете сегодня?',
    url: `${BASE_URL}/challenges?path=new`,
    schedule: { every: 'minute', count: 1, repeats: true }, // Каждые 1 минуты
    attachments: [{ id: 'test2-image', url: IconArrow }],
    smallIcon: IconArrow,
  },
]

export const requestPermissions = async () => {
  const permission = await LocalNotifications.requestPermissions()
  if (permission.display !== 'granted') {
    console.error('Permission not granted for notifications')
    return false
  }
  return true
}

export const scheduleNotifications = async () => {
  const permissionsGranted = await requestPermissions()
  if (!permissionsGranted) return

  try {
    await LocalNotifications.schedule({
      notifications: notifications.map((notification) => ({
        title: notification.title,
        body: notification.body,
        id: notification.id,
        schedule: notification.schedule,
        actionTypeId: '',
        extra: { url: notification.url },
        attachments: notification.attachments,
        smallIcon: notification.smallIcon,
      })),
    })
  } catch (error) {
    console.error('Error scheduling notifications', error)
  }
}
