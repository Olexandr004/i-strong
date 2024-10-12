import { LocalNotifications } from '@capacitor/local-notifications'
import { Preferences } from '@capacitor/preferences'
import { IconArrow } from '@/shared/icons' // Убедитесь, что это импортируется корректно

const BASE_URL = `https://i-strong.vercel.app/`

interface NotificationConfig {
  id: number
  title: string
  body: string
  url: string
  schedule: { at?: Date; every?: 'day'; count?: number; repeats?: boolean }
  attachments: { id: string; url: string }[]
  smallIcon: string
}

// Общий массив уведомлений
export const notifications: NotificationConfig[] = [
  {
    id: 1,
    title: 'IStrong',
    body: 'А ось і новий челендж🔥Що там цікавого підготувала Капібара цього разу?',
    url: `${BASE_URL}/challenges?path=new`,
    schedule: { at: new Date(new Date().setHours(10, 0, 0)), every: 'day', repeats: true }, //10:00
    attachments: [
      { id: 'challenges-image', url: `${BASE_URL}/path_to_your_image/challenges_image.png` },
    ],
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 2,
    title: 'IStrong',
    body: 'Привіт, ти як? Поділись своїм станом з Капібарою та отримай монетку.',
    url: `${BASE_URL}/diary`,
    schedule: { at: new Date(new Date().setHours(9, 0, 0)), every: 'day', repeats: true }, //9:00
    attachments: [{ id: 'test-image', url: `${BASE_URL}/images/icon-arrow.svg` }],
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 3,
    title: 'IStrong',
    body: 'Хей, як пройшов твій день? Розкажи Капібарі - і монетка твоя!',
    url: `${BASE_URL}/diary`,
    schedule: { at: new Date(new Date().setHours(18, 0, 0)), every: 'day', repeats: true }, //18:00
    attachments: [{ id: 'test2-image', url: IconArrow }],
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 4,
    title: 'IStrong',
    body: 'Тестове повідомлення челенджа на 13:00. 🔥',
    url: `${BASE_URL}/challenges?path=new`,
    schedule: { at: new Date(new Date().setHours(13, 0, 0)), every: 'day', repeats: true }, //13:00
    attachments: [
      { id: 'test-challenge-image', url: `${BASE_URL}/path_to_your_image/challenges_image.png` },
    ],
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 5,
    title: 'IStrong',
    body: 'Тестове повідомлення челенджа на 14:00. 🔥',
    url: `${BASE_URL}/challenges?path=new`,
    schedule: { at: new Date(new Date().setHours(14, 0, 0)), every: 'day', repeats: true }, //14:00
    attachments: [
      { id: 'test-challenge-image-2', url: `${BASE_URL}/path_to_your_image/challenges_image.png` },
    ],
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 6,
    title: 'IStrong',
    body: 'Тестове повідомлення про настрій на 17:00. 😊',
    url: `${BASE_URL}/diary`,
    schedule: { at: new Date(new Date().setHours(17, 0, 0)), every: 'day', repeats: true }, //17:00
    attachments: [{ id: 'test-mood-image', url: IconArrow }],
    smallIcon: 'ic_stat_icon1',
  },
]

// Функция для сохранения состояния уведомлений
export const saveNotificationState = async (key: string, enabled: boolean) => {
  await Preferences.set({ key, value: JSON.stringify(enabled) })
}

// Функция для загрузки состояния уведомлений
export const getNotificationState = async (key: string): Promise<boolean> => {
  const { value } = await Preferences.get({ key })
  return value ? JSON.parse(value) : true // По умолчанию уведомления включены
}

// Функция для отмены уведомлений
export const cancelNotifications = async (ids: number[]) => {
  try {
    await Promise.all(ids.map((id) => LocalNotifications.cancel({ notifications: [{ id }] })))
  } catch (error) {
    console.error('Ошибка при отмене уведомлений', error)
  }
}

// Функция для планирования уведомлений
export const scheduleNotifications = async (enabledNotifications: NotificationConfig[]) => {
  const permissionsGranted = await requestPermissions()
  if (!permissionsGranted) return

  try {
    await LocalNotifications.schedule({
      notifications: enabledNotifications.map((notification) => ({
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
    console.error('Ошибка при планировании уведомлений', error)
  }
}

// Функция для переключения состояния уведомлений
export const toggleNotifications = async (type: 'moodTracker' | 'challenge') => {
  const key =
    type === 'moodTracker' ? 'moodTrackerNotificationsEnabled' : 'challengeNotificationsEnabled'
  const currentState = await getNotificationState(key)
  const newState = !currentState
  await saveNotificationState(key, newState)

  const enabledNotifications = notifications.filter(
    (notification) =>
      (type === 'moodTracker' && (notification.id === 2 || notification.id === 3)) ||
      (type === 'challenge' && notification.id === 1),
  )

  if (newState) {
    await scheduleNotifications(enabledNotifications) // Если уведомления включены, планируем их
  } else {
    await cancelNotifications(enabledNotifications.map((notification) => notification.id))
  }

  return newState
}

// Запрос разрешений
export const requestPermissions = async () => {
  const permission = await LocalNotifications.requestPermissions()
  if (permission.display !== 'granted') {
    console.error('Разрешение на уведомления не предоставлено')
    return false
  }
  return true
}
