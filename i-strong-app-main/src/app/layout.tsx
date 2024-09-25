'use client'
import type { Metadata, Viewport } from 'next'

import { FC, ReactNode, useEffect } from 'react'

import '@/styles/globals.scss'
import 'swiper/css'

// metadata
export const viewport: Viewport = initialViewport
// export const metadata: Metadata = initialMetadata

import { QueryClientProvider } from '@tanstack/react-query'

import { mainFont } from '@/fonts'
import { initialMetadata, initialViewport } from '@/metadata'
import { RootLayoutComponent } from '@/modules/layouts'
import { useTanStackClient } from '@/packages/tanstack-client'
import { useCommonStore } from '@/shared/stores'
import useKeyboard from '@/utils/native-app/keyboard'
import { scheduleNotifications } from '@/utils/native-app/notifications'

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
    scheduleNotifications()
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
