'use client'
import type { Metadata, Viewport } from 'next'
import { FC, ReactNode, useEffect, useState } from 'react'
import '@/styles/globals.scss'
import 'swiper/css'
import { useRouter } from 'next/navigation' // Импортируем useRouter

// metadata
export const viewport: Viewport = initialViewport

import { QueryClientProvider } from '@tanstack/react-query'
import { mainFont } from '@/fonts'
import { initialMetadata, initialViewport } from '@/metadata'
import { RootLayoutComponent } from '@/modules/layouts'
import { useTanStackClient } from '@/packages/tanstack-client'
import { useCommonStore } from '@/shared/stores' // Проверьте правильность импорта
import useKeyboard from '@/utils/native-app/keyboard'
import {
  scheduleNotifications,
  notifications,
  getNotificationState,
} from '@/utils/native-app/notifications'

//interface
interface IRootLayout {
  entry: ReactNode
  home: ReactNode
  children: ReactNode
}

//component
const RootLayout: FC<Readonly<IRootLayout>> = ({ home, entry }) => {
  const router = useRouter() // Инициализируем useRouter
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const errorText = useCommonStore((state) => state.errorText)
  const successfulText = useCommonStore((state) => state.successfulText)
  const { queryClient } = useTanStackClient()
  const [isOnline, setIsOnline] = useState(true) // Изначально считаем, что интернет есть

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
    const loadNotifications = async () => {
      const moodTrackerState = await getNotificationState('moodTrackerNotificationsEnabled')
      const challengeState = await getNotificationState('challengeNotificationsEnabled')

      const notificationsToSchedule = notifications.filter(
        (notification) =>
          (notification.id === 1 && challengeState) ||
          ((notification.id === 2 || notification.id === 3) && moodTrackerState),
      )

      await scheduleNotifications(notificationsToSchedule)
    }

    loadNotifications()
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

      // Откладываем перенаправление на страницу оффлайна на 3 секунды, чтобы убедиться, что соединение действительно отсутствует
      setTimeout(() => {
        if (!navigator.onLine) {
          router.push('/offline') // Перенаправляем на страницу оффлайна
        }
      }, 3000) // Задержка в 3 секунды
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Удаляем обработчики событий при размонтировании
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [router])

  // Регистрация Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js') // Убедитесь, что путь к вашему Service Worker правильный
          .then((registration) => {
            console.log('Service Worker зарегистрирован с областью:', registration.scope)
          })
          .catch((error) => {
            console.error('Ошибка регистрации Service Worker:', error)
          })
      })
    }
  }, [])

  //return
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
