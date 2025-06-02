import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationUk from './i18n/locales/uk/translation.json'
import translationEn from './i18n/locales/en/translation.json'

const deviceLang =
  typeof navigator !== 'undefined' ? navigator.language || navigator.languages[0] : 'en'
const isUkrainian = deviceLang === 'uk' || deviceLang.startsWith('uk-')

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: translationUk },
    en: { translation: translationEn },
  },
  lng: isUkrainian ? 'uk' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
