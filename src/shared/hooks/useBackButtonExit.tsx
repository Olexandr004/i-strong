import { usePathname } from 'next/navigation'
import { App as CapacitorApp } from '@capacitor/app'

import { useEffect } from 'react'

export const useBackButtonExit = () => {
  const pathname = usePathname()

  useEffect(() => {
    const handleBackButton = async () => {
      if (pathname === '/') {
        await CapacitorApp.exitApp()
      }
    }

    document.addEventListener('backbutton', handleBackButton, false)

    return () => {
      document.removeEventListener('backbutton', handleBackButton, false)
    }
  }, [pathname])
}
