import { Capacitor } from '@capacitor/core'
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard'

import React, { useEffect } from 'react'

const useKeyboard = () => {
  useEffect(() => {
    const handleKeyboardWillShow = async (info: KeyboardInfo) => {
      console.log('Клавиатура будет показана', info)
      document.body.style.overflow = 'hidden'
    }

    const handleKeyboardWillHide = async () => {
      console.log('Клавиатура будет скрыта')
      document.body.style.overflow = 'auto'
    }

    const handleFocus = async (event: Event) => {
      console.log('Фокус на инпуте, отключение прокрутки страницы')
      if (
        (event.target as HTMLElement).tagName === 'INPUT' ||
        (event.target as HTMLElement).tagName === 'TEXTAREA'
      ) {
        document.body.style.overflow = 'hidden'
      }
    }

    const handleBlur = async () => {
      console.log('Фокус снят с инпута, включение прокрутки страницы')
      document.body.style.overflow = 'auto'
    }

    // Подписка на события показа и скрытия клавиатуры
    Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow)
    Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide)

    // Подписка на события фокуса и потери фокуса для инпутов и текстовых областей
    document.addEventListener('focusin', handleFocus)
    document.addEventListener('focusout', handleBlur)

    return () => {
      // Отписка от событий при размонтировании компонента
      Keyboard.removeAllListeners()
      document.removeEventListener('focusin', handleFocus)
      document.removeEventListener('focusout', handleBlur)
    }
  }, [])
}

const MyComponent: React.FC = () => {
  useKeyboard()

  return (
    <div>
      <h1>Контроль прокрутки клавиатуры</h1>
      <input type='text' placeholder='Введите текст' />
      <input type='password' placeholder='Введите пароль' />
      <textarea placeholder='Введите сообщение'></textarea>
    </div>
  )
}

export default MyComponent
