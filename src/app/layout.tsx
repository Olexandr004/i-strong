'use client'
import '@/i18n' // 🔹 Добавлен импорт i18n
import type { Metadata, Viewport } from 'next'
import { FC, ReactNode, useEffect, useState } from 'react'
import '@/styles/globals.scss'
import 'swiper/css'
import { useRouter } from 'next/navigation'

// metadata
export const viewport: Viewport = initialViewport

import { QueryClientProvider } from '@tanstack/react-query'
import { mainFont } from '@/fonts'
import { initialMetadata, initialViewport } from '@/metadata'
import { RootLayoutComponent } from '@/modules/layouts'
import { useTanStackClient } from '@/packages/tanstack-client'
import { useCommonStore } from '@/shared/stores'
import useKeyboard from '@/utils/native-app/keyboard'
import {
  scheduleNotifications,
  notifications,
  getNotificationState,
} from '@/utils/native-app/notifications'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

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

        if (moodTrackerEnabled) {
          await scheduleNotifications(
            notifications.filter((notification) => [2, 3].includes(notification.id)),
          )
        }

        if (challengeNotificationsEnabled) {
          await scheduleNotifications(
            notifications.filter((notification) => [1].includes(notification.id)),
          )
        }
      } catch (error) {
        console.error('Error scheduling notifications:', error)
      }
    }

    checkAndScheduleNotifications()
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      handleChangeCommonStore({ successfulText: t('connectionRestored') })
    }

    const handleOffline = () => {
      setIsOnline(false)
      handleChangeCommonStore({ errorText: t('noInternet') })

      setTimeout(() => {
        handleChangeCommonStore({ errorText: null })
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
