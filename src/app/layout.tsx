'use client'
import type { Metadata, Viewport } from 'next'
import { FC, ReactNode, useEffect } from 'react'
import '@/styles/globals.scss'
import 'swiper/css'

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
  const handleChangeCommonStore = useCommonStore((state) => state.handleChangeCommonStore)
  const errorText = useCommonStore((state) => state.errorText)
  const successfulText = useCommonStore((state) => state.successfulText)
  const { queryClient } = useTanStackClient()

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

  //return
  return (
    <html lang='uk' className={mainFont.className}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutComponent entry={entry} home={home} />
      </QueryClientProvider>
    </html>
  )
}

export default RootLayout
