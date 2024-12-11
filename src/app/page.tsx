'use client'
import { useEffect } from 'react'
import { NextPage } from 'next'
import { StatusBar, Style } from '@capacitor/status-bar'

const InitialPage: NextPage = () => {
  useEffect(() => {
    const configureStatusBar = async () => {
      try {
        await StatusBar.setBackgroundColor({ color: '#ffffff' }) // Белый фон
        await StatusBar.setStyle({ style: Style.Dark }) // Тёмный текст
        await StatusBar.setOverlaysWebView({ overlay: false }) // Непрозрачный статус-бар
      } catch (error) {
        console.error('Ошибка настройки статус-бара:', error)
      }
    }

    configureStatusBar()
  }, [])

  return null
}

export default InitialPage
