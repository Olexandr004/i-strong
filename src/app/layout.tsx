'use client'
import type { Metadata, Viewport } from 'next'
import { FC, ReactNode, useEffect, useState } from 'react'
import '@/styles/globals.scss'
import 'swiper/css'
import { useRouter } from 'next/navigation'
import { QueryClientProvider } from '@tanstack/react-query'
import { mainFont } from '@/fonts'
import { initialMetadata, initialViewport } from '@/metadata'
import { RootLayoutComponent } from '@/modules/layouts'
import { useTanStackClient } from '@/packages/tanstack-client'
import { useCommonStore, useUserStore } from '@/shared/stores' // Проверьте правильность импорта
import useKeyboard from '@/utils/native-app/keyboard'
import {
  scheduleNotifications,
  notifications,
  getNotificationState,
} from '@/utils/native-app/notifications'
import { LoadingComponent } from '@/modules/layouts/loading'

// interface
interface IRootLayout {
  entry: ReactNode
  home: ReactNode
  children: ReactNode
}

// component
const RootLayout: FC<Readonly<IRootLayout>> = ({ home, entry }) => {
  const router = useRouter()
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const errorText = useCommonStore((state) => state.errorText)
  const successfulText = useCommonStore((state) => state.successfulText)
  const { queryClient } = useTanStackClient()
  const [isOnline, setIsOnline] = useState(true)
  const token = useUserStore((state) => state.user?.access_token)
  const [isInitialized, setIsInitialized] = useState(false) // Новое состояние инициализации

  useEffect(() => {
    const initializeApp = async () => {
      if (token) {
        // Если токен доступен, считаем, что инициализация прошла успешно
        setIsInitialized(true)
      } else {
        // Иначе редиректим на авторизацию или обрабатываем инициализацию
        router.push('/login')
      }
    }

    initializeApp()
  }, [token, router])

  useEffect(() => {
    const handleClick = () => {
      if (errorText) {
        handleChangeCommonStore({ errorText: null })
      } else if (successfulText) {
        handleChangeCommonStore({ successfulText: null })
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [errorText, successfulText])

  useKeyboard()

  useEffect(() => {
    const checkAndScheduleNotifications = async () => {
      try {
        const moodTrackerEnabled = await getNotificationState('moodTrackerNotificationsEnabled')
        const challengeNotificationsEnabled = await getNotificationState(
          'challengeNotificationsEnabled',
        )

        // Запланировать уведомления для трекера настроения
        if (moodTrackerEnabled) {
          await scheduleNotifications(
            notifications.filter((notification) => [2, 3, 4].includes(notification.id)),
          )
        }

        // Запланировать уведомления для челленджей
        if (challengeNotificationsEnabled) {
          await scheduleNotifications(
            notifications.filter((notification) => [1, 5, 6].includes(notification.id)),
          )
        }
      } catch (error) {
        console.error('Error scheduling notifications:', error)
      }
    }

    checkAndScheduleNotifications()
  }, [])

  // Обработчики состояния сети
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      handleChangeCommonStore({ successfulText: `З'єднання відновлено!` })
    }

    const handleOffline = () => {
      setIsOnline(false)
      handleChangeCommonStore({ errorText: 'Немає підключення до Інтернету.' })

      // Автоматически закрываем уведомление через 2 секунды
      setTimeout(() => {
        handleChangeCommonStore({ errorText: null }) // Сбрасываем текст ошибки
      }, 2000)

      setTimeout(() => {
        if (!navigator.onLine) {
          router.push('/offline')
        }
      }, 3000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [router])

  // Регистрация Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker зарегистрирован с областью:', registration.scope)
        })
        .catch((error) => {
          console.error('Ошибка регистрации Service Worker:', error)
        })
    }
  }, [])

  // Отображаем загрузочный экран до завершения инициализации
  if (!isInitialized) {
    return <LoadingComponent />
  }

  return (
    <html lang='uk' className={mainFont.className}>
      <QueryClientProvider client={queryClient}>
        <body>
          <RootLayoutComponent entry={entry} home={home} />
        </body>
      </QueryClientProvider>
    </html>
  )
}

export default RootLayout
