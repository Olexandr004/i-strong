import { Capacitor } from '@capacitor/core'
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard'

import { useEffect } from 'react'

const useKeyboard = () => {
  useEffect(() => {
    const handleKeyboardWillShow = async (info: KeyboardInfo) => {
      console.log('Keyboard will show', info)
      await Keyboard.setScroll({ isDisabled: true })
    }

    const handleKeyboardDidShow = (info: KeyboardInfo) => {
      console.log('Keyboard did show', info)
    }

    const handleKeyboardWillHide = async () => {
      console.log('Keyboard will hide')
      await Keyboard.setScroll({ isDisabled: false })
    }

    const handleKeyboardDidHide = () => {
      console.log('Keyboard did hide')
    }

    const handleScroll = () => {
      console.log('Scroll detected, hiding keyboard')
      Keyboard.hide()
    }

    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        console.log('Click outside detected, hiding keyboard')
        Keyboard.hide()
      }
    }

    const handleTouchStartOutside = (event: TouchEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        console.log('Touch outside detected, hiding keyboard')
        Keyboard.hide()
      }
    }

    const handleFocus = async () => {
      console.log('Input focused, disabling scroll and showing accessory bar')
      await Keyboard.setScroll({ isDisabled: true })
      await Keyboard.setAccessoryBarVisible({ isVisible: true })
      //   if (Capacitor.platform === 'ios') {
      //     await Keyboard.setStyle({ style: KeyboardStyle.Dark }) // Установка темного стиля клавиатуры
      //   }
    }

    const handleBlur = async () => {
      console.log('Input blurred, enabling scroll and hiding accessory bar')
      await Keyboard.setScroll({ isDisabled: false })
      await Keyboard.setAccessoryBarVisible({ isVisible: false })
    }

    // Подписка на события показа и скрытия клавиатуры
    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow)
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow)
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide)
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide)

    // Подписка на события прокрутки, клика и касания вне инпута
    if (Capacitor.isNativePlatform()) {
      window.addEventListener('scroll', handleScroll)
      document.addEventListener('touchstart', handleTouchStartOutside)
    }
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)

    return () => {
      // Отписка от событий при размонтировании компонента
      Keyboard.removeAllListeners()
      if (Capacitor.isNativePlatform()) {
        window.removeEventListener('scroll', handleScroll)
        document.removeEventListener('touchstart', handleTouchStartOutside)
      }
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
    }
  }, [])
}

export default useKeyboard
