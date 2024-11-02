import { LocalNotifications } from '@capacitor/local-notifications'
import { Preferences } from '@capacitor/preferences'
import { IconArrow } from '@/shared/icons'

const BASE_URL = `https://i-strong-xr7i.vercel.app/`

interface NotificationConfig {
  id: number
  title: string
  body: string
  url: string
  schedule: { at?: Date; every?: 'day'; count?: number; repeats?: boolean }
  smallIcon: string
}

// Функция для корректировки времени уведомления
const adjustNotificationTime = (hours: number, minutes: number): Date => {
  const now = new Date()
  const notificationTime = new Date()
  notificationTime.setHours(hours, minutes, 0, 0)

  if (notificationTime <= now) {
    // Если текущее время уже прошло, переносим на следующий день
    notificationTime.setDate(notificationTime.getDate() + 1)
  }
  return notificationTime
}

// Общий массив уведомлений с корректировкой времени
export const notifications: NotificationConfig[] = [
  {
    id: 1,
    title: 'IStrong',
    body: 'А ось і новий челендж🔥Що там цікавого підготувала Капібара цього разу?',
    url: `${BASE_URL}/challenges?path=new`,
    schedule: { at: adjustNotificationTime(10, 0), every: 'day', repeats: true }, // 10:00
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 2,
    title: 'IStrong',
    body: 'Привіт, ти як? Поділись своїм станом з Капібарою та отримай монетку.',
    url: `${BASE_URL}/diary`,
    schedule: { at: adjustNotificationTime(9, 0), every: 'day', repeats: true }, // 9:00
    smallIcon: 'ic_stat_icon1',
  },
  {
    id: 3,
    title: 'IStrong',
    body: 'Хей, як пройшов твій день? Розкажи Капібарі - і монетка твоя!',
    url: `${BASE_URL}/diary`,
    schedule: { at: adjustNotificationTime(18, 0), every: 'day', repeats: true }, // 18:00
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
        smallIcon: notification.smallIcon,
      })),
    })
  } catch (error) {
    console.error('Ошибка при планировании уведомлений', error)
  }
}

// Функция для переключения состояния уведомлений
// Функция для переключения состояния уведомлений
export const toggleNotifications = async (type: 'moodTracker' | 'challenge') => {
  const key =
    type === 'moodTracker' ? 'moodTrackerNotificationsEnabled' : 'challengeNotificationsEnabled'
  const currentState = await getNotificationState(key)
  const newState = !currentState
  await saveNotificationState(key, newState)

  // Выбираем уведомления в зависимости от типа
  const enabledNotifications = notifications.filter((notification) => {
    if (type === 'moodTracker') {
      return notification.id === 2 || notification.id === 3 // Уведомления для moodTracker
    } else {
      return notification.id === 1 // Уведомления для challenge
    }
  })

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
