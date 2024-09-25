import { useEffect } from 'react'

const useKeyboardHandler = () => {
  useEffect(() => {
    const hideKeyboard = (e: MouseEvent) => {
      const activeElement = document.activeElement as HTMLElement
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')
      ) {
        if (e.target !== activeElement) {
          activeElement.blur()
        }
      }
    }

    window.addEventListener('click', hideKeyboard)
    window.addEventListener('touchend', hideKeyboard)

    return () => {
      window.removeEventListener('click', hideKeyboard)
      window.removeEventListener('touchend', hideKeyboard)
    }
  }, [])
}

export default useKeyboardHandler
