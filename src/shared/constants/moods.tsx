import { IconMoodBlue, IconMoodGreen, IconMoodRed, IconMoodYellow } from '@/shared/icons'
import i18n from 'i18next'
const t = i18n.t
export const MOODS = [
  { icon: <IconMoodYellow />, slug: 'Чудово', color: '#F9E692', text: t('emotions.fine') },
  { icon: <IconMoodGreen />, slug: 'Нормально', color: '#C0D6A6', text: t('emotions.normal') },
  { icon: <IconMoodBlue />, slug: 'Не дуже', color: '#c0ebf1', text: t('emotions.bad') },
  { icon: <IconMoodRed />, slug: 'Зле', color: '#e79999', text: t('emotions.awful') },
]
